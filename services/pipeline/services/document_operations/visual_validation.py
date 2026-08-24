"""Raster validation for the closed RetainPDF page-program grammar."""

from __future__ import annotations

import hashlib
import json
from collections import Counter
from pathlib import Path
from typing import Any

import fitz

from .page_program import (
    build_page_plan,
    canonical_program_bytes,
    validate_page_program,
)

VISUAL_VALIDATION_SCHEMA = "retainpdf_visual_validation_v1"
RENDERER_ID = "pymupdf"
DEFAULT_MAX_DIMENSION = 512
MAX_REPORTED_MISMATCHES = 32


def validate_page_program_visuals(
    source_path: Path,
    candidate_path: Path,
    program: dict[str, Any],
    *,
    max_dimension: int = DEFAULT_MAX_DIMENSION,
) -> dict[str, Any]:
    """Render every expected/candidate page pair and compare RGB pixels exactly."""

    validate_page_program(program)
    if max_dimension < 64 or max_dimension > 2048:
        raise ValueError("visual validation max_dimension must be within 64..2048")
    _require_regular_file(source_path, "source PDF")
    _require_regular_file(candidate_path, "candidate PDF")

    expected_digest = hashlib.sha256()
    candidate_digest = hashlib.sha256()
    geometry_digest = hashlib.sha256()
    mismatched_pages: list[int] = []
    mismatch_count = 0
    rendered_pixels = 0

    with fitz.open(source_path) as source, fitz.open(candidate_path) as candidate:
        if source.page_count <= 0:
            raise ValueError("source PDF has no renderable pages")
        plan = build_page_plan(source.page_count, program)
        if candidate.page_count != len(plan):
            raise ValueError(
                f"candidate page count {candidate.page_count} does not match expected {len(plan)}"
            )

        plan_bytes = json.dumps(plan, separators=(",", ":")).encode("utf-8")
        for output_index, (source_index, added_rotation) in enumerate(plan):
            source_page = source.load_page(source_index)
            candidate_page = candidate.load_page(output_index)
            expected_rect = source_page.rect
            if added_rotation in {90, 270}:
                expected_width, expected_height = expected_rect.height, expected_rect.width
            else:
                expected_width, expected_height = expected_rect.width, expected_rect.height
            candidate_rect = candidate_page.rect
            scale = min(
                1.0,
                max_dimension / max(expected_width, expected_height, 1.0),
            )
            expected = source_page.get_pixmap(
                matrix=fitz.Matrix(scale, scale).prerotate(added_rotation),
                colorspace=fitz.csRGB,
                alpha=False,
            )
            actual = candidate_page.get_pixmap(
                matrix=fitz.Matrix(scale, scale),
                colorspace=fitz.csRGB,
                alpha=False,
            )
            header = (
                f"{output_index + 1}:{source_index + 1}:{added_rotation}:"
                f"{expected.width}x{expected.height};"
            ).encode("ascii")
            expected_digest.update(header)
            expected_digest.update(expected.samples)
            candidate_digest.update(header)
            candidate_digest.update(actual.samples)
            geometry_digest.update(
                (
                    f"{output_index + 1}:{source_index + 1}:{added_rotation}:"
                    f"{candidate_rect.width:.4f}x{candidate_rect.height:.4f};"
                ).encode("ascii")
            )
            rendered_pixels += expected.width * expected.height
            if (
                expected.width != actual.width
                or expected.height != actual.height
                or expected.samples != actual.samples
            ):
                mismatch_count += 1
                if len(mismatched_pages) < MAX_REPORTED_MISMATCHES:
                    mismatched_pages.append(output_index + 1)

        source_indices = [source_index for source_index, _rotation in plan]
        source_usage = Counter(source_indices)
        dropped_source_pages = source.page_count - len(source_usage)
        duplicated_output_pages = sum(max(0, count - 1) for count in source_usage.values())
        rotated_output_pages = sum(1 for _index, rotation in plan if rotation != 0)

        report = {
            "schema": VISUAL_VALIDATION_SCHEMA,
            "valid": mismatch_count == 0,
            "renderer": RENDERER_ID,
            "renderer_version": fitz.VersionBind,
            "render_max_dimension": max_dimension,
            "source_pdf_sha256": _sha256_file(source_path),
            "program_sha256": hashlib.sha256(canonical_program_bytes(program)).hexdigest(),
            "candidate_pdf_sha256": _sha256_file(candidate_path),
            "source_page_count": source.page_count,
            "candidate_page_count": candidate.page_count,
            "rendered_page_count": len(plan),
            "rendered_pixel_count": rendered_pixels,
            "page_plan_sha256": hashlib.sha256(plan_bytes).hexdigest(),
            "page_geometry_sha256": geometry_digest.hexdigest(),
            "expected_pixels_sha256": expected_digest.hexdigest(),
            "candidate_pixels_sha256": candidate_digest.hexdigest(),
            "mismatch_count": mismatch_count,
            "mismatched_pages": mismatched_pages,
            "dropped_source_pages": dropped_source_pages,
            "duplicated_output_pages": duplicated_output_pages,
            "rotated_output_pages": rotated_output_pages,
        }
    return report


def _require_regular_file(path: Path, label: str) -> None:
    if path.is_symlink() or not path.is_file():
        raise ValueError(f"{label} must be a regular non-symlink file")


def _sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()

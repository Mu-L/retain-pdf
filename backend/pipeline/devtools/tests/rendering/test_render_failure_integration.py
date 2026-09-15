from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import fitz
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from retainpdf_pipeline.foundation.config import paths
from retainpdf_pipeline.render.output.typst import compiler, sanitize
from retainpdf_pipeline.render.output.typst.compiler import TypstCompileError
from retainpdf_pipeline.render.render_stage import run_render_stage


def _render_inputs(root: Path) -> tuple[Path, Path]:
    source = root / "source.pdf"
    translations = root / "translated"
    translations.mkdir()
    manifest_pages = []
    with fitz.open() as document:
        for page_idx in range(2):
            page = document.new_page(width=240, height=340)
            page.insert_text((20, 40), "Source paragraph", fontsize=12)
            payload = [{
                "item_id": f"p{page_idx + 1:03d}-b001",
                "page_idx": page_idx,
                "block_kind": "text",
                "block_type": "text",
                "layout_role": "paragraph",
                "semantic_role": "body",
                "structure_role": "body",
                "policy_translate": True,
                "asset_id": "",
                "reading_order": 0,
                "raw_block_type": "text",
                "normalized_sub_type": "text",
                "bbox": [10.0, 20.0, 220.0, 65.0],
                "protected_source_text": "Source paragraph",
                "protected_translated_text": "Translation paragraph",
            }]
            name = f"page-{page_idx + 1:03d}.json"
            (translations / name).write_text(json.dumps(payload), encoding="utf-8")
            manifest_pages.append({"page_index": page_idx, "path": name})
        document.save(source)
    (translations / "translation-manifest.json").write_text(
        json.dumps({"schema": "translation_manifest_v1", "schema_version": 1, "pages": manifest_pages}),
        encoding="utf-8",
    )
    return source, translations


@pytest.mark.parametrize(
    ("render_mode", "extract_selected_pages"),
    [("overlay", False), ("overlay", True), ("typst", False), ("typst_visual", False), ("dual", False)],
    ids=["whole-book-overlay", "selected-overlay", "typst", "typst-visual", "dual"],
)
@pytest.mark.parametrize("failure", ["missing-executable", "timeout"])
def test_render_stage_does_not_retry_runtime_failures_or_publish_output(
    tmp_path: Path,
    monkeypatch: pytest.MonkeyPatch,
    render_mode: str,
    extract_selected_pages: bool,
    failure: str,
) -> None:
    source, translations = _render_inputs(tmp_path)
    inputs_before = {path: path.read_bytes() for path in [source, *translations.iterdir()]}
    output = tmp_path / "rendered" / "translated.pdf"
    monkeypatch.setenv("RETAINPDF_RENDER_NO_CACHE", "1")
    monkeypatch.setenv("RETAIN_RENDER_TYPST_LLM_REPAIR", "0")
    monkeypatch.setattr(paths, "OUTPUT_DIR", tmp_path / "fallback")
    monkeypatch.setattr(sanitize, "TYPST_OVERLAY_DIR", tmp_path / "fallback")
    commands: list[list[str]] = []

    def fail_compile(command: list[str], **kwargs: object) -> None:
        commands.append(command)
        if failure == "timeout":
            raise subprocess.TimeoutExpired(command, float(kwargs["timeout"]))
        raise FileNotFoundError("test Typst executable is unavailable")

    monkeypatch.setattr(compiler.subprocess, "run", fail_compile)
    with pytest.raises(TypstCompileError) as raised:
        run_render_stage(
            source_pdf_path=source,
            translations_dir=translations,
            output_pdf_path=output,
            start_page=1 if extract_selected_pages else 0,
            end_page=1,
            render_mode=render_mode,
            extract_selected_pages=extract_selected_pages,
            pdf_compress_dpi=0,
        )

    assert len(commands) == 1, "environment failures must not fan out into content probes"
    assert raised.value.return_code == -1
    assert raised.value.extra["runtime_error_type"] == (
        "TimeoutExpired" if failure == "timeout" else "FileNotFoundError"
    )
    assert not output.exists(), "failed rendering must not publish a successful PDF"
    assert all(path.read_bytes() == original for path, original in inputs_before.items())


@pytest.mark.parametrize("extract_selected_pages", [False, True], ids=["whole-book", "selected-page"])
def test_render_stage_still_compiles_translations_after_recovery_changes(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch, extract_selected_pages: bool,
) -> None:
    source, translations = _render_inputs(tmp_path)
    inputs_before = {path: path.read_bytes() for path in [source, *translations.iterdir()]}
    output = tmp_path / "rendered" / "translated.pdf"
    monkeypatch.setenv("RETAINPDF_RENDER_NO_CACHE", "1")
    result = run_render_stage(
        source_pdf_path=source,
        translations_dir=translations,
        output_pdf_path=output,
        start_page=1 if extract_selected_pages else 0,
        end_page=1,
        render_mode="overlay",
        extract_selected_pages=extract_selected_pages,
        pdf_compress_dpi=0,
    )
    expected_pages = 1 if extract_selected_pages else 2
    assert result["pages_rendered"] == expected_pages
    with fitz.open(output) as rendered:
        assert len(rendered) == expected_pages
        for page in rendered:
            assert "Translationparagraph" in "".join(page.get_text().split())
    assert all(path.read_bytes() == original for path, original in inputs_before.items())

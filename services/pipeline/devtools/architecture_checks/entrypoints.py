from __future__ import annotations

from pathlib import Path
import re

from devtools.architecture_checks.common import PACKAGE_ROOT
from devtools.architecture_checks.common import SCRIPTS_ROOT
from devtools.architecture_checks.common import read_text
from devtools.architecture_checks.common import scan_py_files


ENTRYPOINTS_ROOT = PACKAGE_ROOT / "entrypoints"
STAGE_SPEC_CONTRACT_CHECK = SCRIPTS_ROOT / "devtools" / "check_stage_specs_contract.py"

ENTRYPOINT_IMPORT_ALLOWLIST: dict[Path, tuple[str, ...]] = {
    Path("__init__.py"): (),
    Path("console.py"): (
        "from collections.abc import",
        "from retainpdf_pipeline.entrypoints.run_document_operation import",
        "from retainpdf_pipeline.foundation.shared.structured_errors import",
        "from retainpdf_pipeline.services.document_schema.normalize_pipeline import",
        "from retainpdf_pipeline.services.ocr_provider.provider_pipeline import",
        "from retainpdf_pipeline.services.rendering.workflow.render_only import",
        "from retainpdf_pipeline.services.translation.entrypoints.from_ocr_pipeline import",
        "from retainpdf_pipeline.services.translation.entrypoints.translate_only_pipeline import",
    ),
    Path("build_book.py"): ("from retainpdf_pipeline.runtime.pipeline.book_pipeline import",),
    Path("build_page.py"): (
        "from retainpdf_pipeline.services.translation.public import",
        "from retainpdf_pipeline.services.rendering.legacy.pdf_overlay import",
        "from retainpdf_pipeline.services.rendering.legacy.typst_page_renderer import",
    ),
    Path("diagnose_failure_with_ai.py"): (
        "from retainpdf_pipeline.services.translation.public import",
    ),
    Path("run_book.py"): ("from retainpdf_pipeline.services.translation.entrypoints.from_ocr_pipeline import main",),
    Path("run_document_flow.py"): (
        "from retainpdf_pipeline.runtime.pipeline.book_pipeline import",
        "from retainpdf_pipeline.services.translation.public import",
    ),
    Path("run_document_operation.py"): (
        "from retainpdf_pipeline.services.document_operations.page_program import",
        "from retainpdf_pipeline.services.document_operations.visual_validation import",
    ),
    Path("run_normalize_ocr.py"): ("from retainpdf_pipeline.services.document_schema.normalize_pipeline import main",),
    Path("run_provider_case.py"): ("from retainpdf_pipeline.services.ocr_provider.provider_pipeline import main",),
    Path("run_provider_ocr.py"): ("from retainpdf_pipeline.services.ocr_provider.provider_pipeline import main",),
    Path("run_render_only.py"): ("from retainpdf_pipeline.services.rendering.workflow.render_only import main",),
    Path("run_translate_from_ocr.py"): ("from retainpdf_pipeline.services.translation.entrypoints.from_ocr_pipeline import main",),
    Path("run_translate_only.py"): ("from retainpdf_pipeline.services.translation.entrypoints.translate_only_pipeline import main",),
    Path("translate_book.py"): ("from retainpdf_pipeline.services.translation.entrypoints.translate_only_pipeline import main",),
    Path("translate_page.py"): (
        "from retainpdf_pipeline.services.translation.public import",
    ),
    Path("validate_document_schema.py"): ("from retainpdf_pipeline.services.document_schema import",),
}


def check_entrypoint_stable_imports(errors: list[str]) -> None:
    import_pattern = re.compile(r"^from\s+([A-Za-z0-9_\.]+)\s+import\s+(.+)$", re.MULTILINE)
    for path in scan_py_files(ENTRYPOINTS_ROOT):
        rel_name = path.relative_to(ENTRYPOINTS_ROOT)
        allowed_prefixes = ENTRYPOINT_IMPORT_ALLOWLIST.get(rel_name)
        if allowed_prefixes is None:
            errors.append(f"entrypoints/{rel_name}: missing explicit import allowlist entry in check_pipeline_architecture.py")
            continue
        text = read_text(path)
        for match in import_pattern.finditer(text):
            stmt = f"from {match.group(1)} import {match.group(2)}"
            if match.group(1).startswith(("retainpdf_pipeline.foundation.", "pathlib", "__future__")):
                continue
            if any(stmt.startswith(prefix) for prefix in allowed_prefixes):
                continue
            errors.append(
                f"entrypoints/{rel_name}: entrypoint should import only its stable top-level pipeline/service entry, found '{stmt}'"
            )


def check_stage_spec_contract_checker(errors: list[str]) -> None:
    if not STAGE_SPEC_CONTRACT_CHECK.exists():
        errors.append(
            "devtools/check_stage_specs_contract.py: Rust/Python stage spec contract checker is missing"
        )
        return
    text = read_text(STAGE_SPEC_CONTRACT_CHECK)
    for loader_name in (
        "BookStageSpec",
        "NormalizeStageSpec",
        "ProviderStageSpec",
        "RenderStageSpec",
        "TranslateStageSpec",
    ):
        if loader_name not in text:
            errors.append(
                f"devtools/check_stage_specs_contract.py: missing Python loader coverage for {loader_name}"
            )
    if "stage_spec_contract=ok" not in text:
        errors.append(
            "devtools/check_stage_specs_contract.py: checker must emit a stable success marker"
        )


__all__ = [
    "check_entrypoint_stable_imports",
    "check_stage_spec_contract_checker",
]

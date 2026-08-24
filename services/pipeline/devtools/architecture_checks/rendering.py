from __future__ import annotations

from pathlib import Path

from devtools.architecture_checks.common import PACKAGE_ROOT
from devtools.architecture_checks.common import SCRIPTS_ROOT
from devtools.architecture_checks.common import imported_from_symbols
from devtools.architecture_checks.common import imported_modules
from devtools.architecture_checks.common import module_allowed
from devtools.architecture_checks.common import read_text
from devtools.architecture_checks.common import rel
from devtools.architecture_checks.common import scan_py_files

PIPELINE_ROOT = PACKAGE_ROOT / "runtime" / "pipeline"
RENDERING_ROOT = PACKAGE_ROOT / "services" / "rendering"

RENDER_STAGE_PIPELINE = PIPELINE_ROOT / "render_stage.py"
RENDER_EXECUTION_PIPELINE = PIPELINE_ROOT / "render_execution.py"
RENDERING_WORKFLOW_ROOT = RENDERING_ROOT / "workflow"
RENDERING_ANALYSIS_ROOT = RENDERING_ROOT / "analysis"
RENDERING_PROFILE_ROOT = RENDERING_ANALYSIS_ROOT / "profile"
RENDERING_ROUTE_ROOT = RENDERING_ANALYSIS_ROOT / "route"
RENDERING_TYPST_ROOT = RENDERING_ROOT / "output" / "typst"
RENDERING_LAYOUT_ROOT = RENDERING_ROOT / "layout"
RENDERING_TEXT_TOKENS = RENDERING_LAYOUT_ROOT / "text_tokens.py"
RENDERING_TEXT_ANALYSIS_ROOT = RENDERING_LAYOUT_ROOT / "text_analysis"
RENDERING_SOURCE_ROOT = RENDERING_ROOT / "source"
RENDERING_SOURCE_CLEANUP_ROOT = RENDERING_SOURCE_ROOT / "cleanup"
RENDERING_ALLOWED_ROOT_DIRS = {
    "analysis",
    "contracts",
    "document",
    "layout",
    "legacy",
    "output",
    "pdf_structure_profile",
    "policy",
    "source",
    "source_cleanup",
    "tools",
    "visual_profile",
    "workflow",
}
RENDERING_ALLOWED_ROOT_FILES = {
    "__init__.py",
    "performance.py",
    "README.md",
}
RENDERING_LAYER_IMPORT_RULES: dict[str, tuple[str, ...]] = {
    "workflow": (
        "retainpdf_pipeline.services.rendering.workflow",
        "retainpdf_pipeline.services.rendering.analysis",
        "retainpdf_pipeline.services.rendering.contracts",
        "retainpdf_pipeline.services.rendering.document",
        "retainpdf_pipeline.services.rendering.policy",
        "retainpdf_pipeline.services.rendering.source",
        "retainpdf_pipeline.services.rendering.source_cleanup",
        "retainpdf_pipeline.services.rendering.layout",
        "retainpdf_pipeline.services.rendering.output",
        "retainpdf_pipeline.services.rendering.legacy",
        "retainpdf_pipeline.services.rendering.visual_profile",
    ),
    "analysis": (
        "retainpdf_pipeline.services.rendering.analysis",
        "retainpdf_pipeline.services.rendering.contracts",
        # Page profiling may inspect source image metadata, but must not execute cleanup/output.
        "retainpdf_pipeline.services.rendering.source.background.detect",
    ),
    "contracts": (
        "retainpdf_pipeline.services.rendering.contracts",
        "retainpdf_pipeline.services.rendering.analysis.profile.models",
        "retainpdf_pipeline.services.rendering.analysis.route.models",
    ),
    "document": (
        "retainpdf_pipeline.services.rendering.document",
        "retainpdf_pipeline.services.rendering.layout.model",
        "retainpdf_pipeline.services.rendering.contracts",
    ),
    "source": (
        "retainpdf_pipeline.services.rendering.source",
        "retainpdf_pipeline.services.rendering.contracts",
        "retainpdf_pipeline.services.rendering.document",
        "retainpdf_pipeline.services.rendering.policy",
        "retainpdf_pipeline.services.rendering.layout",
        "retainpdf_pipeline.services.rendering.layout.inline_content",
        # Existing source preparation still reuses the PDF compressor facade and Typst temp-root helper.
        "retainpdf_pipeline.services.rendering.legacy.pdf_compress",
        "retainpdf_pipeline.services.rendering.output.typst.shared",
        # Source prewarm owns cached render-source preparation and may build
        # precomputed Typst page/color profiles for the render stage.
        "retainpdf_pipeline.services.rendering.output.typst.book_support",
        "retainpdf_pipeline.services.rendering.output.typst.color_adapt",
        "retainpdf_pipeline.services.rendering.pdf_structure_profile",
        "retainpdf_pipeline.services.rendering.source_cleanup",
        "retainpdf_pipeline.services.rendering.visual_profile",
    ),
    "layout": (
        "retainpdf_pipeline.services.rendering.layout",
        "retainpdf_pipeline.services.rendering.policy",
    ),
    "output": (
        "retainpdf_pipeline.services.rendering.output",
        "retainpdf_pipeline.services.rendering.layout",
        "retainpdf_pipeline.services.rendering.document",
        "retainpdf_pipeline.services.rendering.policy",
        # Output owns overlay composition and may sample/rebuild source backgrounds.
        "retainpdf_pipeline.services.rendering.source.background",
        "retainpdf_pipeline.services.rendering.visual_profile",
    ),
    "policy": (
        "retainpdf_pipeline.services.rendering.policy",
        "retainpdf_pipeline.services.rendering.source_cleanup.planning.segments",
    ),
    "source_cleanup": (
        "retainpdf_pipeline.services.rendering.source_cleanup",
        "retainpdf_pipeline.services.rendering.contracts",
        "retainpdf_pipeline.services.rendering.policy",
        "retainpdf_pipeline.services.rendering.source.background.detect",
        "retainpdf_pipeline.services.rendering.source.rects",
    ),
    "tools": (
        "retainpdf_pipeline.services.rendering.tools",
    ),
    "pdf_structure_profile": (
        "retainpdf_pipeline.services.rendering.pdf_structure_profile",
        "retainpdf_pipeline.services.rendering.source.rects",
        "retainpdf_pipeline.services.rendering.source_cleanup.planning.coordinate_resolver",
        "retainpdf_pipeline.services.rendering.source_cleanup.planning.drawing_classifier",
    ),
    "visual_profile": (
        "retainpdf_pipeline.services.rendering.visual_profile",
        "retainpdf_pipeline.services.document_schema.semantics",
        "retainpdf_pipeline.services.rendering.layout.font_roles",
        "retainpdf_pipeline.services.rendering.layout.typography.geometry",
        "retainpdf_pipeline.services.rendering.policy",
        "retainpdf_pipeline.services.rendering.source.background.fill",
    ),
    "legacy": (
        "retainpdf_pipeline.services.rendering.workflow",
        "retainpdf_pipeline.services.rendering.analysis",
        "retainpdf_pipeline.services.rendering.document",
        "retainpdf_pipeline.services.rendering.source",
        "retainpdf_pipeline.services.rendering.layout",
        "retainpdf_pipeline.services.rendering.output",
        "retainpdf_pipeline.services.rendering.legacy",
    ),
}
RENDERING_LAYER_IMPORT_EXCEPTIONS: dict[Path, tuple[str, ...]] = {
    # Existing source/background overlay code still bridges source cleanup, layout blocks,
    # and overlay diagnostics. Keep this exception narrow so new cross-layer imports fail.
    Path("source/background/page_overlay.py"): (
        "retainpdf_pipeline.services.rendering.output.typst.overlay_diagnostics",
    ),
    Path("source/background/redaction_plan.py"): (
        "retainpdf_pipeline.services.rendering.layout.model.block_view",
        "retainpdf_pipeline.services.rendering.layout.model.models",
    ),
    Path("source/background/redaction_items.py"): (
        "retainpdf_pipeline.services.rendering.layout.model.block_view",
        "retainpdf_pipeline.services.rendering.layout.model.models",
    ),
    Path("source/background/stage.py"): (
        "retainpdf_pipeline.services.rendering.layout.model.models",
    ),
    Path("source/items.py"): (
        "retainpdf_pipeline.services.rendering.layout.model.render_text",
    ),
}
REMOVED_SOURCE_PREPARATION_BBOX_MODULES = (
    "retainpdf_pipeline.services.rendering.source.preparation.bbox_text_strip_accumulator",
    "retainpdf_pipeline.services.rendering.source.preparation.bbox_text_strip_candidates",
    "retainpdf_pipeline.services.rendering.source.preparation.bbox_text_strip_engine",
    "retainpdf_pipeline.services.rendering.source.preparation.bbox_text_strip_hit_test",
    "retainpdf_pipeline.services.rendering.source.preparation.bbox_text_strip_segments",
)
SOURCE_CLEANUP_NEXT_EXPERIMENTAL_MODULES = (
    "retainpdf_pipeline.services.rendering.source_cleanup_next",
    "retainpdf_pipeline.services.rendering.source_cleanup.planning.decision_builder",
    "retainpdf_pipeline.services.rendering.source_cleanup.planning.deletion_contract",
    "retainpdf_pipeline.services.rendering.source_cleanup.planning.formula_adjacency",
    "retainpdf_pipeline.services.rendering.source_cleanup.planning.strategy",
    "retainpdf_pipeline.services.rendering.source_cleanup.planning.text_groups",
    "retainpdf_pipeline.services.rendering.source_cleanup.pdf.document_pages",
    "retainpdf_pipeline.services.rendering.source_cleanup.pdf.document_parallel",
)
SOURCE_CLEANUP_NEXT_EXPERIMENTAL_SYMBOLS = {
    ("retainpdf_pipeline.services.rendering.source_cleanup", "build_source_cleanup_plan"),
}


def rendering_layer_for(path: Path) -> str | None:
    try:
        parts = path.relative_to(RENDERING_ROOT).parts
    except ValueError:
        return None
    if not parts:
        return None
    first = parts[0]
    return first if first in RENDERING_ALLOWED_ROOT_DIRS else None


def check_render_pipeline_facade_boundary(errors: list[str]) -> None:
    stage_text = read_text(RENDER_STAGE_PIPELINE)
    execution_text = read_text(RENDER_EXECUTION_PIPELINE)
    if "from retainpdf_pipeline.services.rendering.workflow import execute_render_plan" not in execution_text:
        errors.append(
            "runtime/pipeline/render_execution.py: must delegate to services.rendering.workflow.execute_render_plan"
        )
    forbidden = (
        "import fitz",
        "from retainpdf_pipeline.services.rendering.source.render_source import",
        "from retainpdf_pipeline.services.rendering.source.preparation.hidden_text_strip import",
        "from retainpdf_pipeline.services.rendering.output.typst",
        "from retainpdf_pipeline.services.rendering.source.cleanup",
        "from retainpdf_pipeline.services.rendering.layout",
        "from retainpdf_pipeline.services.rendering.legacy.typst_page_renderer import",
        "from retainpdf_pipeline.services.rendering.legacy.pdf_overlay import",
        "from retainpdf_pipeline.services.rendering.legacy.pdf_compress import build_image_compressed_pdf_copy",
        "from retainpdf_pipeline.services.rendering.legacy.pdf_compress import compress_pdf_images_only",
    )
    for item in forbidden:
        if item in stage_text or item in execution_text:
            errors.append(
                f"runtime/pipeline render facade must not import rendering internals directly: '{item}'"
            )


def check_rendering_internal_boundaries(errors: list[str]) -> None:
    for path in RENDERING_ROOT.iterdir():
        if path.name == "__pycache__":
            continue
        if path.is_dir() and path.name not in RENDERING_ALLOWED_ROOT_DIRS:
            errors.append(
                f"services/rendering/{path.name}: unexpected rendering root directory; use workflow/analysis/document/source/layout/output/legacy"
            )
        if path.is_file() and path.name not in RENDERING_ALLOWED_ROOT_FILES:
            errors.append(
                f"services/rendering/{path.name}: unexpected rendering root file; place entrypoints inside a named layer"
            )

    legacy_rendering_imports = (
        "from retainpdf_pipeline.services.rendering.core",
        "import retainpdf_pipeline.services.rendering.core",
        "from retainpdf_pipeline.services.rendering.orchestrator",
        "import retainpdf_pipeline.services.rendering.orchestrator",
        "from retainpdf_pipeline.services.rendering.page_profile",
        "import retainpdf_pipeline.services.rendering.page_profile",
        "from retainpdf_pipeline.services.rendering.page_route",
        "import retainpdf_pipeline.services.rendering.page_route",
        "from retainpdf_pipeline.services.rendering.page_classifier",
        "import retainpdf_pipeline.services.rendering.page_classifier",
        "from retainpdf_pipeline.services.rendering.typst",
        "import retainpdf_pipeline.services.rendering.typst",
        "from retainpdf_pipeline.services.rendering.formula",
        "import retainpdf_pipeline.services.rendering.formula",
        "from retainpdf_pipeline.services.rendering.preprocess",
        "import retainpdf_pipeline.services.rendering.preprocess",
        "from retainpdf_pipeline.services.rendering.redaction",
        "import retainpdf_pipeline.services.rendering.redaction",
        "from retainpdf_pipeline.services.rendering.background",
        "import retainpdf_pipeline.services.rendering.background",
        "from retainpdf_pipeline.services.rendering.compress",
        "import retainpdf_pipeline.services.rendering.compress",
        "from retainpdf_pipeline.services.rendering.source_pdf",
        "import retainpdf_pipeline.services.rendering.source_pdf",
    )
    legacy_rendering_wrappers = set()
    legacy_rendering_wrappers.update((RENDERING_ROOT / "core").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "orchestrator").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "page_profile").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "page_route").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "typst").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "formula").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "formula" / "core").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "formula" / "fallback").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "preprocess").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "redaction").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "background").glob("*.py"))
    legacy_rendering_wrappers.update((RENDERING_ROOT / "compress").glob("*.py"))
    legacy_rendering_wrappers.add(RENDERING_ROOT / "page_classifier.py")
    legacy_rendering_wrappers.add(RENDERING_ROOT / "source_pdf.py")
    for path in scan_py_files(RENDERING_ROOT):
        if path in legacy_rendering_wrappers:
            continue
        text = read_text(path)
        rel_path = rel(path)
        for item in legacy_rendering_imports:
            if item in text:
                errors.append(
                    f"{rel_path}: import new rendering modules directly instead of legacy compatibility wrappers"
                )
                break

    legacy_document_imports = (
        "from retainpdf_pipeline.services.rendering.page_map",
        "import retainpdf_pipeline.services.rendering.page_map",
        "from retainpdf_pipeline.services.rendering.pdf_metadata",
        "import retainpdf_pipeline.services.rendering.pdf_metadata",
    )
    legacy_document_wrappers = {
        RENDERING_ROOT / "page_map.py",
        RENDERING_ROOT / "pdf_metadata.py",
        RENDERING_ROOT / "source_pdf.py",
    }
    for path in scan_py_files(RENDERING_ROOT):
        if path in legacy_document_wrappers:
            continue
        text = read_text(path)
        rel_path = rel(path)
        for item in legacy_document_imports:
            if item in text:
                errors.append(
                    f"{rel_path}: import document helpers from retainpdf_pipeline.services.rendering.document.* instead of rendering root wrappers"
                )
                break

    for path in scan_py_files(RENDERING_PROFILE_ROOT):
        text = read_text(path)
        rel_path = rel(path)
        forbidden = (
            "from retainpdf_pipeline.services.rendering.analysis.route",
            "import retainpdf_pipeline.services.rendering.analysis.route",
            "from retainpdf_pipeline.services.rendering.source.cleanup",
            "import retainpdf_pipeline.services.rendering.source.cleanup",
            "from retainpdf_pipeline.services.rendering.output.typst",
            "import retainpdf_pipeline.services.rendering.output.typst",
            "from retainpdf_pipeline.services.rendering.layout",
            "import retainpdf_pipeline.services.rendering.layout",
        )
        for item in forbidden:
            if item in text:
                errors.append(
                    f"{rel_path}: page_profile must collect facts only and must not depend on route/redaction/typst/layout"
                )
                break

    for path in scan_py_files(RENDERING_ROUTE_ROOT):
        text = read_text(path)
        rel_path = rel(path)
        forbidden = (
            "import fitz",
            "from retainpdf_pipeline.services.rendering.source.cleanup",
            "import retainpdf_pipeline.services.rendering.source.cleanup",
            "from retainpdf_pipeline.services.rendering.output.typst",
            "import retainpdf_pipeline.services.rendering.output.typst",
            "from retainpdf_pipeline.services.rendering.layout",
            "import retainpdf_pipeline.services.rendering.layout",
        )
        for item in forbidden:
            if item in text:
                errors.append(
                    f"{rel_path}: page_route must decide routes only and must not scan pages or call redaction/typst/layout"
                )
                break

    for path in scan_py_files(RENDERING_TYPST_ROOT):
        text = read_text(path)
        rel_path = rel(path)
        forbidden = (
            "from retainpdf_pipeline.services.rendering.source.cleanup",
            "import retainpdf_pipeline.services.rendering.source.cleanup",
        )
        for item in forbidden:
            if item in text:
                errors.append(
                    f"{rel_path}: typst layer must not import redaction directly; route background cleanup through rendering/background or orchestrator"
                )
                break

    for path in scan_py_files(RENDERING_LAYOUT_ROOT):
        text = read_text(path)
        rel_path = rel(path)
        forbidden = (
            "from retainpdf_pipeline.services.rendering.source.cleanup",
            "import retainpdf_pipeline.services.rendering.source.cleanup",
            "from retainpdf_pipeline.services.rendering.output.typst",
            "import retainpdf_pipeline.services.rendering.output.typst",
            "from retainpdf_pipeline.services.rendering.source.render_source",
            "import retainpdf_pipeline.services.rendering.source.render_source",
        )
        for item in forbidden:
            if item in text:
                errors.append(
                    f"{rel_path}: layout layer must not import redaction/typst/source_pdf"
                )
                break

    for path in scan_py_files(RENDERING_SOURCE_CLEANUP_ROOT):
        text = read_text(path)
        rel_path = rel(path)
        forbidden = (
            "from retainpdf_pipeline.services.rendering.output.typst",
            "import retainpdf_pipeline.services.rendering.output.typst",
            "import retainpdf_pipeline.services.rendering.layout",
        )
        for item in forbidden:
            if item in text:
                errors.append(
                    f"{rel_path}: redaction layer must not import typst/layout"
                )
                break

    source_cleanup_rect_entrypoint = "strip_bbox_text_rects_from_pdf_copy"
    source_cleanup_rect_entrypoint_allowed = {
        RENDERING_ROOT / "source_cleanup" / "__init__.py",
        RENDERING_ROOT / "source_cleanup" / "executor.py",
        RENDERING_ROOT / "source_cleanup" / "pdf" / "__init__.py",
        RENDERING_ROOT / "source_cleanup" / "pdf" / "document.py",
    }
    for path in scan_py_files(RENDERING_ROOT / "source_cleanup"):
        if path in source_cleanup_rect_entrypoint_allowed:
            continue
        text = read_text(path)
        rel_path = rel(path)
        if source_cleanup_rect_entrypoint in text:
            errors.append(
                f"{rel_path}: source cleanup orchestration must use BBoxTextStripExecutionPlan instead of low-level rect entrypoint"
            )

    text_token_module = "retainpdf_pipeline.services.rendering.layout.text_tokens"
    text_token_allowed_roots = {
        RENDERING_TEXT_TOKENS,
    }
    text_token_allowed_roots.update(scan_py_files(RENDERING_TEXT_ANALYSIS_ROOT))
    inline_math_boundary_markers = (
        r"(?<!\\)\$",
        r"\$\$",
        r"[^$\\\n]",
        r"[^$\n]",
    )
    inline_math_boundary_allowed_roots = set(text_token_allowed_roots)
    for path in scan_py_files(RENDERING_ROOT):
        rel_path = rel(path)
        if path not in text_token_allowed_roots:
            for module in imported_modules(path):
                if module_allowed(module, (text_token_module,)):
                    errors.append(
                        f"{rel_path}: use services.rendering.layout.text_analysis instead of text_tokens directly"
                    )
                    break
        if path in inline_math_boundary_allowed_roots:
            continue
        text = read_text(path)
        if "inline_math" not in path.name and "markdown" not in path.name and "formula" not in path.name and "$" not in text:
            continue
        if any(marker in text for marker in inline_math_boundary_markers):
            errors.append(
                f"{rel_path}: inline math token boundaries must be implemented in services.rendering.layout.text_analysis/text_tokens only"
            )

    removed_cleanup_modules = (
        "retainpdf_pipeline.services.rendering.source.cleanup.analysis",
        "retainpdf_pipeline.services.rendering.source.cleanup.document_ops",
        "retainpdf_pipeline.services.rendering.source.cleanup.fill",
        "retainpdf_pipeline.services.rendering.source.cleanup.geometry",
        "retainpdf_pipeline.services.rendering.source.cleanup.math_protection",
        "retainpdf_pipeline.services.rendering.source.cleanup.ops",
        "retainpdf_pipeline.services.rendering.source.cleanup.plan",
        "retainpdf_pipeline.services.rendering.source.cleanup.route_selection",
        "retainpdf_pipeline.services.rendering.source.cleanup.shared",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_analysis",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_layer",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_match",
        "retainpdf_pipeline.services.rendering.source.cleanup.vector_analysis",
        "retainpdf_pipeline.services.rendering.source.cleanup.visual_cover",
    )
    for path in scan_py_files(RENDERING_ROOT):
        rel_path = rel(path)
        for module in imported_modules(path):
            if module in removed_cleanup_modules:
                errors.append(
                    f"{rel_path}: cleanup compatibility module '{module}' was removed; import the concrete implementation or source primitive"
                )
                break

    source_background_root = RENDERING_SOURCE_ROOT / "background"
    for path in scan_py_files(source_background_root):
        text = read_text(path)
        rel_path = rel(path)
        forbidden = (
            "from retainpdf_pipeline.services.rendering.source.cleanup",
            "import retainpdf_pipeline.services.rendering.source.cleanup",
        )
        for item in forbidden:
            if item in text:
                errors.append(
                    f"{rel_path}: source/background must not import source.cleanup directly; use source-level facades"
                )
                break

    source_preparation_root = RENDERING_SOURCE_ROOT / "preparation"
    preparation_compat_imports = (
        "retainpdf_pipeline.services.rendering.source.cleanup.analysis",
        "retainpdf_pipeline.services.rendering.source.cleanup.document_ops",
        "retainpdf_pipeline.services.rendering.source.cleanup.fill",
        "retainpdf_pipeline.services.rendering.source.cleanup.geometry",
        "retainpdf_pipeline.services.rendering.source.cleanup.math_protection",
        "retainpdf_pipeline.services.rendering.source.cleanup.ops",
        "retainpdf_pipeline.services.rendering.source.cleanup.plan",
        "retainpdf_pipeline.services.rendering.source.cleanup.route_selection",
        "retainpdf_pipeline.services.rendering.source.cleanup.shared",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_analysis",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_layer",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_match",
        "retainpdf_pipeline.services.rendering.source.cleanup.vector_analysis",
        "retainpdf_pipeline.services.rendering.source.cleanup.visual_cover",
    )
    for path in scan_py_files(source_preparation_root):
        rel_path = rel(path)
        for module in imported_modules(path):
            if module in preparation_compat_imports:
                errors.append(
                    f"{rel_path}: source/preparation must import source primitives or concrete cleanup modules, not compatibility facade '{module}'"
                )
                break

    for path in scan_py_files(RENDERING_ROOT):
        rel_path = rel(path)
        for module in imported_modules(path):
            if module_allowed(module, REMOVED_SOURCE_PREPARATION_BBOX_MODULES):
                errors.append(
                    f"{rel_path}: removed bbox source-preparation module '{module}'; use services.rendering.source_cleanup boundary"
                )
                break

    for path in scan_py_files(RENDERING_ROOT):
        rel_path = rel(path)
        for module in imported_modules(path):
            if module_allowed(module, SOURCE_CLEANUP_NEXT_EXPERIMENTAL_MODULES):
                errors.append(
                    f"{rel_path}: source_cleanup_next experiment module '{module}' must not be imported by the beta10 cleanup mainline"
                )
                break
        for module, symbol in imported_from_symbols(path):
            if (module, symbol) in SOURCE_CLEANUP_NEXT_EXPERIMENTAL_SYMBOLS:
                errors.append(
                    f"{rel_path}: experimental source cleanup symbol '{symbol}' must not be imported by the beta10 cleanup mainline"
                )
                break

    dev_overlay_compat_imports = (
        "retainpdf_pipeline.services.rendering.source.cleanup.builders",
        "retainpdf_pipeline.services.rendering.source.cleanup.text_draw",
    )
    for path in scan_py_files(RENDERING_ROOT):
        rel_path = rel(path)
        for module in imported_modules(path):
            if module in dev_overlay_compat_imports:
                errors.append(
                    f"{rel_path}: cleanup dev overlay compatibility path was removed; import from retainpdf_pipeline.services.rendering.source.dev_overlay instead of '{module}'"
                )
                break

    for path in scan_py_files(RENDERING_ROOT):
        layer = rendering_layer_for(path)
        if layer is None:
            continue
        allowed_prefixes = RENDERING_LAYER_IMPORT_RULES[layer]
        exception_prefixes = RENDERING_LAYER_IMPORT_EXCEPTIONS.get(path.relative_to(RENDERING_ROOT), ())
        for module in imported_modules(path):
            if not module.startswith("retainpdf_pipeline.services.rendering."):
                continue
            if module_allowed(module, allowed_prefixes) or module_allowed(module, exception_prefixes):
                continue
            errors.append(
                f"{rel(path)}: rendering layer '{layer}' must not import '{module}' directly"
            )

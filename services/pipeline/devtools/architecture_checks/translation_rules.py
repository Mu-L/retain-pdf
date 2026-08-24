from __future__ import annotations

from pathlib import Path

from devtools.architecture_checks.common import PACKAGE_ROOT
from devtools.architecture_checks.common import SCRIPTS_ROOT

PIPELINE_ROOT = PACKAGE_ROOT / "runtime" / "pipeline"
DOCUMENT_SCHEMA_ROOT = PACKAGE_ROOT / "services" / "document_schema"
TRANSLATION_ROOT = PACKAGE_ROOT / "services" / "translation"
RENDERING_ROOT = PACKAGE_ROOT / "services" / "rendering"
DEVTOOLS_ROOT = SCRIPTS_ROOT / "devtools"
TRANSLATION_STAGE_PIPELINE = PIPELINE_ROOT / "translation_stage.py"

TRANSLATE_ONLY_ENTRYPOINT = PACKAGE_ROOT / "services" / "translation" / "entrypoints" / "translate_only_pipeline.py"
FROM_OCR_ENTRYPOINT = PACKAGE_ROOT / "services" / "translation" / "entrypoints" / "from_ocr_pipeline.py"
TRANSLATION_ALLOWED_ROOT_DIRS = {
    "artifacts",
    "core",
    "entrypoints",
    "llm",
    "public",
    "services",
    "workflow",
}
TRANSLATION_ALLOWED_ROOT_FILES = {
    "__init__.py",
    "README.md",
}
TRANSLATION_WORKFLOW_ALLOWED_DIRS = {
    "__pycache__",
    ".ipynb_checkpoints",
    "batching",
    "checkpoint",
    "legacy",
    "phases",
    "scheduling",
}
TRANSLATION_WORKFLOW_ALLOWED_FILES = {
    "__init__.py",
    "README.md",
    "batch_plan.py",
    "batch_runner.py",
    "book_flow.py",
    "execution.py",
    "execution_plan.py",
    "execution_runner.py",
    "page_policies.py",
    "page_range.py",
    "pages.py",
    "stages.py",
    "translation_workflow.py",
    "workers.py",
}
TRANSLATION_WORKFLOW_SUBPACKAGE_RULES: dict[str, tuple[str, ...]] = {
    "checkpoint": (
        "retainpdf_pipeline.services.translation.workflow.checkpoint",
        "retainpdf_pipeline.services.translation.workflow.execution",
        "retainpdf_pipeline.services.translation.workflow.execution_plan",
        "retainpdf_pipeline.services.translation.core.engine_identity",
        "retainpdf_pipeline.services.translation.core.payload.parts.units",
    ),
    "phases": (
        "retainpdf_pipeline.services.translation.workflow.phases",
        "retainpdf_pipeline.services.translation.workflow.batching.pending_units",
        "retainpdf_pipeline.services.translation.workflow.pages",
        "retainpdf_pipeline.services.translation.workflow.page_policies",
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.llm.shared.control_context",
        "retainpdf_pipeline.services.translation.llm.shared.provider_runtime",
        "retainpdf_pipeline.services.translation.services.agents",
        "retainpdf_pipeline.services.translation.services.finalization",
        "retainpdf_pipeline.services.translation.services.policy",
        "retainpdf_pipeline.services.translation.services.postprocess",
        "retainpdf_pipeline.services.pipeline_shared.events",
    ),
    "scheduling": (
        "retainpdf_pipeline.services.translation.workflow.scheduling",
        "retainpdf_pipeline.services.translation.llm.shared.control_context",
        "retainpdf_pipeline.services.translation.llm.shared.orchestration.batched_plain_single",
        "retainpdf_pipeline.services.translation.llm.shared.orchestration.terminal_payloads",
        "retainpdf_pipeline.services.translation.llm.shared.tail_retry_queue",
        "retainpdf_pipeline.services.translation.services.results.applier",
        "retainpdf_pipeline.services.translation.services.results.flush",
    ),
    "batching": (
        "retainpdf_pipeline.services.translation.workflow.batching",
        "retainpdf_pipeline.services.translation.workflow.batch_runner",
        "retainpdf_pipeline.services.translation.workflow.scheduling",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.services.context",
        "retainpdf_pipeline.services.translation.services.fast_path",
        "retainpdf_pipeline.services.translation.services.memory",
        "retainpdf_pipeline.services.translation.services.results",
    ),
    "legacy": (
        "retainpdf_pipeline.services.translation.workflow.legacy",
        "retainpdf_pipeline.services.translation.core.payload",
        "retainpdf_pipeline.services.translation.llm.shared.orchestration",
        "retainpdf_pipeline.services.translation.llm.shared.provider_runtime",
        "retainpdf_pipeline.services.translation.services.continuation",
        "retainpdf_pipeline.services.translation.services.policy",
    ),
}
TRANSLATION_WORKFLOW_PRIVATE_IMPORT_EXCEPTIONS: dict[Path, tuple[str, ...]] = {
    # Compatibility facades intentionally re-export old private names while callers migrate.
    Path("workflow/stages.py"): (
        "retainpdf_pipeline.services.translation.workflow.phases.repair._agent_repair_limit_from_env",
    ),
    Path("workflow/workers.py"): (
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._",
    ),
    Path("workflow/batch_plan.py"): (
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._",
    ),
    Path("workflow/batch_runner.py"): (
        "retainpdf_pipeline.services.translation.workflow.batching.executor._translate_batch_or_keep_origin",
        "retainpdf_pipeline.services.translation.workflow.scheduling.failures._failed_results_for_unhandled_batch_exception",
        "retainpdf_pipeline.services.translation.workflow.scheduling.tail_retry._",
    ),
    Path("workflow/batch_plan.py"): (
        "retainpdf_pipeline.services.translation.workflow.batching.plan._",
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._",
    ),
    Path("workflow/execution_plan.py"): (
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._adaptive_floor_limit",
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._adaptive_initial_limit",
    ),
    Path("workflow/batching/plan.py"): (
        "retainpdf_pipeline.services.translation.workflow.batching.batching._",
        "retainpdf_pipeline.services.translation.workflow.batching.dedupe._",
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._",
    ),
    Path("workflow/batching/pending_units.py"): (
        "retainpdf_pipeline.services.translation.workflow.batching.executor._",
        "retainpdf_pipeline.services.translation.workflow.batching.plan._",
        "retainpdf_pipeline.services.translation.workflow.scheduling.allocation._",
    ),
    Path("workflow/scheduling/tail_retry.py"): (
        "retainpdf_pipeline.services.translation.workflow.scheduling.failures._failed_results_for_unhandled_batch_exception",
    ),
}
TRANSLATION_LAYER_IMPORT_RULES: dict[str, tuple[str, ...]] = {
    "entrypoints": (
        "retainpdf_pipeline.services.translation.entrypoints",
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.services.terms",
        "retainpdf_pipeline.services.translation.workflow",
    ),
    "core": (
        "retainpdf_pipeline.services.translation.core",
    ),
    "workflow": (
        "retainpdf_pipeline.services.translation.workflow",
        "retainpdf_pipeline.services.translation.workflow.batching",
        "retainpdf_pipeline.services.translation.workflow.legacy",
        "retainpdf_pipeline.services.translation.workflow.phases",
        "retainpdf_pipeline.services.translation.workflow.scheduling",
        "retainpdf_pipeline.services.translation.services.classification",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.services.context",
        "retainpdf_pipeline.services.translation.services.continuation",
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.services.fast_path",
        "retainpdf_pipeline.services.translation.services.finalization",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.services.memory",
        "retainpdf_pipeline.services.translation.core.ocr",
        "retainpdf_pipeline.services.translation.core.orchestration",
        "retainpdf_pipeline.services.translation.core.payload",
        "retainpdf_pipeline.services.translation.services.agents",
        "retainpdf_pipeline.services.translation.services.policy",
        "retainpdf_pipeline.services.translation.services.postprocess",
        "retainpdf_pipeline.services.translation.services.results",
        "retainpdf_pipeline.services.translation.services.terms",
    ),
    "llm": (
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.core.payload",
    ),
    "services": (
        "retainpdf_pipeline.services.translation.services",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.core.item_reader",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.artifacts",
    ),
    "artifacts": (
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.core.payload",
    ),
    "public": (
        "retainpdf_pipeline.services.translation.public",
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.core.payload",
        "retainpdf_pipeline.services.translation.core.terms",
        "retainpdf_pipeline.services.translation.llm.shared.provider_runtime",
        "retainpdf_pipeline.services.translation.workflow",
    ),
    "policy": (
        "retainpdf_pipeline.services.translation.services.policy",
        # Historical policy modules still inspect OCR contracts and LLM domain hints.
        # T17-T18 will narrow this to decision-only inputs.
        "retainpdf_pipeline.services.translation.services.classification",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.services.context",
        "retainpdf_pipeline.services.translation.llm.domain_context",
        "retainpdf_pipeline.services.translation.llm.shared.provider_runtime",
        "retainpdf_pipeline.services.translation.core.ocr",
        "retainpdf_pipeline.services.translation.core.payload",
    ),
    "payload": (
        "retainpdf_pipeline.services.translation.core.payload",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.core.ocr",
    ),
    "memory": (
        "retainpdf_pipeline.services.translation.services.memory",
        "retainpdf_pipeline.services.translation.services.terms",
    ),
    "context": (
        "retainpdf_pipeline.services.translation.services.context",
        "retainpdf_pipeline.services.translation.llm.shared.control_context",
        "retainpdf_pipeline.services.translation.llm.style_hints",
        "retainpdf_pipeline.services.translation.services.policy",
        "retainpdf_pipeline.services.translation.services.terms",
    ),
    "ocr": (
        "retainpdf_pipeline.services.translation.core.ocr",
    ),
    "orchestration": (
        "retainpdf_pipeline.services.translation.core.orchestration",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.services.context",
        "retainpdf_pipeline.services.translation.services.continuation",
        "retainpdf_pipeline.services.translation.core.ocr",
        "retainpdf_pipeline.services.translation.core.payload",
    ),
    "continuation": (
        "retainpdf_pipeline.services.translation.services.continuation",
        "retainpdf_pipeline.services.translation.services.context",
        # Continuation review currently asks LLM for borderline cases.
        "retainpdf_pipeline.services.translation.llm",
    ),
    "classification": (
        "retainpdf_pipeline.services.translation.services.classification",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.services.context",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.core.ocr",
        "retainpdf_pipeline.services.translation.services.policy",
    ),
    "terms": (
        "retainpdf_pipeline.services.translation.services.terms",
    ),
    "diagnostics": (
        "retainpdf_pipeline.services.translation.artifacts",
        "retainpdf_pipeline.services.translation.services.agents",
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.llm.shared.control_context",
        "retainpdf_pipeline.services.translation.core.payload",
    ),
    "agents": (
        "retainpdf_pipeline.services.translation.services.agents",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.services.quality",
        "retainpdf_pipeline.services.translation.services.terms",
    ),
    "quality": (
        "retainpdf_pipeline.services.translation.core",
        "retainpdf_pipeline.services.translation.core.item_reader",
        "retainpdf_pipeline.services.translation.llm",
        "retainpdf_pipeline.services.translation.services.quality",
        "retainpdf_pipeline.services.translation.services.terms",
    ),
    "postprocess": (
        "retainpdf_pipeline.services.translation.services.postprocess",
        "retainpdf_pipeline.services.translation.llm",
    ),
}
TRANSLATION_LAYER_IMPORT_EXCEPTIONS: dict[Path, tuple[str, ...]] = {
    # Current llm orchestration still bridges workflow-ish retry behavior until T04-T10 migrate runtime flow.
    Path("llm/shared/orchestration/fallbacks.py"): (
        "retainpdf_pipeline.services.translation.services.postprocess",
    ),
}
TRANSLATION_RENDERING_IMPORT_EXCEPTIONS: dict[Path, tuple[str, ...]] = {
    # Translation can start render-source prewarm in parallel with LLM work, but
    # must not reach into broader rendering internals.
    Path("workflow/execution_runner.py"): (
        "retainpdf_pipeline.services.rendering.source.prewarm",
    ),
}
TRANSLATION_SHARED_COMPAT_IMPORTS = (
    "retainpdf_pipeline.services.translation.core.item_reader",
    "retainpdf_pipeline.services.translation.services.context.session_context",
)
TRANSLATION_REMOVED_COMPAT_IMPORTS = (
    "retainpdf_pipeline.services.translation.from_ocr_pipeline",
    "retainpdf_pipeline.services.translation.translate_only_pipeline",
    "retainpdf_pipeline.services.translation.item_reader",
    "retainpdf_pipeline.services.translation.session_context",
    "retainpdf_pipeline.services.translation.services.context.models",
    "retainpdf_pipeline.services.translation.services.context.unit_context",
    "retainpdf_pipeline.services.translation.services.terms.glossary",
    "retainpdf_pipeline.services.translation.services.terms.abbreviations",
    "retainpdf_pipeline.services.translation.services.terms.injection",
    "retainpdf_pipeline.services.translation.services.quality.checks",
)
DEVTOOLS_TRANSLATION_INTERNAL_IMPORT_ALLOWLIST = {
    Path("inspect_translation_repair_candidates.py"),
    Path("job_debug_runner.py"),
    Path("replay_translation_item.py"),
    Path("run_golden_flow.py"),
    Path("translation_repair_runner.py"),
}
DEVTOOLS_TRANSLATION_INTERNAL_DIR_ALLOWLIST = {
    "experiments",
    "promptfoo",
    "tests",
}


def translation_layer_for(path: Path) -> str | None:
    try:
        parts = path.relative_to(TRANSLATION_ROOT).parts
    except ValueError:
        return None
    if not parts:
        return None
    first = parts[0]
    return first if first in TRANSLATION_ALLOWED_ROOT_DIRS else None

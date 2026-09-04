"""Deprecated compat shim: render prewarm entry now lives in render.

Stage decoupling: OCR/translate stages must NOT import this module.
The prewarm flow moved to the render-private module
``retainpdf_pipeline.render.workflow.prewarm_entry``; cross-stage handoff
goes through files (translation artifacts + prewarm manifest) or
``python -m retainpdf_pipeline.render`` subprocess.

This shim only re-exports the moved helpers so local debug
(``entrypoints/run_book``-style flows) and existing devtools tests keep
working. Do not add new imports of this module from stage code.
"""

from __future__ import annotations

from retainpdf_pipeline.render.workflow.prewarm_entry import build_source_render_preprocess_pages
from retainpdf_pipeline.render.workflow.prewarm_entry import prewarm_manifest_path_from_artifacts_dir
from retainpdf_pipeline.render.workflow.prewarm_entry import run_ocr_render_preprocess
from retainpdf_pipeline.render.workflow.prewarm_entry import run_post_translation_render_prewarm
from retainpdf_pipeline.render.workflow.prewarm_entry import start_ocr_render_preprocess


__all__ = [
    "build_source_render_preprocess_pages",
    "prewarm_manifest_path_from_artifacts_dir",
    "run_post_translation_render_prewarm",
    "run_ocr_render_preprocess",
    "start_ocr_render_preprocess",
]

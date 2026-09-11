from __future__ import annotations

import sys
from pathlib import Path
from unittest import mock

import pytest


REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))


from retainpdf_pipeline.render.workflow.executor import _dispatch_render_mode
from retainpdf_pipeline.render.workflow.modes import RENDER_MODE_HANDLERS


def test_render_mode_registry_covers_all_dispatch_modes() -> None:
    assert sorted(RENDER_MODE_HANDLERS) == ["dual", "overlay", "typst", "typst_visual"]


def test_dispatch_render_mode_rejects_unknown_mode() -> None:
    context = mock.Mock()

    with pytest.raises(ValueError, match="unknown render mode"):
        _dispatch_render_mode(
            mode="typsts",
            source_pdf_path=Path("/tmp/source.pdf"),
            translated_pages={},
            context=context,
            extract_selected_pages=False,
        )


def test_dispatch_render_mode_routes_each_mode_through_registry() -> None:
    context = mock.Mock()
    calls: list[str] = []

    def _fake(mode: str):
        def _handler(*, source_pdf_path, translated_pages, context):
            calls.append(mode)
            return 1, {"mode": mode}

        return _handler

    registry = {mode: _fake(mode) for mode in RENDER_MODE_HANDLERS}
    with mock.patch.dict(
        "retainpdf_pipeline.render.workflow.modes.RENDER_MODE_HANDLERS",
        registry,
        clear=True,
    ):
        for mode in sorted(registry):
            pages, diagnostics = _dispatch_render_mode(
                mode=mode,
                source_pdf_path=Path("/tmp/source.pdf"),
                translated_pages={},
                context=context,
                extract_selected_pages=False,
            )
            assert pages == 1
            assert diagnostics == {"mode": mode}

    assert sorted(calls) == ["dual", "overlay", "typst", "typst_visual"]

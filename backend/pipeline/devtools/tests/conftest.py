from __future__ import annotations

import pytest

from retainpdf_pipeline.foundation.config import layout


@pytest.fixture(autouse=True)
def _isolate_render_state(monkeypatch: pytest.MonkeyPatch):
    # Offline tests must neither learn from nor write to real job history.
    # Memory-specific tests explicitly enable their own temporary store.
    monkeypatch.setenv("RETAIN_RENDER_TYPOGRAPHY_MEMORY", "0")
    # render_only applies tuning in-process. Restore it after each test so a
    # workflow test cannot change the baseline of subsequent layout tests.
    for name, value in vars(layout).items():
        if name.isupper() and isinstance(value, (bool, int, float, str)):
            monkeypatch.setattr(layout, name, value)

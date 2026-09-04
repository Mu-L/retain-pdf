from __future__ import annotations

import importlib
import sys
from pathlib import Path


REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))


def test_translation_public_import_is_lazy() -> None:
    for module_name in list(sys.modules):
        if module_name == "retainpdf_pipeline.translate.public":
            sys.modules.pop(module_name, None)
        elif module_name.startswith("retainpdf_pipeline.translate.workflow"):
            sys.modules.pop(module_name, None)
        elif module_name.startswith("retainpdf_pipeline.render"):
            sys.modules.pop(module_name, None)

    public = importlib.import_module("retainpdf_pipeline.translate.public")

    assert public.__all__
    assert "retainpdf_pipeline.translate.workflow" not in sys.modules
    assert not any(module_name.startswith("retainpdf_pipeline.render") for module_name in sys.modules)


def test_translation_public_resolves_exports_on_demand() -> None:
    public = importlib.import_module("retainpdf_pipeline.translate.public")

    assert public.item_block_kind({"block_kind": "text"}) == "text"
    assert public.DEFAULT_MODEL

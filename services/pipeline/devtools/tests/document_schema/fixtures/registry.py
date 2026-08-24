from __future__ import annotations

from pathlib import Path

from retainpdf_pipeline.services.document_schema.providers import PROVIDER_GENERIC_FLAT_OCR
from retainpdf_pipeline.services.document_schema.providers import PROVIDER_MINERU
from retainpdf_pipeline.services.document_schema.providers import PROVIDER_MINERU_CONTENT_LIST_V2
from retainpdf_pipeline.services.document_schema.providers import PROVIDER_PADDLE
from retainpdf_pipeline.services.mineru.contracts import MINERU_CONTENT_LIST_V2_FILE_NAME
from retainpdf_pipeline.services.mineru.contracts import MINERU_LAYOUT_JSON_FILE_NAME

REPO_ROOT = Path(__file__).resolve().parents[6]
MINERU_REGRESSION_ROOT = REPO_ROOT / "data" / "jobs" / "20260414164126-41e3ea" / "ocr" / "unpacked"
DOCUMENT_SCHEMA_FIXTURES_ROOT = REPO_ROOT / "services" / "pipeline" / "devtools" / "tests" / "document_schema" / "fixtures"
PADDLE_FIXTURES_ROOT = REPO_ROOT / "services" / "api" / "crates" / "retain-data" / "src" / "ocr_provider" / "paddle"


# Single source of truth for provider fixtures consumed by regression_check.py.
PROVIDER_FIXTURES = [
    {
        "name": "raw_layout",
        "provider": PROVIDER_MINERU,
        "document_id": "regression-raw-layout",
        "path": MINERU_REGRESSION_ROOT / MINERU_LAYOUT_JSON_FILE_NAME,
    },
    {
        "name": "content_list_v2",
        "provider": PROVIDER_MINERU_CONTENT_LIST_V2,
        "document_id": "regression-content-v2",
        "path": MINERU_REGRESSION_ROOT / MINERU_CONTENT_LIST_V2_FILE_NAME,
    },
    {
        "name": "generic_fixture",
        "provider": PROVIDER_GENERIC_FLAT_OCR,
        "document_id": "regression-generic",
        "path": DOCUMENT_SCHEMA_FIXTURES_ROOT / "generic_flat_ocr.minimal.json",
    },
    {
        "name": "paddle_fixture",
        "provider": PROVIDER_PADDLE,
        "document_id": "regression-paddle",
        "path": PADDLE_FIXTURES_ROOT / "json_full.json",
    },
    {
        "name": "paddle_sci_fixture",
        "provider": PROVIDER_PADDLE,
        "document_id": "regression-paddle-sci",
        "path": PADDLE_FIXTURES_ROOT / "json_sci.json",
    },
]


def expected_fixture_providers() -> set[str]:
    return {str(item["provider"]) for item in PROVIDER_FIXTURES}


def fixture_names() -> list[str]:
    return [str(item["name"]) for item in PROVIDER_FIXTURES]

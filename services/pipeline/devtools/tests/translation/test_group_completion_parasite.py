"""Group completion must not be parasitized by a single member's text.

Regression for job 20260903172634-d33d97: p009-b009 carried no translation
but was counted completed because p009-b010 held a solo text in the shared
group field. A later regroup exposed b009 as pending and the checkpoint
guard failed the entire job.
"""

import sys
from pathlib import Path

REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))

from retainpdf_pipeline.services.translation.core.payload.parts.units import (
    pending_translation_items,
)


def _member(item_id: str, source: str, group_text: str = "") -> dict:
    return {
        "item_id": item_id,
        "translation_unit_id": "__cg__:cg-009-008",
        "translation_unit_kind": "group",
        "translation_unit_member_ids": ["p009-b009", "p009-b010"],
        "block_type": "text",
        "should_translate": True,
        "protected_source_text": source,
        "source_text": source,
        "formula_map": [],
        "protected_map": [],
        "continuation_group": "cg-009-008",
        "translation_unit_protected_translated_text": group_text,
        "group_protected_translated_text": "",
    }


def test_lone_member_text_does_not_complete_group() -> None:
    payload = [
        _member("p009-b009", "first half of the sentence"),
        _member("p009-b010", "second half of the sentence", group_text="后半句译文"),
    ]
    units = pending_translation_items(payload)
    assert len(units) == 1
    combined = units[0].get("protected_source_text", "")
    assert "first half" in combined and "second half" in combined


def test_identical_group_text_completes_group() -> None:
    payload = [
        _member("p009-b009", "first half", group_text="整段译文"),
        _member("p009-b010", "second half", group_text="整段译文"),
    ]
    assert pending_translation_items(payload) == []


def test_mismatched_group_texts_keep_group_pending() -> None:
    payload = [
        _member("p009-b009", "first half", group_text="甲译文"),
        _member("p009-b010", "second half", group_text="乙译文"),
    ]
    units = pending_translation_items(payload)
    assert len(units) == 1

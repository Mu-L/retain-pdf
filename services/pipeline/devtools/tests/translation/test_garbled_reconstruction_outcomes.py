from collections import Counter
from copy import deepcopy
import json
import threading
from types import SimpleNamespace

import pytest

from retainpdf_pipeline.translate.services.postprocess import garbled_reconstruction as reconstruction
from retainpdf_pipeline.translate.workflow.phases import repair


def item(page):
    return {"item_id": f"p{page + 1:03d}-b000", "page_idx": page,
            "source_text": "The catalyst remains stable.",
            "protected_source_text": "The catalyst remains stable.",
            "formula_map": [], "protected_map": [], "should_translate": True,
            "final_status": "failed", "translated_text": ""}


def issue():
    return SimpleNamespace(kind="synthetic_rejection", as_dict=lambda: {"kind": "synthetic_rejection"})


@pytest.mark.parametrize("reject", [False, True])
def test_apply_outcome_matches_actual_translation_state(monkeypatch, reject):
    payload = item(0)
    monkeypatch.setattr(reconstruction, "_validate_reconstruction", lambda *args: [issue()] if reject else [])
    outcome = reconstruction._apply_reconstruction([payload], "催化剂保持稳定。")
    assert outcome == ("rejected" if reject else "applied")
    assert payload["final_status"] == ("failed" if reject else "translated")
    assert payload["translated_text"] == ("" if reject else "催化剂保持稳定。")
    if reject:
        assert payload["translation_diagnostics"]["garbled_reconstruction_rejected"]


@pytest.mark.parametrize("no_items", [False, True])
def test_no_result_does_not_modify_payload_or_validate(monkeypatch, no_items):
    payload = [] if no_items else [item(0)]
    before = deepcopy(payload)
    def forbidden(*args):
        raise AssertionError("no result must not invoke quality validation")
    monkeypatch.setattr(reconstruction, "_validate_reconstruction", forbidden)
    assert reconstruction._apply_reconstruction(payload, "译文" if no_items else "") == "no_result"
    assert payload == before


@pytest.mark.parametrize("workers", [1, 4])
@pytest.mark.parametrize("has_success", [False, True])
def test_stage_counts_only_applied_and_saves_cross_page_rejections(tmp_path, monkeypatch, workers, has_success):
    pages = {page: [item(page)] for page in range(4)}
    paths = {page: tmp_path / f"page-{page}.json" for page in pages}
    # Fix the candidate boundary: one cross-page target, one valid single,
    # one empty response. Use the real runner, application and stage save.
    targets = {"cross": [pages[0][0], pages[1][0]], "good": pages[2], "empty": pages[3]}
    representatives = {key: values[0] for key, values in targets.items()}
    monkeypatch.setattr(reconstruction, "_collect_candidates", lambda items: (targets, representatives))
    monkeypatch.setattr(reconstruction, "_max_candidates_from_env", lambda default: 3)
    monkeypatch.setattr(reconstruction, "_validate_reconstruction",
                        lambda target, text: [issue()] if target["page_idx"] == 0 or not has_success else [])
    calls = []
    lock = threading.Lock()
    def model(target, **kwargs):
        with lock:
            calls.append(target["page_idx"])
        return "" if target["page_idx"] == 3 else "催化剂保持稳定。"
    monkeypatch.setattr(reconstruction, "_repair_item_translation", model)
    monkeypatch.setattr(repair, "_garbled_reconstruction_enabled", lambda: True)
    monkeypatch.setattr(repair, "_garbled_reconstruction_runtime", lambda **kwargs: SimpleNamespace(
        model="offline", display_base_url=lambda: "offline", provider_reason="test"))
    events = []
    monkeypatch.setattr(repair, "emit_stage_progress", lambda **event: events.append(event))
    repair.run_garbled_reconstruction_stage(
        page_payloads=pages, translation_paths=paths, api_key="", model="offline",
        base_url="", workers=workers, run_diagnostics=None,
    )
    final = events[-1]["payload"]
    assert final["garbled_attempted"] == 3
    assert final["garbled_reconstructed"] == int(has_success)
    assert {0, 1, 2} <= set(final["dirty_pages"])
    assert Counter(calls) == Counter({0: 1, 2: 1, 3: 1})
    for page in (0, 1):
        persisted = json.loads(paths[page].read_text())[0]
        assert persisted["final_status"] == "failed"
        assert persisted["translated_text"] == ""
        assert persisted["translation_diagnostics"]["garbled_reconstruction_rejected"]
    assert json.loads(paths[2].read_text())[0]["final_status"] == ("translated" if has_success else "failed")


@pytest.mark.parametrize("workers", [1, 4])
def test_only_rejected_responses_still_return_dirty_pages(monkeypatch, workers):
    targets = {str(page): [item(page)] for page in (0, 1)}
    monkeypatch.setattr(reconstruction, "_repair_item_translation", lambda *args, **kwargs: "被拒绝的输出")
    monkeypatch.setattr(reconstruction, "_validate_reconstruction", lambda *args: [issue()])
    count, dirty = reconstruction._run_reconstruction_candidates(
        [(key, values[0]) for key, values in targets.items()], candidates_by_key=targets,
        api_key="", model="offline", base_url="", workers=workers,
        runtime=SimpleNamespace(model="offline", display_base_url=lambda: "offline", provider_reason="test"),
    )
    assert count == 0
    assert dirty == {0, 1}

from __future__ import annotations

import json
import multiprocessing
import os
import shutil
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest


REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))

from services.translation.core.payload import load_translations
from services.translation.core.payload import pending_translation_items
from services.translation.core.payload import save_translations
from services.translation.core.payload import write_translation_manifest
from services.translation.workflow.checkpoint import TRANSLATION_CHECKPOINT_FILE_NAME
from services.translation.workflow.checkpoint import ResumeCandidateFingerprintMismatch
from services.translation.workflow.checkpoint import TranslationCheckpointSession
from services.translation.workflow.checkpoint import discard_copied_resume_candidate
from services.translation.workflow.checkpoint.store import CheckpointStore
from services.translation.workflow.checkpoint.identity import build_translation_identity
from services.translation.workflow.execution import TranslationExecutionRequest


def _request(source_json: Path, output_dir: Path, *, model: str = "test-model") -> TranslationExecutionRequest:
    return TranslationExecutionRequest(
        source_json_path=source_json,
        output_dir=output_dir,
        api_key="test-key",
        model=model,
        base_url="https://example.invalid/v1",
    )


def _plan():
    return SimpleNamespace(
        start=0,
        stop=0,
        glossary_entries=[],
        policy_config=SimpleNamespace(
            rule_profile_name="general_sci",
            rule_profile_text="General scientific translation rules.",
            custom_rules_text="",
        ),
    )


def _item(item_id: str, translated_text: str = "") -> dict:
    return {
        "item_id": item_id,
        "block_kind": "text",
        "layout_role": "paragraph",
        "semantic_role": "body",
        "structure_role": "body",
        "policy_translate": True,
        "asset_id": "",
        "reading_order": 0,
        "raw_block_type": "paragraph",
        "normalized_sub_type": "body",
        "source_text": f"source {item_id}",
        "protected_source_text": f"source {item_id}",
        "translated_text": translated_text,
        "should_translate": True,
        "continuation_group": "",
        "formula_map": [],
        "protected_map": [],
    }


def _crash_after_checkpoint_flush(source_json: str, output_dir: str) -> None:
    output = Path(output_dir)
    page = output / "page-001-deepseek.json"
    payload = [_item("done", "已完成"), _item("pending")]
    checkpoint = TranslationCheckpointSession.acquire(
        _request(Path(source_json), output),
        _plan(),
    )
    save_translations(page, payload)
    checkpoint.update("translating", {0: payload}, {0: page})
    os._exit(23)


def test_checkpoint_lock_rejects_concurrent_writer(tmp_path: Path) -> None:
    checkpoint_path = tmp_path / "translated" / TRANSLATION_CHECKPOINT_FILE_NAME
    first = CheckpointStore(checkpoint_path)
    second = CheckpointStore(checkpoint_path)
    first.acquire()
    try:
        with pytest.raises(RuntimeError, match="already owned"):
            second.acquire()
    finally:
        first.close()


def test_worker_crash_preserves_flush_and_releases_lease(tmp_path: Path) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text("{}", encoding="utf-8")
    output_dir = tmp_path / "job-crashed" / "translated"
    process = multiprocessing.get_context("spawn").Process(
        target=_crash_after_checkpoint_flush,
        args=(str(source_json), str(output_dir)),
    )
    process.start()
    process.join(timeout=15)

    assert process.exitcode == 23
    assert not (output_dir / "translation-manifest.json").exists()
    checkpoint_payload = json.loads(
        (output_dir / TRANSLATION_CHECKPOINT_FILE_NAME).read_text(encoding="utf-8")
    )
    assert checkpoint_payload["status"] == "in_progress"
    assert checkpoint_payload["progress"]["completed_item_count"] == 1

    with TranslationCheckpointSession.acquire(
        _request(source_json, output_dir),
        _plan(),
    ):
        resumed = load_translations(output_dir / "page-001-deepseek.json")
        assert [item["item_id"] for item in pending_translation_items(resumed)] == ["pending"]


def test_fingerprint_mismatch_releases_checkpoint_lease(tmp_path: Path) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text("{}", encoding="utf-8")
    output_dir = tmp_path / "job-a" / "translated"
    with TranslationCheckpointSession.acquire(_request(source_json, output_dir), _plan()):
        pass

    with pytest.raises(RuntimeError, match="fingerprint mismatch"):
        TranslationCheckpointSession.acquire(
            _request(source_json, output_dir, model="different-model"),
            _plan(),
        )

    store = CheckpointStore(output_dir / TRANSLATION_CHECKPOINT_FILE_NAME)
    store.acquire()
    store.close()


def test_checkpoint_identity_tracks_translation_engine_version(tmp_path: Path, monkeypatch) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text("{}", encoding="utf-8")
    request = _request(source_json, tmp_path / "job-a" / "translated")

    first = build_translation_identity(request, _plan())
    monkeypatch.setattr(
        "services.translation.workflow.checkpoint.identity.translation_engine_identity",
        lambda **_kwargs: {
            "prompt_hash": "changed-prompt",
            "translation_protocol_version": "changed-protocol",
        },
    )
    second = build_translation_identity(request, _plan())

    assert first["parameters_sha256"] != second["parameters_sha256"]
    assert first["fingerprint"] != second["fingerprint"]


def test_checkpoint_identity_tracks_resolved_policy_content(tmp_path: Path) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text("{}", encoding="utf-8")
    request = _request(source_json, tmp_path / "job-a" / "translated")
    first_plan = _plan()
    second_plan = _plan()
    second_plan.policy_config.rule_profile_text = "Changed rule profile content."

    first = build_translation_identity(request, first_plan)
    second = build_translation_identity(request, second_plan)

    assert first["parameters_sha256"] != second["parameters_sha256"]
    assert first["fingerprint"] != second["fingerprint"]


def test_checkpoint_rejects_completed_item_regression(tmp_path: Path) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text("{}", encoding="utf-8")
    output_dir = tmp_path / "job-a" / "translated"
    page = output_dir / "page-001-deepseek.json"
    payload = [_item("stable", "已完成")]

    with TranslationCheckpointSession.acquire(_request(source_json, output_dir), _plan()) as checkpoint:
        save_translations(page, payload)
        checkpoint.update("policy_ready", {0: payload}, {0: page})
        payload[0]["translated_text"] = ""
        with pytest.raises(RuntimeError, match="regressed to pending"):
            checkpoint.update("translating", {0: payload}, {0: page})


def test_copied_checkpoint_resumes_only_pending_items(tmp_path: Path) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text('{"schema":"document.v1"}', encoding="utf-8")
    old_output = tmp_path / "job-old" / "translated"
    old_page = old_output / "page-001-deepseek.json"
    old_payload = [_item("done", "已完成"), _item("pending")]

    with TranslationCheckpointSession.acquire(_request(source_json, old_output), _plan()) as checkpoint:
        save_translations(old_page, old_payload)
        checkpoint.update("translating", {0: old_payload}, {0: old_page})

    assert not (old_output / "translation-manifest.json").exists()
    interrupted = json.loads(
        (old_output / TRANSLATION_CHECKPOINT_FILE_NAME).read_text(encoding="utf-8")
    )
    assert interrupted["status"] == "in_progress"
    assert interrupted["progress"]["completed_item_count"] == 1
    assert "parameters_sha256" in interrupted
    assert "parameters" not in interrupted
    assert "base_url" not in interrupted

    new_output = tmp_path / "job-new" / "translated"
    new_output.mkdir(parents=True)
    new_page = new_output / old_page.name
    shutil.copy2(old_page, new_page)
    shutil.copy2(
        old_output / TRANSLATION_CHECKPOINT_FILE_NAME,
        new_output / TRANSLATION_CHECKPOINT_FILE_NAME,
    )

    with TranslationCheckpointSession.acquire(_request(source_json, new_output), _plan()) as checkpoint:
        resumed_payload = load_translations(new_page)
        pending = pending_translation_items(resumed_payload)
        assert [item["item_id"] for item in pending] == ["pending"]
        assert checkpoint.payload is not None
        assert checkpoint.payload["resumed_from_attempt_id"] == "job-old"

        resumed_payload[1]["translated_text"] = "现在完成"
        save_translations(new_page, resumed_payload)
        checkpoint.update("validating", {0: resumed_payload}, {0: new_page})
        manifest_path = write_translation_manifest(new_output, {0: new_page})
        checkpoint.complete(manifest_path)

    committed = json.loads(
        (new_output / TRANSLATION_CHECKPOINT_FILE_NAME).read_text(encoding="utf-8")
    )
    assert committed["status"] == "complete"
    assert committed["phase"] == "committed"
    assert committed["progress"]["pending_item_count"] == 0
    assert committed["final_manifest"] == "translation-manifest.json"


def test_mismatched_copied_checkpoint_is_explicitly_discarded(tmp_path: Path) -> None:
    source_json = tmp_path / "document.v1.json"
    source_json.write_text("{}", encoding="utf-8")
    old_output = tmp_path / "job-old" / "translated"
    old_page = old_output / "page-001-deepseek.json"
    payload = [_item("pending")]
    with TranslationCheckpointSession.acquire(_request(source_json, old_output), _plan()) as checkpoint:
        save_translations(old_page, payload)
        checkpoint.update("translating", {0: payload}, {0: old_page})

    new_output = tmp_path / "job-new" / "translated"
    new_output.mkdir(parents=True)
    new_page = new_output / old_page.name
    shutil.copy2(old_page, new_page)
    shutil.copy2(
        old_output / TRANSLATION_CHECKPOINT_FILE_NAME,
        new_output / TRANSLATION_CHECKPOINT_FILE_NAME,
    )

    with pytest.raises(ResumeCandidateFingerprintMismatch) as raised:
        TranslationCheckpointSession.acquire(
            _request(source_json, new_output, model="new-model"),
            _plan(),
        )
    discard_copied_resume_candidate(
        new_output,
        source_attempt_id=raised.value.source_attempt_id,
    )

    assert not new_page.exists()
    assert not (new_output / TRANSLATION_CHECKPOINT_FILE_NAME).exists()
    with TranslationCheckpointSession.acquire(
        _request(source_json, new_output, model="new-model"),
        _plan(),
    ) as fresh:
        assert fresh.payload is not None
        assert fresh.payload["attempt_id"] == "job-new"
        assert "resumed_from_attempt_id" not in fresh.payload

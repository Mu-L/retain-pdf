from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from retainpdf_pipeline.services.translation.core.payload.parts.units import pending_translation_items


TRANSLATION_CHECKPOINT_FILE_NAME = "translation-checkpoint.v1.json"
TRANSLATION_CHECKPOINT_SCHEMA = "translation_checkpoint_v1"
TRANSLATION_CHECKPOINT_SCHEMA_VERSION = 1
CHECKPOINT_PHASES = (
    "preparing",
    "policy_ready",
    "translating",
    "repairing",
    "validating",
    "committed",
)


def translation_checkpoint_path(translations_dir: Path) -> Path:
    return Path(translations_dir) / TRANSLATION_CHECKPOINT_FILE_NAME


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def validate_checkpoint(payload: object, *, path: Path) -> dict[str, Any]:
    if not isinstance(payload, dict):
        raise RuntimeError(f"Invalid translation checkpoint object: {path}")
    if payload.get("schema") != TRANSLATION_CHECKPOINT_SCHEMA:
        raise RuntimeError(f"Unsupported translation checkpoint schema: {path}")
    if payload.get("schema_version") != TRANSLATION_CHECKPOINT_SCHEMA_VERSION:
        raise RuntimeError(f"Unsupported translation checkpoint version: {path}")
    return dict(payload)


def new_checkpoint(
    *,
    identity: dict[str, Any],
    attempt_id: str,
    previous: dict[str, Any] | None = None,
) -> dict[str, Any]:
    timestamp = now_iso()
    payload: dict[str, Any] = {
        "schema": TRANSLATION_CHECKPOINT_SCHEMA,
        "schema_version": TRANSLATION_CHECKPOINT_SCHEMA_VERSION,
        "status": "in_progress",
        "phase": "preparing",
        "attempt_id": attempt_id,
        "created_at": str((previous or {}).get("created_at", "") or timestamp),
        "updated_at": timestamp,
        **identity,
        "pages": list((previous or {}).get("pages", [])),
        "progress": dict((previous or {}).get("progress", {})),
        "final_manifest": None,
    }
    previous_attempt = str((previous or {}).get("attempt_id", "") or "")
    if previous_attempt and previous_attempt != attempt_id:
        payload["resumed_from_attempt_id"] = previous_attempt
    return payload


def project_progress(
    *,
    output_dir: Path,
    page_payloads: dict[int, list[dict]],
    translation_paths: dict[int, Path],
) -> tuple[list[dict[str, Any]], dict[str, int]]:
    flat_payload = [
        item
        for page_idx in sorted(page_payloads)
        for item in page_payloads[page_idx]
        if isinstance(item, dict)
    ]
    pending_ids: set[str] = set()
    for unit in pending_translation_items(flat_payload):
        member_ids = [
            str(item_id or "")
            for item_id in unit.get("translation_unit_member_ids", [])
            if str(item_id or "")
        ]
        if len(member_ids) > 1:
            pending_ids.update(member_ids)
            continue
        item_id = str(unit.get("item_id", "") or "")
        if item_id:
            pending_ids.add(item_id)
    pages: list[dict[str, Any]] = []
    completed_total = 0
    item_total = 0
    resolved_output_dir = Path(output_dir).resolve()
    for page_idx in sorted(page_payloads):
        items = [item for item in page_payloads[page_idx] if isinstance(item, dict)]
        item_ids = [str(item.get("item_id", "") or "") for item in items]
        pending_page_ids = [item_id for item_id in item_ids if item_id in pending_ids]
        completed = len(item_ids) - len(pending_page_ids)
        completed_total += completed
        item_total += len(item_ids)
        relative_path = (
            Path(translation_paths[page_idx])
            .resolve()
            .relative_to(resolved_output_dir)
            .as_posix()
        )
        pages.append(
            {
                "page_index": page_idx,
                "path": relative_path,
                "item_count": len(item_ids),
                "completed_item_count": completed,
                "pending_item_ids": pending_page_ids,
            }
        )
    return pages, {
        "item_count": item_total,
        "completed_item_count": completed_total,
        "pending_item_count": max(0, item_total - completed_total),
    }


def advance_checkpoint(
    payload: dict[str, Any],
    *,
    phase: str,
    pages: list[dict[str, Any]],
    progress: dict[str, int],
) -> dict[str, Any]:
    current_phase = str(payload.get("phase", "") or "")
    if current_phase not in CHECKPOINT_PHASES or phase not in CHECKPOINT_PHASES:
        raise RuntimeError(f"Unknown translation checkpoint phase: {current_phase}->{phase}")
    if CHECKPOINT_PHASES.index(phase) < CHECKPOINT_PHASES.index(current_phase):
        raise RuntimeError(
            f"Translation checkpoint phase cannot move backwards: {current_phase}->{phase}"
        )
    previous_pending = {
        str(item_id)
        for page in payload.get("pages", [])
        if isinstance(page, dict)
        for item_id in page.get("pending_item_ids", [])
    }
    current_pending = {
        str(item_id)
        for page in pages
        for item_id in page.get("pending_item_ids", [])
    }
    if payload.get("pages"):
        regressed = current_pending - previous_pending
        if regressed:
            preview = ", ".join(sorted(regressed)[:8])
            raise RuntimeError(
                f"Translation checkpoint completed items regressed to pending: {preview}"
            )
    payload.update(
        {
            "status": "in_progress",
            "phase": phase,
            "updated_at": now_iso(),
            "pages": pages,
            "progress": progress,
        }
    )
    return payload


def commit_checkpoint(payload: dict[str, Any], *, manifest_name: str) -> dict[str, Any]:
    if payload.get("phase") != "validating":
        raise RuntimeError("Translation checkpoint can only commit after validation")
    if int((payload.get("progress") or {}).get("pending_item_count", -1)) != 0:
        raise RuntimeError("Translation checkpoint cannot commit with pending items")
    payload.update(
        {
            "status": "complete",
            "phase": "committed",
            "updated_at": now_iso(),
            "final_manifest": manifest_name,
        }
    )
    return payload

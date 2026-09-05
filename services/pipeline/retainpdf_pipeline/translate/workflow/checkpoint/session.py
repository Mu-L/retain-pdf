from __future__ import annotations

import json
from pathlib import Path
from typing import TYPE_CHECKING, Any

from .contract import (
    advance_checkpoint,
    commit_checkpoint,
    committed_pages_for_changes,
    new_checkpoint,
    project_progress,
    translation_checkpoint_path,
    validate_checkpoint,
)
from .contract import (
    changed_item_ids_by_page as diff_changed_item_ids_by_page,
)
from .identity import build_translation_identity
from .store import CheckpointStore

if TYPE_CHECKING:
    from retainpdf_pipeline.translate.workflow.execution import (
        TranslationExecutionRequest,
    )
    from retainpdf_pipeline.translate.workflow.execution_plan import (
        TranslationExecutionPlan,
    )


class ResumeCandidateFingerprintMismatch(RuntimeError):
    def __init__(self, source_attempt_id: str) -> None:
        super().__init__(
            "Copied translation checkpoint fingerprint does not match the new attempt"
        )
        self.source_attempt_id = source_attempt_id


class TranslationCheckpointSession:
    def __init__(
        self,
        *,
        output_dir: Path,
        identity: dict[str, Any],
        attempt_id: str,
    ) -> None:
        self.output_dir = Path(output_dir)
        self.identity = identity
        self.attempt_id = attempt_id
        self.store = CheckpointStore(translation_checkpoint_path(self.output_dir))
        self.payload: dict[str, Any] | None = None

    @classmethod
    def acquire(
        cls,
        request: TranslationExecutionRequest,
        plan: TranslationExecutionPlan,
    ) -> "TranslationCheckpointSession":
        output_dir = Path(request.output_dir)
        session = cls(
            output_dir=output_dir,
            identity=build_translation_identity(request, plan),
            attempt_id=output_dir.parent.name or output_dir.name,
        )
        session.store.acquire()
        try:
            session._initialize()
        except Exception:
            session.store.close()
            raise
        return session

    def _initialize(self) -> None:
        loaded = self.store.load()
        previous = (
            validate_checkpoint(loaded, path=self.store.path)
            if loaded is not None
            else None
        )
        if previous is not None:
            self.store.restore_committed_pages(previous)
        if previous is not None and previous.get("fingerprint") != self.identity["fingerprint"]:
            previous_attempt = str(previous.get("attempt_id", "") or "")
            if previous_attempt and previous_attempt != self.attempt_id:
                raise ResumeCandidateFingerprintMismatch(previous_attempt)
            raise RuntimeError("Translation checkpoint fingerprint mismatch within the same attempt")
        if previous is not None:
            self._replay_durable_checkpoint(previous)
        self.payload = new_checkpoint(
            identity=self.identity,
            attempt_id=self.attempt_id,
            previous=previous,
        )
        self._persist(committed_pages=[])

    def update(
        self,
        phase: str,
        page_payloads: dict[int, list[dict]],
        translation_paths: dict[int, Path],
        changed_item_ids_by_page: dict[int, set[str]] | None = None,
        *,
        detect_item_changes: bool = False,
    ) -> None:
        if self.payload is None:
            raise RuntimeError("Translation checkpoint session is not initialized")
        previous_pages = [
            dict(page)
            for page in self.payload.get("pages", [])
            if isinstance(page, dict)
        ]
        pages, progress = project_progress(
            output_dir=self.output_dir,
            page_payloads=page_payloads,
            translation_paths=translation_paths,
        )
        derived_changes = diff_changed_item_ids_by_page(previous_pages, pages)
        if changed_item_ids_by_page is not None:
            committed_changes = self._validate_change_hint(
                previous_pages=previous_pages,
                pages=pages,
                derived_changes=derived_changes,
                hinted_changes=changed_item_ids_by_page,
            )
        elif detect_item_changes:
            committed_changes = derived_changes
        else:
            committed_changes = {}
        advance_checkpoint(
            self.payload,
            phase=str(phase),
            pages=pages,
            progress=progress,
        )
        self._persist(
            committed_pages=committed_pages_for_changes(pages, committed_changes)
        )

    def complete(self, manifest_path: Path) -> None:
        if self.payload is None:
            raise RuntimeError("Translation checkpoint session is not initialized")
        commit_checkpoint(
            self.payload,
            manifest_name=Path(manifest_path).name,
        )
        self._persist(committed_pages=[])

    def _validate_change_hint(
        self,
        *,
        previous_pages: list[dict[str, Any]],
        pages: list[dict[str, Any]],
        derived_changes: dict[int, set[str]],
        hinted_changes: dict[int, set[str]],
    ) -> dict[int, set[str]]:
        normalized = {
            int(page_idx): {str(item_id) for item_id in item_ids if str(item_id)}
            for page_idx, item_ids in hinted_changes.items()
            if item_ids
        }
        current_fingerprints = {
            int(page.get("page_index", -1)): page.get("item_fingerprints", {})
            for page in pages
            if isinstance(page, dict)
        }
        for page_idx, item_ids in normalized.items():
            available = current_fingerprints.get(page_idx)
            if not isinstance(available, dict):
                raise RuntimeError(f"Changed translation page is missing: {page_idx}")
            missing = sorted(item_ids - set(available))
            if missing:
                raise RuntimeError(
                    f"Changed translation items are missing from page {page_idx}: "
                    + ", ".join(missing[:8])
                )

        # Old v1 checkpoints did not have item fingerprints. Trust the precise
        # in-process hint for those pages once, then the newly persisted
        # fingerprints become authoritative for every later flush/restart.
        previous_fingerprints = {
            int(page.get("page_index", -1)): page.get("item_fingerprints")
            for page in previous_pages
            if isinstance(page, dict)
        }
        comparable_pages = {
            page_idx
            for page_idx, fingerprints in previous_fingerprints.items()
            if isinstance(fingerprints, dict)
        }
        reconciled = {
            page_idx: set(item_ids)
            for page_idx, item_ids in normalized.items()
            if page_idx not in comparable_pages
        }
        # Once a durable baseline exists, the page bytes and their item
        # fingerprints are authoritative. This both fills any missed expanded
        # member and drops transient changes that returned to their old value
        # before the batch was flushed.
        for page_idx, item_ids in derived_changes.items():
            if page_idx in comparable_pages and item_ids:
                reconciled[page_idx] = set(item_ids)
        return reconciled

    def _persist(self, *, committed_pages: list[dict[str, Any]]) -> None:
        if self.payload is None:
            raise RuntimeError("Translation checkpoint session is not initialized")
        self.payload["generation"] = int(self.payload.get("generation", 0) or 0) + 1
        self.payload["committed_pages"] = [dict(page) for page in committed_pages]
        event_payload = self._event_payload(
            payload=self.payload,
            committed_pages=committed_pages,
            producer_generation=int(self.payload["generation"]),
        )
        self.payload["committed_pages_event"] = event_payload
        self.store.snapshot_pages(self.payload)
        self.store.save(self.payload)
        from retainpdf_pipeline.translate.artifacts.aggregator import get_active_translation_run_diagnostics
        diagnostics = get_active_translation_run_diagnostics()
        if diagnostics is not None:
            diagnostics.record_committed_pages(committed_pages)
        self.store.prune_snapshots(int(self.payload["generation"]))
        self._emit_pipeline_checkpoint(event_payload)

    @staticmethod
    def _event_payload(
        *,
        payload: dict[str, Any],
        committed_pages: list[dict[str, Any]],
        producer_generation: int,
    ) -> dict[str, Any]:
        return {
            "schema": "pipeline_checkpoint_v1",
            "schema_version": 1,
            "stage": "translate",
            "phase": str(payload.get("phase", "") or ""),
            "status": str(payload.get("status", "") or ""),
            "producer_generation": int(producer_generation),
            "committed_pages": [dict(page) for page in committed_pages],
            "progress": dict(payload.get("progress", {})),
        }

    def _replay_durable_checkpoint(self, payload: dict[str, Any]) -> None:
        committed_pages = payload.get("committed_pages")
        event_payload = payload.get("committed_pages_event")
        if not isinstance(committed_pages, list) or not committed_pages:
            return
        valid_stored_event = (
            isinstance(event_payload, dict)
            and event_payload.get("schema") == "pipeline_checkpoint_v1"
            and event_payload.get("schema_version") == 1
            and event_payload.get("committed_pages") == committed_pages
            and event_payload.get("producer_generation")
            == int(payload.get("generation", 0) or 0)
        )
        if not valid_stored_event:
            event_payload = self._event_payload(
                payload=payload,
                committed_pages=[page for page in committed_pages if isinstance(page, dict)],
                producer_generation=int(payload.get("generation", 0) or 0),
            )
        self._emit_pipeline_checkpoint(dict(event_payload))

    def _emit_pipeline_checkpoint(self, payload: dict[str, Any]) -> None:
        print(
            json.dumps(
                {"event_type": "pipeline_checkpoint", "payload": payload},
                ensure_ascii=False,
            ),
            flush=True,
        )

    def close(self) -> None:
        self.store.close()

    def __enter__(self) -> "TranslationCheckpointSession":
        return self

    def __exit__(self, exc_type, exc, traceback) -> None:
        self.close()

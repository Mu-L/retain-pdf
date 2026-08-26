from __future__ import annotations

from pathlib import Path
import json
from typing import TYPE_CHECKING, Any

from .contract import new_checkpoint
from .contract import advance_checkpoint
from .contract import commit_checkpoint
from .contract import project_progress
from .contract import translation_checkpoint_path
from .contract import validate_checkpoint
from .identity import build_translation_identity
from .store import CheckpointStore

if TYPE_CHECKING:
    from retainpdf_pipeline.services.translation.workflow.execution import TranslationExecutionRequest
    from retainpdf_pipeline.services.translation.workflow.execution_plan import TranslationExecutionPlan


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
        self.payload = new_checkpoint(
            identity=self.identity,
            attempt_id=self.attempt_id,
            previous=previous,
        )
        self._persist()

    def update(
        self,
        phase: str,
        page_payloads: dict[int, list[dict]],
        translation_paths: dict[int, Path],
    ) -> None:
        if self.payload is None:
            raise RuntimeError("Translation checkpoint session is not initialized")
        pages, progress = project_progress(
            output_dir=self.output_dir,
            page_payloads=page_payloads,
            translation_paths=translation_paths,
        )
        advance_checkpoint(
            self.payload,
            phase=str(phase),
            pages=pages,
            progress=progress,
        )
        self._persist()

    def complete(self, manifest_path: Path) -> None:
        if self.payload is None:
            raise RuntimeError("Translation checkpoint session is not initialized")
        commit_checkpoint(
            self.payload,
            manifest_name=Path(manifest_path).name,
        )
        self._persist()

    def _persist(self) -> None:
        if self.payload is None:
            raise RuntimeError("Translation checkpoint session is not initialized")
        self.payload["generation"] = int(self.payload.get("generation", 0) or 0) + 1
        self.store.snapshot_pages(self.payload)
        self.store.save(self.payload)
        self.store.prune_snapshots(int(self.payload["generation"]))
        unit = self.payload.get("last_committed_unit")
        payload: dict[str, Any] = {
            "schema": "pipeline_checkpoint_v1",
            "schema_version": 1,
            "stage": "translate",
            "phase": str(self.payload.get("phase", "") or ""),
            "status": str(self.payload.get("status", "") or ""),
            "producer_generation": int(self.payload["generation"]),
            "progress": dict(self.payload.get("progress", {})),
        }
        if isinstance(unit, dict):
            payload.update(
                {
                    "unit_key": str(unit.get("unit_key", "") or ""),
                    "unit_order": int(unit.get("unit_order", 0) or 0),
                    "page_index": int(unit.get("page_index", 0) or 0),
                    "page_hash": str(unit.get("page_hash", "") or ""),
                }
            )
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

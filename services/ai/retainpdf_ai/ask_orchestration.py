"""Request-scoped orchestration for synchronous and streaming AI turns."""

from __future__ import annotations

import json
import queue
import threading
from collections.abc import Callable, Iterator
from dataclasses import asdict, dataclass, replace
from typing import Any

from fastapi import HTTPException

from .api_contracts import AskInput
from .config import Settings
from .conversation_state import ConversationState
from .credential_vault import CredentialReferenceError, resolve_credential
from .runtimes.contracts import AgentRuntime

ChatFnBuilder = Callable[..., Any]
ConfirmationProjector = Callable[[Any, str], list[dict[str, Any]]]


@dataclass(frozen=True)
class PreparedAsk:
    """Validated runtime and model settings for one request."""

    runtime: AgentRuntime
    runtime_id: str
    settings: Settings


class AskOrchestrator:
    """Coordinate runtime routing, durable conversation state, and SSE delivery."""

    def __init__(
        self,
        *,
        settings: Settings,
        runtime: AgentRuntime,
        reading_runtime: AgentRuntime | None,
        conversation_state: ConversationState,
        chat_fn_builder: ChatFnBuilder,
        confirmation_projector: ConfirmationProjector,
    ) -> None:
        self._settings = settings
        self._runtime = runtime
        self._runtime_id = runtime.runtime_id
        self._reading_runtime = reading_runtime
        self._conversation_state = conversation_state
        self._chat_fn_builder = chat_fn_builder
        self._confirmation_projector = confirmation_projector

    def prepare(self, payload: AskInput) -> PreparedAsk:
        """Select a runtime and validate model credentials before responding."""
        request_runtime, request_runtime_id = self._request_runtime(payload)
        return PreparedAsk(
            runtime=request_runtime,
            runtime_id=request_runtime_id,
            settings=self._resolve_llm_settings(payload, request_runtime),
        )

    def ask(self, payload: AskInput, prepared: PreparedAsk) -> dict[str, Any]:
        """Execute one synchronous turn and durably persist its final result."""
        request_runtime = prepared.runtime
        chat_fn = self._request_chat_fn(payload, prepared)
        document_id = self._conversation_state.resolve_document_id(payload)
        conversation_id = self._conversation_state.ensure_conversation_id(
            payload, document_id
        )
        history, _compress_event, memory_debug, summary_id = self._prepare_memory(
            payload, conversation_id
        )
        request_message_id, request_persisted = (
            self._conversation_state.persist_agent_request_message(
                conversation_id,
                payload,
                request_runtime,
                chain_parent_id=summary_id,
            )
        )
        result = request_runtime.ask(
            payload.question,
            conversation_id=conversation_id,
            document_id=document_id,
            job_id=payload.job_id.strip(),
            chat_fn=chat_fn,
            history=history,
            **self._operation_arguments(payload, request_runtime, request_message_id),
        )
        persisted = request_persisted and self._conversation_state.persist_turn(
            conversation_id,
            payload,
            result,
            request_runtime,
            chain_parent_id=summary_id,
            prepersisted_user_id=request_message_id,
        )
        return {
            "code": 0,
            "message": "ok",
            "data": self._result_payload(
                result,
                request_runtime_id=prepared.runtime_id,
                conversation_id=conversation_id,
                persisted=persisted,
                memory=memory_debug,
            ),
        }

    def sse_events(
        self,
        payload: AskInput,
        prepared: PreparedAsk,
    ) -> Iterator[str]:
        """Yield the existing SSE protocol while work runs in a host thread."""
        # The runtime loop is synchronous. A queue lets the HTTP response expose
        # tool events and final-answer deltas as soon as they are produced.
        events: queue.Queue[dict[str, Any] | None] = queue.Queue()
        request_runtime = prepared.runtime
        document_id = self._conversation_state.resolve_document_id(payload)
        conversation_id = self._conversation_state.ensure_conversation_id(
            payload, document_id
        )
        history, compress_event, memory_debug, summary_id = self._prepare_memory(
            payload, conversation_id
        )
        chat_fn = (
            None
            if request_runtime.capabilities.model_transport == "runtime_managed"
            else self._chat_fn_builder(
                prepared.settings,
                on_delta=lambda text: events.put(
                    {"type": "answer_delta", "text": text}
                ),
            )
        )

        def run() -> None:
            try:
                if compress_event:
                    events.put(compress_event)
                request_message_id, request_persisted = (
                    self._conversation_state.persist_agent_request_message(
                        conversation_id,
                        payload,
                        request_runtime,
                        chain_parent_id=summary_id,
                    )
                )
                events.put(
                    self._agent_session_event(
                        payload,
                        prepared,
                        conversation_id=conversation_id,
                        document_id=document_id,
                        request_message_id=request_message_id,
                    )
                )
                result = request_runtime.ask(
                    payload.question,
                    conversation_id=conversation_id,
                    document_id=document_id,
                    job_id=payload.job_id.strip(),
                    on_event=events.put,
                    chat_fn=chat_fn,
                    history=history,
                    **self._operation_arguments(
                        payload, request_runtime, request_message_id
                    ),
                )
                for confirmation in self._confirmation_projector(
                    result, self._settings.agent_confirmation_mode
                ):
                    events.put(
                        {
                            "type": "agent_confirmation_required",
                            **confirmation,
                        }
                    )
                persisted = request_persisted and self._conversation_state.persist_turn(
                    conversation_id,
                    payload,
                    result,
                    request_runtime,
                    chain_parent_id=summary_id,
                    prepersisted_user_id=request_message_id,
                )
                events.put(
                    {
                        "type": "done",
                        **self._result_payload(
                            result,
                            request_runtime_id=prepared.runtime_id,
                            conversation_id=conversation_id,
                            memory=memory_debug,
                            persisted=persisted,
                        ),
                    }
                )
            except Exception as exc:  # noqa: BLE001 - SSE serializes runtime errors
                message = (
                    str(exc)
                    if isinstance(exc, RuntimeError)
                    else f"{type(exc).__name__}: {exc}"
                )
                events.put({"type": "error", "message": message})
            finally:
                events.put(None)

        threading.Thread(target=run, daemon=True).start()
        while True:
            event = events.get()
            if event is None:
                break
            yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"

    def _request_runtime(self, payload: AskInput) -> tuple[AgentRuntime, str]:
        mode = payload.assistant_mode
        if mode == "reading":
            if self._reading_runtime is None:
                raise HTTPException(
                    status_code=409,
                    detail="当前 AI 服务没有可用的文档阅读运行时，请重启后再试。",
                )
            return self._reading_runtime, self._reading_runtime.runtime_id
        if mode == "operations":
            if not self._runtime.capabilities.document_operations:
                raise HTTPException(
                    status_code=409,
                    detail="当前 AI Agent 未启用 PDF 操作模式，请先在 API 设置中选择 OpenAI Agent 或 FX Agent。",
                )
            return self._runtime, self._runtime_id
        has_document_scope = bool(payload.document_id.strip() or payload.job_id.strip())
        if (
            has_document_scope
            and self._runtime.capabilities.document_operations
            and not self._runtime.capabilities.document_reading
        ):
            raise HTTPException(
                status_code=409,
                detail=(
                    "当前 Agent 运行时不能读取文档正文；请明确选择 reading 使用文档问答，"
                    "或选择 operations 执行 PDF 操作。"
                ),
            )
        return self._runtime, self._runtime_id

    def _resolve_llm_settings(
        self,
        payload: AskInput,
        request_runtime: AgentRuntime,
    ) -> Settings:
        if request_runtime.capabilities.model_transport == "runtime_managed":
            if not (
                self._settings.fx_gateway_api_key
                or self._settings.fx_gateway_credential_ref
            ):
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "fx runtime 缺少 RETAIN_AI_FX_GATEWAY_API_KEY；"
                        "不会把现有 Rust API key 或普通 DeepSeek key 交给 fx。"
                    ),
                )
            return self._settings
        api_key = payload.llm_api_key.strip()
        if not api_key and self._settings.llm_credential_ref:
            try:
                api_key = resolve_credential(
                    self._settings.data_root,
                    self._settings.llm_credential_ref,
                    "agent_llm_api_key",
                )
            except CredentialReferenceError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
        if not api_key:
            api_key = self._settings.llm_api_key.strip()
        if not api_key:
            raise HTTPException(
                status_code=400,
                detail="缺少 LLM API Key:请在前端凭据设置中填写模型 API Key。",
            )
        return replace(
            self._settings,
            llm_api_key=api_key,
            llm_base_url=(payload.llm_base_url or self._settings.llm_base_url).rstrip(
                "/"
            ),
            llm_model=payload.llm_model or self._settings.llm_model,
        )

    def _request_chat_fn(self, payload: AskInput, prepared: PreparedAsk) -> Any:
        if prepared.runtime.capabilities.model_transport == "runtime_managed":
            return None
        if (
            not payload.llm_api_key
            and not payload.llm_base_url
            and not payload.llm_model
            and not prepared.settings.llm_credential_ref
        ):
            return None
        return self._chat_fn_builder(prepared.settings)

    def _prepare_memory(
        self,
        payload: AskInput,
        conversation_id: str,
    ) -> tuple[list[dict[str, str]], dict[str, Any] | None, dict[str, Any], str]:
        memory_stop = (
            payload.parent_id.strip()
            if payload.regenerate and payload.parent_id.strip()
            else ""
        )
        return self._conversation_state.prepare_memory(
            conversation_id,
            force_compress=bool(payload.force_compress),
            stop_at=memory_stop,
        )

    def _operation_arguments(
        self,
        payload: AskInput,
        request_runtime: AgentRuntime,
        request_message_id: str,
    ) -> dict[str, Any]:
        if not request_runtime.capabilities.document_operations:
            return {}
        return {
            "request_message_id": request_message_id,
            "confirmed": bool(payload.confirm_document_operation)
            or self._settings.agent_confirmation_mode == "green_light",
        }

    def _agent_session_event(
        self,
        payload: AskInput,
        prepared: PreparedAsk,
        *,
        conversation_id: str,
        document_id: str,
        request_message_id: str,
    ) -> dict[str, Any]:
        request_runtime = prepared.runtime
        return {
            "type": "agent_session",
            "conversation_id": conversation_id,
            "request_message_id": request_message_id or payload.user_message_id.strip(),
            "agent_runtime": prepared.runtime_id,
            "capabilities": {
                **request_runtime.capabilities.public_view(),
                "document_operations": bool(
                    request_runtime.capabilities.document_operations
                    and document_id
                    and request_message_id
                ),
                "document_operation_confirmation_mode": (
                    self._settings.agent_confirmation_mode
                ),
            },
        }

    def _result_payload(
        self,
        result: Any,
        *,
        request_runtime_id: str,
        conversation_id: str = "",
        memory: dict[str, Any] | None = None,
        persisted: bool = True,
    ) -> dict[str, Any]:
        confirmation_requests = self._confirmation_projector(
            result, self._settings.agent_confirmation_mode
        )
        payload: dict[str, Any] = {
            "answer": result.answer,
            "citations": [asdict(citation) for citation in result.citations],
            "tool_trace": result.tool_trace,
            "rounds": result.rounds,
            "persisted": persisted,
            "agent_runtime": request_runtime_id,
            "operation_refs": list(getattr(result, "operation_refs", []) or []),
            "confirmation_mode": self._settings.agent_confirmation_mode,
            "confirmation_requests": confirmation_requests,
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id
        if memory:
            payload["memory"] = memory
        return payload

"""FastAPI 应用:认证 + /v1/ask + 健康检查。"""

from __future__ import annotations

import json
import os
import queue
import signal
import threading
from collections.abc import Callable, Iterator
from dataclasses import asdict, replace
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import StreamingResponse

from . import __version__
from .agent import RetrievalAgent, build_deepseek_chat_fn
from .agent_confirmations import confirmation_requests
from .api_contracts import AskInput, RuntimeConfigUpdate
from .config import Settings, load_settings
from .conversation_state import ConversationState
from .runtime import (
    AgentRuntime,
    PythonAgentRuntime,
    build_agent_runtime,
)
from .runtime_config_api import register_runtime_config_routes
from .rust_client import RustApiClient
from .tools import build_default_registry

__all__ = ["AskInput", "RuntimeConfigUpdate", "build_app"]


def _schedule_process_restart() -> None:
    timer = threading.Timer(0.2, lambda: os.kill(os.getpid(), signal.SIGTERM))
    timer.daemon = True
    timer.start()


# Compatibility aliases for existing consumers importing contracts/helpers here.
_confirmation_requests = confirmation_requests


def build_app(
    settings: Settings | None = None,
    agent: RetrievalAgent | None = None,
    rust: RustApiClient | None = None,
    runtime: AgentRuntime | None = None,
    restart_callback: Callable[[], None] | None = None,
) -> FastAPI:
    settings = settings or load_settings()
    if runtime is None and agent is None:
        # LLM key 不再强制:允许留空 env,由前端按请求传入(见 AskInput.llm_api_key)
        if not settings.rust_api_key:
            raise RuntimeError("RETAIN_AI_RUST_API_KEY is required")
        rust = rust or RustApiClient(settings)
        agent = RetrievalAgent(
            build_default_registry(settings, rust),
            build_deepseek_chat_fn(settings),
            max_tool_rounds=settings.max_tool_rounds,
        )
    if runtime is None:
        if agent is None:
            raise RuntimeError("agent runtime initialization failed")
        selected_runtime = settings.agent_runtime.strip().lower()
        if selected_runtime in {"fx", "openai"}:
            rust = rust or RustApiClient(settings)
            runtime = build_agent_runtime(settings, rust, agent)
        elif selected_runtime == "python":
            runtime = PythonAgentRuntime(agent)
        else:
            raise RuntimeError(
                f"unsupported RETAIN_AI_RUNTIME={settings.agent_runtime!r}; "
                "expected python, openai, or fx"
            )

    runtime_id = runtime.runtime_id
    reading_runtime = (
        PythonAgentRuntime(agent)
        if agent is not None
        else (runtime if runtime.capabilities.document_reading else None)
    )
    restart_runtime = restart_callback or _schedule_process_restart

    app = FastAPI(title="retainpdf-ai", version=__version__)

    conversation_state = ConversationState(settings, rust)

    def require_api_key(request: Request) -> None:
        if not settings.api_keys:
            raise HTTPException(
                status_code=500, detail="RETAIN_AI_API_KEYS is not configured"
            )
        provided = request.headers.get("X-API-Key", "")
        if provided not in settings.api_keys:
            raise HTTPException(status_code=401, detail="invalid api key")

    @app.get("/healthz")
    def healthz() -> dict[str, Any]:
        return {
            "ok": True,
            "version": __version__,
            "agent_runtime": runtime_id,
            "capabilities": runtime.capabilities.public_view(),
        }

    register_runtime_config_routes(
        app,
        active_settings=settings,
        runtime=runtime,
        runtime_id=runtime_id,
        rust=rust,
        agent=agent,
        restart_runtime=restart_runtime,
        require_api_key=require_api_key,
    )

    def _request_runtime(payload: AskInput) -> tuple[AgentRuntime, str]:
        mode = payload.assistant_mode
        if mode == "reading":
            if reading_runtime is None:
                raise HTTPException(
                    status_code=409,
                    detail="当前 AI 服务没有可用的文档阅读运行时，请重启后再试。",
                )
            return reading_runtime, reading_runtime.runtime_id
        if mode == "operations":
            if not runtime.capabilities.document_operations:
                raise HTTPException(
                    status_code=409,
                    detail="当前 AI Agent 未启用 PDF 操作模式，请先在 API 设置中选择 OpenAI Agent 或 FX Agent。",
                )
            return runtime, runtime_id
        has_document_scope = bool(payload.document_id.strip() or payload.job_id.strip())
        if (
            has_document_scope
            and runtime.capabilities.document_operations
            and not runtime.capabilities.document_reading
        ):
            raise HTTPException(
                status_code=409,
                detail=(
                    "当前 Agent 运行时不能读取文档正文；请明确选择 reading 使用文档问答，"
                    "或选择 operations 执行 PDF 操作。"
                ),
            )
        return runtime, runtime_id

    def _result_payload(
        result: Any,
        *,
        request_runtime_id: str,
        conversation_id: str = "",
        memory: dict[str, Any] | None = None,
        persisted: bool = True,
    ) -> dict[str, Any]:
        confirmation_requests = _confirmation_requests(
            result, settings.agent_confirmation_mode
        )
        payload: dict[str, Any] = {
            "answer": result.answer,
            "citations": [asdict(citation) for citation in result.citations],
            "tool_trace": result.tool_trace,
            "rounds": result.rounds,
            "persisted": persisted,
            "agent_runtime": request_runtime_id,
            "operation_refs": list(getattr(result, "operation_refs", []) or []),
            "confirmation_mode": settings.agent_confirmation_mode,
            "confirmation_requests": confirmation_requests,
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id
        if memory:
            payload["memory"] = memory
        return payload

    def _resolve_llm_settings(
        payload: AskInput,
        request_runtime: AgentRuntime,
    ) -> Settings:
        if request_runtime.capabilities.model_transport == "runtime_managed":
            if not settings.fx_gateway_api_key:
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "fx runtime 缺少 RETAIN_AI_FX_GATEWAY_API_KEY；"
                        "不会把现有 Rust API key 或普通 DeepSeek key 交给 fx。"
                    ),
                )
            return settings
        # 前端按请求携带 LLM key/base/model 时覆盖启动期配置;三者留空则回退 env。
        # 缺 key 直接报错,避免打到上游才 401。
        api_key = (payload.llm_api_key or settings.llm_api_key).strip()
        if not api_key:
            raise HTTPException(
                status_code=400,
                detail="缺少 LLM API Key:请在前端凭据设置中填写模型 API Key。",
            )
        return replace(
            settings,
            llm_api_key=api_key,
            llm_base_url=(payload.llm_base_url or settings.llm_base_url).rstrip("/"),
            llm_model=payload.llm_model or settings.llm_model,
        )

    def _request_chat_fn(payload: AskInput, request_runtime: AgentRuntime):
        if request_runtime.capabilities.model_transport == "runtime_managed":
            _resolve_llm_settings(payload, request_runtime)
            return None
        # 非流式路径:请求未覆盖任何 LLM 参数时回退启动期 chat_fn(返回 None)。
        resolved = _resolve_llm_settings(payload, request_runtime)  # 顺带做缺 key 守卫
        if (
            not payload.llm_api_key
            and not payload.llm_base_url
            and not payload.llm_model
        ):
            return None
        return build_deepseek_chat_fn(resolved)

    def _sse_events(
        payload: AskInput,
        resolved: Settings,
        request_runtime: AgentRuntime,
        request_runtime_id: str,
    ) -> Iterator[str]:
        # agent 循环是同步阻塞的,放到工作线程,经队列推事件——
        # 前端在首个工具调用(~2s)就能看到"正在检索…"的过程感;
        # 最终回答轮经 on_delta 逐 token 推 answer_delta。
        events: queue.Queue[dict[str, Any] | None] = queue.Queue()
        document_id = conversation_state.resolve_document_id(payload)
        conversation_id = conversation_state.ensure_conversation_id(
            payload, document_id
        )
        # regenerate: 上下文停在 user 节点;正常续写:走当前 head 路径
        memory_stop = (
            payload.parent_id.strip()
            if payload.regenerate and payload.parent_id.strip()
            else ""
        )
        history, compress_event, memory_debug, summary_id = (
            conversation_state.prepare_memory(
                conversation_id,
                force_compress=bool(payload.force_compress),
                stop_at=memory_stop,
            )
        )
        # SSE 路径总是用带 on_delta 的流式 chat_fn:增量文本进事件队列。
        chat_fn = (
            None
            if request_runtime.capabilities.model_transport == "runtime_managed"
            else build_deepseek_chat_fn(
                resolved,
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
                    conversation_state.persist_agent_request_message(
                        conversation_id,
                        payload,
                        request_runtime,
                        chain_parent_id=summary_id,
                    )
                )
                events.put(
                    {
                        "type": "agent_session",
                        "conversation_id": conversation_id,
                        "request_message_id": request_message_id
                        or payload.user_message_id.strip(),
                        "agent_runtime": request_runtime_id,
                        "capabilities": {
                            **request_runtime.capabilities.public_view(),
                            "document_operations": bool(
                                request_runtime.capabilities.document_operations
                                and document_id
                                and request_message_id
                            ),
                            "document_operation_confirmation_mode": (
                                settings.agent_confirmation_mode
                            ),
                        },
                    }
                )
                result = request_runtime.ask(
                    payload.question,
                    conversation_id=conversation_id,
                    document_id=document_id,
                    job_id=payload.job_id.strip(),
                    on_event=events.put,
                    chat_fn=chat_fn,
                    history=history,
                    **(
                        {
                            "request_message_id": request_message_id,
                            "confirmed": bool(payload.confirm_document_operation)
                            or settings.agent_confirmation_mode == "green_light",
                        }
                        if request_runtime.capabilities.document_operations
                        else {}
                    ),
                )
                for confirmation in _confirmation_requests(
                    result, settings.agent_confirmation_mode
                ):
                    events.put(
                        {
                            "type": "agent_confirmation_required",
                            **confirmation,
                        }
                    )
                persisted = request_persisted and conversation_state.persist_turn(
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
                        **_result_payload(
                            result,
                            request_runtime_id=request_runtime_id,
                            conversation_id=conversation_id,
                            memory=memory_debug,
                            persisted=persisted,
                        ),
                    }
                )
            except Exception as exc:  # noqa: BLE001 - serialize runtime failures as SSE errors
                # RuntimeError 是我们自己产的用户可读文案（如 _friendly_llm_error），
                # 直出不带异常类名；其余异常保留类名便于定位
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

    @app.post("/v1/ask", dependencies=[Depends(require_api_key)])
    def ask(payload: AskInput) -> Any:
        request_runtime, request_runtime_id = _request_runtime(payload)
        if payload.stream:
            # 生成器内抛 HTTPException 无法转成 400,故先在此校验并解析出 settings
            resolved = _resolve_llm_settings(payload, request_runtime)
            return StreamingResponse(
                _sse_events(payload, resolved, request_runtime, request_runtime_id),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
            )
        chat_fn = _request_chat_fn(payload, request_runtime)
        document_id = conversation_state.resolve_document_id(payload)
        conversation_id = conversation_state.ensure_conversation_id(
            payload, document_id
        )
        memory_stop = (
            payload.parent_id.strip()
            if payload.regenerate and payload.parent_id.strip()
            else ""
        )
        history, _compress_event, memory_debug, summary_id = (
            conversation_state.prepare_memory(
                conversation_id,
                force_compress=bool(payload.force_compress),
                stop_at=memory_stop,
            )
        )
        request_message_id, request_persisted = (
            conversation_state.persist_agent_request_message(
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
            **(
                {
                    "request_message_id": request_message_id,
                    "confirmed": bool(payload.confirm_document_operation)
                    or settings.agent_confirmation_mode == "green_light",
                }
                if request_runtime.capabilities.document_operations
                else {}
            ),
        )
        persisted = request_persisted and conversation_state.persist_turn(
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
            "data": _result_payload(
                result,
                request_runtime_id=request_runtime_id,
                conversation_id=conversation_id,
                persisted=persisted,
                memory=memory_debug,
            ),
        }

    return app

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
from .memory import assemble_history, maybe_compress_transcript
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

    def resolve_document_id(payload: AskInput) -> str:
        document_id = payload.document_id.strip()
        if document_id or not payload.job_id.strip() or rust is None:
            return document_id
        try:
            document = rust.get_document_by_job(payload.job_id.strip())
        except Exception:  # noqa: BLE001 - lookup failure falls back to no document scope
            return ""
        return str((document or {}).get("document_id") or "")

    def ensure_conversation_id(payload: AskInput, document_id: str) -> str:
        """B1: 有 conversation_id 则用;否则经 Rust auto-create 并返回新 id。"""
        existing = payload.conversation_id.strip()
        if existing:
            return existing
        if rust is None:
            return ""
        title = (payload.question or "").strip().replace("\n", " ")
        if len(title) > 48:
            title = f"{title[:48].rstrip()}…"
        if not title:
            title = "阅读问答"
        try:
            created = rust.create_conversation(
                title=title, document_id=document_id or ""
            )
            return str((created or {}).get("conversation_id") or "").strip()
        except Exception as exc:  # noqa: BLE001 - conversation storage is optional here
            print(f"[retainpdf-ai] auto-create conversation failed: {exc}", flush=True)
            return ""

    def _visible_path(
        messages: list[dict[str, Any]],
        head_id: str,
        *,
        stop_at: str = "",
    ) -> list[dict[str, Any]]:
        """从 head(或 stop_at)沿 parent_id 回溯,返回根→叶路径。

        无 parent / message_id 的旧数据按 seq 串成线性链。
        """
        if not messages:
            return []
        ordered = sorted(
            messages,
            key=lambda m: (
                int(m.get("seq") or 0) if str(m.get("seq") or "").strip() else 0
            ),
        )
        # 合成稳定 id + 线性 parent,保证无树字段时退化为整条 transcript
        by_id: dict[str, dict[str, Any]] = {}
        prev_id = ""
        for index, raw in enumerate(ordered):
            mid = (
                str(raw.get("message_id") or "").strip()
                or f"__seq_{raw.get('seq', index)}"
            )
            pid = str(raw.get("parent_id") or "").strip()
            if not pid and prev_id:
                pid = prev_id
            node = {**raw, "message_id": mid, "parent_id": pid}
            by_id[mid] = node
            prev_id = mid

        start_id = (stop_at or head_id or "").strip()
        if not start_id:
            start_id = prev_id
        cur = by_id.get(start_id)
        if cur is None and ordered:
            cur = by_id.get(prev_id)
        chain: list[dict[str, Any]] = []
        guard = 0
        while cur is not None and guard <= len(messages) + 2:
            chain.append(cur)
            guard += 1
            pid = str(cur.get("parent_id") or "").strip()
            cur = by_id.get(pid) if pid else None
        chain.reverse()
        return chain

    def load_transcript(
        conversation_id: str,
        *,
        stop_at: str = "",
    ) -> list[dict[str, Any]]:
        if not conversation_id or rust is None:
            return []
        try:
            detail = rust.get_conversation(conversation_id) or {}
        except Exception:  # noqa: BLE001 - unavailable history degrades to an empty transcript
            return []
        messages = list(detail.get("messages") or [])
        head_id = str(detail.get("head_id") or "").strip()
        path = _visible_path(messages, head_id, stop_at=stop_at)
        out: list[dict[str, Any]] = []
        for message in path:
            role = str(message.get("role") or "")
            content = str(message.get("content") or "")
            if role not in {"user", "assistant"} or not content.strip():
                continue
            out.append(
                {
                    "role": role,
                    "content": content,
                    "message_id": str(message.get("message_id") or ""),
                    "parent_id": str(message.get("parent_id") or ""),
                    "citations_json": message.get("citations_json") or "[]",
                }
            )
        return out

    def prepare_memory(
        conversation_id: str,
        *,
        force_compress: bool = False,
        stop_at: str = "",
    ) -> tuple[list[dict[str, str]], dict[str, Any] | None, dict[str, Any], str]:
        """压缩(可选) + 组装 history；返回 (history, compress_event|None, memory_debug, summary_id)。

        summary_id 非空时,调用方必须把本轮 user(或 regenerate 的 assistant)挂在
        它下面——摘要只有落在 head 路径上,下一轮 load_transcript 才读得回来。
        旧实现摘要以 set_head=False 挂在 head 下、user 又同样挂在 head 下,
        摘要成了 user 的兄弟节点(死分支):永远读不回 → 每轮重新压缩 + 再写一条
        孤儿摘要(审计 A2)。
        """
        transcript = load_transcript(conversation_id, stop_at=stop_at)
        compress = maybe_compress_transcript(
            transcript,
            window_turns=settings.memory_window_turns,
            compress_after_turns=settings.memory_compress_after_turns,
            force=force_compress,
        )
        compress_event: dict[str, Any] | None = None
        summary_id = ""
        working = compress.messages
        if (
            compress.compressed
            and compress.summary_message
            and conversation_id
            and rust is not None
        ):
            try:
                summary_msg = rust.append_conversation_message(
                    conversation_id,
                    role="assistant",
                    content=str(compress.summary_message.get("content") or ""),
                    model="memory/extractive_v1",
                    parent_id=stop_at or "",
                    set_head=False,
                )
                summary_id = str((summary_msg or {}).get("message_id") or "").strip()
                compress_event = compress.event
            except Exception as exc:  # noqa: BLE001 - memory persistence must not fail the turn
                print(f"[retainpdf-ai] persist summary failed: {exc}", flush=True)
                # 持久化失败仍用内存 working 视图完成本轮
        assembled = assemble_history(
            working,
            window_turns=settings.memory_window_turns,
            max_chars=settings.memory_max_chars,
        )
        debug = {
            **assembled.debug,
            "compressed": bool(compress.compressed and compress_event is not None),
            "evidence_count": 0,
        }
        return assembled.history, compress_event, debug, summary_id

    def persist_turn(
        conversation_id: str,
        payload: AskInput,
        result: Any,
        request_runtime: AgentRuntime,
        *,
        chain_parent_id: str = "",
        prepersisted_user_id: str = "",
    ) -> bool:
        """尽力而为的历史回写:失败只记日志,不影响返回。

        正常轮: user(parent=chain_parent_id|payload.parent_id|head) + assistant(parent=user)。
        regenerate: 仅 assistant(parent=chain_parent_id|payload.parent_id 的 user 节点)。
        chain_parent_id = prepare_memory 刚落库的摘要节点 id:传入时本轮消息以
        摘要为 parent,把摘要接进 head 路径(否则摘要成死分支,见 prepare_memory 注释)。

        返回是否成功持久化(无会话可写=True,不算失败);False 会经 done.persisted
        透传给前端提示"本轮未存入历史"(审计 C2:此前失败只 print,用户无感知)。
        """
        if not conversation_id or rust is None:
            return True
        try:
            parent_hint = chain_parent_id.strip() or payload.parent_id.strip()
            citations_json = json.dumps(
                [asdict(citation) for citation in result.citations], ensure_ascii=False
            )
            tool_trace_json = json.dumps(result.tool_trace, ensure_ascii=False)
            model = (
                settings.fx_model or request_runtime.runtime_id
                if request_runtime.capabilities.model_transport == "runtime_managed"
                else payload.llm_model or settings.llm_model
            )
            if payload.regenerate:
                # 重试: parent_id 必须是 user 消息
                user_parent = parent_hint
                rust.append_conversation_message(
                    conversation_id,
                    role="assistant",
                    content=result.answer,
                    citations_json=citations_json,
                    tool_trace_json=tool_trace_json,
                    model=model,
                    parent_id=user_parent,
                    message_id=payload.assistant_message_id.strip(),
                    set_head=True,
                )
                return True
            user_id = prepersisted_user_id.strip()
            if not user_id:
                user_msg = rust.append_conversation_message(
                    conversation_id,
                    role="user",
                    content=payload.question.strip(),
                    parent_id=parent_hint,
                    message_id=payload.user_message_id.strip(),
                    set_head=True,
                )
                user_id = str((user_msg or {}).get("message_id") or "").strip()
            rust.append_conversation_message(
                conversation_id,
                role="assistant",
                content=result.answer,
                citations_json=citations_json,
                tool_trace_json=tool_trace_json,
                model=model,
                parent_id=user_id or parent_hint,
                message_id=payload.assistant_message_id.strip(),
                set_head=True,
            )
            return True
        except Exception as exc:  # noqa: BLE001 - answer remains usable if history write fails
            print(f"[retainpdf-ai] persist conversation turn failed: {exc}", flush=True)
            return False

    def persist_agent_request_message(
        conversation_id: str,
        payload: AskInput,
        request_runtime: AgentRuntime,
        *,
        chain_parent_id: str = "",
    ) -> tuple[str, bool]:
        """Persist the user request before an Agent can create an operation."""
        if not request_runtime.capabilities.document_operations:
            return "", True
        parent_hint = chain_parent_id.strip() or payload.parent_id.strip()
        if payload.regenerate:
            return parent_hint, bool(parent_hint)
        if not conversation_id or rust is None:
            return "", False
        requested_id = payload.user_message_id.strip()
        try:
            user_msg = rust.append_conversation_message(
                conversation_id,
                role="user",
                content=payload.question.strip(),
                parent_id=parent_hint,
                message_id=requested_id,
                set_head=True,
            )
            message_id = str((user_msg or {}).get("message_id") or "").strip()
            return message_id, bool(message_id)
        except Exception as exc:  # noqa: BLE001 - retry must cover transport ambiguity
            # A client retry may repeat a stable message_id after the first
            # request reached Rust but its response was lost. Reuse only an
            # exact user/content match; never guess by sequence or head.
            if requested_id:
                try:
                    detail = rust.get_conversation(conversation_id) or {}
                    for message in detail.get("messages") or []:
                        if (
                            str(message.get("message_id") or "") == requested_id
                            and str(message.get("role") or "") == "user"
                            and str(message.get("content") or "").strip()
                            == payload.question.strip()
                        ):
                            return requested_id, True
                except Exception:  # noqa: BLE001, S110 - preserve the original failure
                    pass
            print(f"[retainpdf-ai] pre-persist Agent request failed: {exc}", flush=True)
            return "", False

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
        document_id = resolve_document_id(payload)
        conversation_id = ensure_conversation_id(payload, document_id)
        # regenerate: 上下文停在 user 节点;正常续写:走当前 head 路径
        memory_stop = (
            payload.parent_id.strip()
            if payload.regenerate and payload.parent_id.strip()
            else ""
        )
        history, compress_event, memory_debug, summary_id = prepare_memory(
            conversation_id,
            force_compress=bool(payload.force_compress),
            stop_at=memory_stop,
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
                request_message_id, request_persisted = persist_agent_request_message(
                    conversation_id,
                    payload,
                    request_runtime,
                    chain_parent_id=summary_id,
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
                persisted = request_persisted and persist_turn(
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
        document_id = resolve_document_id(payload)
        conversation_id = ensure_conversation_id(payload, document_id)
        memory_stop = (
            payload.parent_id.strip()
            if payload.regenerate and payload.parent_id.strip()
            else ""
        )
        history, _compress_event, memory_debug, summary_id = prepare_memory(
            conversation_id,
            force_compress=bool(payload.force_compress),
            stop_at=memory_stop,
        )
        request_message_id, request_persisted = persist_agent_request_message(
            conversation_id,
            payload,
            request_runtime,
            chain_parent_id=summary_id,
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
        persisted = request_persisted and persist_turn(
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

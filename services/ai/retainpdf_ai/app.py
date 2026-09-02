"""FastAPI 应用:认证 + /v1/ask + 健康检查。"""

from __future__ import annotations

import json
import os
import queue
import signal
import threading
from collections.abc import Callable, Iterator
from dataclasses import asdict, replace
from typing import Any, Literal
from urllib.parse import urlsplit

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel, Field

from . import __version__
from .agent import RetrievalAgent, build_deepseek_chat_fn
from .config import (
    FX_DEFAULT_GATEWAY_BASE_URL,
    Settings,
    apply_runtime_credentials,
    fx_gateway_chat_url,
    load_settings,
    normalize_agent_confirmation_mode,
    normalize_fx_gateway_base_url,
)
from .memory import assemble_history, maybe_compress_transcript
from .openai_agent_runtime import OPENAI_AGENT_RUNTIME_ID
from .runtime import (
    FX_RUNTIME_ID,
    AgentRuntime,
    PythonAgentRuntime,
    build_agent_runtime,
    probe_fx_gateway_endpoint,
)
from .runtime_credentials import (
    RuntimeCredentialConflict,
    load_runtime_credentials,
    masked_secret,
    save_runtime_credentials,
)
from .rust_client import RustApiClient
from .tools import build_default_registry


class AskInput(BaseModel):
    question: str = Field(min_length=1, max_length=4000)
    document_id: str = ""
    # 可只传 job_id(含历史 run):由服务端解析所属文档,避免前端靠
    # active_job_id 反查在历史 job 上静默失配、问答退化为全库检索
    job_id: str = ""
    # 多轮对话:传会话 ID 则注入既往轮次为上下文,并在完成后把
    # user/assistant 两条经 Rust API 回写(单写入者不破)。
    # 缺省时若能连上 Rust 会 auto-create,并在 done 回传 conversation_id。
    conversation_id: str = ""
    # 消息树:新 user 的 parent(当前 head);重试时 = 被重试的 user 消息 id。
    parent_id: str = ""
    # 重新生成:只挂新 assistant 到 parent_id(user),不再写 user。
    regenerate: bool = False
    # 客户端稳定消息 id,与前端 store / assistant-ui 对齐。
    user_message_id: str = ""
    assistant_message_id: str = ""
    stream: bool = False
    # B2: 强制触发抽取式压缩（测试/调试）
    force_compress: bool = False
    # run / commit 属于显式确认动作；模型不能自行把这项设为 true。
    confirm_document_operation: bool = False
    # 按请求选择能力面。Reader 默认 reading，避免全局 Agent runtime
    # 把“文档问答”误路由成仅支持页面操作的工具循环。
    assistant_mode: Literal["auto", "reading", "operations"] = "auto"
    # 前端按请求传入的 LLM 凭据:留空则回退启动期 env 配置
    llm_api_key: str = ""
    llm_base_url: str = ""
    llm_model: str = ""


class RuntimeConfigUpdate(BaseModel):
    expected_revision: int | None = Field(default=None, ge=0)
    agent_runtime: str | None = None
    agent_confirmation_mode: str | None = None
    llm_base_url: str | None = Field(default=None, max_length=2048)
    llm_model: str | None = Field(default=None, max_length=256)
    llm_api_key: str | None = Field(default=None, max_length=8192)
    clear_llm_api_key: bool = False
    fx_gateway_base_url: str | None = Field(default=None, max_length=2048)
    fx_gateway_api_key: str | None = Field(default=None, max_length=8192)
    clear_fx_gateway_api_key: bool = False
    fx_model: str | None = Field(default=None, max_length=256)


def _schedule_process_restart() -> None:
    timer = threading.Timer(0.2, lambda: os.kill(os.getpid(), signal.SIGTERM))
    timer.daemon = True
    timer.start()


_CONFIRMATION_ACTIONS: dict[str, tuple[str, bool]] = {
    "draft": ("run", False),
    "awaiting_confirmation": ("run", False),
    "result_ready": ("commit", False),
    "failed": ("retry", False),
    "ambiguous": ("retry", True),
}


def _confirmation_requests(result: Any, confirmation_mode: str) -> list[dict[str, Any]]:
    """Project touched operation refs into a model-independent UI contract."""
    if confirmation_mode == "green_light":
        return []
    requests: list[dict[str, Any]] = []
    seen: set[tuple[str, str, int]] = set()
    for ref in list(getattr(result, "operation_refs", []) or []):
        if not isinstance(ref, dict):
            continue
        operation_id = str(ref.get("operation_id") or "").strip()
        status = str(ref.get("status") or "").strip()
        action_spec = _CONFIRMATION_ACTIONS.get(status)
        try:
            current_attempt = int(ref.get("current_attempt") or 0)
            latest_event_seq = int(ref.get("latest_event_seq") or 0)
        except (TypeError, ValueError):
            continue
        if not operation_id or current_attempt < 1 or action_spec is None:
            continue
        action, requires_risk_acceptance = action_spec
        key = (operation_id, action, current_attempt)
        if key in seen:
            continue
        seen.add(key)
        requests.append(
            {
                "schema": "retainpdf_agent_confirmation_v1",
                "operation_id": operation_id,
                "action": action,
                "status": status,
                "current_attempt": current_attempt,
                "latest_event_seq": max(0, latest_event_seq),
                "requires_risk_acceptance": requires_risk_acceptance,
            }
        )
    return requests


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
    document_operation_runtime_ids = {FX_RUNTIME_ID, OPENAI_AGENT_RUNTIME_ID}
    reading_runtime = PythonAgentRuntime(agent) if agent is not None else (
        runtime if runtime_id == PythonAgentRuntime.runtime_id else None
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
            created = rust.create_conversation(title=title, document_id=document_id or "")
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
            key=lambda m: int(m.get("seq") or 0) if str(m.get("seq") or "").strip() else 0,
        )
        # 合成稳定 id + 线性 parent,保证无树字段时退化为整条 transcript
        by_id: dict[str, dict[str, Any]] = {}
        prev_id = ""
        for index, raw in enumerate(ordered):
            mid = str(raw.get("message_id") or "").strip() or f"__seq_{raw.get('seq', index)}"
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
        if compress.compressed and compress.summary_message and conversation_id and rust is not None:
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
        *,
        chain_parent_id: str = "",
        prepersisted_user_id: str = "",
    ) -> None:
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
                settings.fx_model or "fx"
                if runtime_id == FX_RUNTIME_ID
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
        *,
        chain_parent_id: str = "",
    ) -> tuple[str, bool]:
        """Persist the user request before an Agent can create an operation."""
        if runtime_id not in document_operation_runtime_ids:
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
            raise HTTPException(status_code=500, detail="RETAIN_AI_API_KEYS is not configured")
        provided = request.headers.get("X-API-Key", "")
        if provided not in settings.api_keys:
            raise HTTPException(status_code=401, detail="invalid api key")

    @app.get("/healthz")
    def healthz() -> dict[str, Any]:
        return {"ok": True, "version": __version__, "agent_runtime": runtime_id}

    def configured_settings() -> Settings:
        stored = load_runtime_credentials(settings.data_root)
        return apply_runtime_credentials(settings, stored)

    @app.get("/readyz")
    def readyz() -> JSONResponse:
        configured = configured_settings()
        if configured.runtime_config_revision != settings.runtime_config_revision:
            return JSONResponse(
                status_code=503,
                content={
                    "ok": False,
                    "reason": "runtime_config_restart_pending",
                    "active_revision": settings.runtime_config_revision,
                    "configured_revision": configured.runtime_config_revision,
                },
            )
        if settings.agent_runtime == "fx" and settings.fx_gateway_base_url:
            try:
                probe_fx_gateway_endpoint(
                    settings.fx_gateway_base_url,
                    timeout=min(settings.fx_startup_timeout_s, 1.5),
                )
            except RuntimeError:
                return JSONResponse(
                    status_code=503,
                    content={
                        "ok": False,
                        "reason": "fx_gateway_unreachable",
                        "active_revision": settings.runtime_config_revision,
                        "configured_revision": configured.runtime_config_revision,
                    },
                )
        return JSONResponse(
            content={
                "ok": True,
                "version": __version__,
                "agent_runtime": runtime_id,
                "active_revision": settings.runtime_config_revision,
                "configured_revision": configured.runtime_config_revision,
            }
        )

    def runtime_config_view(candidate: Settings | None = None) -> dict[str, Any]:
        candidate = candidate or configured_settings()
        restart_required = (
            candidate.runtime_config_revision != settings.runtime_config_revision
        )
        effective_fx_base_url = (
            candidate.fx_gateway_base_url or FX_DEFAULT_GATEWAY_BASE_URL
        )
        effective_fx_chat_url = (
            fx_gateway_chat_url(candidate.fx_gateway_base_url)
            if candidate.fx_gateway_base_url
            else f"{FX_DEFAULT_GATEWAY_BASE_URL}/v3/ai/language-model"
        )
        return {
            "schema": "retainpdf_ai_runtime_config_view_v1",
            "active_runtime": runtime_id,
            "configured_runtime": candidate.agent_runtime,
            "agent_confirmation_mode": candidate.agent_confirmation_mode,
            "configured_revision": candidate.runtime_config_revision,
            "active_revision": settings.runtime_config_revision,
            "restart_state": "pending" if restart_required else "active",
            "llm_base_url": candidate.llm_base_url,
            "llm_model": candidate.llm_model,
            "llm_api_key_configured": bool(candidate.llm_api_key.strip()),
            "llm_api_key_masked": masked_secret(candidate.llm_api_key),
            "fx_gateway_base_url": candidate.fx_gateway_base_url,
            "fx_gateway_mode": candidate.fx_gateway_base_url_mode,
            "fx_gateway_effective_base_url": effective_fx_base_url,
            "fx_gateway_effective_chat_url": effective_fx_chat_url,
            "fx_gateway_api_key_configured": bool(
                candidate.fx_gateway_api_key.strip()
            ),
            "fx_gateway_api_key_masked": masked_secret(
                candidate.fx_gateway_api_key
            ),
            "fx_model": candidate.fx_model,
            "restart_required": restart_required,
        }

    def validate_base_url(value: str) -> str:
        normalized = value.strip().rstrip("/")
        parsed = urlsplit(normalized)
        if (
            parsed.scheme not in {"http", "https"}
            or not parsed.netloc
            or parsed.username
            or parsed.password
        ):
            raise HTTPException(
                status_code=400,
                detail="模型 API URL 必须是无内嵌凭据的 http(s) 地址。",
            )
        return normalized

    @app.get("/v1/runtime-config", dependencies=[Depends(require_api_key)])
    def get_runtime_config() -> dict[str, Any]:
        return {"data": runtime_config_view()}

    @app.put("/v1/runtime-config", dependencies=[Depends(require_api_key)])
    def update_runtime_config(
        payload: RuntimeConfigUpdate,
        background_tasks: BackgroundTasks,
    ) -> dict[str, Any]:
        current = configured_settings()
        if (
            payload.expected_revision is not None
            and payload.expected_revision != current.runtime_config_revision
        ):
            raise HTTPException(
                status_code=409,
                detail="AI 配置已被其他请求更新；请刷新后重试。",
            )
        selected_runtime = (
            payload.agent_runtime.strip().lower()
            if payload.agent_runtime is not None
            else current.agent_runtime
        )
        if selected_runtime not in {"python", "openai", "fx"}:
            raise HTTPException(
                status_code=400,
                detail="运行模式只能是 python、openai 或 fx。",
            )
        try:
            agent_confirmation_mode = normalize_agent_confirmation_mode(
                payload.agent_confirmation_mode
                if payload.agent_confirmation_mode is not None
                else current.agent_confirmation_mode
            )
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc
        if payload.clear_llm_api_key and (payload.llm_api_key or "").strip():
            raise HTTPException(status_code=400, detail="模型 key 不能同时保存和清除。")
        if payload.clear_fx_gateway_api_key and (
            payload.fx_gateway_api_key or ""
        ).strip():
            raise HTTPException(status_code=400, detail="Gateway key 不能同时保存和清除。")

        llm_base_url = current.llm_base_url
        if payload.llm_base_url is not None:
            llm_base_url = validate_base_url(payload.llm_base_url)
        llm_model = current.llm_model
        if payload.llm_model is not None:
            llm_model = payload.llm_model.strip()
            if not llm_model:
                raise HTTPException(status_code=400, detail="模型名称不能为空。")
        llm_api_key = current.llm_api_key
        if payload.clear_llm_api_key:
            llm_api_key = ""
        elif (payload.llm_api_key or "").strip():
            llm_api_key = (payload.llm_api_key or "").strip()

        fx_gateway_api_key = current.fx_gateway_api_key
        if payload.clear_fx_gateway_api_key:
            fx_gateway_api_key = ""
        elif (payload.fx_gateway_api_key or "").strip():
            fx_gateway_api_key = (payload.fx_gateway_api_key or "").strip()
        fx_gateway_base_url = current.fx_gateway_base_url
        fx_gateway_base_url_mode = current.fx_gateway_base_url_mode
        if payload.fx_gateway_base_url is not None:
            try:
                fx_gateway_base_url = normalize_fx_gateway_base_url(
                    payload.fx_gateway_base_url
                )
            except ValueError as exc:
                raise HTTPException(status_code=400, detail=str(exc)) from exc
            fx_gateway_base_url_mode = (
                "custom" if fx_gateway_base_url else "official_default"
            )
        fx_model = current.fx_model
        if payload.fx_model is not None:
            fx_model = payload.fx_model.strip()

        candidate = replace(
            current,
            agent_runtime=selected_runtime,
            agent_confirmation_mode=agent_confirmation_mode,
            llm_base_url=llm_base_url,
            llm_model=llm_model,
            llm_api_key=llm_api_key,
            fx_gateway_base_url=fx_gateway_base_url,
            fx_gateway_base_url_mode=fx_gateway_base_url_mode,
            fx_gateway_api_key=fx_gateway_api_key,
            fx_model=fx_model,
        )
        if selected_runtime in {"python", "openai"} and not candidate.llm_api_key:
            mode = "OpenAI-compatible Agent" if selected_runtime == "openai" else "普通问答"
            raise HTTPException(status_code=400, detail=f"{mode}模式需要模型 API Key。")
        if selected_runtime == "fx":
            if not candidate.fx_gateway_api_key:
                raise HTTPException(status_code=400, detail="FX Agent 模式需要 Gateway Key。")
            if rust is None or agent is None:
                raise HTTPException(status_code=503, detail="FX Agent 运行环境不可用。")
            try:
                build_agent_runtime(candidate, rust, agent)
            except Exception as exc:
                raise HTTPException(
                    status_code=400,
                    detail=f"FX Agent 自检失败：{exc}",
                ) from exc
        if selected_runtime == "openai":
            if rust is None or agent is None:
                raise HTTPException(
                    status_code=503,
                    detail="OpenAI-compatible Agent 运行环境不可用。",
                )
            try:
                build_agent_runtime(candidate, rust, agent)
            except Exception as exc:
                raise HTTPException(
                    status_code=400,
                    detail=f"OpenAI-compatible Agent 自检失败：{exc}",
                ) from exc

        changed = any(
            (
                candidate.agent_runtime != current.agent_runtime,
                candidate.agent_confirmation_mode != current.agent_confirmation_mode,
                candidate.llm_base_url != current.llm_base_url,
                candidate.llm_model != current.llm_model,
                candidate.llm_api_key != current.llm_api_key,
                candidate.fx_gateway_base_url != current.fx_gateway_base_url,
                candidate.fx_gateway_base_url_mode
                != current.fx_gateway_base_url_mode,
                candidate.fx_gateway_api_key != current.fx_gateway_api_key,
                candidate.fx_model != current.fx_model,
            )
        )
        if not changed:
            return {"data": runtime_config_view(current)}
        try:
            save_runtime_credentials(
                settings.data_root,
                {
                    "agent_runtime": candidate.agent_runtime,
                    "agent_confirmation_mode": candidate.agent_confirmation_mode,
                    "llm_base_url": candidate.llm_base_url,
                    "llm_model": candidate.llm_model,
                    "llm_api_key": candidate.llm_api_key,
                    "fx_gateway_base_url": candidate.fx_gateway_base_url,
                    "fx_gateway_base_url_mode": candidate.fx_gateway_base_url_mode,
                    "fx_gateway_api_key": candidate.fx_gateway_api_key,
                    "fx_model": candidate.fx_model,
                },
                expected_revision=current.runtime_config_revision,
            )
        except RuntimeCredentialConflict as exc:
            raise HTTPException(
                status_code=409,
                detail="AI 配置已被其他请求更新；请刷新后重试。",
            ) from exc
        except Exception as exc:
            raise HTTPException(
                status_code=500,
                detail=f"安全保存 AI 配置失败：{exc}",
            ) from exc
        saved = configured_settings()
        background_tasks.add_task(restart_runtime)
        return {"data": runtime_config_view(saved)}

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
            if runtime_id not in document_operation_runtime_ids:
                raise HTTPException(
                    status_code=409,
                    detail="当前 AI Agent 未启用 PDF 操作模式，请先在 API 设置中选择 OpenAI Agent 或 FX Agent。",
                )
            return runtime, runtime_id
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

    def _resolve_llm_settings(payload: AskInput, request_runtime_id: str) -> Settings:
        if request_runtime_id == FX_RUNTIME_ID:
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
            raise HTTPException(status_code=400, detail="缺少 LLM API Key:请在前端凭据设置中填写模型 API Key。")
        return replace(
            settings,
            llm_api_key=api_key,
            llm_base_url=(payload.llm_base_url or settings.llm_base_url).rstrip("/"),
            llm_model=payload.llm_model or settings.llm_model,
        )

    def _request_chat_fn(payload: AskInput, request_runtime_id: str):
        if request_runtime_id == FX_RUNTIME_ID:
            _resolve_llm_settings(payload, request_runtime_id)
            return None
        # 非流式路径:请求未覆盖任何 LLM 参数时回退启动期 chat_fn(返回 None)。
        resolved = _resolve_llm_settings(payload, request_runtime_id)  # 顺带做缺 key 守卫
        if not payload.llm_api_key and not payload.llm_base_url and not payload.llm_model:
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
            if request_runtime_id == FX_RUNTIME_ID
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
                            "document_operations": bool(
                                request_runtime_id in document_operation_runtime_ids
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
                        if request_runtime_id in document_operation_runtime_ids
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
                message = str(exc) if isinstance(exc, RuntimeError) else f"{type(exc).__name__}: {exc}"
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
            resolved = _resolve_llm_settings(payload, request_runtime_id)
            return StreamingResponse(
                _sse_events(payload, resolved, request_runtime, request_runtime_id),
                media_type="text/event-stream",
                headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
            )
        chat_fn = _request_chat_fn(payload, request_runtime_id)
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
                if request_runtime_id in document_operation_runtime_ids
                else {}
            ),
        )
        persisted = request_persisted and persist_turn(
            conversation_id,
            payload,
            result,
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

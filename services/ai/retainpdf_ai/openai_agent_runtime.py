"""OpenAI-compatible document Agent runtime.

This runtime owns only model turns and structured function calling.  Durable
document state, operation execution, candidate publication, and commit remain
owned by Rust.  Every model tool call is projected into the same exact
``retainpdf-agent`` grammar used by the fx ACP adapter.
"""

from __future__ import annotations

import json
from collections.abc import Callable
from contextlib import nullcontext
from typing import Any

from .agent import (
    MARKDOWN_TOOL_NAMES,
    AskResult,
    ChatFn,
    Citation,
    _assign_refs,
    _public_tool_payload,
    _referenced_citations,
    _sanitize_answer_text,
    _scope_tool_arguments,
    build_deepseek_chat_fn,
)
from .agent_command_broker import AgentCommandBroker, BrokerScope
from .config import Settings
from .operation_context import load_operation_context
from .prompts import build_operation_system_prompt
from .rust_client import RustApiClient
from .tools import ToolRegistry

OPENAI_AGENT_RUNTIME_ID = "openai-compatible-agent-v1"
_MAX_ANSWER_CHARS = 1024 * 1024
_LIBRARY_READING_TOOL_NAMES = frozenset(
    {"list_documents", "search_fulltext", "read_blocks", "search_favorites"}
)

_PAGE_STEP_SCHEMA: dict[str, Any] = {
    "oneOf": [
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["op", "pages"],
            "properties": {
                "op": {"const": "select_pages"},
                "pages": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 999,
                    "items": {"type": "integer", "minimum": 1},
                    "description": "按当前页面编号选择；可用于删除、重排或复制页面。",
                },
            },
        },
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["op", "pages", "degrees"],
            "properties": {
                "op": {"const": "rotate_pages"},
                "pages": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 999,
                    "items": {"type": "integer", "minimum": 1},
                },
                "degrees": {"type": "integer", "enum": [90, 180, 270]},
            },
        },
    ]
}


def _function(
    name: str, description: str, parameters: dict[str, Any]
) -> dict[str, Any]:
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": parameters,
        },
    }


DOCUMENT_AGENT_TOOLS: list[dict[str, Any]] = [
    _function(
        "retainpdf_document_inspect",
        "读取当前文档可安全暴露的元数据和活动版本。",
        {"type": "object", "additionalProperties": False, "properties": {}},
    ),
    _function(
        "retainpdf_operation_create",
        "根据受限页面步骤创建 durable PDF operation；创建不会执行或提交。",
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["steps"],
            "properties": {
                "steps": {
                    "type": "array",
                    "minItems": 1,
                    "maxItems": 64,
                    "items": _PAGE_STEP_SCHEMA,
                }
            },
        },
    ),
    _function(
        "retainpdf_operation_get",
        "查询一个 durable operation 的权威状态。",
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["operation_id"],
            "properties": {"operation_id": {"type": "string", "minLength": 1}},
        },
    ),
    _function(
        "retainpdf_operation_run",
        "显式确认后运行或重试 operation，生成可预览候选版本，但不提交。",
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["operation_id"],
            "properties": {
                "operation_id": {"type": "string", "minLength": 1},
                "retry": {"type": "string", "enum": ["failed", "ambiguous"]},
                "accept_duplicate_risk": {"type": "boolean", "default": False},
            },
        },
    ),
    _function(
        "retainpdf_operation_commit",
        "在用户已经预览候选版本并再次显式确认后提交 operation。",
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["operation_id"],
            "properties": {"operation_id": {"type": "string", "minLength": 1}},
        },
    ),
    _function(
        "retainpdf_operation_cancel",
        "取消尚未提交的 operation。",
        {
            "type": "object",
            "additionalProperties": False,
            "required": ["operation_id", "reason"],
            "properties": {
                "operation_id": {"type": "string", "minLength": 1},
                "reason": {
                    "type": "string",
                    "enum": ["agent_abort", "superseded", "user_cancelled"],
                },
            },
        },
    ),
]


class OpenAICompatibleAgentRuntime:
    runtime_id = OPENAI_AGENT_RUNTIME_ID

    def __init__(
        self,
        settings: Settings,
        rust: RustApiClient,
        reading_registry: ToolRegistry | None = None,
    ) -> None:
        self._settings = settings
        self._rust = rust
        self._reading_registry = reading_registry
        self._chat = build_deepseek_chat_fn(settings)

    def ask(
        self,
        question: str,
        *,
        conversation_id: str = "",
        document_id: str = "",
        job_id: str = "",
        request_message_id: str = "",
        confirmed: bool = False,
        on_event: Callable[[dict[str, Any]], None] | None = None,
        chat_fn: ChatFn | None = None,
        history: list[dict[str, str]] | None = None,
    ) -> AskResult:
        emit = on_event or (lambda _event: None)
        chat = chat_fn or self._chat
        conversation_id = conversation_id.strip()
        document_id = document_id.strip()
        request_message_id = request_message_id.strip()
        operation_tools_available = bool(
            conversation_id and document_id and request_message_id
        )
        reading_names = (
            MARKDOWN_TOOL_NAMES
            if document_id or job_id.strip()
            else _LIBRARY_READING_TOOL_NAMES
        )
        reading_specs = (
            self._reading_registry.specs(reading_names)
            if self._reading_registry is not None
            else []
        )
        reading_tool_names = {
            str((spec.get("function") or {}).get("name") or "")
            for spec in reading_specs
        }
        tool_specs = [
            *(DOCUMENT_AGENT_TOOLS if operation_tools_available else []),
            *reading_specs,
        ]
        green_light = self._settings.agent_confirmation_mode == "green_light"
        operations = load_operation_context(
            self._rust,
            conversation_id=conversation_id,
            document_id=document_id,
        )
        messages: list[dict[str, Any]] = [
            {
                "role": "system",
                "content": build_operation_system_prompt(
                    document_id=document_id,
                    conversation_id=conversation_id,
                    tools_available=operation_tools_available,
                    confirmation_mode=(
                        "green_light" if green_light else "explicit"
                    ),
                    confirmed=confirmed,
                    operations=operations,
                    reading_available=bool(reading_specs),
                ),
            }
        ]
        for turn in history or []:
            role = str(turn.get("role") or "")
            content = str(turn.get("content") or "").strip()
            if role in {"user", "assistant"} and content:
                messages.append({"role": role, "content": content})
        messages.append({"role": "user", "content": question.strip()})

        if not tool_specs:
            message = chat(messages, [])
            return AskResult(
                answer=str(message.get("content") or "").strip()[:_MAX_ANSWER_CHARS],
                rounds=1,
            )

        operation_refs: dict[str, dict[str, Any]] = {}
        trace: list[dict[str, Any]] = []
        ran_in_this_turn: set[str] = set()
        citations: dict[int, Citation] = {}
        next_ref = 1

        def on_operation_event(event: dict[str, Any]) -> None:
            operation_id = str(event.get("operation_id") or "").strip()
            if operation_id:
                operation_refs[operation_id] = {
                    "operation_id": operation_id,
                    "status": str(event.get("status") or ""),
                    "current_attempt": int(event.get("current_attempt") or 0),
                    "latest_event_seq": int(event.get("latest_event_seq") or 0),
                }
            emit(event)

        broker_context = (
            AgentCommandBroker(
                state_root=self._settings.data_root / "agent-runtime" / "openai-compatible",
                cli_command=(
                    self._settings.agent_cli_command
                    or self._settings.fx_agent_cli_command
                ),
                rust_api_url=self._settings.rust_api_base,
                rust=self._rust,
                scope=BrokerScope(
                    conversation_id=conversation_id,
                    document_id=document_id,
                    request_message_id=request_message_id,
                    intent_summary=question,
                    confirmed=confirmed,
                    green_light=green_light,
                ),
                on_operation_event=on_operation_event,
            )
            if operation_tools_available
            else nullcontext(None)
        )
        with broker_context as broker:
            for round_index in range(1, self._settings.max_tool_rounds + 1):
                message = chat(messages, tool_specs)
                tool_calls = message.get("tool_calls") or []
                if not tool_calls:
                    answer = _sanitize_answer_text(
                        str(message.get("content") or "").strip()[:_MAX_ANSWER_CHARS],
                        citations,
                    )
                    return AskResult(
                        answer=answer,
                        citations=_referenced_citations(answer, citations),
                        tool_trace=trace,
                        rounds=round_index,
                        operation_refs=list(operation_refs.values()),
                    )
                messages.append(
                    {
                        "role": "assistant",
                        "content": message.get("content") or "",
                        "tool_calls": tool_calls,
                    }
                )
                for call in tool_calls:
                    call_id = str(call.get("id") or "")[:256]
                    function = call.get("function") or {}
                    name = str(function.get("name") or "")
                    arguments = _parse_arguments(function.get("arguments"))
                    if name in reading_tool_names and self._reading_registry is not None:
                        scoped_arguments = _scope_tool_arguments(
                            name,
                            arguments,
                            document_id=document_id,
                            job_id=job_id.strip(),
                        )
                        emit(
                            {
                                "type": "tool",
                                "round": round_index,
                                "tool": name,
                                "arguments": scoped_arguments,
                            }
                        )
                        raw_result = self._reading_registry.invoke(name, scoped_arguments)
                        next_ref = _assign_refs(raw_result, citations, next_ref)
                        result = _public_tool_payload(raw_result)
                        trace.append(
                            {
                                "round": round_index,
                                "tool": name,
                                "status": "failed" if result.get("error") else "completed",
                            }
                        )
                        messages.append(
                            {
                                "role": "tool",
                                "tool_call_id": call_id,
                                "content": json.dumps(result, ensure_ascii=False),
                            }
                        )
                        continue
                    emit(
                        {
                            "type": "agent_tool",
                            "tool_call_id": call_id,
                            "title": name,
                            "kind": "retainpdf_operation",
                            "status": "running",
                        }
                    )
                    result = (
                        _invoke_tool(
                            broker,
                            name,
                            arguments,
                            ran_in_this_turn=ran_in_this_turn,
                            allow_same_turn_commit=green_light,
                        )
                        if broker is not None
                        else {
                            "ok": False,
                            "code": "document_scope_required",
                            "error": "durable document scope is required",
                        }
                    )
                    trace.append(
                        {
                            "round": round_index,
                            "tool": name,
                            "status": "completed" if result.get("ok") else "failed",
                        }
                    )
                    emit(
                        {
                            "type": "agent_tool",
                            "tool_call_id": call_id,
                            "title": name,
                            "kind": "retainpdf_operation",
                            "status": "completed" if result.get("ok") else "failed",
                        }
                    )
                    messages.append(
                        {
                            "role": "tool",
                            "tool_call_id": call_id,
                            "content": json.dumps(result, ensure_ascii=False),
                        }
                    )

            messages.append(
                {
                    "role": "user",
                    "content": "工具轮数已用完。请根据已有工具结果总结，不要再调用工具。",
                }
            )
            final = chat(messages, [])
            answer = _sanitize_answer_text(
                str(final.get("content") or "").strip()[:_MAX_ANSWER_CHARS],
                citations,
            )
            return AskResult(
                answer=answer,
                citations=_referenced_citations(answer, citations),
                tool_trace=trace,
                rounds=self._settings.max_tool_rounds + 1,
                operation_refs=list(operation_refs.values()),
            )


def _parse_arguments(raw: Any) -> dict[str, Any]:
    if isinstance(raw, dict):
        return raw
    try:
        value = json.loads(str(raw or "{}"))
    except json.JSONDecodeError:
        return {}
    return value if isinstance(value, dict) else {}


def _invoke_tool(
    broker: AgentCommandBroker,
    name: str,
    arguments: dict[str, Any],
    *,
    ran_in_this_turn: set[str],
    allow_same_turn_commit: bool = False,
) -> dict[str, Any]:
    try:
        argv = _tool_argv(
            name,
            arguments,
            ran_in_this_turn=ran_in_this_turn,
            allow_same_turn_commit=allow_same_turn_commit,
        )
        completed = broker.execute_host_argv(argv)
    except (TypeError, ValueError) as exc:
        error = str(exc)
        return {
            "ok": False,
            "code": (
                "confirmation_required"
                if error == "explicit confirmation is required"
                else "invalid_operation_command"
            ),
            "error": error,
        }
    exit_code = int(completed.get("exit_code") or 0)
    stdout = str(completed.get("stdout") or "")
    if exit_code != 0:
        return {
            "ok": False,
            "error": str(completed.get("stderr") or "operation tool failed")[:4000],
        }
    try:
        payload = json.loads(stdout)
    except json.JSONDecodeError:
        payload = {"output": stdout[:16000]}
    operation_id = str(arguments.get("operation_id") or "").strip()
    if name == "retainpdf_operation_run" and operation_id:
        ran_in_this_turn.add(operation_id)
    return {"ok": True, "result": payload}


def _tool_argv(
    name: str,
    arguments: dict[str, Any],
    *,
    ran_in_this_turn: set[str],
    allow_same_turn_commit: bool = False,
) -> tuple[str, ...]:
    if name == "retainpdf_document_inspect":
        return ("retainpdf-agent", "document", "inspect")
    if name == "retainpdf_operation_create":
        program = {
            "schema": "retainpdf_page_program_v1",
            "steps": arguments.get("steps"),
        }
        canonical = json.dumps(
            program,
            ensure_ascii=False,
            sort_keys=True,
            separators=(",", ":"),
        )
        return (
            "retainpdf-agent",
            "operation",
            "create",
            "--program-json",
            canonical,
        )
    operation_id = str(arguments.get("operation_id") or "").strip()
    if name == "retainpdf_operation_get":
        return (
            "retainpdf-agent",
            "operation",
            "get",
            "--operation-id",
            operation_id,
        )
    if name == "retainpdf_operation_run":
        argv = [
            "retainpdf-agent",
            "operation",
            "run",
            "--operation-id",
            operation_id,
        ]
        retry = str(arguments.get("retry") or "").strip()
        if retry:
            argv.extend(["--retry", retry])
            if retry == "ambiguous" and arguments.get("accept_duplicate_risk") is True:
                argv.extend(["--accept-duplicate-risk", "yes"])
        return tuple(argv)
    if name == "retainpdf_operation_commit":
        if operation_id in ran_in_this_turn and not allow_same_turn_commit:
            raise ValueError(
                "candidate must be previewed before a later confirmed commit turn"
            )
        return (
            "retainpdf-agent",
            "operation",
            "commit",
            "--operation-id",
            operation_id,
        )
    if name == "retainpdf_operation_cancel":
        return (
            "retainpdf-agent",
            "operation",
            "cancel",
            "--operation-id",
            operation_id,
            "--reason-code",
            str(arguments.get("reason") or ""),
        )
    raise ValueError(f"unsupported RetainPDF tool: {name}")

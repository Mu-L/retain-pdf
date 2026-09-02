"""Document-scoped retrieval agent and its bounded tool loop."""

from __future__ import annotations

import json
from collections.abc import Callable
from typing import Any

from .agent_evidence import (
    assign_refs,
    public_tool_payload,
    referenced_citations,
    sanitize_answer_text,
)
from .prompts import build_reading_system_prompt
from .runtimes.contracts import AskResult, ChatFn, Citation
from .tools import ToolRegistry

SYSTEM_PROMPT = build_reading_system_prompt()
MARKDOWN_TOOL_NAMES = frozenset({"search_markdown", "read_markdown_chunk"})


class RetrievalAgent:
    """Run a bounded function-calling loop over RetainPDF retrieval tools."""

    def __init__(
        self,
        registry: ToolRegistry,
        chat_fn: ChatFn,
        *,
        max_tool_rounds: int = 6,
    ) -> None:
        self._registry = registry
        self._chat = chat_fn
        self._max_tool_rounds = max(1, max_tool_rounds)

    @property
    def registry(self) -> ToolRegistry:
        """Expose the read-only tool registry to unified host runtimes."""
        return self._registry

    def ask(
        self,
        question: str,
        *,
        document_id: str = "",
        job_id: str = "",
        on_event: Callable[[dict[str, Any]], None] | None = None,
        chat_fn: ChatFn | None = None,
        history: list[dict[str, str]] | None = None,
    ) -> AskResult:
        emit = on_event or (lambda event: None)
        chat = chat_fn or self._chat
        scoped_document_id = document_id.strip()
        scoped_job_id = job_id.strip()
        messages = _initial_messages(
            question,
            document_id=scoped_document_id,
            job_id=scoped_job_id,
            history=history,
        )
        citations: dict[int, Citation] = {}
        trace: list[dict[str, Any]] = []
        next_ref = 1
        tool_specs = tool_specs_for_scope(self._registry, scoped_document_id)
        allowed_tool_names = {
            str((spec.get("function") or {}).get("name") or "") for spec in tool_specs
        }
        markdown_only_mode = bool(allowed_tool_names & MARKDOWN_TOOL_NAMES)
        searched_markdown = False

        for round_index in range(1, self._max_tool_rounds + 1):
            message = chat(messages, tool_specs)
            tool_calls = message.get("tool_calls") or []
            if not tool_calls:
                if markdown_only_mode and not searched_markdown:
                    if round_index < self._max_tool_rounds:
                        _request_required_markdown_search(messages)
                        continue
                    return AskResult(
                        answer="当前回答尚未完成文档检索，无法可靠回答。请重试。",
                        tool_trace=trace,
                        rounds=round_index,
                    )
                return _answer_result(message, citations, trace, round_index)

            messages.append(
                {
                    "role": "assistant",
                    "content": message.get("content") or "",
                    "tool_calls": tool_calls,
                }
            )
            for call in tool_calls:
                name = call.get("function", {}).get("name", "")
                if markdown_only_mode and name not in allowed_tool_names:
                    _reject_hidden_tool(
                        call,
                        name=name,
                        round_index=round_index,
                        messages=messages,
                        trace=trace,
                        emit=emit,
                    )
                    continue
                arguments = _parse_tool_arguments(call)
                arguments = scope_tool_arguments(
                    name,
                    arguments,
                    document_id=scoped_document_id,
                    job_id=scoped_job_id,
                )
                if name == "search_markdown":
                    searched_markdown = True
                event = {
                    "type": "tool",
                    "round": round_index,
                    "tool": name,
                    "arguments": arguments,
                }
                emit(event)
                result = self._registry.invoke(name, arguments)
                next_ref = assign_refs(result, citations, next_ref)
                trace.append(
                    {"round": round_index, "tool": name, "arguments": arguments}
                )
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": call.get("id", ""),
                        "content": json.dumps(
                            public_tool_payload(result),
                            ensure_ascii=False,
                        ),
                    }
                )

        messages.append(
            {
                "role": "user",
                "content": (
                    "请基于以上已检索到的证据直接给出最终回答,不要再调用工具。"
                    "引用只用 [n]。"
                ),
            }
        )
        # Use the request-level chat transport here as well: deployments may
        # provide credentials per request while the startup transport has none.
        message = chat(messages, [])
        return _answer_result(
            message,
            citations,
            trace,
            self._max_tool_rounds,
        )


def _initial_messages(
    question: str,
    *,
    document_id: str,
    job_id: str,
    history: list[dict[str, str]] | None,
) -> list[dict[str, Any]]:
    user_content = question.strip()
    if document_id or job_id:
        user_content = (
            f"(限定当前 Markdown document_id={document_id or 'unknown'}"
            f"{f', job_id={job_id}' if job_id else ''}"
            "。只能使用 search_markdown / read_markdown_chunk 读取该任务的 md/full.md。)\n"
            f"{user_content}"
        )
    messages: list[dict[str, Any]] = [{"role": "system", "content": SYSTEM_PROMPT}]
    for turn in history or []:
        role = str(turn.get("role") or "")
        content = str(turn.get("content") or "").strip()
        if role in {"user", "assistant"} and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": user_content})
    return messages


def _request_required_markdown_search(messages: list[dict[str, Any]]) -> None:
    messages.extend(
        [
            {"role": "assistant", "content": ""},
            {
                "role": "user",
                "content": (
                    "回答当前文档前必须先调用 search_markdown。"
                    "请立即检索；没有证据时明确说明未找到。"
                ),
            },
        ]
    )


def _parse_tool_arguments(call: dict[str, Any]) -> dict[str, Any]:
    try:
        arguments = json.loads(call.get("function", {}).get("arguments") or "{}")
    except json.JSONDecodeError:
        return {}
    return arguments if isinstance(arguments, dict) else {}


def _reject_hidden_tool(
    call: dict[str, Any],
    *,
    name: str,
    round_index: int,
    messages: list[dict[str, Any]],
    trace: list[dict[str, Any]],
    emit: Callable[[dict[str, Any]], None],
) -> None:
    arguments = {"skipped": True}
    result = {
        "error": (
            "Markdown-only 问答不允许调用该工具，请使用 "
            "search_markdown / read_markdown_chunk。"
        )
    }
    event = {
        "type": "tool",
        "round": round_index,
        "tool": name,
        "arguments": arguments,
    }
    emit(event)
    trace.append({"round": round_index, "tool": name, "arguments": arguments})
    messages.append(
        {
            "role": "tool",
            "tool_call_id": call.get("id", ""),
            "content": json.dumps(result, ensure_ascii=False),
        }
    )


def _answer_result(
    message: dict[str, Any],
    citations: dict[int, Citation],
    trace: list[dict[str, Any]],
    rounds: int,
) -> AskResult:
    answer = sanitize_answer_text(str(message.get("content") or "").strip(), citations)
    return AskResult(
        answer=answer,
        citations=referenced_citations(answer, citations),
        tool_trace=trace,
        rounds=rounds,
    )


def scope_tool_arguments(
    name: str,
    arguments: dict[str, Any],
    *,
    document_id: str = "",
    job_id: str = "",
) -> dict[str, Any]:
    """Force tool calls into the current document/job scope."""
    scoped = dict(arguments)
    if name in MARKDOWN_TOOL_NAMES:
        if document_id:
            scoped["document_id"] = document_id
        if job_id:
            scoped["job_id"] = job_id
        return scoped
    if not document_id:
        return scoped
    if name in {"search_fulltext", "search_favorites", "list_documents", "read_blocks"}:
        scoped["document_id"] = document_id
    if name == "read_blocks" and job_id and not str(scoped.get("job_id") or "").strip():
        scoped["job_id"] = job_id
    return scoped


def tool_specs_for_scope(
    registry: ToolRegistry,
    document_id: str = "",
) -> list[dict[str, Any]]:
    """Expose Markdown tools when available, retaining legacy test registries."""
    specs = registry.specs()
    names = {str((spec.get("function") or {}).get("name") or "") for spec in specs}
    if names & MARKDOWN_TOOL_NAMES:
        return [
            spec
            for spec in specs
            if str((spec.get("function") or {}).get("name") or "")
            in MARKDOWN_TOOL_NAMES
        ]
    if not document_id.strip():
        return specs
    return [
        spec
        for spec in specs
        if str((spec.get("function") or {}).get("name") or "") != "list_documents"
    ]


_scope_tool_arguments = scope_tool_arguments
_tool_specs_for_scope = tool_specs_for_scope

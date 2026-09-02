"""OpenAI-compatible model transport used by the retrieval agent."""

from __future__ import annotations

import json
from collections.abc import Callable, Iterable
from typing import Any

import httpx

from .config import Settings
from .runtimes.contracts import ChatFn


def assemble_streaming_message(
    lines: Iterable[str | bytes],
    on_delta: Callable[[str], None] | None = None,
) -> dict[str, Any]:
    """Assemble an SSE response into the non-streaming assistant shape."""
    content_parts: list[str] = []
    tool_calls: dict[int, dict[str, Any]] = {}
    saw_tool_calls = False
    # The model may emit prose before tool calls. Hold a small prefix until the
    # turn is classified so that tool-call preambles never leak as answer text.
    holdback_chars = 64
    pending: list[str] = []
    pending_flushed = False

    def flush_pending() -> None:
        nonlocal pending_flushed
        if on_delta is not None and pending:
            on_delta("".join(pending))
        pending.clear()
        pending_flushed = True

    for raw in lines:
        line = raw.decode("utf-8") if isinstance(raw, bytes) else raw
        line = line.strip()
        if not line or not line.startswith("data:"):
            continue
        data = line[len("data:") :].strip()
        if data == "[DONE]":
            break
        try:
            chunk = json.loads(data)
        except json.JSONDecodeError:
            continue
        choices = chunk.get("choices") or []
        if not choices:
            continue
        delta = choices[0].get("delta") or {}
        delta_tool_calls = delta.get("tool_calls") or []
        if delta_tool_calls:
            if not saw_tool_calls:
                pending.clear()
            saw_tool_calls = True
            for call in delta_tool_calls:
                index = call.get("index", 0)
                slot = tool_calls.setdefault(
                    index,
                    {
                        "id": "",
                        "type": "function",
                        "function": {"name": "", "arguments": ""},
                    },
                )
                if call.get("id"):
                    slot["id"] = call["id"]
                if call.get("type"):
                    slot["type"] = call["type"]
                function = call.get("function") or {}
                if function.get("name"):
                    slot["function"]["name"] += function["name"]
                if function.get("arguments"):
                    slot["function"]["arguments"] += function["arguments"]
        piece = delta.get("content")
        if piece:
            content_parts.append(piece)
            if on_delta is not None and not saw_tool_calls:
                if pending_flushed:
                    on_delta(piece)
                else:
                    pending.append(piece)
                    if sum(len(part) for part in pending) >= holdback_chars:
                        flush_pending()
    if not saw_tool_calls and not pending_flushed:
        flush_pending()
    message: dict[str, Any] = {
        "role": "assistant",
        "content": "".join(content_parts),
    }
    if tool_calls:
        message["tool_calls"] = [tool_calls[index] for index in sorted(tool_calls)]
    return message


def friendly_llm_error(status_code: int, detail: str = "") -> RuntimeError:
    """Translate provider HTTP failures into actionable, bounded messages."""
    hint = {
        400: "请求被模型服务拒绝（参数或上下文过长）",
        401: "模型 API Key 无效或未授权：请到 设置 → API 设置 检查 Key",
        402: "模型账户余额不足：请前往服务商充值后重试",
        403: "模型服务拒绝访问：请检查 Key 权限或所选模型",
        404: "模型或接口地址不存在：请检查模型名称与 Base URL",
        429: "模型请求过于频繁（限流）：请稍候几秒再试",
    }.get(status_code)
    if hint is None:
        if status_code >= 500:
            hint = "模型服务暂时不可用（上游故障）：请稍后重试"
        else:
            hint = f"模型服务返回错误（HTTP {status_code}）"
    snippet = f"{detail or ''}".strip().replace("\n", " ")
    if len(snippet) > 200:
        snippet = f"{snippet[:200]}…"
    return RuntimeError(f"{hint}" + (f"（上游信息：{snippet}）" if snippet else ""))


def build_deepseek_chat_fn(
    settings: Settings,
    client: httpx.Client | None = None,
    *,
    on_delta: Callable[[str], None] | None = None,
) -> ChatFn:
    """Build the request-scoped OpenAI-compatible chat function."""
    http = client or httpx.Client(timeout=settings.llm_timeout_s)
    url = f"{settings.llm_base_url}/chat/completions"
    api_key = f"{settings.llm_api_key or ''}".strip()
    if not api_key:

        def missing_key(
            _messages: list[dict[str, Any]],
            _tools: list[dict[str, Any]],
        ) -> dict[str, Any]:
            raise RuntimeError(
                "缺少 LLM API Key：请在前端「设置 → 凭据」填写模型 API Key，"
                "或配置环境变量 RETAIN_AI_LLM_API_KEY。"
            )

        return missing_key
    headers = {"Authorization": f"Bearer {api_key}"}

    def chat(
        messages: list[dict[str, Any]],
        tools: list[dict[str, Any]],
    ) -> dict[str, Any]:
        body: dict[str, Any] = {
            "model": settings.llm_model,
            "messages": messages,
            "tools": tools,
            "temperature": 0.2,
        }
        if on_delta is None:
            response = http.post(url, headers=headers, json=body)
            if response.status_code >= 400:
                raise friendly_llm_error(response.status_code, response.text)
            return response.json()["choices"][0]["message"]
        body["stream"] = True
        with http.stream("POST", url, headers=headers, json=body) as response:
            if response.status_code >= 400:
                try:
                    detail = response.read().decode("utf-8", errors="replace")
                except Exception:  # noqa: BLE001 - preserve bounded provider fallback
                    detail = ""
                raise friendly_llm_error(response.status_code, detail)
            return assemble_streaming_message(response.iter_lines(), on_delta)

    return chat


# Original private helper name remains available to compatibility facades.
_friendly_llm_error = friendly_llm_error

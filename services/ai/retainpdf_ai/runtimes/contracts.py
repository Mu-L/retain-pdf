"""Shared contracts implemented by every RetainPDF agent runtime."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any, Protocol

from ..agent import AskResult, ChatFn


class AgentRuntime(Protocol):
    runtime_id: str

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
    ) -> AskResult: ...

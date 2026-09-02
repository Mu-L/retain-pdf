"""Adapter for the in-process Markdown retrieval agent."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

from ..agent import AskResult, ChatFn, RetrievalAgent


class PythonAgentRuntime:
    runtime_id = "python-retrieval-v1"

    def __init__(self, agent: RetrievalAgent) -> None:
        self._agent = agent

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
        del conversation_id, request_message_id, confirmed
        return self._agent.ask(
            question,
            document_id=document_id,
            job_id=job_id,
            on_event=on_event,
            chat_fn=chat_fn,
            history=history,
        )

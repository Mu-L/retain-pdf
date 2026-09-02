import json
import stat
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from retainpdf_ai.config import Settings
from retainpdf_ai.openai_agent_runtime import (
    OPENAI_AGENT_RUNTIME_ID,
    OpenAICompatibleAgentRuntime,
)
from retainpdf_ai.runtime import build_agent_runtime


class FakeRust:
    def __init__(self):
        self.capability_calls: list[dict] = []

    def issue_agent_capability(self, **kwargs) -> dict:
        self.capability_calls.append(kwargs)
        return {"capability": "host-only-capability"}


class UnusedRetrievalAgent:
    pass


def _write_operation_cli(path: Path) -> Path:
    script = f"""#!{sys.executable}
import json
import sys
from pathlib import Path

args = sys.argv[1:]
action = args[1] if len(args) > 1 else "inspect"
request = {{}}
if "--request" in args:
    index = args.index("--request")
    request = json.loads(Path(args[index + 1]).read_text(encoding="utf-8"))
operation_id = request.get("operation_id") or "op-openai-1"
status = {{"create": "draft", "run": "result_ready", "commit": "committed"}}.get(action, "draft")
print(json.dumps({{
    "schema": "retainpdf_agent_cli_response_v1",
    "ok": True,
    "response": {{
        "code": 0,
        "data": {{
            "operation_id": operation_id,
            "conversation_id": request.get("conversation_id", "conv-a"),
            "request_message_id": request.get("request_message_id", "msg-a"),
            "status": status,
            "current_attempt": 1,
            "events": [{{"seq": 3}}],
        }},
    }},
}}, separators=(",", ":")))
"""
    path.write_text(script, encoding="utf-8")
    path.chmod(path.stat().st_mode | stat.S_IXUSR)
    return path


def _settings(tmp_path: Path, cli: Path) -> Settings:
    return Settings(
        agent_runtime="openai",
        llm_base_url="https://models.example/v1",
        llm_model="model-a",
        llm_api_key="model-key",
        max_tool_rounds=4,
        fx_agent_cli_command=str(cli),
        data_root=tmp_path / "data",
    )


def _call(call_id: str, name: str, arguments: dict) -> dict:
    return {
        "id": call_id,
        "type": "function",
        "function": {
            "name": name,
            "arguments": json.dumps(arguments, separators=(",", ":")),
        },
    }


def test_openai_runtime_creates_operation_through_shared_broker(tmp_path):
    rust = FakeRust()
    cli = _write_operation_cli(tmp_path / "retainpdf-agent")
    runtime = OpenAICompatibleAgentRuntime(_settings(tmp_path, cli), rust)  # type: ignore[arg-type]
    replies = iter(
        [
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    _call(
                        "tool-create",
                        "retainpdf_operation_create",
                        {
                            "steps": [
                                {
                                    "op": "rotate_pages",
                                    "pages": [1],
                                    "degrees": 90,
                                }
                            ]
                        },
                    )
                ],
            },
            {"role": "assistant", "content": "候选操作已创建，请确认运行。"},
        ]
    )
    events: list[dict] = []

    result = runtime.ask(
        "把第一页旋转 90 度",
        conversation_id="conv-a",
        document_id="doc-a",
        request_message_id="msg-a",
        on_event=events.append,
        chat_fn=lambda _messages, _tools: next(replies),
    )

    assert result.answer == "候选操作已创建，请确认运行。"
    assert result.operation_refs == [
        {
            "operation_id": "op-openai-1",
            "status": "draft",
            "current_attempt": 1,
            "latest_event_seq": 3,
        }
    ]
    assert [item["type"] for item in events] == [
        "agent_tool",
        "agent_operation",
        "agent_tool",
    ]
    assert rust.capability_calls == [
        {
            "conversation_id": "conv-a",
            "document_id": "doc-a",
            "actions": ["operation.create"],
            "ttl_seconds": 60,
        }
    ]


def test_openai_runtime_rejects_run_without_independent_confirmation(tmp_path):
    rust = FakeRust()
    cli = _write_operation_cli(tmp_path / "retainpdf-agent")
    runtime = OpenAICompatibleAgentRuntime(_settings(tmp_path, cli), rust)  # type: ignore[arg-type]
    observed_tool_results: list[dict] = []

    def chat(messages, _tools):
        assert "点击对应 operation 卡片" in messages[0]["content"]
        assert "固定确认语句" in messages[0]["content"]
        tool_results = [
            message for message in messages if message.get("role") == "tool"
        ]
        if not tool_results:
            return {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    _call(
                        "tool-run",
                        "retainpdf_operation_run",
                        {"operation_id": "op-openai-1"},
                    )
                ],
            }
        observed_tool_results.append(json.loads(tool_results[-1]["content"]))
        return {"role": "assistant", "content": "需要用户明确确认后才能运行。"}

    result = runtime.ask(
        "运行它",
        conversation_id="conv-a",
        document_id="doc-a",
        request_message_id="msg-a",
        confirmed=False,
        chat_fn=chat,
    )

    assert "明确确认" in result.answer
    assert observed_tool_results[0]["ok"] is False
    assert "confirmation" in observed_tool_results[0]["error"]
    assert rust.capability_calls == []


def test_openai_runtime_green_light_can_run_and_commit_in_one_turn(tmp_path):
    rust = FakeRust()
    cli = _write_operation_cli(tmp_path / "retainpdf-agent")
    settings = _settings(tmp_path, cli)
    settings = Settings(**{**settings.__dict__, "agent_confirmation_mode": "green_light"})
    runtime = OpenAICompatibleAgentRuntime(settings, rust)  # type: ignore[arg-type]
    replies = iter(
        [
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    _call(
                        "tool-run",
                        "retainpdf_operation_run",
                        {"operation_id": "op-openai-1"},
                    )
                ],
            },
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    _call(
                        "tool-commit",
                        "retainpdf_operation_commit",
                        {"operation_id": "op-openai-1"},
                    )
                ],
            },
            {"role": "assistant", "content": "已直接执行并提交。"},
        ]
    )

    result = runtime.ask(
        "直接执行这个操作",
        conversation_id="conv-a",
        document_id="doc-a",
        request_message_id="msg-a",
        confirmed=False,
        chat_fn=lambda _messages, _tools: next(replies),
    )

    assert result.answer == "已直接执行并提交。"
    assert [call["actions"] for call in rust.capability_calls] == [
        ["operation.run"],
        ["operation.commit"],
    ]
    assert [item["status"] for item in result.tool_trace] == ["completed", "completed"]


def test_openai_runtime_requires_preview_turn_between_run_and_commit(tmp_path):
    rust = FakeRust()
    cli = _write_operation_cli(tmp_path / "retainpdf-agent")
    runtime = OpenAICompatibleAgentRuntime(_settings(tmp_path, cli), rust)  # type: ignore[arg-type]
    replies = iter(
        [
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    _call(
                        "tool-run",
                        "retainpdf_operation_run",
                        {"operation_id": "op-openai-1"},
                    )
                ],
            },
            {
                "role": "assistant",
                "content": "",
                "tool_calls": [
                    _call(
                        "tool-commit",
                        "retainpdf_operation_commit",
                        {"operation_id": "op-openai-1"},
                    )
                ],
            },
            {"role": "assistant", "content": "请先预览候选版本，再单独确认提交。"},
        ]
    )

    result = runtime.ask(
        "确认运行",
        conversation_id="conv-a",
        document_id="doc-a",
        request_message_id="msg-a",
        confirmed=True,
        chat_fn=lambda _messages, _tools: next(replies),
    )

    assert "预览候选版本" in result.answer
    assert [call["actions"] for call in rust.capability_calls] == [["operation.run"]]
    assert [item["status"] for item in result.tool_trace] == ["completed", "failed"]


def test_runtime_factory_selects_openai_agent_without_gateway_key(tmp_path):
    cli = _write_operation_cli(tmp_path / "retainpdf-agent")
    settings = _settings(tmp_path, cli)
    runtime = build_agent_runtime(
        settings,
        FakeRust(),  # type: ignore[arg-type]
        UnusedRetrievalAgent(),  # type: ignore[arg-type]
    )
    assert runtime.runtime_id == OPENAI_AGENT_RUNTIME_ID

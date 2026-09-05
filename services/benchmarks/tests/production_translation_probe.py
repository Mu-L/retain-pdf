"""Offline production-entry probe, executed only in a fresh child process."""
import json
from pathlib import Path
import sys

import pytest

def probe(transport, route, outcome, cache_dir):
    from copy import deepcopy
    from types import SimpleNamespace
    from unittest.mock import Mock, patch
    import socket
    from retainpdf_pipeline.foundation.config import paths
    from retainpdf_pipeline.translate.llm.shared.rust_executor import ExecutorError
    from retainpdf_pipeline.translate.llm.shared import executor_context as executor
    from retainpdf_pipeline.translate.llm.shared.orchestration import translate_batch
    from retainpdf_pipeline.translate.llm.shared.request_capture import digest
    from retainpdf_pipeline.translate.llm.providers.deepseek import client

    paths.TRANSLATION_UNIT_CACHE_DIR = Path(cache_dir)
    source = "The energy remains conserved in this experiment."
    translated = "在这一实验过程中，体系的能量始终保持守恒。"
    def item(identity):
        return {"item_id": identity, "protected_source_text": source, "source_text": source,
                "translation_unit_protected_source_text": source, "block_type": "text",
                "structure_role": "body", "math_mode": "direct_typst"}
    if route == "group":
        group = item("__cg__:g")
        group.update(continuation_group="g", translation_unit_id="__cg__:g", translation_unit_kind="group",
                     translation_unit_member_ids=["a", "b"],
                     translation_unit_members=[{"item_id": i, "protected_source_text": source} for i in ("a", "b")],
                     translation_unit_protected_source_text=source + " " + source)
        batch = [group]
        content = json.dumps({"member_translations": [{"item_id": i, "translated_text": translated} for i in ("a", "b")]})
    elif route == "batch":
        batch = [dict(item(i), _batched_plain_candidate=True) for i in ("a", "b")]
        content = "\n".join(f"<<<ITEM item_id={i}>>>\n{translated}\n<<<END>>>" for i in ("a", "b"))
    else:
        batch = [item("a")]
        content = translated
    calls = []
    def fake_request(**kwargs):
        calls.append(deepcopy(kwargs))
        if outcome == "transport":
            raise ExecutorError("fake transport failure")
        return SimpleNamespace(content="invalid json" if outcome == "protocol" else content)
    def fake_post(_url, **kwargs):
        calls.append(deepcopy(kwargs["json"]))
        response = Mock(status_code=200)
        response.json.return_value = {"choices": [{"message": {"content": content}}]}
        return response
    def deny_network(*args, **kwargs):
        raise AssertionError("real network forbidden")
    rt = executor.ExecutorRuntime(SimpleNamespace(request=fake_request))
    with patch.object(executor, "_runtime", rt), patch.object(socket, "socket", deny_network), \
         patch.object(socket, "getaddrinfo", deny_network), \
         patch.object(client, "_prewarm_dns"), patch.object(client, "should_use_stream_responses", return_value=False), \
         patch.object(client, "get_session", return_value=SimpleNamespace(post=fake_post)):
        failed = False
        try:
            result = translate_batch(batch, api_key="fake-key", model="qwen3.8-flash",
                                     base_url="https://dashscope.aliyuncs.com/compatible-mode/v1")
        except ExecutorError:
            result, failed = {}, True
        if failed:
            previous = len(calls)
            with pytest.raises(ExecutorError):
                translate_batch([item("new-unit")], api_key="fake-key")
            assert len(calls) == previous
    print(json.dumps({"calls": len(calls), "failed": failed,
                      "messages_hashes": [digest(c["messages"]) for c in calls],
                      "purposes": [c.get("purpose") for c in calls],
                      "unit_ids": [c.get("unit_id") for c in calls],
                      "thinking": calls[0].get("enable_thinking") if calls else None,
                      "result": {i: {k: v for k, v in r.items() if k in {"translated_text", "decision", "final_status", "member_translations"}}
                                 for i, r in result.items()}}, ensure_ascii=False))


if __name__ == "__main__":
    probe(*sys.argv[1:])

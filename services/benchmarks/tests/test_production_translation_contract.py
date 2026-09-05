"""Production entry contracts run independently of parent-process imports."""
import json
import hashlib
import os
from pathlib import Path
import subprocess
import sys

import pytest

PIPELINE = Path(__file__).resolve().parents[2] / "pipeline"
PROBE = Path(__file__).with_name("production_translation_probe.py")


def probe_environment(transport):
    # No parent provider keys, proxies, capture paths or executor capabilities.
    # Retain only OS/runtime essentials needed to start the isolated interpreter.
    allowed = {"PATH", "SYSTEMROOT", "WINDIR", "COMSPEC", "PATHEXT",
               "TMP", "TEMP", "TMPDIR", "LANG", "LC_ALL"}
    env = {key: value for key, value in os.environ.items() if key.upper() in allowed}
    env.update(PYTHONPATH=str(PIPELINE), PYTHONIOENCODING="utf-8",
               PYTHONNOUSERSITE="1", RETAIN_TRANSLATION_TRANSPORT=transport)
    return env


def run_probe(tmp_path, transport, route, outcome="success"):
    result = subprocess.run([sys.executable, str(PROBE), transport, route, outcome, str(tmp_path)],
                            env=probe_environment(transport), capture_output=True,
                            text=True, encoding="utf-8", timeout=20)
    assert result.returncode == 0, result.stderr + result.stdout
    return json.loads(result.stdout.splitlines()[-1])


def test_probe_environment_does_not_inherit_service_configuration(monkeypatch):
    for name in ("RETAIN_TRANSLATION_CAPTURE_DIR", "RETAIN_MODEL_EXECUTOR_URL",
                 "RETAIN_MODEL_CAPABILITY", "OPENAI_API_KEY", "HTTP_PROXY",
                 "HTTPS_PROXY", "ALL_PROXY", "PYTHONSTARTUP", "PYTHONPATH"):
        monkeypatch.setenv(name, "synthetic-parent-value")
    env = probe_environment("rust")
    assert "synthetic-parent-value" not in env.values()
    assert env["PYTHONPATH"] == str(PIPELINE)
    assert env["RETAIN_TRANSLATION_TRANSPORT"] == "rust"


@pytest.mark.parametrize("route", ["single", "batch", "group"])
def test_production_entry_generates_same_messages_across_transports(tmp_path, route):
    legacy = run_probe(tmp_path / "legacy", "legacy", route)
    rust = run_probe(tmp_path / "rust", "rust", route)
    assert legacy["calls"] == rust["calls"] == 1
    assert legacy["messages_hashes"] == rust["messages_hashes"]
    assert legacy["result"] == rust["result"]
    assert legacy["result"] and all(r["translated_text"] for r in legacy["result"].values())
    assert not legacy["failed"] and not rust["failed"]
    assert legacy["thinking"] is False
    assert rust["purposes"] == ["primary"]
    members = {"single": ["a"], "batch": ["a", "b"], "group": ["__cg__:g", "a", "b"]}[route]
    expected = hashlib.sha256(json.dumps(["translation", members], separators=(",", ":")).encode()).hexdigest()
    assert rust["unit_ids"] == [expected]


@pytest.mark.parametrize("outcome,count", [("protocol", 2), ("transport", 1)])
def test_production_rust_failure_has_bounded_requests(tmp_path, outcome, count):
    result = run_probe(tmp_path, "rust", "group", outcome)
    assert result["failed"]
    assert result["calls"] == count
    assert result["purposes"] == (["primary", "repair"] if count == 2 else ["primary"])

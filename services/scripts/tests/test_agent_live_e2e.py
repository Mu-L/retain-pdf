from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import subprocess
import sys

import pytest


SCRIPT = Path(__file__).resolve().parents[1] / "agent_live_e2e.py"
SPEC = importlib.util.spec_from_file_location("agent_live_e2e", SCRIPT)
assert SPEC is not None and SPEC.loader is not None
agent_live_e2e = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = agent_live_e2e
SPEC.loader.exec_module(agent_live_e2e)


def _options(tmp_path: Path, *args: str):
    return agent_live_e2e.parse_args(
        ["--fixture", str(tmp_path / "fixture.pdf"), *args]
    )


def test_missing_gateway_key_fails_before_startup(tmp_path: Path):
    with pytest.raises(agent_live_e2e.LiveE2EError, match="GATEWAY_API_KEY"):
        agent_live_e2e._gateway_key(_options(tmp_path), {})


def test_main_reports_missing_gateway_key_without_traceback(capsys):
    assert agent_live_e2e.main([]) == 1
    captured = capsys.readouterr()
    assert "GATEWAY_API_KEY" in captured.err
    assert "Traceback" not in captured.err


def test_data_root_must_be_isolated(tmp_path: Path):
    occupied = tmp_path / "occupied"
    occupied.mkdir()
    (occupied / "user-data").write_text("keep", encoding="utf-8")
    with pytest.raises(agent_live_e2e.LiveE2EError, match="empty directory"):
        agent_live_e2e._prepare_data_root(
            _options(tmp_path, "--data-root", str(occupied))
        )
    assert (occupied / "user-data").read_text(encoding="utf-8") == "keep"


def test_multipart_contains_pdf_without_changing_fixture(tmp_path: Path):
    fixture = tmp_path / "fixture.pdf"
    fixture.write_bytes(b"%PDF-safe-fixture")
    body, content_type = agent_live_e2e._multipart_pdf(fixture)
    assert b"%PDF-safe-fixture" in body
    assert b'filename="retainpdf-live-fixture.pdf"' in body
    assert content_type.startswith("multipart/form-data; boundary=")
    assert fixture.read_bytes() == b"%PDF-safe-fixture"


def test_operation_discovery_requires_exactly_one_durable_operation(tmp_path: Path):
    operations = tmp_path / "operations"
    operations.mkdir()
    (operations / "runs").mkdir()
    with pytest.raises(agent_live_e2e.LiveE2EError, match="found 0"):
        agent_live_e2e._operation_id(tmp_path)
    (operations / "op-one").mkdir()
    assert agent_live_e2e._operation_id(tmp_path) == "op-one"
    (operations / "op-two").mkdir()
    with pytest.raises(agent_live_e2e.LiveE2EError, match="found 2"):
        agent_live_e2e._operation_id(tmp_path)


def test_candidate_path_cannot_escape_data_root(tmp_path: Path):
    operation = {
        "status": "committed",
        "candidate_version": {
            "status": "committed",
            "artifact_key": "../outside.pdf",
        },
    }
    with pytest.raises(agent_live_e2e.LiveE2EError, match="escaped"):
        agent_live_e2e._verify_candidate(tmp_path, operation)


def test_diagnostic_redacts_all_supplied_secrets(tmp_path: Path):
    log = tmp_path / "stack.log"
    log.write_text(
        "gateway-secret\nAPI_KEY=api-secret\nnormal diagnostic\n",
        encoding="utf-8",
    )
    output = agent_live_e2e._diagnostic_tail(
        log, ("gateway-secret", "api-secret")
    )
    assert "gateway-secret" not in output
    assert "api-secret" not in output
    assert "normal diagnostic" in output


def test_only_sensitive_environment_names_feed_log_redaction():
    values = agent_live_e2e._sensitive_environment_values(
        {
            "PATH": "/ordinary/path",
            "PORT": "41000",
            "API_KEY": "secret-value",
            "ACCESS_TOKEN": "token-value",
        }
    )
    assert values == ("secret-value", "token-value")


def test_candidate_verifier_accepts_only_expected_pdf_shape(tmp_path: Path, monkeypatch):
    data_root = tmp_path / "data"
    candidate = data_root / "operations" / "op-one" / "candidate.pdf"
    candidate.parent.mkdir(parents=True)
    candidate.write_bytes(b"%PDF")
    python = agent_live_e2e.SERVICES_ROOT / ".venv" / "bin" / "python"
    monkeypatch.setattr(Path, "is_file", lambda self: True if self == python else self.exists())
    monkeypatch.setattr(
        agent_live_e2e.subprocess,
        "run",
        lambda *args, **kwargs: subprocess.CompletedProcess(
            args[0], 0, json.dumps({"pages": 2, "rotations": [0, 90]}), ""
        ),
    )
    result = agent_live_e2e._verify_candidate(
        data_root,
        {
            "status": "committed",
            "candidate_version": {
                "status": "committed",
                "artifact_key": "operations/op-one/candidate.pdf",
                "content_sha256": "abc",
            },
        },
    )
    assert result["pages"] == 2
    assert result["rotations"] == [0, 90]

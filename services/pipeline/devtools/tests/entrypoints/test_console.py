from __future__ import annotations

import sys

from retainpdf_pipeline.entrypoints import console


def test_help_lists_stable_commands(capsys) -> None:
    assert console.main(["--help"]) == 0

    output = capsys.readouterr().out
    assert "retainpdf-pipeline <command>" in output
    assert "translate-only" in output
    assert "document-operation" in output


def test_unknown_command_fails_without_running_worker(capsys) -> None:
    assert console.main(["not-a-command"]) == 2

    error = capsys.readouterr().err
    assert "unknown command: not-a-command" in error


def test_dispatch_forwards_worker_arguments_and_restores_argv(monkeypatch) -> None:
    received: list[str] = []

    def fake_runner() -> int:
        received.extend(sys.argv)
        return 7

    monkeypatch.setitem(console.COMMANDS, "fake", (fake_runner, "test command"))
    original_argv = sys.argv

    assert console.main(["fake", "--spec", "job.spec.json"]) == 7
    assert received == [
        "retainpdf-pipeline fake",
        "--spec",
        "job.spec.json",
    ]
    assert sys.argv is original_argv

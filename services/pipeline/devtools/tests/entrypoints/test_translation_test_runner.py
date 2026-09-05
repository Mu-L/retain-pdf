"""The offline entrypoint must not select live tools or hide pytest failures."""
import importlib.util
from pathlib import Path
from types import SimpleNamespace

import pytest


def _runner(path=None):
    path = path or Path(__file__).resolve().parents[2] / "run_translation_tests.py"
    spec = importlib.util.spec_from_file_location("offline_translation_runner_test", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_symlinked_entry_uses_one_canonical_test_tree(tmp_path):
    source = Path(__file__).resolve().parents[2]
    alias = tmp_path / "devtools-alias"
    alias.symlink_to(source, target_is_directory=True)
    runner = _runner(alias / "run_translation_tests.py")
    assert runner.RUNNER_TEST == source / "tests/entrypoints/test_translation_test_runner.py"
    assert runner.RUNNER_TEST.is_relative_to(runner.SERVICES)


def test_default_suites_and_failure_propagation(monkeypatch):
    runner = _runner()
    calls = []
    monkeypatch.setenv("RETAIN_TRANSLATION_CAPTURE_DIR", "/unused-live-capture")
    def fake_run(command, **kwargs):
        calls.append((command, kwargs))
        return SimpleNamespace(returncode=1)
    monkeypatch.setattr(runner.subprocess, "run", fake_run)
    assert runner.main([]) == 1
    command, options = calls[0]
    assert command[3:5] == [str(path) for path in runner.SUITES.values()]
    assert command[5] == str(runner.RUNNER_TEST)
    assert options["timeout"] == 300
    assert "RETAIN_TRANSLATION_CAPTURE_DIR" not in options["env"]
    assert options["env"]["PYTHONPATH"] == str(runner.SERVICES / "pipeline")


def test_reverse_and_collection(monkeypatch):
    runner = _runner()
    calls = []
    monkeypatch.setattr(runner.subprocess, "run", lambda command, **kwargs: (
        calls.append(command) or SimpleNamespace(returncode=0)))
    assert runner.main(["--suite", "benchmarks", "--reverse", "--collect-only"]) == 0
    expected = sorted(map(str, runner.SUITES["benchmarks"].rglob("test_*.py")), reverse=True)
    assert calls[0][3:3 + len(expected)] == expected
    assert calls[0][-1] == "--collect-only"


def test_timeout_is_failure(monkeypatch):
    runner = _runner()
    def timeout(command, **kwargs):
        raise runner.subprocess.TimeoutExpired(command, 300)
    monkeypatch.setattr(runner.subprocess, "run", timeout)
    assert runner.main([]) == 124


def test_missing_suite_is_not_silently_skipped(monkeypatch, tmp_path):
    runner = _runner()
    monkeypatch.setitem(runner.SUITES, "benchmarks", tmp_path / "missing")
    with pytest.raises(SystemExit) as error:
        runner.main([])
    assert error.value.code == 2


def test_empty_reverse_suite_never_runs_unscoped_pytest(monkeypatch, tmp_path):
    runner = _runner()
    monkeypatch.setitem(runner.SUITES, "benchmarks", tmp_path)
    def unexpected_run(*args, **kwargs):
        pytest.fail("Empty selection must not launch pytest discovery")
    monkeypatch.setattr(runner.subprocess, "run", unexpected_run)
    with pytest.raises(SystemExit) as error:
        runner.main(["--suite", "benchmarks", "--reverse"])
    assert error.value.code == 2

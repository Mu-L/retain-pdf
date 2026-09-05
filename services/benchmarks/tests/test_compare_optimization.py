import json
import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from compare_optimization import evaluate


def run_fixture(root, *, requests=10, tokens=100, elapsed=50, status="translated"):
    root.mkdir()
    report = {"job_id": "j", "pages": "all", "workers": 8, "model": "qwen3.8-flash", "transport": "rust",
              "status": "succeeded", "wall_seconds": elapsed,
              "model_executor": {"metrics": {name: {"sum": value, "unknown_count": 0} for name, value in
                  [("upstream_attempts", requests), ("input_tokens", tokens), ("output_tokens", 20), ("cached_tokens", 10)]}}}
    path = root / "report.json"
    path.write_text(json.dumps(report))
    pages = root / "data/jobs/j/translated"
    pages.mkdir(parents=True)
    (pages / "translation-manifest.json").write_text('{"status":"complete"}')
    (pages / "page-001-deepseek.json").write_text(json.dumps([{"item_id": "i", "source_text": "source",
        "translated_text": "译文", "final_status": status}]))
    return path


def test_comparison_requires_both_integrity_and_performance(tmp_path):
    a = run_fixture(tmp_path / "a")
    b = run_fixture(tmp_path / "b", requests=9, tokens=90)
    assert evaluate(a, b)["accepted"]
    c = run_fixture(tmp_path / "c", requests=9, tokens=90, elapsed=56)
    assert not evaluate(a, c)["accepted"]
    d = run_fixture(tmp_path / "d", requests=9, tokens=90, status="failed")
    assert not evaluate(a, d)["accepted"]


def test_missing_metric_is_not_zero_and_bad_configuration_is_rejected(tmp_path):
    a = run_fixture(tmp_path / "a")
    b = run_fixture(tmp_path / "b", requests=9, tokens=90)
    report = json.loads(b.read_text())
    report["model_executor"]["metrics"]["input_tokens"]["unknown_count"] = 1
    b.write_text(json.dumps(report))
    assert not evaluate(a, b)["accepted"]
    report["workers"] = 4
    b.write_text(json.dumps(report))
    with pytest.raises(ValueError):
        evaluate(a, b)

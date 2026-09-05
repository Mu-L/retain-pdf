"""Keep the daily offline gate and optional order check distinct from live evals."""
from pathlib import Path


ROOT = Path(__file__).resolve().parents[3]
ENTRY = '$RETAIN_PDF_SERVICES_ROOT/pipeline/devtools/run_translation_tests.py'


def test_daily_gate_uses_full_offline_entry_and_keeps_stage_tests():
    workflow = (ROOT / ".github/workflows/tests.yml").read_text()
    assert f'python "{ENTRY}"' in workflow
    assert ENTRY + '" --reverse' not in workflow
    assert "pipeline/devtools/tests/translation/test_" not in workflow
    assert "pipeline/devtools/tests/pipeline" in workflow
    assert "ai/tests/test_page_program.py" in workflow
    assert "uses: ./.github/actions/setup-test-typst" in workflow


def test_order_check_is_manual_and_never_starts_live_evaluation():
    workflow = (ROOT / ".github/workflows/translation-offline.yml").read_text()
    assert "workflow_dispatch: {}" in workflow
    assert "pull_request:" not in workflow
    assert "schedule:" not in workflow
    assert f'python "{ENTRY}" --reverse' in workflow
    for live_marker in ("secrets.", "promptfoo", "live_smoke", "--run", "translation-replay"):
        assert live_marker not in workflow
    assert "--locked --all-extras" in workflow
    assert "uses: ./.github/actions/setup-test-typst" in workflow


def test_formula_runtime_matches_repository_version():
    action = (ROOT / ".github/actions/setup-test-typst/action.yml").read_text()
    sample = (ROOT / ".github/workflows/translate-sample-pdf.yml").read_text()
    assert 'TYPST_VERSION: "0.14.2"' in sample
    assert "/download/v0.14.2/" in action
    assert "curl --fail" in action
    assert '"$GITHUB_ENV"' in action
    assert "TYPST_BIN=" in action

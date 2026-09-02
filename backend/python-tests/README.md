# Legacy Python test runner

This directory predates the backend extraction into `services/`. Its runner
still names removed `backend/pipeline` paths and is not the supported test
entrypoint. It remains only so a later cleanup can migrate or delete the runner
and its self-tests deliberately instead of silently losing history.

Use the current service-owned suites:

```bash
uv sync --project services --extra test
uv run --project services python -m pytest services/ai/tests services/scripts/tests
```

Pipeline tests live with their modules under `services/pipeline/**/tests` and
Rust tests run from `services/api/Cargo.toml`. New tests must be added beside
their owning service, not under `backend/python-tests/`.

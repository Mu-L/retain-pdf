# RetainPDF backend workspace

`services/` is the source and build root for the RetainPDF backend. It is
designed to become an independent repository without changing its internal
layout.

The workspace contains:

- `api/`: Rust API and job runtime workspace.
- `ai/`: Python AI conversation service.
- `pipeline/`: Python OCR, translation, and rendering package.
- `config/`: backend-owned runtime configuration shared by Rust and Python.

## Local verification

Run Python commands from this directory, or pass `--project services` from the
monorepo root:

```bash
uv sync --locked --all-extras
uv run retainpdf-pipeline --help
uv run python -c "import retainpdf_ai, retainpdf_pipeline"
cargo test --locked --workspace --manifest-path api/Cargo.toml
```

From the monorepo root, the extraction smoke test builds a clean Git snapshot
of this directory and verifies that it does not accidentally import source
files from the parent checkout:

```bash
python3 services/scripts/check_standalone.py
```

`contracts`, backend deployment assets, and golden test data are still owned
outside this directory. The standalone smoke test therefore checks package
installation and compilation, not the contract tests that read those external
fixtures. Those assets are the next extraction boundary to move inward.

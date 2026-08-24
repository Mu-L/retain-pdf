# RetainPDF backend workspace

`services/` is the source and build root for the RetainPDF backend. It is
designed to become an independent repository without changing its internal
layout.

The workspace contains:

- `api/`: Rust API and job runtime workspace.
- `ai/`: Python AI conversation service.
- `pipeline/`: Python OCR, translation, and rendering package.
- `config/`: backend-owned runtime configuration shared by Rust and Python.
- `contracts/`: backend-local JSON contract mirror plus monorepo parity check.

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
python3 services/contracts/check_parity.py --require-upstream
```

Contracts and golden regression data now live under `contracts/` and
`testdata/`, so an isolated backend checkout can validate both without reaching
into the parent monorepo. Fonts and backend deployment assets remain external
boundaries.

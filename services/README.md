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
- `fonts/`: backend-owned default rendering fonts and their redistribution license.
- `docker/`: the self-contained backend application image definition.

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
into the parent monorepo. The bundled font assets and app image are also owned
by this workspace; web delivery and desktop packaging remain product-level
consumers in the parent repository.

## Backend container

Build the backend image with this directory as the complete Docker context:

```bash
docker build -f docker/Dockerfile.app -t retainpdf-app:local .
```

The image contains `rust_api`, `retain-jobsd`, `retainpdf-agent`, the Python
pipeline, and the Python AI service. `rust_api` supervises the AI service inside
the container, so `/api/v1/ai/*` does not require a separately managed process.

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

## Start the backend locally

From the monorepo root, the authoritative launcher prepares the locked Python
environment and Rust binaries, starts `rust_api`, and lets Rust supervise jobsd
and the AI service:

```bash
python3 services/scripts/dev_stack.py --runtime python
```

Startup succeeds only after `http://127.0.0.1:41000/ready` reports that the
database and supervised services are ready. `Ctrl+C` stops the complete process
tree. Use `--no-sync --no-build` for a prepared checkout, or `--prepare-only`
to install/build without starting services.

The FX runtime requires FX `0.0.5` and `RETAIN_AI_FX_GATEWAY_API_KEY` in the
local environment:

```bash
python3 services/scripts/dev_stack.py --runtime fx
```

Credentials are checked as present or missing but are never printed. Inspect
the Agent integration or run the offline real-PDF smoke with:

```bash
python3 services/scripts/agent_e2e.py doctor --probe-live
python3 services/scripts/agent_e2e.py smoke
```

`/health` is a liveness/diagnostic endpoint. `/ready` is the startup gate for
the database and locally supervised backend children. The legacy
`services/api/scripts/dev-remote.sh` entrypoint forwards to the same launcher.

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

## Source archive

Create a provenance-stamped archive containing only the tracked backend tree:

```bash
python3 scripts/build_source_archive.py
```

The command refuses dirty tracked backend state by default, validates the
archive layout, embeds `SOURCE.json` with the Git revision and services tree
hash, and writes a matching `.sha256` sidecar.

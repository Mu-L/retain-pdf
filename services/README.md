# RetainPDF backend workspace

`services/` is the self-contained source and build root for the RetainPDF
backend package. The package boundary is tested from a clean extracted tree;
it does not require or imply a separate Git repository.

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

The launcher uses the full API on `41000`, the internal jobs service on
loopback `41002`, the internal AI service on loopback `41100`, and the
single-route multipart bundle listener on `42000`. Raw Rust configuration
still defaults to in-process jobs and disabled child supervision; the launcher
explicitly selects `remote + supervised` for the complete development stack.

The FX runtime requires FX `0.0.5` and `RETAIN_AI_FX_GATEWAY_API_KEY` in the
local environment:

```bash
python3 services/scripts/dev_stack.py --runtime fx
```

FX 0.0.5 can redirect Gateway traffic only to a local loopback HTTP bridge.
Set `RETAIN_AI_FX_GATEWAY_BASE_URL=http://127.0.0.1:<port>` when using one;
the launcher rejects remote or malformed overrides instead of allowing FX to
silently fall back to its default Gateway.

The document-capable OpenAI-compatible runtime uses the normal model URL,
model, and key while sharing the same durable Rust operation broker:

```bash
RETAIN_AI_LLM_BASE_URL=https://models.example/v1 \
RETAIN_AI_LLM_MODEL=model-name \
RETAIN_AI_LLM_API_KEY=... \
python3 services/scripts/dev_stack.py --runtime openai
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
python3 api/scripts/check_architecture.py
PYTHONPATH=pipeline uv run python pipeline/devtools/check_pipeline_architecture.py
uv run python -m pytest ai/tests pipeline/devtools/tests -q
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
The current container leaves the jobs runtime in its default in-process mode;
the included `retain-jobsd` binary is used only when deployment configuration
explicitly selects remote jobs mode and supervision.

## Durable state ownership

The Rust backend owns durable documents, conversations, credentials, job and
pipeline state, PDF operations, candidates, and commits. `retainpdf-ai`
orchestrates turns and memory preparation but persists conversation messages
and reads operation state through the Rust API. Pipeline workers own artifact
and checkpoint file production; Rust records lifecycle, attempts, units, and
events. Frontends treat Rust projections as authoritative and use AI/SSE events
only as refresh hints.

## Source archive

Create a provenance-stamped archive containing only the tracked backend tree:

```bash
python3 scripts/build_source_archive.py
```

The command refuses dirty tracked backend state by default, validates the
archive layout, embeds `SOURCE.json` with the Git revision and services tree
hash, and writes a matching `.sha256` sidecar.

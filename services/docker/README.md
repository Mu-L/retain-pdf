# Backend container

This directory belongs to the standalone `services` workspace. Build it from
the workspace root so Docker cannot accidentally read monorepo-only files:

```bash
docker build -f docker/Dockerfile.app -t retainpdf-app:local .
```

Run a local smoke instance:

```bash
docker run --rm \
  -p 127.0.0.1:41000:41000 \
  -p 127.0.0.1:42000:42000 \
  -v retainpdf-data:/data \
  retainpdf-app:local
```

Port `41000` serves the full API and health/readiness endpoints. Port `42000`
serves only `POST /api/v1/translate/bundle`. The AI service (`41100`) is
supervised on loopback inside the container and is not published. Jobs execute
in-process unless remote jobs mode is explicitly enabled; a remote jobsd uses
loopback `41002` and should not be exposed publicly.

Runtime credentials and provider secrets must be supplied as environment
variables or mounted configuration. Do not bake them into the image.

The Rust API supervises `retainpdf-ai` by default in this image. The default AI
runtime is the Python retrieval/tool loop. To opt into the experimental fx adapter, also
install or mount the version-pinned `fx` executable and set the corresponding
`RETAIN_AI_FX_*` variables; `retainpdf-agent` is already bundled.

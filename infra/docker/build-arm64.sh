#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
SERVICES_ROOT="$(python3 "${ROOT_DIR}/.github/scripts/resolve_backend_source.py" \
  --repo-root "${ROOT_DIR}" --print-path)"

TAG="${1:-latest}"

echo "=== Build retainpdf-app (ARM64) ==="
docker build \
  -f "${SERVICES_ROOT}/docker/Dockerfile.app" \
  -t "retainpdf-app:${TAG}" \
  "${SERVICES_ROOT}"

echo "=== Build retainpdf-web (ARM64) ==="
docker build \
  -f "${ROOT_DIR}/infra/docker/Dockerfile.web" \
  -t "retainpdf-web:${TAG}" \
  "${ROOT_DIR}"

echo ""
echo "Build done. Start with:"
echo "  cd ${ROOT_DIR}/infra/docker/delivery"
echo "  APP_IMAGE=retainpdf-app:${TAG} WEB_IMAGE=retainpdf-web:${TAG} docker compose up -d"

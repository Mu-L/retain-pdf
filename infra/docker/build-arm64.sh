#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

TAG="${1:-latest}"

echo "=== Build retainpdf-app (ARM64) ==="
docker build \
  -f "${ROOT_DIR}/docker/Dockerfile.app" \
  -t "retainpdf-app:${TAG}" \
  "${ROOT_DIR}"

echo "=== Build retainpdf-web (ARM64) ==="
docker build \
  -f "${ROOT_DIR}/docker/Dockerfile.web" \
  -t "retainpdf-web:${TAG}" \
  "${ROOT_DIR}"

echo ""
echo "Build done. Start with:"
echo "  cd ${ROOT_DIR}/docker/delivery"
echo "  APP_IMAGE=retainpdf-app:${TAG} WEB_IMAGE=retainpdf-web:${TAG} docker compose up -d"

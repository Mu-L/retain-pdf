#!/usr/bin/env bash
set -euo pipefail

# ADR-002 Phase 3 dev 脚本：一键拉起 3 进程，各自可热重载
#   shell(:41000)  ─┬─> jobsd(:41002) ─> workers
#                  └─> ai_service(:41100)
#  改 shell 只重启 shell，jobsd/workers 不受影响

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
RUST_API_ROOT="$ROOT/backend/rust_api"
AI_SERVICE_ROOT="$ROOT/backend/ai_service"
DATA_ROOT="${RUST_API_DATA_ROOT:-$ROOT/data}"
JOBS_PORT="${RUST_API_JOBS_PORT:-41002}"
AI_PORT="${RUST_API_AI_PORT:-41100}"
SHELL_PORT="${RUST_API_PORT:-41000}"

export RUST_API_PROJECT_ROOT="$ROOT"
export RUST_API_ROOT="$RUST_API_ROOT"
export RUST_API_DATA_ROOT="$DATA_ROOT"
export RUST_API_SCRIPTS_DIR="$ROOT/backend/pipeline"
export RUST_API_JOBS_MODE=remote
export RUST_API_JOBS_PORT="$JOBS_PORT"
export RUST_API_JOBS_SUPERVISE=0
export RUST_API_AI_SUPERVISE=0
export RUST_API_PORT="$SHELL_PORT"
export RUST_API_SIMPLE_PORT="${RUST_API_SIMPLE_PORT:-42000}"
export RUST_API_AI_PORT="$AI_PORT"
export PYTHONPATH="$ROOT/backend/pipeline:$AI_SERVICE_ROOT:${PYTHONPATH:-}"
export PYTHONUNBUFFERED=1
# 本地开发默认密钥（若外部已设置则不覆盖）
export RETAIN_API_KEYS="${RETAIN_API_KEYS:-dev-local-key}"
export RETAIN_AI_API_KEYS="${RETAIN_AI_API_KEYS:-${RETAIN_API_KEYS}}"
export RETAIN_AI_RUST_API_KEY="${RETAIN_AI_RUST_API_KEY:-dev-local-key}"
# 供 jobsd/shell 的 manifest 定位（仓库根无 Cargo.toml，workspace 在 backend/rust_api）
export CARGO_MANIFEST_PATH="$RUST_API_ROOT/Cargo.toml"

USE_WATCH=0
if command -v cargo-watch >/dev/null 2>&1 || cargo watch --version >/dev/null 2>&1; then
  USE_WATCH=1
fi

cleanup() {
  echo "[dev-remote] shutting down..."
  jobs -p | xargs -r kill 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "[dev-remote] ROOT=$ROOT"
echo "[dev-remote] shell :$SHELL_PORT  jobsd :$JOBS_PORT  ai :$AI_PORT"
echo "[dev-remote] mode=remote  supervise=0 (dev 各自独立，便于热重载)"

# 1) jobsd
if [ "$USE_WATCH" = 1 ]; then
  echo "[dev-remote] starting jobsd (watch)..."
  cargo watch -q -x "run --manifest-path $CARGO_MANIFEST_PATH -p retain-jobsd" &
else
  echo "[dev-remote] starting jobsd..."
  cargo run --manifest-path "$CARGO_MANIFEST_PATH" -p retain-jobsd &
fi
JOBSD_PID=$!

# 等 jobsd healthz
echo -n "[dev-remote] waiting for jobsd :$JOBS_PORT"
for i in $(seq 1 30); do
  if curl -sf "http://127.0.0.1:$JOBS_PORT/healthz" >/dev/null 2>&1; then
    echo " ok"
    break
  fi
  echo -n "."
  sleep 1
  if [ "$i" = 30 ]; then echo " timeout"; fi
done

# 2) ai_service
if [ -f "$AI_SERVICE_ROOT/retainpdf_ai/__main__.py" ]; then
  echo "[dev-remote] starting ai_service..."
  python3 -m retainpdf_ai &
  AI_PID=$!
  echo -n "[dev-remote] waiting for ai :$AI_PORT"
  for i in $(seq 1 30); do
    if curl -sf "http://127.0.0.1:$AI_PORT/healthz" >/dev/null 2>&1; then
      echo " ok"
      break
    fi
    echo -n "."
    sleep 1
  done
else
  echo "[dev-remote] ai_service not found, skipping"
fi

# 3) shell (rust_api) - 最后起，依赖前两者可选
if [ "$USE_WATCH" = 1 ]; then
  echo "[dev-remote] starting shell (watch)..."
  cargo watch -q -x "run --manifest-path $CARGO_MANIFEST_PATH -p rust_api" &
else
  echo "[dev-remote] starting shell..."
  cargo run --manifest-path "$CARGO_MANIFEST_PATH" -p rust_api &
fi

echo "[dev-remote] all started. Ctrl+C to stop."
echo "[dev-remote] shell http://127.0.0.1:$SHELL_PORT  health http://127.0.0.1:$SHELL_PORT/api/v1/health"

wait

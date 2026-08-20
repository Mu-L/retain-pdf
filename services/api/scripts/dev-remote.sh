#!/usr/bin/env bash
set -euo pipefail

# ADR-002 Phase 3 dev 脚本：一键拉起 3 进程，各自可热重载
#   shell(:41000)  ─┬─> jobsd(:41002) ─> workers
#                  └─> ai_service(:41100)
#  改 shell 只重启 shell，jobsd/workers 不受影响

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
# Monorepo 整理：新路径 services/api + services/pipeline + services/ai（兼容旧 backend/*）
if [ -d "$ROOT/services/api" ]; then RUST_API_ROOT_NEW="$ROOT/services/api"; else RUST_API_ROOT_NEW="$ROOT/backend/rust_api"; fi
if [ -d "$ROOT/services/pipeline" ]; then PIPELINE_ROOT="$ROOT/services/pipeline"; else PIPELINE_ROOT="$ROOT/backend/pipeline"; fi
if [ -d "$ROOT/services/ai" ]; then AI_SERVICE_ROOT_NEW="$ROOT/services/ai"; else AI_SERVICE_ROOT_NEW="$ROOT/backend/ai_service"; fi
RUST_API_ROOT="$RUST_API_ROOT_NEW"
AI_SERVICE_ROOT="$AI_SERVICE_ROOT_NEW"
DATA_ROOT="${RUST_API_DATA_ROOT:-$ROOT/data}"
JOBS_PORT="${RUST_API_JOBS_PORT:-41002}"
AI_PORT="${RUST_API_AI_PORT:-41100}"
SHELL_PORT="${RUST_API_PORT:-41000}"
GOLDEN_SMOKE=0
GOLDEN_FIXTURE=""
for arg in "$@"; do
  case "$arg" in
    --golden-smoke) GOLDEN_SMOKE=1 ;;
    --golden-smoke=*) GOLDEN_SMOKE=1; GOLDEN_FIXTURE="${arg#--golden-smoke=}" ;;
  esac
done

export RUST_API_PROJECT_ROOT="$ROOT"
export RUST_API_ROOT="$RUST_API_ROOT"
export RUST_API_DATA_ROOT="$DATA_ROOT"
export RUST_API_SCRIPTS_DIR="$PIPELINE_ROOT"
export RUST_API_JOBS_MODE=remote
export RUST_API_JOBS_PORT="$JOBS_PORT"
export RUST_API_JOBS_SUPERVISE=0
export RUST_API_AI_SUPERVISE=0
export RUST_API_PORT="$SHELL_PORT"
export RUST_API_SIMPLE_PORT="${RUST_API_SIMPLE_PORT:-42000}"
export RUST_API_AI_PORT="$AI_PORT"
export PYTHONPATH="$PIPELINE_ROOT:$AI_SERVICE_ROOT:${PYTHONPATH:-}"
export PYTHONUNBUFFERED=1
# 本地开发默认密钥（若外部已设置则不覆盖）
export RETAIN_API_KEYS="${RETAIN_API_KEYS:-dev-local-key}"
export RETAIN_AI_API_KEYS="${RETAIN_AI_API_KEYS:-${RETAIN_API_KEYS}}"
export RETAIN_AI_RUST_API_KEY="${RETAIN_AI_RUST_API_KEY:-dev-local-key}"
# 供 jobsd/shell 的 manifest 定位（workspace 在 services/api）
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
if [ "$GOLDEN_SMOKE" = 1 ]; then
  FIXTURE="${GOLDEN_FIXTURE:-$ROOT/resources/fixtures/golden-jobs/chem-6ada81-10p}"
  echo "[dev-remote] --golden-smoke: running offline harness against $FIXTURE"
  if python3 "$PIPELINE_ROOT/devtools/golden_harness.py" --fixture "$FIXTURE" 2>&1; then
    echo "[dev-remote] golden-smoke (structural) ok"
  else
    echo "[dev-remote] golden-smoke (structural) FAILED — see above"
  fi
  # 有凭证且本地有 source 时可加 --render 做全量渲染冒烟
  if [ -n "${RETAIN_PADDLE_API_TOKEN:-}" ] || [ -n "${RETAIN_TRANSLATION_API_KEY:-}" ]; then
    echo "[dev-remote] credentials detected — also running --render smoke (needs source PDF)"
    python3 "$PIPELINE_ROOT/devtools/golden_harness.py" --fixture "$FIXTURE" --render 2>&1 || echo "[dev-remote] golden-smoke --render failed (check typst/source)"
  else
    echo "[dev-remote] no provider credentials — skip --render (structural already ok)"
  fi
fi

wait

#!/usr/bin/env python3
"""Run the real FX -> Agent CLI -> Rust API -> PDF operation acceptance flow."""

from __future__ import annotations

import argparse
from dataclasses import dataclass
import getpass
import hashlib
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import signal
import socket
import subprocess
import sys
import tempfile
import time
from typing import Any, Mapping, Sequence
from urllib.error import HTTPError, URLError
from urllib.request import build_opener, ProxyHandler, Request


SCRIPT_DIR = Path(__file__).resolve().parent
SERVICES_ROOT = SCRIPT_DIR.parent
PRODUCT_ROOT = SERVICES_ROOT.parent
DEV_STACK = SCRIPT_DIR / "dev_stack.py"
DEFAULT_FIXTURE = (
    SERVICES_ROOT
    / "api"
    / "crates"
    / "retain-data"
    / "src"
    / "ocr_provider"
    / "paddle"
    / "paddle_ocr_json_split.pdf"
)
SCHEMA = "retainpdf_agent_live_e2e_v1"
EXPECTED_RUNTIME = "vercel-fx-acp-v1"
MAX_HTTP_BYTES = 4 * 1024 * 1024
MAX_DIAGNOSTIC_CHARS = 8_000
SENSITIVE_NAME_PARTS = ("KEY", "TOKEN", "SECRET", "PASSWORD", "CREDENTIAL")
LOCAL_HTTP = build_opener(ProxyHandler({}))

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
from dev_stack import terminate_process_group  # noqa: E402


class LiveE2EError(RuntimeError):
    """A bounded user-facing acceptance failure."""


@dataclass(frozen=True)
class Options:
    fixture: Path
    data_root: Path | None
    keep_data: bool
    prompt_gateway_key: bool
    sync: bool
    build: bool
    startup_timeout: float
    turn_timeout: float


@dataclass(frozen=True)
class StackHandle:
    process: subprocess.Popen[bytes]
    log_file: Any
    log_path: Path
    ports: tuple[int, int, int, int]
    api_key: str

    @property
    def api_url(self) -> str:
        return f"http://127.0.0.1:{self.ports[0]}"


def parse_args(argv: Sequence[str] | None = None) -> Options:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fixture", type=Path, default=DEFAULT_FIXTURE)
    parser.add_argument("--data-root", type=Path)
    parser.add_argument("--keep-data", action="store_true")
    parser.add_argument(
        "--prompt-gateway-key",
        action="store_true",
        help="read the Gateway key from a hidden terminal prompt when the env is empty",
    )
    parser.add_argument("--no-sync", action="store_true")
    parser.add_argument("--no-build", action="store_true")
    parser.add_argument("--startup-timeout", type=float, default=120.0)
    parser.add_argument("--turn-timeout", type=float, default=180.0)
    args = parser.parse_args(argv)
    if args.startup_timeout <= 0 or args.turn_timeout <= 0:
        parser.error("timeouts must be positive")
    fixture = args.fixture.expanduser().resolve()
    data_root = args.data_root.expanduser().resolve() if args.data_root else None
    return Options(
        fixture=fixture,
        data_root=data_root,
        keep_data=args.keep_data,
        prompt_gateway_key=args.prompt_gateway_key,
        sync=not args.no_sync,
        build=not args.no_build,
        startup_timeout=args.startup_timeout,
        turn_timeout=args.turn_timeout,
    )


def _gateway_key(options: Options, environ: Mapping[str, str]) -> str:
    key = environ.get("RETAIN_AI_FX_GATEWAY_API_KEY", "").strip()
    if not key and options.prompt_gateway_key:
        key = getpass.getpass("Vercel AI Gateway API key: ").strip()
    if not key:
        raise LiveE2EError(
            "RETAIN_AI_FX_GATEWAY_API_KEY is missing; use a hidden local env or "
            "--prompt-gateway-key"
        )
    return key


def _prepare_data_root(options: Options) -> tuple[Path, bool]:
    if options.data_root is None:
        root = Path(tempfile.mkdtemp(prefix="retainpdf-agent-live-"))
        root.chmod(0o700)
        return root, True
    root = options.data_root
    if root.exists() and (not root.is_dir() or any(root.iterdir())):
        raise LiveE2EError("--data-root must be absent or an empty directory")
    root.mkdir(parents=True, exist_ok=True, mode=0o700)
    root.chmod(0o700)
    return root, False


def _reserve_ports(count: int = 4) -> tuple[int, ...]:
    sockets: list[socket.socket] = []
    try:
        for _ in range(count):
            holder = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            holder.bind(("127.0.0.1", 0))
            sockets.append(holder)
        return tuple(int(holder.getsockname()[1]) for holder in sockets)
    finally:
        for holder in sockets:
            holder.close()


def _start_stack(
    options: Options,
    data_root: Path,
    gateway_key: str,
    environ: Mapping[str, str],
) -> StackHandle:
    ports = _reserve_ports()
    api_key = f"live-{secrets.token_urlsafe(24)}"
    command = [
        sys.executable,
        str(DEV_STACK),
        "--runtime",
        "fx",
        "--port",
        str(ports[0]),
        "--jobs-port",
        str(ports[1]),
        "--ai-port",
        str(ports[2]),
        "--simple-port",
        str(ports[3]),
        "--data-root",
        str(data_root),
        "--readiness-timeout",
        str(options.startup_timeout),
    ]
    if not options.sync:
        command.append("--no-sync")
    if not options.build:
        command.append("--no-build")
    env = dict(environ)
    env.update(
        {
            "RETAIN_AI_FX_GATEWAY_API_KEY": gateway_key,
            "RETAIN_AI_FX_TURN_TIMEOUT_SECS": str(options.turn_timeout),
            "RUST_API_KEYS": api_key,
        }
    )
    log_path = data_root / "live-e2e-stack.log"
    descriptor = os.open(log_path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    log_file = os.fdopen(descriptor, "wb", buffering=0)
    try:
        process = subprocess.Popen(
            command,
            cwd=PRODUCT_ROOT,
            env=env,
            stdin=subprocess.DEVNULL,
            stdout=log_file,
            stderr=subprocess.STDOUT,
            start_new_session=True,
        )
    except Exception:
        log_file.close()
        raise
    return StackHandle(process, log_file, log_path, ports, api_key)


def _read_response(response: Any) -> dict[str, Any]:
    raw = response.read(MAX_HTTP_BYTES + 1)
    if len(raw) > MAX_HTTP_BYTES:
        raise LiveE2EError("backend response exceeded the live E2E limit")
    try:
        payload = json.loads(raw)
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise LiveE2EError("backend returned a non-JSON response") from exc
    if not isinstance(payload, dict):
        raise LiveE2EError("backend returned an invalid JSON envelope")
    return payload


def _request_json(
    method: str,
    url: str,
    api_key: str,
    *,
    payload: dict[str, Any] | None = None,
    body: bytes | None = None,
    content_type: str = "application/json",
    timeout: float = 30.0,
) -> dict[str, Any]:
    encoded = body
    if payload is not None:
        encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode()
    headers = {"Accept": "application/json", "X-API-Key": api_key}
    if encoded is not None:
        headers["Content-Type"] = content_type
    request = Request(url, data=encoded, headers=headers, method=method)
    try:
        with LOCAL_HTTP.open(request, timeout=timeout) as response:
            result = _read_response(response)
    except HTTPError as error:
        try:
            detail = _read_response(error)
            message = str(detail.get("message") or "request rejected")[:1000]
        except LiveE2EError:
            message = "request rejected"
        raise LiveE2EError(f"backend HTTP {error.code}: {message}") from error
    except (URLError, TimeoutError, OSError) as error:
        raise LiveE2EError(f"backend request failed: {type(error).__name__}") from error
    if result.get("code") != 0:
        raise LiveE2EError("backend returned a failed API envelope")
    return result


def _wait_ready(stack: StackHandle, timeout: float) -> None:
    deadline = time.monotonic() + timeout
    url = f"{stack.api_url}/ready"
    while time.monotonic() < deadline:
        status = stack.process.poll()
        if status is not None:
            raise LiveE2EError(f"backend stack exited before readiness (status {status})")
        try:
            result = _request_json("GET", url, stack.api_key, timeout=1.0)
            if (result.get("data") or {}).get("status") == "ready":
                return
        except LiveE2EError:
            pass
        time.sleep(0.25)
    raise LiveE2EError(f"backend readiness timed out after {timeout:g}s")


def _multipart_pdf(path: Path) -> tuple[bytes, str]:
    if not path.is_file() or path.suffix.lower() != ".pdf":
        raise LiveE2EError("fixture must be a readable PDF file")
    boundary = f"retainpdf-live-{secrets.token_hex(16)}"
    prefix = (
        f"--{boundary}\r\n"
        'Content-Disposition: form-data; name="file"; '
        'filename="retainpdf-live-fixture.pdf"\r\n'
        "Content-Type: application/pdf\r\n\r\n"
    ).encode()
    suffix = f"\r\n--{boundary}--\r\n".encode()
    return prefix + path.read_bytes() + suffix, f"multipart/form-data; boundary={boundary}"


def _operation_id(data_root: Path) -> str:
    operations = data_root / "operations"
    candidates = (
        sorted(
            path.name
            for path in operations.iterdir()
            if path.is_dir() and path.name.startswith("op-")
        )
        if operations.is_dir()
        else []
    )
    if len(candidates) != 1:
        raise LiveE2EError(
            f"expected exactly one durable document operation, found {len(candidates)}"
        )
    return candidates[0]


def _verify_candidate(
    data_root: Path,
    operation: dict[str, Any],
) -> dict[str, Any]:
    if operation.get("status") != "committed":
        raise LiveE2EError(
            f"document operation ended in {operation.get('status') or 'unknown'} instead of committed"
        )
    candidate = operation.get("candidate_version")
    if not isinstance(candidate, dict) or candidate.get("status") != "committed":
        raise LiveE2EError("committed operation has no committed candidate version")
    artifact_key = str(candidate.get("artifact_key") or "")
    candidate_path = (data_root / artifact_key).resolve()
    if not artifact_key or not candidate_path.is_relative_to(data_root.resolve()):
        raise LiveE2EError("candidate artifact escaped the isolated data root")
    if not candidate_path.is_file():
        raise LiveE2EError("candidate PDF is missing")
    python = SERVICES_ROOT / ".venv" / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if not python.is_file():
        raise LiveE2EError("backend Python environment is missing")
    script = (
        "import json,pikepdf,sys;"
        "pdf=pikepdf.open(sys.argv[1]);"
        "print(json.dumps({'pages':len(pdf.pages),'rotations':[int(p.get('/Rotate',0))%360 for p in pdf.pages]}))"
    )
    completed = subprocess.run(
        [str(python), "-c", script, str(candidate_path)],
        cwd=PRODUCT_ROOT,
        check=False,
        capture_output=True,
        text=True,
        timeout=30,
    )
    try:
        details = json.loads(completed.stdout)
    except json.JSONDecodeError as exc:
        raise LiveE2EError("candidate PDF verifier returned invalid output") from exc
    if completed.returncode != 0 or details != {"pages": 2, "rotations": [0, 90]}:
        raise LiveE2EError("candidate PDF did not match the requested page program")
    return {
        "artifact_key": artifact_key,
        "content_sha256": str(candidate.get("content_sha256") or ""),
        **details,
    }


def _exercise(stack: StackHandle, options: Options, data_root: Path) -> dict[str, Any]:
    fixture_bytes = options.fixture.read_bytes()
    document_id = hashlib.sha256(fixture_bytes).hexdigest()
    multipart, content_type = _multipart_pdf(options.fixture)
    _request_json(
        "POST",
        f"{stack.api_url}/api/v1/uploads",
        stack.api_key,
        body=multipart,
        content_type=content_type,
        timeout=30,
    )
    conversation = _request_json(
        "POST",
        f"{stack.api_url}/api/v1/ai/conversations",
        stack.api_key,
        payload={"title": "FX live PDF acceptance", "document_id": document_id},
    )
    conversation_id = str((conversation.get("data") or {}).get("conversation_id") or "")
    if not conversation_id:
        raise LiveE2EError("conversation creation returned no id")
    answer = _request_json(
        "POST",
        f"{stack.api_url}/api/v1/ai/ask",
        stack.api_key,
        payload={
            "question": (
                "Use retainpdf-agent to duplicate page 1, rotate the second copy by 90 "
                "degrees, run the operation, wait until it is result_ready, and commit it. "
                "This exact document operation is explicitly confirmed. Do not only explain."
            ),
            "document_id": document_id,
            "conversation_id": conversation_id,
            "confirm_document_operation": True,
            "stream": False,
        },
        timeout=options.turn_timeout + 30,
    )
    answer_data = answer.get("data") or {}
    if answer_data.get("agent_runtime") != EXPECTED_RUNTIME:
        raise LiveE2EError("AI response did not come from the pinned FX runtime")
    operation_id = _operation_id(data_root)
    operation = _request_json(
        "GET",
        f"{stack.api_url}/api/v1/internal/agent/operations/{operation_id}",
        stack.api_key,
    )
    operation_data = operation.get("data") or {}
    candidate = _verify_candidate(data_root, operation_data)
    return {
        "schema": SCHEMA,
        "ok": True,
        "runtime": EXPECTED_RUNTIME,
        "document_id": document_id,
        "conversation_id": conversation_id,
        "operation_id": operation_id,
        "operation_status": operation_data.get("status"),
        "candidate": candidate,
        "tool_events": len(answer_data.get("tool_trace") or []),
    }


def _stop_stack(stack: StackHandle) -> None:
    try:
        if stack.process.poll() is None:
            stack.process.send_signal(signal.SIGINT)
            try:
                stack.process.wait(timeout=20)
            except subprocess.TimeoutExpired:
                terminate_process_group(stack.process, timeout=5)
    finally:
        stack.log_file.close()


def _diagnostic_tail(path: Path, secrets_to_redact: Sequence[str]) -> str:
    try:
        text = path.read_text(encoding="utf-8", errors="replace")[-MAX_DIAGNOSTIC_CHARS:]
    except OSError:
        return ""
    for value in sorted((item for item in secrets_to_redact if item), key=len, reverse=True):
        text = text.replace(value, "[REDACTED]")
    return re.sub(
        r"(?i)((?:api[_-]?key|token|secret|password)\s*[=:]\s*)\S+",
        r"\1[REDACTED]",
        text,
    ).strip()


def _sensitive_environment_values(environ: Mapping[str, str]) -> tuple[str, ...]:
    return tuple(
        value
        for name, value in environ.items()
        if value
        and len(value) >= 4
        and any(part in name.upper() for part in SENSITIVE_NAME_PARTS)
    )


def run(options: Options, environ: Mapping[str, str] | None = None) -> int:
    source_env = dict(os.environ if environ is None else environ)
    gateway_key = _gateway_key(options, source_env)
    data_root, owns_data_root = _prepare_data_root(options)
    stack: StackHandle | None = None
    succeeded = False
    try:
        stack = _start_stack(options, data_root, gateway_key, source_env)
        _wait_ready(stack, options.startup_timeout)
        result = _exercise(stack, options, data_root)
        print(json.dumps(result, ensure_ascii=False, sort_keys=True))
        succeeded = True
        return 0
    except LiveE2EError as error:
        print(f"[agent-live-e2e] failed: {error}", file=sys.stderr)
        if stack is not None:
            diagnostic = _diagnostic_tail(
                stack.log_path,
                (
                    gateway_key,
                    stack.api_key,
                    *_sensitive_environment_values(source_env),
                ),
            )
            if diagnostic:
                print(diagnostic, file=sys.stderr)
        print(f"[agent-live-e2e] preserved state: {data_root}", file=sys.stderr)
        return 1
    finally:
        if stack is not None:
            _stop_stack(stack)
        if succeeded and owns_data_root and not options.keep_data:
            shutil.rmtree(data_root)
        elif succeeded:
            print(f"[agent-live-e2e] state: {data_root}", file=sys.stderr)


def main(argv: Sequence[str] | None = None) -> int:
    try:
        options = parse_args(argv)
        return run(options)
    except LiveE2EError as error:
        print(f"[agent-live-e2e] failed: {error}", file=sys.stderr)
        return 1
    except Exception as error:  # noqa: BLE001 - keep credentials out of tracebacks
        print(
            f"[agent-live-e2e] failed unexpectedly: {type(error).__name__}",
            file=sys.stderr,
        )
        return 1


if __name__ == "__main__":
    raise SystemExit(main())

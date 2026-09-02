"""Host-owned command broker for document-capable Agent runtimes.

fx can execute only the generated ``retainpdf-agent`` wrapper. OpenAI-compatible
function-calling runtimes invoke the same exact argv grammar directly through
the host. Neither path receives a Rust credential: this module mints a
single-action capability and runs the real CLI in a separate host-owned
subprocess.
"""

from __future__ import annotations

import base64
import binascii
import hashlib
import json
import os
import re
import secrets
import shlex
import shutil
import socket
import stat
import subprocess
import sys
import threading
from collections import Counter
from collections.abc import Callable
from dataclasses import dataclass
from pathlib import Path
from types import TracebackType
from typing import Any, Protocol, Self

_MAX_COMMAND_CHARS = 16384
_MAX_BROKER_FRAME_BYTES = 1024 * 1024
_MAX_CALLS_PER_TURN = 16
_CLI_TIMEOUT_SECONDS = 30
_SAFE_OPERATION_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$")
_SHA256 = re.compile(r"^[0-9a-fA-F]{64}$")
_CANCEL_REASONS = {"agent_abort", "superseded", "user_cancelled"}
_BASE64URL = re.compile(r"^[A-Za-z0-9_-]+$")
_OPERATION_STATUSES = {
    "draft",
    "awaiting_confirmation",
    "queued",
    "running",
    "validating",
    "result_ready",
    "committed",
    "failed",
    "cancelled",
    "ambiguous",
}


class CapabilityIssuer(Protocol):
    def issue_agent_capability(
        self,
        *,
        conversation_id: str,
        document_id: str,
        actions: list[str],
        ttl_seconds: int,
    ) -> dict[str, Any]: ...


@dataclass(frozen=True)
class BrokerScope:
    conversation_id: str
    document_id: str
    request_message_id: str
    intent_summary: str
    confirmed: bool = False
    green_light: bool = False

    @property
    def effects_allowed(self) -> bool:
        return self.confirmed or self.green_light


@dataclass(frozen=True)
class BrokerCommand:
    public_argv: tuple[str, ...]
    action: str
    cli_argv: tuple[str, ...]
    request_payload: dict[str, Any] | None = None


class FxCommandBroker:
    def __init__(
        self,
        *,
        state_root: Path,
        cli_command: str,
        rust_api_url: str,
        rust: CapabilityIssuer,
        scope: BrokerScope,
        on_operation_event: Callable[[dict[str, Any]], None] | None = None,
    ) -> None:
        self._state_root = state_root.resolve()
        self._cli_command = cli_command
        self._rust_api_url = rust_api_url.rstrip("/")
        self._rust = rust
        self._scope = scope
        self._on_operation_event = on_operation_event
        self._turn_id = secrets.token_urlsafe(18)
        self._root = self._state_root / "brokers" / self._turn_id
        self._bin_dir = self._root / "bin"
        self._work_dir = self._root / "work"
        self._request_dir = self._work_dir / "requests"
        # Darwin's sockaddr_un path is very short. Keep only the socket in a
        # random owner-only /tmp directory; all durable-ish turn files remain
        # under state_root and both locations are removed on close.
        self._socket_dir = Path("/tmp") / f"rpdf-fx-{self._turn_id[:16]}"
        self._socket_path = self._socket_dir / "broker.sock"
        self._broker_key = secrets.token_urlsafe(32)
        self._approved: Counter[tuple[str, ...]] = Counter()
        self._approved_lock = threading.Lock()
        self._stop = threading.Event()
        self._listener: socket.socket | None = None
        self._thread: threading.Thread | None = None
        self._call_count = 0

    @property
    def bin_dir(self) -> Path:
        return self._bin_dir

    @property
    def instructions(self) -> str:
        if self._scope.green_light:
            confirmation = (
                "RetainPDF green-light mode is enabled. You may run and commit operations "
                "needed by the current user request without asking for manual confirmation. "
                "This does not permit any command outside the listed grammar."
            )
        elif self._scope.confirmed:
            confirmation = "The host supplied explicit run/commit confirmation for this turn."
        else:
            confirmation = (
                "The host did not confirm run/commit; those commands will be rejected. "
                "Tell the user to use the operation card action. Never claim that typing an "
                "exact phrase in chat will grant confirmation."
            )
        return (
            "The only host tool is retainpdf-agent. Supported commands are exactly:\n"
            "retainpdf-agent document inspect\n"
            "retainpdf-agent operation create --program-json '<compact-json>'\n"
            "retainpdf-agent operation get --operation-id <id>\n"
            "retainpdf-agent operation run --operation-id <id>\n"
            "retainpdf-agent operation run --operation-id <id> --retry failed\n"
            "retainpdf-agent operation run --operation-id <id> --retry ambiguous "
            "--accept-duplicate-risk yes\n"
            "retainpdf-agent operation commit --operation-id <id>\n"
            "retainpdf-agent operation cancel --operation-id <id> "
            "--reason-code <agent_abort|superseded|user_cancelled>\n"
            "The compact program JSON is exactly "
            '{"schema":"retainpdf_page_program_v1","steps":[...]}. '
            "Steps are applied in order and use 1-based current-page numbers. "
            'Allowed steps are {"op":"select_pages","pages":[...]}, which '
            "can delete/reorder/duplicate pages, and "
            '{"op":"rotate_pages","pages":[...],"degrees":90|180|270}. '
            "Do not use shell syntax, paths, redirection, substitutions, or other commands. "
            "The host injects document scope, message identity, idempotency keys, and credentials. "
            f"{confirmation}"
        )

    def __enter__(self) -> Self:
        if os.name != "posix":
            raise RuntimeError("fx command broker requires a Unix-domain socket")
        for path in (
            self._state_root,
            self._root,
            self._bin_dir,
            self._work_dir,
            self._request_dir,
            self._socket_dir,
        ):
            path.mkdir(parents=True, exist_ok=True, mode=0o700)
            if path.is_symlink() or not path.is_dir():
                raise RuntimeError("fx broker directory is unsafe")
            path.chmod(0o700)
        self._write_wrapper()
        listener = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        listener.bind(str(self._socket_path))
        self._socket_path.chmod(0o600)
        listener.listen(4)
        listener.settimeout(0.2)
        self._listener = listener
        self._thread = threading.Thread(target=self._serve, daemon=True)
        self._thread.start()
        return self

    def __exit__(
        self,
        _type: type[BaseException] | None,
        _value: BaseException | None,
        _traceback: TracebackType | None,
    ) -> None:
        self.close()

    def close(self) -> None:
        self._stop.set()
        if self._listener is not None:
            self._listener.close()
        if self._thread is not None:
            self._thread.join(timeout=1)
        shutil.rmtree(self._root, ignore_errors=True)
        shutil.rmtree(self._socket_dir, ignore_errors=True)

    def approve_permission(self, params: dict[str, Any]) -> bool:
        options = params.get("options")
        if not isinstance(options, list) or not any(
            isinstance(option, dict)
            and (
                str(option.get("optionId") or "") in {"allow_once", "allow-once"}
                or str(option.get("kind") or "") in {"allow_once", "allow-once"}
            )
            for option in options
        ):
            return False
        tool_call = params.get("toolCall")
        if not isinstance(tool_call, dict) or tool_call.get("kind") != "execute":
            return False
        raw_input = tool_call.get("rawInput")
        if not isinstance(raw_input, dict):
            return False
        raw_command = raw_input.get("command")
        if not isinstance(raw_command, str):
            return False
        try:
            command = parse_broker_command(raw_command, self._scope)
        except ValueError:
            return False
        with self._approved_lock:
            if sum(self._approved.values()) >= _MAX_CALLS_PER_TURN:
                return False
            self._approved[command.public_argv] += 1
        return True

    def execute_host_argv(self, argv: tuple[str, ...]) -> dict[str, Any]:
        """Execute one structured model tool call through the shared broker.

        Unlike the fx ACP path this method does not consume an ACP permission
        ticket: the host already parsed a named function call into an argv
        tuple.  It still passes through the same exact grammar, confirmation
        checks, per-turn call limit, capability minting, subprocess isolation,
        output bounding, redaction, and operation-event projection.
        """
        command = parse_broker_argv(argv, self._scope)
        with self._approved_lock:
            if self._call_count >= _MAX_CALLS_PER_TURN:
                return _failure("broker call limit reached")
            self._call_count += 1
        return self._execute(command)

    def _serve(self) -> None:
        listener = self._listener
        if listener is None:
            return
        while not self._stop.is_set():
            try:
                connection, _ = listener.accept()
            except TimeoutError:
                continue
            except OSError:
                return
            with connection:
                response = self._handle_connection(connection)
                encoded = json.dumps(
                    response, ensure_ascii=False, separators=(",", ":")
                ).encode("utf-8")
                if len(encoded) > _MAX_BROKER_FRAME_BYTES:
                    encoded = b'{"exit_code":1,"stdout":"","stderr":"broker response exceeded limit"}'
                try:
                    connection.sendall(encoded + b"\n")
                except OSError:
                    pass

    def _handle_connection(self, connection: socket.socket) -> dict[str, Any]:
        try:
            payload = _recv_json_line(connection)
            if payload.get("broker_key") != self._broker_key:
                return _failure("broker authentication failed")
            argv = payload.get("argv")
            if not isinstance(argv, list) or not all(
                isinstance(item, str) for item in argv
            ):
                return _failure("invalid broker argv")
            public_argv = ("retainpdf-agent", *argv)
            command = parse_broker_argv(public_argv, self._scope)
            with self._approved_lock:
                if self._approved[command.public_argv] <= 0:
                    return _failure("command was not approved")
                self._approved[command.public_argv] -= 1
            if self._call_count >= _MAX_CALLS_PER_TURN:
                return _failure("broker call limit reached")
            self._call_count += 1
            return self._execute(command)
        except (OSError, TypeError, ValueError, json.JSONDecodeError):
            return _failure("invalid broker request")
        except Exception:  # noqa: BLE001 - never expose host diagnostics to fx
            return _failure("host command execution failed")

    def _execute(self, command: BrokerCommand) -> dict[str, Any]:
        issued = self._rust.issue_agent_capability(
            conversation_id=self._scope.conversation_id,
            document_id=self._scope.document_id,
            actions=[command.action],
            ttl_seconds=60,
        )
        capability = str(issued.get("capability") or "")
        if not capability:
            return _failure("host did not issue a capability")
        cli_path = _resolve_cli(self._cli_command)
        argv = [str(cli_path), *command.cli_argv]
        if command.request_payload is not None:
            request_name = f"request-{self._call_count:02d}.json"
            request_path = self._request_dir / request_name
            _write_json_no_follow(request_path, command.request_payload)
            argv.extend(["--request", f"requests/{request_name}"])
        env = {
            "HOME": str(self._root),
            "PATH": os.defpath,
            "RETAINPDF_AGENT_API_URL": self._rust_api_url,
            "RETAINPDF_AGENT_CAPABILITY": capability,
        }
        try:
            completed = subprocess.run(
                argv,
                cwd=self._work_dir,
                env=env,
                stdin=subprocess.DEVNULL,
                capture_output=True,
                timeout=_CLI_TIMEOUT_SECONDS,
                check=False,
            )
        except subprocess.TimeoutExpired:
            return _failure("retainpdf-agent timed out")
        stdout = completed.stdout[:_MAX_BROKER_FRAME_BYTES].decode(
            "utf-8", errors="replace"
        )
        stderr = completed.stderr[:_MAX_BROKER_FRAME_BYTES].decode(
            "utf-8", errors="replace"
        )
        stdout = stdout.replace(capability, "[REDACTED]")
        stderr = stderr.replace(capability, "[REDACTED]")
        if completed.returncode == 0 and self._on_operation_event is not None:
            event = _safe_operation_event(command, stdout, self._scope)
            if event is not None:
                try:
                    self._on_operation_event(event)
                except Exception:  # noqa: BLE001, S110 - discovery must not fail the command
                    pass
        return {
            "exit_code": int(completed.returncode),
            "stdout": stdout,
            "stderr": stderr,
        }

    def _write_wrapper(self) -> None:
        wrapper = self._bin_dir / "retainpdf-agent"
        if wrapper.exists() or wrapper.is_symlink():
            raise RuntimeError("fx broker wrapper already exists")
        source = _wrapper_source(str(self._socket_path), self._broker_key)
        descriptor = os.open(wrapper, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o700)
        try:
            os.write(descriptor, source.encode("utf-8"))
            os.fsync(descriptor)
        finally:
            os.close(descriptor)
        wrapper.chmod(stat.S_IRUSR | stat.S_IWUSR | stat.S_IXUSR)


def _safe_operation_event(
    command: BrokerCommand,
    stdout: str,
    scope: BrokerScope,
) -> dict[str, Any] | None:
    """Project a successful CLI response into the public SSE discovery shape."""
    if not command.action.startswith("operation.") or len(stdout) > _MAX_BROKER_FRAME_BYTES:
        return None
    try:
        envelope = json.loads(stdout)
    except (TypeError, json.JSONDecodeError):
        return None
    if not isinstance(envelope, dict) or envelope.get("ok") is not True:
        return None
    response = envelope.get("response")
    if not isinstance(response, dict):
        return None
    view = response.get("data", response)
    if not isinstance(view, dict):
        return None
    operation_id = str(view.get("operation_id") or "").strip()
    status = str(view.get("status") or "").strip()
    if not _SAFE_OPERATION_ID.fullmatch(operation_id) or status not in _OPERATION_STATUSES:
        return None
    try:
        attempt = int(view.get("current_attempt") or 0)
    except (TypeError, ValueError):
        return None
    if attempt < 1:
        return None
    events = view.get("events")
    latest_event_seq = 0
    if isinstance(events, list):
        for item in events:
            if not isinstance(item, dict):
                continue
            try:
                latest_event_seq = max(latest_event_seq, int(item.get("seq") or 0))
            except (TypeError, ValueError):
                continue
    return {
        "type": "agent_operation",
        "event_id": f"{operation_id}:{attempt}:{latest_event_seq}:{status}",
        "operation_id": operation_id,
        "conversation_id": str(view.get("conversation_id") or scope.conversation_id).strip(),
        "request_message_id": str(
            view.get("request_message_id") or scope.request_message_id
        ).strip(),
        "status": status,
        "current_attempt": attempt,
        "latest_event_seq": latest_event_seq,
    }

def parse_broker_command(raw_command: str, scope: BrokerScope) -> BrokerCommand:
    if (
        not raw_command
        or len(raw_command) > _MAX_COMMAND_CHARS
        or any(character in raw_command for character in "\r\n\0")
    ):
        raise ValueError("invalid command")
    try:
        argv = tuple(shlex.split(raw_command, posix=True))
    except ValueError as exc:
        raise ValueError("invalid command quoting") from exc
    return parse_broker_argv(argv, scope)


def parse_broker_argv(argv: tuple[str, ...], scope: BrokerScope) -> BrokerCommand:
    if not argv or argv[0] != "retainpdf-agent":
        raise ValueError("unsupported executable")
    if argv == ("retainpdf-agent", "document", "inspect"):
        return BrokerCommand(
            public_argv=argv,
            action="document.inspect",
            cli_argv=("document", "inspect", "--document-id", scope.document_id),
        )
    if len(argv) >= 3 and argv[1:3] == ("operation", "create"):
        if len(argv[3:]) != 2 or argv[3] not in {
            "--program-json",
            "--program-base64url",
            "--program-sha256",
        }:
            raise ValueError("invalid create flags")
        if not scope.request_message_id:
            raise ValueError("invalid create scope")
        program: dict[str, Any] | None = None
        if argv[3] == "--program-json":
            program, canonical = _parse_page_program_json(argv[4])
            program_sha256 = hashlib.sha256(canonical).hexdigest()
        elif argv[3] == "--program-base64url":
            program, canonical = _decode_page_program(argv[4])
            program_sha256 = hashlib.sha256(canonical).hexdigest()
        else:
            # Compatibility for control-plane preview callers. fx is prompted
            # only with --program-base64url for real execution.
            program_sha256 = argv[4]
            if not _SHA256.fullmatch(program_sha256):
                raise ValueError("invalid program hash")
        payload: dict[str, Any] = {
            "schema": "document_operation_create_v1",
            "idempotency_key": _idempotency_key(scope, "create"),
            "conversation_id": scope.conversation_id,
            "request_message_id": scope.request_message_id,
            "document_id": scope.document_id,
            "intent_summary": scope.intent_summary.strip()[:4000]
            or "Document operation",
            "program_sha256": program_sha256.lower(),
        }
        if program is not None:
            payload["program"] = program
        return BrokerCommand(
            public_argv=argv,
            action="operation.create",
            cli_argv=("operation", "create"),
            request_payload=payload,
        )
    if len(argv) < 3 or argv[1] != "operation":
        raise ValueError("unsupported command")
    action = argv[2]
    if action == "get":
        flags = _parse_flags(argv[3:], {"--operation-id"})
        operation_id = _operation_id(flags)
        return BrokerCommand(
            argv, "operation.get", ("operation", "get", "--operation-id", operation_id)
        )
    if action in {"run", "commit"}:
        if not scope.effects_allowed:
            raise ValueError("explicit confirmation is required")
        retry = False
        accept_duplicate_risk = False
        if action == "run" and "--retry" in argv[3:]:
            retry_value = (
                argv[argv.index("--retry") + 1]
                if argv.index("--retry") + 1 < len(argv)
                else ""
            )
            allowed = {"--operation-id", "--retry"}
            if retry_value == "ambiguous":
                allowed.add("--accept-duplicate-risk")
            flags = _parse_flags(argv[3:], allowed)
            if flags["--retry"] not in {"failed", "ambiguous"}:
                raise ValueError("invalid retry source status")
            retry = True
            if flags["--retry"] == "ambiguous":
                if flags["--accept-duplicate-risk"] != "yes":
                    raise ValueError("ambiguous retry risk was not accepted")
                accept_duplicate_risk = True
        else:
            flags = _parse_flags(argv[3:], {"--operation-id"})
        operation_id = _operation_id(flags)
        payload: dict[str, Any] = {
            "schema": f"document_operation_{action}_v1",
            "idempotency_key": _idempotency_key(scope, action, operation_id),
        }
        if action == "run":
            payload["confirmed"] = True
            if retry:
                payload["retry"] = True
                payload["accept_duplicate_risk"] = accept_duplicate_risk
        return BrokerCommand(
            argv,
            f"operation.{action}",
            ("operation", action, "--operation-id", operation_id),
            payload,
        )
    if action == "cancel":
        flags = _parse_flags(argv[3:], {"--operation-id", "--reason-code"})
        operation_id = _operation_id(flags)
        reason = flags["--reason-code"]
        if reason not in _CANCEL_REASONS:
            raise ValueError("invalid cancel reason")
        return BrokerCommand(
            argv,
            "operation.cancel",
            ("operation", "cancel", "--operation-id", operation_id),
            {
                "schema": "document_operation_cancel_v1",
                "idempotency_key": _idempotency_key(scope, "cancel", operation_id),
                "reason": reason,
            },
        )
    raise ValueError("unsupported operation action")


def _parse_flags(argv: tuple[str, ...], allowed: set[str]) -> dict[str, str]:
    if len(argv) != len(allowed) * 2:
        raise ValueError("wrong flag count")
    flags: dict[str, str] = {}
    for index in range(0, len(argv), 2):
        name, value = argv[index], argv[index + 1]
        if name not in allowed or name in flags or not value:
            raise ValueError("invalid flag")
        flags[name] = value
    if set(flags) != allowed:
        raise ValueError("missing flag")
    return flags


def _decode_page_program(encoded: str) -> tuple[dict[str, Any], bytes]:
    if not encoded or len(encoded) > 12000 or not _BASE64URL.fullmatch(encoded):
        raise ValueError("invalid page program encoding")
    padding = "=" * (-len(encoded) % 4)
    try:
        raw = base64.urlsafe_b64decode(encoded + padding)
        value = json.loads(raw)
    except (binascii.Error, UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError("invalid page program encoding") from exc
    return _validate_page_program(value)


def _parse_page_program_json(raw: str) -> tuple[dict[str, Any], bytes]:
    if not raw or len(raw.encode("utf-8")) > 12000:
        raise ValueError("invalid page program JSON")
    try:
        value = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError("invalid page program JSON") from exc
    return _validate_page_program(value)


def _validate_page_program(value: Any) -> tuple[dict[str, Any], bytes]:
    if not isinstance(value, dict) or set(value) != {"schema", "steps"}:
        raise ValueError("invalid page program")
    if value.get("schema") != "retainpdf_page_program_v1":
        raise ValueError("unsupported page program schema")
    steps = value.get("steps")
    if not isinstance(steps, list) or not 1 <= len(steps) <= 32:
        raise ValueError("invalid page program steps")
    page_references = 0
    for step in steps:
        if not isinstance(step, dict):
            raise ValueError("invalid page program step")  # noqa: TRY004
        operation = step.get("op")
        expected = (
            {"op", "pages"}
            if operation == "select_pages"
            else {
                "op",
                "pages",
                "degrees",
            }
        )
        if operation not in {"select_pages", "rotate_pages"} or set(step) != expected:
            raise ValueError("unsupported page program step")
        pages = step.get("pages")
        if (
            not isinstance(pages, list)
            or not pages
            or not all(
                isinstance(page, int) and not isinstance(page, bool) and page > 0
                for page in pages
            )
        ):
            raise ValueError("invalid page program pages")
        if operation == "rotate_pages" and step.get("degrees") not in {90, 180, 270}:
            raise ValueError("invalid page rotation")
        page_references += len(pages)
        if page_references > 20000:
            raise ValueError("page program is too large")
    canonical = json.dumps(
        value,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    ).encode("utf-8")
    return value, canonical


def _operation_id(flags: dict[str, str]) -> str:
    value = flags["--operation-id"]
    if not _SAFE_OPERATION_ID.fullmatch(value):
        raise ValueError("invalid operation id")
    return value


def _idempotency_key(scope: BrokerScope, action: str, operation_id: str = "") -> str:
    identity = (
        f"{scope.conversation_id}\0{scope.request_message_id}\0{action}\0{operation_id}"
    )
    return f"fx-{action}-{hashlib.sha256(identity.encode()).hexdigest()[:40]}"


def _resolve_cli(command: str) -> Path:
    raw = command.strip()
    if not raw or any(character in raw for character in "\r\n\0"):
        raise RuntimeError("invalid retainpdf-agent command")
    resolved = shutil.which(raw) if not Path(raw).is_absolute() else raw
    if not resolved:
        raise RuntimeError("retainpdf-agent executable was not found")
    path = Path(resolved).resolve()
    if not path.is_file() or not os.access(path, os.X_OK):
        raise RuntimeError("retainpdf-agent executable is not runnable")
    return path


def _write_json_no_follow(path: Path, payload: dict[str, Any]) -> None:
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600)
    try:
        encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode(
            "utf-8"
        )
        os.write(descriptor, encoded)
        os.fsync(descriptor)
    finally:
        os.close(descriptor)


def _recv_json_line(connection: socket.socket) -> dict[str, Any]:
    chunks = bytearray()
    while len(chunks) <= _MAX_BROKER_FRAME_BYTES:
        piece = connection.recv(min(65536, _MAX_BROKER_FRAME_BYTES + 1 - len(chunks)))
        if not piece:
            break
        chunks.extend(piece)
        if b"\n" in piece:
            break
    if len(chunks) > _MAX_BROKER_FRAME_BYTES:
        raise ValueError("broker frame too large")
    line = bytes(chunks).split(b"\n", 1)[0]
    value = json.loads(line)
    if not isinstance(value, dict):
        raise TypeError("broker frame must be an object")
    return value


def _failure(message: str) -> dict[str, Any]:
    return {"exit_code": 1, "stdout": "", "stderr": message}


def _wrapper_source(socket_path: str, broker_key: str) -> str:
    return f"""#!{sys.executable}
import json
import socket
import sys

payload = json.dumps({{"broker_key": {broker_key!r}, "argv": sys.argv[1:]}}, separators=(",", ":")).encode("utf-8")
if len(payload) > {_MAX_BROKER_FRAME_BYTES}:
    sys.stderr.write("broker request exceeded limit\\n")
    raise SystemExit(1)
with socket.socket(socket.AF_UNIX, socket.SOCK_STREAM) as connection:
    connection.connect({socket_path!r})
    connection.sendall(payload + b"\\n")
    chunks = bytearray()
    while len(chunks) <= {_MAX_BROKER_FRAME_BYTES}:
        piece = connection.recv(65536)
        if not piece:
            break
        chunks.extend(piece)
        if b"\\n" in piece:
            break
response = json.loads(bytes(chunks).split(b"\\n", 1)[0])
sys.stdout.write(str(response.get("stdout") or ""))
sys.stderr.write(str(response.get("stderr") or ""))
raise SystemExit(int(response.get("exit_code") or 0))
"""

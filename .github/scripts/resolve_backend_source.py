#!/usr/bin/env python3
"""Resolve and verify the backend source consumed by the product repository."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from pathlib import PurePosixPath
import re
import subprocess
import sys
from typing import Any


REQUIRED_PATHS = (
    "pyproject.toml",
    "uv.lock",
    "api/Cargo.toml",
    "ai/pyproject.toml",
    "pipeline/pyproject.toml",
    "config/ocr_providers.json",
    "docker/Dockerfile.app",
)

GIT_REVISION_PATTERN = re.compile(r"[0-9a-f]{40}")
GITHUB_REPOSITORY_PATTERN = re.compile(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+")


def _git(*args: str, cwd: Path) -> str:
    return subprocess.run(
        ["git", *args],
        cwd=cwd,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def _load_lock(repo_root: Path) -> dict[str, Any]:
    lock_path = repo_root / "backend-source.lock.json"
    payload = json.loads(lock_path.read_text(encoding="utf-8"))
    if payload.get("schema_version") != 1:
        raise RuntimeError(f"unsupported backend source lock schema: {lock_path}")
    for field in ("source_tree", "embedded_path", "checkout_path"):
        if not str(payload.get(field) or "").strip():
            raise RuntimeError(f"backend source lock is missing {field}: {lock_path}")
    if not GIT_REVISION_PATTERN.fullmatch(str(payload["source_tree"])):
        raise RuntimeError(f"backend source lock has invalid source_tree: {lock_path}")

    repository = payload.get("repository")
    revision = payload.get("revision")
    if (repository is None) != (revision is None):
        raise RuntimeError(
            f"backend source lock repository and revision must both be set or null: {lock_path}"
        )
    if repository is not None:
        if not isinstance(repository, str) or not GITHUB_REPOSITORY_PATTERN.fullmatch(repository):
            raise RuntimeError(
                f"backend source lock repository must be an owner/name GitHub slug: {lock_path}"
            )
        if not isinstance(revision, str) or not GIT_REVISION_PATTERN.fullmatch(revision):
            raise RuntimeError(
                f"backend source lock revision must be a full 40-character SHA: {lock_path}"
            )

    for field in ("embedded_path", "checkout_path"):
        raw_path = str(payload[field])
        relative = PurePosixPath(raw_path)
        if (
            relative.is_absolute()
            or ".." in relative.parts
            or not relative.parts
            or raw_path in {"", "."}
            or "\\" in raw_path
        ):
            raise RuntimeError(
                f"backend source lock {field} must be a safe repository-relative path: {lock_path}"
            )
    return payload


def backend_checkout_metadata(repo_root: Path) -> dict[str, str]:
    """Return validated lock fields consumed before an optional CI checkout."""
    lock = _load_lock(repo_root.resolve())
    repository = lock.get("repository")
    revision = lock.get("revision")
    return {
        "external": "true" if repository is not None else "false",
        "repository": str(repository or ""),
        "revision": str(revision or ""),
        "checkout_path": str(lock["checkout_path"]),
        "source_tree": str(lock["source_tree"]),
    }


def _append_github_output(path: Path, values: dict[str, str]) -> None:
    with path.open("a", encoding="utf-8") as output:
        for key, value in values.items():
            if "\n" in value or "\r" in value:
                raise RuntimeError(f"backend source output {key} contains a newline")
            output.write(f"{key}={value}\n")


def _candidate(repo_root: Path, lock: dict[str, Any]) -> tuple[Path, str]:
    override = os.environ.get("RETAIN_PDF_SERVICES_ROOT", "").strip()
    if override:
        path = Path(override).expanduser()
        return (path if path.is_absolute() else repo_root / path).resolve(), "environment"

    if lock.get("repository") is not None:
        checkout = (repo_root / str(lock["checkout_path"])).resolve()
        return checkout, "checkout"

    return (repo_root / str(lock["embedded_path"])).resolve(), "embedded"


def _git_source(source_root: Path) -> tuple[str, str, Path, str]:
    git_root = Path(_git("rev-parse", "--show-toplevel", cwd=source_root)).resolve()
    relative = source_root.relative_to(git_root)
    treeish = "HEAD^{tree}" if relative == Path(".") else f"HEAD:{relative.as_posix()}"
    return (
        _git("rev-parse", "HEAD", cwd=git_root),
        _git("rev-parse", treeish, cwd=git_root),
        git_root,
        relative.as_posix(),
    )


def resolve_backend_source(
    repo_root: Path,
    *,
    allow_dirty: bool = False,
) -> dict[str, str]:
    repo_root = repo_root.resolve()
    lock = _load_lock(repo_root)
    source_root, source_kind = _candidate(repo_root, lock)
    if not source_root.is_dir():
        raise RuntimeError(f"backend source directory is unavailable: {source_root}")

    missing = [item for item in REQUIRED_PATHS if not (source_root / item).is_file()]
    if missing:
        raise RuntimeError(
            f"backend source layout is incomplete at {source_root}: {', '.join(missing)}"
        )

    actual_revision, actual_tree, git_root, relative = _git_source(source_root)
    expected_tree = str(lock["source_tree"])
    if actual_tree != expected_tree:
        raise RuntimeError(
            "backend source tree does not match backend-source.lock.json: "
            f"expected {expected_tree}, got {actual_tree} at {source_root}"
        )

    expected_revision = lock.get("revision")
    if source_kind != "embedded" and expected_revision is not None:
        if actual_revision != expected_revision:
            raise RuntimeError(
                "backend checkout revision does not match backend-source.lock.json: "
                f"expected {expected_revision}, got {actual_revision} at {source_root}"
            )

    pathspec = "." if relative == "." else relative
    dirty = _git(
        "status",
        "--porcelain",
        "--untracked-files=no",
        "--",
        pathspec,
        cwd=git_root,
    )
    if dirty and not allow_dirty:
        raise RuntimeError(
            f"tracked backend source changes are not represented by the lock: {source_root}"
        )

    return {
        "path": str(source_root),
        "kind": source_kind,
        "revision": actual_revision if source_kind != "embedded" else "",
        "tree": actual_tree,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--repo-root",
        type=Path,
        default=Path(__file__).resolve().parents[2],
        help="RetainPDF product repository root.",
    )
    parser.add_argument(
        "--allow-dirty",
        action="store_true",
        help="Allow tracked backend changes that are not represented by the lock.",
    )
    output = parser.add_mutually_exclusive_group()
    output.add_argument("--print-path", action="store_true")
    output.add_argument("--json", action="store_true")
    output.add_argument(
        "--github-output",
        type=Path,
        help="Append validated pre-checkout lock metadata to a GitHub Actions output file.",
    )
    args = parser.parse_args()

    if args.github_output is not None:
        _append_github_output(
            args.github_output,
            backend_checkout_metadata(args.repo_root),
        )
        return 0

    resolved = resolve_backend_source(args.repo_root, allow_dirty=args.allow_dirty)
    if args.print_path:
        print(resolved["path"])
    elif args.json:
        print(json.dumps(resolved, ensure_ascii=False, sort_keys=True))
    else:
        print(
            f"backend source verified: {resolved['kind']} {resolved['tree']} "
            f"at {resolved['path']}"
        )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, ValueError, RuntimeError, subprocess.CalledProcessError) as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1) from error

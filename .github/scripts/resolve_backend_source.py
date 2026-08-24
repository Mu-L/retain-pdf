#!/usr/bin/env python3
"""Resolve and verify the backend source consumed by the product repository."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
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
    return payload


def _candidate(repo_root: Path, lock: dict[str, Any]) -> tuple[Path, str]:
    override = os.environ.get("RETAIN_PDF_SERVICES_ROOT", "").strip()
    if override:
        path = Path(override).expanduser()
        return (path if path.is_absolute() else repo_root / path).resolve(), "environment"

    checkout = (repo_root / str(lock["checkout_path"])).resolve()
    if checkout.is_dir():
        return checkout, "checkout"

    return (repo_root / str(lock["embedded_path"])).resolve(), "embedded"


def _tree_for_source(source_root: Path) -> tuple[str, Path, str]:
    git_root = Path(_git("rev-parse", "--show-toplevel", cwd=source_root)).resolve()
    relative = source_root.relative_to(git_root)
    treeish = "HEAD^{tree}" if relative == Path(".") else f"HEAD:{relative.as_posix()}"
    return _git("rev-parse", treeish, cwd=git_root), git_root, relative.as_posix()


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

    actual_tree, git_root, relative = _tree_for_source(source_root)
    expected_tree = str(lock["source_tree"])
    if actual_tree != expected_tree:
        raise RuntimeError(
            "backend source tree does not match backend-source.lock.json: "
            f"expected {expected_tree}, got {actual_tree} at {source_root}"
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
    args = parser.parse_args()

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

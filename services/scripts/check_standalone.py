#!/usr/bin/env python3
"""Verify the tracked services tree as an isolated backend workspace."""

from __future__ import annotations

import argparse
import os
from pathlib import Path, PurePosixPath
import shutil
import subprocess
import tarfile
import tempfile


SERVICES_ROOT = Path(__file__).resolve().parents[1]


def _run(
    command: list[str],
    *,
    cwd: Path,
    env: dict[str, str] | None = None,
    suppress_stdout: bool = False,
) -> None:
    print(f"standalone: {' '.join(command)}", flush=True)
    subprocess.run(
        command,
        cwd=cwd,
        env=env,
        check=True,
        stdout=subprocess.DEVNULL if suppress_stdout else None,
    )


def _git_archive_source(*, allow_dirty: bool) -> tuple[Path, str]:
    result = subprocess.run(
        ["git", "rev-parse", "--show-toplevel"],
        cwd=SERVICES_ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    git_root = Path(result.stdout.strip()).resolve()
    relative = SERVICES_ROOT.relative_to(git_root)
    if relative == Path("."):
        treeish = "HEAD"
        pathspec = "."
    elif relative == Path("services"):
        treeish = "HEAD:services"
        pathspec = "services"
    else:
        raise RuntimeError(
            "backend workspace must be either the Git root or its services directory"
        )

    dirty = subprocess.run(
        ["git", "status", "--porcelain", "--untracked-files=no", "--", pathspec],
        cwd=git_root,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()
    if dirty and not allow_dirty:
        raise RuntimeError(
            "tracked backend changes are not committed; commit them or pass --allow-dirty "
            "to verify the current HEAD snapshot explicitly"
        )
    if dirty:
        print("standalone: warning: verifying HEAD; tracked worktree changes are excluded")
    return git_root, treeish


def _extract_tracked_snapshot(
    destination: Path,
    *,
    git_root: Path,
    treeish: str,
) -> None:
    archive_path = destination.parent / "services.tar"
    with archive_path.open("wb") as archive:
        subprocess.run(
            ["git", "archive", "--format=tar", treeish],
            cwd=git_root,
            stdout=archive,
            check=True,
        )

    with tarfile.open(archive_path) as archive:
        for member in archive.getmembers():
            relative = PurePosixPath(member.name)
            if relative.is_absolute() or ".." in relative.parts:
                raise RuntimeError(f"unsafe archive member: {member.name}")
            if not (member.isfile() or member.isdir()):
                raise RuntimeError(f"unsupported archive member type: {member.name}")
        archive.extractall(destination, filter="data")


def _require_layout(root: Path) -> None:
    required = (
        "pyproject.toml",
        "uv.lock",
        "ai/pyproject.toml",
        "pipeline/pyproject.toml",
        "api/Cargo.toml",
        "api/Cargo.lock",
        "config/ocr_providers.json",
        "contracts/check_parity.py",
        "contracts/ai-ask.v1.schema.json",
        "contracts/ai-conversations.v1.schema.json",
        "contracts/job-status.v1.schema.json",
        "contracts/jobs-control.v1.schema.json",
        "contracts/library-books.v1.schema.json",
        "contracts/pipeline-stdout.v1.schema.json",
        "testdata/golden-jobs/chem-6ada81-10p/artifacts/pipeline_summary.json",
    )
    missing = [relative for relative in required if not (root / relative).is_file()]
    if missing:
        raise RuntimeError(f"standalone backend snapshot is incomplete: {', '.join(missing)}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--compile-rust",
        action="store_true",
        help="also compile every Rust workspace test without executing it",
    )
    parser.add_argument(
        "--allow-dirty",
        action="store_true",
        help="verify committed HEAD even when tracked backend files differ locally",
    )
    args = parser.parse_args()

    for command in ("git", "uv", "cargo"):
        if shutil.which(command) is None:
            raise RuntimeError(f"required command is unavailable: {command}")

    git_root, treeish = _git_archive_source(allow_dirty=args.allow_dirty)

    with tempfile.TemporaryDirectory(prefix="retainpdf-backend-standalone-") as raw_tmp:
        temp_root = Path(raw_tmp)
        snapshot = temp_root / "workspace"
        snapshot.mkdir()
        _extract_tracked_snapshot(snapshot, git_root=git_root, treeish=treeish)
        _require_layout(snapshot)

        env = os.environ.copy()
        for inherited_python_path in ("PYTHONHOME", "PYTHONPATH", "VIRTUAL_ENV"):
            env.pop(inherited_python_path, None)
        env["UV_PROJECT_ENVIRONMENT"] = str(temp_root / "venv")
        env["CARGO_TARGET_DIR"] = str(temp_root / "cargo-target")

        _run(["python3", "contracts/check_parity.py"], cwd=snapshot, env=env)
        _run(["uv", "sync", "--locked", "--all-extras"], cwd=snapshot, env=env)
        _run(
            [
                "uv",
                "run",
                "--locked",
                "python",
                "-c",
                (
                    "from pathlib import Path; "
                    "import retainpdf_ai, retainpdf_pipeline; "
                    "root = Path.cwd().resolve(); "
                    "assert Path(retainpdf_ai.__file__).resolve().is_relative_to(root); "
                    "assert Path(retainpdf_pipeline.__file__).resolve().is_relative_to(root); "
                    "from retainpdf_pipeline.foundation.shared.ocr_provider_config "
                    "import _config_path; "
                    "assert _config_path() == Path.cwd() / 'config' / 'ocr_providers.json'"
                ),
            ],
            cwd=snapshot,
            env=env,
        )
        _run(
            ["uv", "run", "--locked", "retainpdf-pipeline", "--help"],
            cwd=snapshot,
            env=env,
        )
        _run(
            [
                "cargo",
                "metadata",
                "--locked",
                "--no-deps",
                "--format-version",
                "1",
                "--manifest-path",
                "api/Cargo.toml",
            ],
            cwd=snapshot,
            env=env,
            suppress_stdout=True,
        )
        if args.compile_rust:
            _run(
                [
                    "cargo",
                    "test",
                    "--locked",
                    "--workspace",
                    "--no-run",
                    "--manifest-path",
                    "api/Cargo.toml",
                ],
                cwd=snapshot,
                env=env,
            )

    print("isolated backend source workspace smoke passed")
    print("remaining boundary: fonts and deploy assets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

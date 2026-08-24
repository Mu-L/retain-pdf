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
REPO_ROOT = SERVICES_ROOT.parent


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


def _extract_tracked_snapshot(destination: Path) -> None:
    archive_path = destination.parent / "services.tar"
    with archive_path.open("wb") as archive:
        subprocess.run(
            ["git", "archive", "--format=tar", "HEAD:services"],
            cwd=REPO_ROOT,
            stdout=archive,
            check=True,
        )

    with tarfile.open(archive_path) as archive:
        for member in archive.getmembers():
            relative = PurePosixPath(member.name)
            if relative.is_absolute() or ".." in relative.parts:
                raise RuntimeError(f"unsafe archive member: {member.name}")
        archive.extractall(destination)


def _require_layout(root: Path) -> None:
    required = (
        "pyproject.toml",
        "uv.lock",
        "ai/pyproject.toml",
        "pipeline/pyproject.toml",
        "api/Cargo.toml",
        "api/Cargo.lock",
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
    args = parser.parse_args()

    for command in ("git", "uv", "cargo"):
        if shutil.which(command) is None:
            raise RuntimeError(f"required command is unavailable: {command}")

    with tempfile.TemporaryDirectory(prefix="retainpdf-backend-standalone-") as raw_tmp:
        temp_root = Path(raw_tmp)
        snapshot = temp_root / "workspace"
        snapshot.mkdir()
        _extract_tracked_snapshot(snapshot)
        _require_layout(snapshot)

        env = os.environ.copy()
        env["UV_PROJECT_ENVIRONMENT"] = str(temp_root / "venv")
        env["CARGO_TARGET_DIR"] = str(temp_root / "cargo-target")

        _run(["uv", "sync", "--locked", "--all-extras"], cwd=snapshot, env=env)
        _run(
            [
                "uv",
                "run",
                "--locked",
                "python",
                "-c",
                "import retainpdf_ai, retainpdf_pipeline",
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

    print("standalone backend workspace smoke passed")
    print("remaining boundary: contracts, config, testdata, fonts, and deploy assets")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

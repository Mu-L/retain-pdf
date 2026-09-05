"""Run the curated offline translation regression suites, never live eval scripts."""
from __future__ import annotations

import argparse
import os
from pathlib import Path
import subprocess
import sys


SERVICES = Path(__file__).resolve().parents[2]
SUITES = {
    "translation": SERVICES / "pipeline/devtools/tests/translation",
    "benchmarks": SERVICES / "benchmarks/tests",
}
RUNNER_TEST = Path(__file__).resolve().parent / "tests/entrypoints/test_translation_test_runner.py"


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--suite", choices=("all", *SUITES), default="all")
    parser.add_argument("--reverse", action="store_true", help="Reverse test file order (not test order within each file).")
    parser.add_argument("--collect-only", action="store_true")
    args = parser.parse_args(argv)
    directories = list(SUITES.values()) if args.suite == "all" else [SUITES[args.suite]]
    missing = [str(directory) for directory in directories if not directory.is_dir()]
    if missing:
        parser.error("Missing test directories: " + ", ".join(missing))
    targets = [str(directory) for directory in directories]
    if args.reverse:
        targets = [str(path) for path in sorted(
            (path for directory in directories for path in directory.rglob("test_*.py")),
            reverse=True,
        )]
        if not targets:
            parser.error("No test files found in the selected suites")
    if args.suite == "all":
        targets.append(str(RUNNER_TEST))
        if args.reverse:
            targets.sort(reverse=True)
    command = [sys.executable, "-m", "pytest", *targets, "-q", "--durations=12"]
    if args.collect_only:
        command.append("--collect-only")
    environment = os.environ.copy()
    environment["PYTHONPATH"] = str(SERVICES / "pipeline")
    # A local live capture directory must never receive synthetic test inputs.
    environment.pop("RETAIN_TRANSLATION_CAPTURE_DIR", None)
    try:
        return subprocess.run(command, cwd=SERVICES, env=environment, timeout=300).returncode
    except subprocess.TimeoutExpired:
        print("Offline translation tests exceeded 300 seconds.", file=sys.stderr)
        return 124


if __name__ == "__main__":
    raise SystemExit(main())

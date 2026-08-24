"""Compatibility wrapper for the namespaced pipeline entrypoint."""

from pathlib import Path
import sys

PIPELINE_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PIPELINE_ROOT))

from retainpdf_pipeline.entrypoints.run_provider_case import main


if __name__ == "__main__":
    raise SystemExit(main())

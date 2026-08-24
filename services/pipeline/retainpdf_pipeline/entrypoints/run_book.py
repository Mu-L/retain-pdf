"""Top-level book workflow entrypoint.

Formal local entry for the production path:
book.stage.v1 -> normalize -> translate -> render.
"""

from retainpdf_pipeline.foundation.shared.structured_errors import run_with_structured_failure
from retainpdf_pipeline.services.translation.entrypoints.from_ocr_pipeline import main


if __name__ == "__main__":
    run_with_structured_failure(main, default_stage="translation", provider="translation")

"""Opt-in page-local batching policy. Legacy transport is never changed."""
import os
import re

from retainpdf_pipeline.translate.llm.shared.executor_context import execution_enabled
from retainpdf_pipeline.translate.workflow.scheduling.page_order import item_order


def strategy():
    if not execution_enabled():
        return "baseline"
    value = os.environ.get("RETAIN_TRANSLATION_OPTIMIZATION", "baseline")
    if value not in {"baseline", "page_local_v1"}:
        raise ValueError("unsupported translation optimization strategy")
    return value


def is_standalone_number(item):
    if strategy() != "page_local_v1":
        return False
    if (item.get("continuation_group") or item.get("translation_group_id") or item.get("translation_unit_kind") == "group"
            or str(item.get("translation_unit_id", "")).startswith("__cg__:")
            or len(item.get("translation_unit_member_ids") or []) > 1
            or any(item.get(key) for key in ("formula_map", "protected_map", "translation_unit_formula_map",
                                             "translation_unit_protected_map", "group_formula_map", "group_protected_map"))):
        return False
    source = str(item.get("translation_unit_protected_source_text") or item.get("protected_source_text") or item.get("source_text") or "").strip()
    return re.fullmatch(r"(?:[0-9]+\.?|\([0-9]+\)|\[[0-9]+\])", source) is not None


def page_local_batches(items, batch_size, source_text):
    """Keep semantic units intact; bound source characters, not guessed tokens."""
    output, batch, chars, current = [], [], 0, None
    limit = min(8, max(1, batch_size))
    for item in sorted(items, key=item_order):
        key = (item_order(item)[0], item.get("math_mode", "placeholder"))
        size = len(source_text(item))
        if batch and (key != current or len(batch) >= limit or chars + size > 2400):
            output.append(batch)
            batch, chars = [], 0
        current = key
        batch.append(item)
        chars += size
        if size > 2400:
            output.append(batch)
            batch, chars = [], 0
    if batch:
        output.append(batch)
    return output

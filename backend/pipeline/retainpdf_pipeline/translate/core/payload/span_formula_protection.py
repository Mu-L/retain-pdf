"""按 OCR 标注的公式边界做保护——不猜。

和 formula_protection 的根本区别在边界从哪来：

- formula_protection 用 LATEX_FORMULA_RE 在一段没有定界符的扁平文本里**猜**哪
  段是公式。散文里做这件事不可能可靠，这也是 placeholder 模式一直不被信任的
  原因。
- 这里的边界来自 OCR。MinerU 把每个行内公式标成独立的 span
  （`type: "inline_equation"`），带精确文本和 bbox，这份标注一路保留到翻译
  payload 的 `lines[].spans` 里。

实测 762 个 inline_equation span，全部能在 source_text 里逐字命中，命中率 100%，
连去空白的模糊匹配都用不上。

为什么值得做：direct_typst 模式把扁平的 source_text 交给模型，让它**重新识别**
这些已经被精确标注过的公式，再自己加上 `$...$`。模型一旦动手就会顺带"修"没坏的
东西——实测 236 个含公式的条目里 132 个（55%）丢了 LaTeX 命令，`\mathrm` 62 次、
`\mathsf` 55 次、`\bar` 25 次。`\bar{x}` 变成 `x` 是另一个量，`A \to B` 丢掉
`\to` 是另一句话。

答案本来就在手里，只是没交给模型。
"""

from __future__ import annotations

from retainpdf_pipeline.translate.core.payload.token_protection import ProtectedToken
from retainpdf_pipeline.translate.core.payload.token_protection import Span
from retainpdf_pipeline.translate.core.payload.token_protection import checksum
from retainpdf_pipeline.translate.core.payload.token_protection import next_token_indexes
from retainpdf_pipeline.translate.core.payload.token_protection import token_tag


INLINE_FORMULA_SPAN_TYPES = frozenset({"inline_equation", "inline_formula"})


def iter_ocr_formula_texts(item: dict) -> list[str]:
    """条目里被 OCR 标为行内公式的原文片段，按出现顺序。

    span 的文本字段在不同层叫法不同：document.v1.json 里是 `text`，翻译 payload
    里是 `content`。两个都读，不然静默拿到空列表——这一点踩过。
    """
    texts: list[str] = []
    for line in item.get("lines") or []:
        if not isinstance(line, dict):
            continue
        for span in line.get("spans") or []:
            if not isinstance(span, dict):
                continue
            if str(span.get("type", "") or "") not in INLINE_FORMULA_SPAN_TYPES:
                continue
            value = str(span.get("content") or span.get("text") or "")
            if value.strip():
                texts.append(value)
    return texts


def collect_ocr_formula_spans(text: str, formula_texts: list[str]) -> list[Span]:
    """把 OCR 给的公式文本定位回 text，产出跨度。

    逐字匹配，不做归一化：能对上就保护，对不上就放过。宁可漏保护几个，也不要用
    模糊匹配去"大概齐"地框住一段——框错了会把正文锁死不让翻译，比不保护更糟。

    同一段公式文本可能出现多次（例如同一个符号反复出现），所以从上次命中位置
    之后继续找，而不是每次都从头找。
    """
    spans: list[Span] = []
    cursor = 0
    for value in formula_texts:
        index = text.find(value, cursor)
        if index < 0:
            # 从头再试一次：OCR 的 span 顺序偶尔和拼接顺序不一致。
            index = text.find(value)
            if index < 0:
                continue
        spans.append(Span(index, index + len(value), "formula", value, value))
        cursor = index + len(value)
    return spans


def protect_ocr_formulas(
    text: str,
    formula_texts: list[str],
    *,
    existing_map: list[dict] | None = None,
) -> tuple[str, list[dict]]:
    """把 OCR 标注的公式换成 token，返回 (保护后的文本, protected_map)。"""
    spans = collect_ocr_formula_spans(text, formula_texts)
    if not spans:
        return text, list(existing_map or [])
    base = list(existing_map or [])
    counters = next_token_indexes(base)
    protected_map = list(base)
    chunks: list[str] = []
    cursor = 0
    for span in sorted(spans, key=lambda item: item.start):
        if span.start < cursor:
            continue
        chunks.append(text[cursor:span.start])
        counters["formula"] += 1
        value_checksum = checksum(span.original_text, span.token_type)
        tag = token_tag(span.token_type, counters["formula"], value_checksum)
        protected_map.append(
            ProtectedToken(
                token_tag=tag,
                token_type=span.token_type,
                original_text=span.original_text,
                restore_text=span.original_text,
                source_offset=span.start,
                checksum=value_checksum,
            ).to_dict()
        )
        chunks.append(tag)
        cursor = span.end
    chunks.append(text[cursor:])
    return "".join(chunks), protected_map


__all__ = [
    "INLINE_FORMULA_SPAN_TYPES",
    "collect_ocr_formula_spans",
    "iter_ocr_formula_texts",
    "protect_ocr_formulas",
]

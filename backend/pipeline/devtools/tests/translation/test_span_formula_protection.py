"""行内公式按 OCR 标注锁住，模型碰不到。

背景：direct_typst 把扁平的 source_text 交给模型，而 OCR 产物里公式**没有**
`$...$` 定界符——提示词因此要求模型自己识别公式并包裹。模型一旦动手改公式，就会
顺带"修"没坏的东西。实测 236 个含公式的条目里 132 个（55%）丢了 LaTeX 命令：
`\\mathrm` 62 次、`\\mathsf` 55 次、`\\bar` 25 次、`\\cdot` 6 次、`\\to` 6 次。

后三种不是排版问题：`\\bar{x}` 变成 `x` 是另一个量，`A \\to B` 丢掉 `\\to` 是另
一句话。而且是静默的——译文通顺，公式也能渲染，只是和原文不是一回事。

边界一直都在。MinerU 把每个行内公式标成独立 span（`type: "inline_equation"`），
这份标注一路保留到翻译 payload 的 `lines[].spans`。实测 762 个 span 全部能在
source_text 里逐字命中。之前只是没用它。

下面钉住三件事：锁住之后模型看不到公式、还原时确定性补上 `$`、以及定位失败时
宁可放过也不乱框。
"""

from __future__ import annotations

import sys
from pathlib import Path

REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))

from retainpdf_pipeline.translate.core.payload.span_formula_protection import (  # noqa: E402
    collect_ocr_formula_spans,
    iter_ocr_formula_texts,
    protect_ocr_formulas,
)
from retainpdf_pipeline.translate.core.payload.token_protection import (  # noqa: E402
    restore_protected_tokens,
)


def _item(*spans: tuple[str, str]) -> dict:
    return {"lines": [{"spans": [{"type": kind, "content": text} for kind, text in spans]}]}


def test_reads_inline_formula_spans_from_ocr_lines() -> None:
    item = _item(("text", "The "), ("inline_equation", r"^ { 1 3 } \mathsf { C }"), ("text", " NMR"))
    assert iter_ocr_formula_texts(item) == [r"^ { 1 3 } \mathsf { C }"]


def test_reads_both_text_and_content_span_fields() -> None:
    """span 的文本字段在两层里叫法不同——document.v1.json 用 text，翻译 payload 用 content。

    只读其中一个会静默拿到空列表，保护整个失效而不报错。踩过这一次。
    """
    item = {"lines": [{"spans": [{"type": "inline_equation", "text": r"\alpha"}]}]}
    assert iter_ocr_formula_texts(item) == [r"\alpha"]


def test_protected_formula_is_invisible_to_the_model() -> None:
    source = r"The ^ { 1 3 } \mathsf { C } NMR spectrum"
    protected, protected_map = protect_ocr_formulas(source, [r"^ { 1 3 } \mathsf { C }"])

    assert r"\mathsf" not in protected, "公式仍暴露在送给模型的文本里"
    assert protected.startswith("The <f1-")
    assert [entry["restore_text"] for entry in protected_map] == [r"^ { 1 3 } \mathsf { C }"]


def test_restore_adds_the_delimiters_the_model_used_to_guess() -> None:
    """还原时补 `$`：这正是此前要模型代劳、而它做不稳的那件事。"""
    source = r"at \mathrm { c m } ^ { - 1 } units"
    protected, protected_map = protect_ocr_formulas(source, [r"\mathrm { c m } ^ { - 1 }"])
    restored = restore_protected_tokens(protected, protected_map)

    assert restored == r"at $\mathrm { c m } ^ { - 1 }$ units"
    assert restored.replace("$", "") == source, "除了补 $ 之外不得有任何改动"


def test_repeated_formula_text_protects_each_occurrence_separately() -> None:
    source = r"\alpha then \alpha again"
    protected, protected_map = protect_ocr_formulas(source, [r"\alpha", r"\alpha"])

    tags = [entry["token_tag"] for entry in protected_map]
    assert len(tags) == 2 and tags[0] != tags[1], "两次出现必须拿到不同 token"
    assert r"\alpha" not in protected


def test_unlocatable_span_is_skipped_rather_than_guessed() -> None:
    """定位不到就放过。

    宁可漏保护几个，也不要用模糊匹配去"大概齐"地框——框错了会把正文锁死不让翻译，
    比不保护更糟。这也是本模块和 formula_protection 的分界：那边用正则在散文里猜，
    这边只认 OCR 给的精确文本。
    """
    source = "plain prose with no formula"
    protected, protected_map = protect_ocr_formulas(source, [r"\notpresent"])

    assert protected == source
    assert protected_map == []


def test_spans_carry_the_offsets_they_were_found_at() -> None:
    source = r"a \beta b"
    spans = collect_ocr_formula_spans(source, [r"\beta"])
    assert [(span.start, span.end) for span in spans] == [(2, 7)]
    assert source[2:7] == r"\beta"


def test_existing_protected_map_keeps_its_token_numbering() -> None:
    """公式和术语共用一份 map，序号必须接着往下编，否则两边会撞 token。"""
    existing = [{"token_tag": "<f1-abc/>", "token_type": "formula", "restore_text": "x"}]
    _, protected_map = protect_ocr_formulas(r"and \gamma here", [r"\gamma"], existing_map=existing)

    tags = [entry["token_tag"] for entry in protected_map]
    assert tags[0] == "<f1-abc/>"
    assert tags[1].startswith("<f2-"), f"新 token 应从 2 起编，实际 {tags[1]}"


def test_restore_covers_formula_tokens_not_only_terms() -> None:
    """保护了就必须还原——公式 token 漏在译文里会直接显示成 `<f1-e32/>`。

    真实事故：给 protected_map 加了 formula 类型的 token，但统一还原点
    restore_runtime_term_tokens 只处理 {"term"}。一次翻译 262 个条目里 79 个
    （30%）译文带着未还原的 token 落盘，渲染出来是 `< 𝑓1 − 𝑒32/ >` 这种东西。

    保护和还原是一对，加了一类就要同时检查另一头。
    """
    from retainpdf_pipeline.translate.llm.shared.orchestration.metadata import (
        restore_runtime_term_tokens,
    )

    item = {
        "protected_map": [
            {"token_tag": "<f1-e32/>", "token_type": "formula", "restore_text": r"\mathrm{D}"},
            {"token_tag": "<t1-abc/>", "token_type": "term", "restore_text": "势能面"},
        ]
    }
    result = restore_runtime_term_tokens(
        {"p001-b008": {"translated_text": "交换反应 <f1-e32/> 在 <t1-abc/> 上"}},
        item=item,
    )
    text = result["p001-b008"]["translated_text"]

    assert "<f1-" not in text and "<t1-" not in text, f"仍有未还原的 token：{text}"
    assert text == r"交换反应 $\mathrm{D}$ 在 势能面 上"
    assert "$" in text, "公式还原必须补回定界符，原文 OCR 里没有"


def test_translation_with_leaked_tokens_never_reaches_the_cache() -> None:
    """带未还原 token 的译文既不能写进缓存，也不能从缓存里读出来。

    真实事故的第二幕：还原修好之后重翻，结果一模一样——262 条目、79 条泄漏，
    两次数字逐位相同。原因是缓存命中：坏译文在修复前已经写进去了，而缓存键只
    包含提示词和源文，不包含"还原逻辑的版本"，所以键没变、照旧命中。

    一次写入污染此后每一次运行，而且表现成"修复没生效"——最难排查的那种。
    所以两头都堵，而不是只修还原。
    """
    from retainpdf_pipeline.translate.llm.shared.cache import has_unrestored_protected_tokens

    assert has_unrestored_protected_tokens("项 <f1-2d4/> 是奇异绝热修正")
    assert has_unrestored_protected_tokens("术语 <t2-abc/> 保留")
    assert not has_unrestored_protected_tokens("项 $\\mathrm{D}$ 是修正")
    assert not has_unrestored_protected_tokens("普通译文，没有任何占位符")
    # 形近但不是 token 的写法不能误伤
    assert not has_unrestored_protected_tokens("区间 <f1> 与 a<b 比较")

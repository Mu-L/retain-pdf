"""受保护 token 的还原,以及「公式边界不归我们管」这条决定。

曾经试过按 OCR 标注锁住行内公式:MinerU 把每个行内公式标成独立 span
（`type: "inline_equation"`）,762 个 span 全部能在 source_text 里逐字命中。
动机是一个测出来的数字:「236 个含公式条目里 132 个（55%）丢了 LaTeX 命令」。

那个数字是错的,机制也是错的,三处都值得记下来。

一、100% 可定位只证明找得到,不证明边界对。真实一句里 MinerU 给的是:

    text            'so that \\'
    inline_equation 'E { \\bf q } . \\quad ( 2 . 4 { \\bf b } )'
    inline_equation 'gives \\tilde { \\Psi } _ { I }'

反斜杠留在 text span、命令名划进公式;还原补 `$` 后拼出 `\\E`,mitex 报
`unknown command: \\E`,整页渲染失败。英文单词 `gives` 被框进公式。同一个
`A_I({\\bf R})` 被切成 text/equation/text 三段。锁住只会把坏边界固化。

二、提示词本来就要求模型自己包 `$`,于是模型包一遍、还原补一遍,拼出
`$A _ { I } ( { $\\bf R$ } )` 这种嵌套 `$`。

三、模型会把 token 当成数学符号改写尖括号,还原对不上,那段内容整个消失。
"""

from __future__ import annotations

import sys
from pathlib import Path

REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))

from retainpdf_pipeline.translate.llm.placeholder_transform import (  # noqa: E402
    item_with_runtime_hard_glossary,
)
from retainpdf_pipeline.translate.llm.shared.cache import (  # noqa: E402
    has_unrestored_protected_tokens,
)
from retainpdf_pipeline.translate.llm.shared.orchestration.metadata import (  # noqa: E402
    restore_runtime_term_tokens,
)


def test_ocr_formula_spans_are_left_alone() -> None:
    """标着 inline_equation 的 span 不得被换成 token。

    没有术语要保护时,送给模型的文本必须和原文逐字相同,公式原样暴露给模型。
    一旦有人再把公式保护接回来,这条会红。
    """
    source = r"so that \ E { \bf q } . \quad ( 2 . 4 { \bf b } ) gives \tilde { \Psi } _ { I }"
    item = {
        "source_text": source,
        "lines": [
            {"spans": [
                {"type": "text", "content": r"so that \ "},
                {"type": "inline_equation", "content": r"E { \bf q } . \quad ( 2 . 4 { \bf b } )"},
                {"type": "inline_equation", "content": r"gives \tilde { \Psi } _ { I }"},
            ]}
        ],
    }
    result = item_with_runtime_hard_glossary(item, [])

    assert result.get("protected_source_text", source) == source
    assert not result.get("protected_map"), f"公式被保护了:{result.get('protected_map')}"


def test_restore_covers_formula_tokens_not_only_terms() -> None:
    """保护了就必须还原,加一类就要同时改还原那头。

    真实事故:给 protected_map 加了 formula 类型的 token,但统一还原点只处理
    {"term"}。一次翻译 262 个条目里 79 个（30%）译文带着未还原的 token 落盘,
    渲染出来是 `< 𝑓1 − 𝑒32/ >` 这种东西。

    生产里现在只有 term 进 map,但还原点必须继续覆盖 formula——正是收窄成单一
    类型的那个写法造成了事故。
    """
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

    assert "<f1-" not in text and "<t1-" not in text, f"仍有未还原的 token:{text}"
    assert text == r"交换反应 $\mathrm{D}$ 在 势能面 上"


def test_translation_with_leaked_tokens_never_reaches_the_cache() -> None:
    """带未还原 token 的译文既不能写进缓存,也不能从缓存里读出来。

    上面那次事故的第二幕:还原修好之后重翻,结果一模一样——262 条目、79 条泄漏,
    两次数字逐位相同。原因是缓存命中:坏译文在修复前已经写进去了,而缓存键只包含
    提示词和源文,不包含「还原逻辑的版本」,所以键没变、照旧命中。一次写入污染此后
    每一次运行,而且表现成「修复没生效」。
    """
    assert has_unrestored_protected_tokens("项 <f1-2d4/> 是奇异绝热修正")
    assert has_unrestored_protected_tokens("术语 <t2-abc/> 保留")
    assert not has_unrestored_protected_tokens("项 $\\mathrm{D}$ 是修正")
    assert not has_unrestored_protected_tokens("普通译文,没有任何占位符")
    # 形近但不是 token 的写法不能误伤
    assert not has_unrestored_protected_tokens("区间 <f1> 与 a<b 比较")

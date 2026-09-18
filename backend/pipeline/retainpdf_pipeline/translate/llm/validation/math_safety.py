from __future__ import annotations

import collections
import re


UNESCAPED_INLINE_DOLLAR_RE = re.compile(r"(?<!\\)\$")
LATEX_COMMAND_RE = re.compile(r"\\([A-Za-z]+)")

# 这些命令本来就会在翻译中正常消失或出现，计入丢失只会淹没真正的信号：
# - \text / \mathrm 等包裹中文时，模型改用别的包裹是等价的
# - \cite / \ref 一类引用命令按产品规则会被改写成上标
# - \begin / \end 成对出现，单看数量容易误判
EXPECTED_TO_DRIFT = frozenset({
    "text", "textrm", "textit", "textbf",
    "cite", "citep", "citet", "ref", "label",
    "begin", "end",
})


def has_balanced_inline_math_delimiters(text: str) -> bool:
    return len(UNESCAPED_INLINE_DOLLAR_RE.findall(text or "")) % 2 == 0


def dropped_latex_commands(source_text: str, translated_text: str) -> dict[str, int]:
    """原文里有、译文里没了的 LaTeX 命令，按丢失个数计。

    为什么需要这条：direct_typst 模式下模型直接处理带公式的整段文本——它必须
    改动公式（原文 OCR 没有 `$...$` 定界符，要由模型识别并包裹），而一旦动手，
    就会顺带"修"一些本来没坏的东西。实测一批真实产物：原文 998 个命令，译文
    只保留 712 个，`\\mathsf` 被换成 `\\delta`、`\\mathbb` 被换成 `\\mathrm`、
    `\\cdot` 直接消失。

    这类损失是静默的：译文读起来通顺，公式也能渲染，只是和原文不是一回事。
    没有这条检查就看不见它。

    先作为 warning 记录而不是 error：触发面可能达到四分之一的条目，一上来就
    重试会让成本和死信率一起爆掉。先积累数据，再决定要不要升级成硬错误。
    """
    source = collections.Counter(
        name for name in LATEX_COMMAND_RE.findall(source_text or "")
        if name not in EXPECTED_TO_DRIFT
    )
    translated = collections.Counter(
        name for name in LATEX_COMMAND_RE.findall(translated_text or "")
        if name not in EXPECTED_TO_DRIFT
    )
    return {name: count for name, count in (source - translated).items() if count > 0}


__all__ = [
    "EXPECTED_TO_DRIFT",
    "LATEX_COMMAND_RE",
    "UNESCAPED_INLINE_DOLLAR_RE",
    "dropped_latex_commands",
    "has_balanced_inline_math_delimiters",
]

from __future__ import annotations

import collections
import re


UNESCAPED_INLINE_DOLLAR_RE = re.compile(r"(?<!\\)\$")
LATEX_COMMAND_RE = re.compile(r"\\([A-Za-z]+)")

# 这些命令本来就会在翻译中正常消失或出现，计入丢失只会淹没真正的信号：
# - \text / \mathrm 等包裹中文时，模型改用别的包裹是等价的
# - \cite / \ref 一类引用命令按产品规则会被改写成上标
# - \begin / \end 成对出现，单看数量容易误判
# - \prime 有等价的 ASCII 写法：`A ^ { \prime }` 和 `A'` 是同一个东西，而 `'`
#   不是命令、数不进来，于是每一次正常的规范化都被记成丢失
# - 字号与间距命令只影响排版，不影响「和原文是不是一回事」，而 OCR 产物里
#   \scriptstyle、\quad 这类多半本身就是切分噪声
EXPECTED_TO_DRIFT = frozenset({
    "text", "textrm", "textit", "textbf",
    "cite", "citep", "citet", "ref", "label",
    "begin", "end",
    "prime",
    "scriptstyle", "scriptscriptstyle", "displaystyle", "textstyle",
    "quad", "qquad", "big", "Big", "bigg", "Bigg",
})

# 同一件事的两种拼法：TeX 老式字体切换 vs 现代数学字体命令。模型统一成后者不是
# 丢失。折叠成同一个名字再计数，而不是把两边都放过——`\bf` 整个消失仍要报。
COMMAND_ALIASES = {
    "bf": "mathbf",
    "rm": "mathrm",
    "it": "mathit",
    "sf": "mathsf",
    "tt": "mathtt",
    "cal": "mathcal",
    "boldsymbol": "mathbf",
    "pmb": "mathbf",
}


def _semantic_commands(text: str) -> collections.Counter:
    return collections.Counter(
        COMMAND_ALIASES.get(name, name)
        for name in LATEX_COMMAND_RE.findall(text or "")
        if name not in EXPECTED_TO_DRIFT
    )


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

    只数**语义**命令。第一版把等价改写也算进来，于是虚报得离谱：一个真实任务
    报「158 条含公式、79 条丢命令（50%）」，其中 140 次是 `A ^ { \prime }` 写成
    `A\'`——同一个数学对象。拿这个数字当依据，会让人去修一个不存在的问题。
    所以等价写法要么进 EXPECTED_TO_DRIFT，要么进 COMMAND_ALIASES 折叠。

    先作为 warning 记录而不是 error：先积累数据，再决定要不要升级成硬错误。
    """
    source = _semantic_commands(source_text)
    translated = _semantic_commands(translated_text)
    return {name: count for name, count in (source - translated).items() if count > 0}


__all__ = [
    "COMMAND_ALIASES",
    "EXPECTED_TO_DRIFT",
    "LATEX_COMMAND_RE",
    "UNESCAPED_INLINE_DOLLAR_RE",
    "dropped_latex_commands",
    "has_balanced_inline_math_delimiters",
]

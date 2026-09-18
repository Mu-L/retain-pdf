"""mitex 能不能渲染我们实际会遇到的 LaTeX —— 真编译，不看字符串。

为什么要真编译：这一整套曾经被一个**版本脱节**坑过很久。mitex 0.2.6 吐的是旧版
Typst 的符号名（`\\hbar` → `planck.reduce`、`\\partial` → `diff`、`\\otimes` →
`times.circle`、`\\langle` → `angle.l`），而我们装的 Typst 早就把这些改了名，于是
报的是 `unknown symbol modifier` / `unknown variable`。

那个报错看上去像「mitex 不认识这个命令」，实际是「mitex 认识，但它翻出来的
Typst 名字不存在了」。两者的修法完全相反：前者要换渲染方案，后者只要升个版本。
当时按前者理解，于是长出了一批把 LaTeX 降级成 Unicode 的重写规则
（`\\hbar` → `ℏ` 之类），既丢保真度又越积越多——`\\mathscr` → `\\mathcal` 甚至是
错的，它把手写体悄悄换成了花体。

字符串断言抓不到这类问题：无论 mitex 吐什么，字符串都「正确」。只有真的把它交给
Typst 编译一次才会暴露。所以本文件的每个用例都走完整链路：

    LaTeX → build_direct_typst_passthrough_text → cmarker.render(md, math: mitex) → typst compile

升级 Typst 或 mitex 时，这里会当场变红，而不是等它变成死信队列里的神秘失败。

清单只收「我们真的在科技论文里遇到过」的构造，不追求覆盖整个 LaTeX。
"""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import pytest

REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))

from retainpdf_pipeline.render.layout.inline_content import (  # noqa: E402
    build_direct_typst_passthrough_markdown,
)
from retainpdf_pipeline.render.output.typst.block_config import (  # noqa: E402
    typst_package_imports,
)

TYPST_BIN = os.environ.get("TYPST_BIN", "").strip() or shutil.which("typst")

# 每一条都对应一个曾经存在的降级规则，或一类反复出现的真实写法。
SUPPORTED_LATEX = [
    r"\hbar \omega",
    r"\partial_x u",
    r"A \otimes B",
    r"\mathscr{F}",
    r"\mathcal{L}",
    r"\varPhi",
    r"\varphi",
    r"\langle x \rangle",
    r"\langle A \rangle_{t}",
    r"\left\langle \psi \right\rangle",
    r"\left. \frac{a}{b} \right|_{x=0}",
    r"\left\{ x \right\}",
    r"\left| x \right|",
    r"\left( \frac{a}{b} \right)",
    r"\big[ x \big]",
    r"\sum_{i=1}^{n} x_i",
    r"\begin{pmatrix} a & b \\ c & d \end{pmatrix}",
    r"\vec{F} = m \vec{a}",
    r"\mathrm{M}",
    r"\mu \mathrm{mol}",
    r"-78\ ^{\circ}\mathrm{C}",
    r"^{117,126}",
    r"\text{速度} v = 3",
]


def _compile_through_mitex(latex: str) -> tuple[bool, str]:
    """把一段 LaTeX 按生产链路渲染一次，返回 (是否成功, 错误文本)。"""
    markdown = build_direct_typst_passthrough_markdown(f"${latex}$")
    # Typst 字符串只认双引号，且要转义反斜杠——用 Python 的 repr 会得到单引号，
    # 编译期直接报 "the character ' is not valid in code"。
    literal = '"' + markdown.replace("\\", "\\\\").replace('"', '\\"') + '"'
    source = "\n".join([
        *typst_package_imports(),
        "#set page(width: auto, height: auto, margin: 2pt)",
        f"#let md = {literal}",
        "#cmarker.render(md, math: mitex)",
        "",
    ])
    with tempfile.TemporaryDirectory() as tmp:
        typ_path = Path(tmp) / "probe.typ"
        typ_path.write_text(source, encoding="utf-8")
        proc = subprocess.run(
            [TYPST_BIN, "compile", str(typ_path), str(Path(tmp) / "probe.pdf")],
            capture_output=True,
            text=True,
            timeout=120,
        )
    return proc.returncode == 0, (proc.stderr or proc.stdout or "").strip()


@pytest.mark.skipif(not TYPST_BIN, reason="没有可用的 typst 二进制")
@pytest.mark.parametrize("latex", SUPPORTED_LATEX, ids=lambda s: s[:28])
def test_mitex_renders_supported_latex(latex: str) -> None:
    ok, err = _compile_through_mitex(latex)
    assert ok, (
        f"mitex 渲染失败：{latex}\n{err}\n\n"
        "报错里出现 unknown symbol modifier / unknown variable 时，"
        "说明是 mitex 与 Typst 的版本脱节，先升 MITEX_VERSION，"
        "不要在 inline_math.py 里加降级重写。"
    )


@pytest.mark.skipif(not TYPST_BIN, reason="没有可用的 typst 二进制")
def test_sanitizer_no_longer_degrades_supported_commands() -> None:
    """降级规则删干净了没有——这些命令应当原样送进 mitex。

    钉住它是因为「渲染失败就加一条重写」是最顺手的修法，而每加一条都是一次静默的
    保真度损失。真要加，先确认不是版本脱节。
    """
    markdown = build_direct_typst_passthrough_markdown(
        r"$\hbar$ $\partial$ $\otimes$ $\mathscr{F}$ $\langle x \rangle$ $\varPhi$"
    )
    for command in (r"\hbar", r"\partial", r"\otimes", r"\mathscr", r"\langle", r"\rangle", r"\varPhi"):
        assert command in markdown, f"{command} 被重写掉了"
    for degraded in ("ℏ", "∂", "⊗", "⟨", "⟩"):
        assert degraded not in markdown, f"仍在把 LaTeX 降级成 {degraded}"

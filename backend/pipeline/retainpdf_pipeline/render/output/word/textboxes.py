from __future__ import annotations

from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from lxml import etree

from retainpdf_pipeline.render.output.word.html_fit import LINE_STEP_RATIO
from retainpdf_pipeline.render.output.word.math_omml import append_inline_content


VML_NS = "urn:schemas-microsoft-com:vml"
OFFICE_NS = "urn:schemas-microsoft-com:office:office"


def append_absolute_textbox(
    paragraph,
    *,
    shape_id: str,
    text: str,
    x_pt: float,
    y_pt: float,
    width_pt: float,
    height_pt: float,
    font_size_pt: float,
    font_family: str,
    leading_em: float = 0.0,
    line_step_pt: float = 0.0,
    bold: bool = False,
    first_line_indent_pt: float = 0.0,
    include_shapetype: bool = False,
) -> None:
    pict = OxmlElement("w:pict")
    if include_shapetype:
        pict.append(textbox_shapetype())

    shape = etree.Element(f"{{{VML_NS}}}shape", nsmap={"v": VML_NS, "o": OFFICE_NS})
    shape.set("id", shape_id)
    shape.set("type", "#_x0000_t202")
    shape.set("stroked", "f")
    shape.set("filled", "t")
    shape.set("fillcolor", "#FFFFFF")
    shape.set(
        "style",
        (
            "position:absolute;"
            f"margin-left:{x_pt:.3f}pt;"
            f"margin-top:{y_pt:.3f}pt;"
            f"width:{width_pt:.3f}pt;"
            f"height:{height_pt:.3f}pt;"
            "z-index:251659264;"
            "mso-position-horizontal:absolute;"
            "mso-position-horizontal-relative:page;"
            "mso-position-vertical:absolute;"
            "mso-position-vertical-relative:page;"
        ),
    )

    textbox = etree.Element(f"{{{VML_NS}}}textbox")
    textbox.set("inset", "0,0,0,0")
    textbox.set("style", "mso-fit-shape-to-text:false")
    content = OxmlElement("w:txbxContent")

    for line in str(text or "").splitlines() or [""]:
        p = OxmlElement("w:p")
        p_pr = OxmlElement("w:pPr")
        spacing = OxmlElement("w:spacing")
        spacing.set(qn("w:before"), "0")
        spacing.set(qn("w:after"), "0")
        # 行距一律由上游给（line_step_pt）:要么是从译文 PDF 的相邻基线量到的真值，
        # 要么是 html_fit 按实测比值算的。
        #
        # 这里曾经按 `font_size_pt * (1 + leading_em)` 自己折算。方向看着合理——Typst
        # 的 `par(leading:)` 是行间空隙、Word 的 `w:line` 是行高本身，不能照搬当倍数。
        # 但折算出来**系统性高 21%**:跨 9 本书 111 个块实测，真实行距是字号的 1.289 倍，
        # 而 `1 + leading_em` 给出 1.560。行盒本身不是 1em，这个换算从一开始就不成立。
        line_pt = line_step_pt if line_step_pt > 0 else font_size_pt * LINE_STEP_RATIO
        spacing.set(qn("w:line"), str(int(max(1.0, line_pt) * 20)))
        spacing.set(qn("w:lineRule"), "exact")
        # 首行缩进也来自排版层：中文正文常有两字缩进，不接的话段落起头和原文对不齐。
        if first_line_indent_pt > 0:
            ind = OxmlElement("w:ind")
            ind.set(qn("w:firstLine"), str(int(first_line_indent_pt * 20)))
            p_pr.append(ind)
        p_pr.append(spacing)
        p.append(p_pr)

        append_inline_content(
            p, line, font_size_pt=font_size_pt, font_family=font_family, bold=bold,
        )
        content.append(p)

    textbox.append(content)
    shape.append(textbox)
    pict.append(shape)
    paragraph._p.append(pict)


def textbox_shapetype():
    shapetype = etree.Element(f"{{{VML_NS}}}shapetype", nsmap={"v": VML_NS, "o": OFFICE_NS})
    shapetype.set("id", "_x0000_t202")
    shapetype.set("coordsize", "21600,21600")
    shapetype.set(f"{{{OFFICE_NS}}}spt", "202")
    shapetype.set("path", "m,l,21600r21600,l21600,xe")

    stroke = etree.Element(f"{{{VML_NS}}}stroke")
    stroke.set("joinstyle", "miter")
    shapetype.append(stroke)

    path = etree.Element(f"{{{VML_NS}}}path")
    path.set("gradientshapeok", "t")
    path.set(f"{{{OFFICE_NS}}}connecttype", "rect")
    shapetype.append(path)
    return shapetype

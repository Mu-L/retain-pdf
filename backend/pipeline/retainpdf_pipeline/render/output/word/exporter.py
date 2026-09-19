from __future__ import annotations

from pathlib import Path

from docx import Document
from docx.enum.section import WD_SECTION
from docx.shared import Pt

from retainpdf_pipeline.render.output.word.backgrounds import render_page_backgrounds
from retainpdf_pipeline.render.output.word.document_builder import add_background_image
from retainpdf_pipeline.render.output.word.document_builder import add_page_break
from retainpdf_pipeline.render.output.word.document_builder import set_section_page
from retainpdf_pipeline.render.output.word.job_io import single_pdf
from retainpdf_pipeline.render.output.word.job_io import translated_pages
from retainpdf_pipeline.render.output.word.html_fit import fitted_typography
from retainpdf_pipeline.render.output.word.html_fit import MEASURED_FONT_FAMILY
from retainpdf_pipeline.render.output.word.textboxes import append_absolute_textbox
from retainpdf_pipeline.render.output.word.typography_readback import converged_typography
from retainpdf_pipeline.render.output.word.typography_readback import open_translated_document
from retainpdf_pipeline.render.output.word.typography_readback import read_page_lines
from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs


def export_layout_docx(
    *,
    job_root: Path,
    output_path: Path,
    dpi: int,
    max_pages: int = 0,
    font_family: str = MEASURED_FONT_FAMILY,
    source_pdf: Path | None = None,
    translated_pdf: Path | None = None,
) -> Path:
    # 源 PDF 不一定在 `job_root/source/` 下。translate-only 的任务复用上游 OCR 任务的
    # 产物，它自己的 source/ 是**空的**，源 PDF 在父任务目录里（job 记录的
    # `source_artifact_job_id` 指过去）。调用方（Rust 的 resolve_source_pdf）已经解析
    # 好了就直接用，别在这里凭 job_root 重新猜——猜错的表现是整条导出 500，而且
    # 因为子进程的 stderr 被丢弃，报错里看不出是路径问题。
    source_pdf_path = source_pdf or single_pdf(job_root / "source")
    pages = translated_pages(job_root)
    page_specs = build_render_page_specs(source_pdf_path=source_pdf_path, translated_pages=pages)
    if max_pages > 0:
        page_specs = page_specs[:max_pages]

    rendered_dir = job_root / "rendered" / "docx"
    # 背景图目录带上 DPI:同一个 job 的两次导出（不同清晰度）可以同时在跑——
    # API 那边的 in-flight 去重键也是按 DPI 分的。共用一个目录的话，两边写的是同一批
    # 文件名，先跑的那个会读到后跑的那个覆盖进去的图。
    bg_paths = render_page_backgrounds(
        source_pdf_path, rendered_dir / f"background-pages-{int(dpi)}", dpi=dpi,
    )

    # `block.font_size_pt` 是**上界**不是结果：Typst 拿它当 max_size 二分找能装下的字号。
    # 照上界排，凡是当初被缩过的块在 Word 里都会溢出。收敛后的字号读流水线自己渲染的译文
    # PDF 最准；读不到就退回 spec（见 typography_readback 的模块注释）。
    translated_document = open_translated_document(job_root, translated_pdf)

    document = Document()
    if page_specs:
        set_section_page(
            document.sections[0],
            width_pt=page_specs[0].page_width_pt,
            height_pt=page_specs[0].page_height_pt,
        )

    for spec_index, spec in enumerate(page_specs):
        if spec_index > 0:
            document.add_section(WD_SECTION.NEW_PAGE)
            set_section_page(
                document.sections[-1],
                width_pt=spec.page_width_pt,
                height_pt=spec.page_height_pt,
            )

        add_background_image(
            document,
            bg_paths[spec.page_index],
            width_pt=spec.page_width_pt,
            height_pt=spec.page_height_pt,
        )

        rendered_lines = (
            read_page_lines(translated_document, spec.page_index) if translated_document is not None else []
        )

        overlay_paragraph = document.add_paragraph()
        overlay_paragraph.paragraph_format.space_before = Pt(0)
        overlay_paragraph.paragraph_format.space_after = Pt(0)
        textbox_shapetype_added = False
        for block_index, block in enumerate(spec.blocks):
            if not block.plain_text.strip():
                continue
            x0, y0, x1, y1 = block.content_rect
            observed = converged_typography(
                rendered_lines, block.content_rect, len(block.plain_text.strip()),
            )
            # 读不到译文 PDF（只翻译没渲染、产物被清掉、块对不上）时不能退回裸上界——
            # 上界是 Typst 二分的**起点**，实测跨 9 本书有 44.6% 的字符照它排会溢出。
            # 退回阅读器那套字号收敛：误差只会偏小，溢出降到 1.5%。
            font_size_pt, line_step_pt = (
                (observed.font_size_pt, observed.line_step_pt) if observed
                else fitted_typography(block)
            )
            append_absolute_textbox(
                overlay_paragraph,
                shape_id=f"pdftr_p{spec.page_index + 1:03d}_b{block_index:03d}",
                text=block.content_text,
                x_pt=x0,
                y_pt=y0,
                width_pt=max(8.0, x1 - x0),
                height_pt=max(8.0, y1 - y0),
                font_size_pt=font_size_pt,
                font_family=font_family,
                # 排版层已经为这个块算好了行距、字重和首行缩进（PDF 和阅读器的
                # HTML 浮层都在用同一组值）。不接的话 Word 是三个渲染面里唯一
                # 跑偏的那个：行距写死、标题不粗、段落起头对不齐。
                leading_em=block.leading_em,
                line_step_pt=line_step_pt,
                bold=str(block.font_weight or "").strip().lower() == "bold",
                first_line_indent_pt=block.first_line_indent_pt,
                include_shapetype=not textbox_shapetype_added,
            )
            textbox_shapetype_added = True

        if spec_index + 1 < len(page_specs):
            add_page_break(document)

    if translated_document is not None:
        translated_document.close()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    document.save(output_path)
    return output_path

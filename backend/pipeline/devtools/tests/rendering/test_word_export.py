"""保留排版的 Word 导出。

这个模块此前**从「scripts/ → pipeline/」那次重命名起就跑不起来**：`exporter.py` 还在
import 已经改名的 `SCRIPTS_ROOT`，一 import 就 ImportError；`cli.py` 缺
`if __name__ == "__main__"`，`python -m` 跑完静悄悄什么都不做；声明在 pyproject 里的
`python-docx` 也没装进 venv。三件事指向同一个原因——**没有任何测试碰过它**，所以半年
没人知道它是死的。

所以这里第一优先钉的不是排版效果，而是「它还活着」：模块能 import、CLI 有入口、产物
真的写出来了、结构是我们要的那种（每页一节、背景图、绝对定位文本框、公式是 OMML 而
不是图片）。
"""

from __future__ import annotations

import importlib
import json
import pkgutil
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

PIPELINE_ROOT = Path(__file__).resolve().parents[3]
if str(PIPELINE_ROOT) not in sys.path:
    sys.path.insert(0, str(PIPELINE_ROOT))

docx = pytest.importorskip("docx", reason="python-docx 未安装（它在 pyproject 里声明了）")
fitz = pytest.importorskip("fitz", reason="PyMuPDF 未安装")

from docx.oxml.ns import qn  # noqa: E402

MATH_NS = "{http://schemas.openxmlformats.org/officeDocument/2006/math}"


def test_every_module_imports():
    """整包 import 一遍。

    这一条就能挡住当初那次改名:`exporter` import 了一个已经不存在的名字,而它是
    整条链路的入口。
    """
    import retainpdf_pipeline.render.output.word as package

    failures = []
    for module in pkgutil.iter_modules(package.__path__):
        name = f"retainpdf_pipeline.render.output.word.{module.name}"
        try:
            importlib.import_module(name)
        except Exception as exc:  # noqa: BLE001 - 这里就是要把失败原因摊开
            failures.append(f"{name}: {type(exc).__name__}: {exc}")
    assert not failures, "有模块 import 不了:\n" + "\n".join(failures)


def test_cli_has_an_entry_point():
    """`python -m …cli` 必须真的执行 main()。

    少了这一段,命令跑完既没有产物也没有报错——排查时看起来像「成功但没输出」。
    """
    source = (PIPELINE_ROOT / "retainpdf_pipeline" / "render" / "output" / "word" / "cli.py").read_text()
    assert '__name__ == "__main__"' in source, "cli.py 没有入口,python -m 跑了等于没跑"


# 真实 job 的译文块有 80+ 个字段（分栏、续行、公式映射、翻译单元…）。手搓一份合成
# 数据既写不全，也会把测试钉在一个和真实形状不一样的东西上——那正是这类测试最容易
# 变成摆设的方式。所以这里从仓库里挑一个真实 job，裁成一页来用。
REPO_ROOT = PIPELINE_ROOT.parents[1]
JOBS_ROOT = REPO_ROOT / "data" / "jobs"


def _find_translated_job() -> Path | None:
    if not JOBS_ROOT.is_dir():
        return None
    for job in sorted(JOBS_ROOT.iterdir(), reverse=True):
        manifest = job / "translated" / "translation-manifest.json"
        if not manifest.is_file():
            continue
        if not list((job / "source").glob("*.pdf")):
            continue
        try:
            pages = json.loads(manifest.read_text(encoding="utf-8")).get("pages") or []
        except Exception:  # noqa: BLE001 - 损坏的 manifest 跳过即可
            continue
        if pages:
            return job
    return None


@pytest.fixture
def tiny_job(tmp_path: Path) -> Path:
    """真实 job 裁成一页。

    整本跑一遍要几十秒（背景图渲染是大头），一页足够验结构。
    """
    source_job = _find_translated_job()
    if source_job is None:
        pytest.skip("本机没有已翻译的 job（data/jobs 下找不到带 manifest 的）")

    job_root = tmp_path / "job"
    (job_root / "source").mkdir(parents=True)
    (job_root / "translated").mkdir(parents=True)

    pdf = sorted((source_job / "source").glob("*.pdf"))[0]
    doc = fitz.open(pdf)
    one = fitz.open()
    one.insert_pdf(doc, from_page=0, to_page=0)
    one.save(job_root / "source" / pdf.name)
    one.close()
    doc.close()

    manifest = json.loads((source_job / "translated" / "translation-manifest.json").read_text(encoding="utf-8"))
    first = manifest["pages"][0]
    shutil.copy(source_job / "translated" / first["path"], job_root / "translated" / first["path"])
    manifest["pages"] = [first]
    (job_root / "translated" / "translation-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False), encoding="utf-8",
    )

    # 流水线自己渲染出来的译文 PDF 也裁一页带上——收敛后的字号和行距要从它里面读回来。
    rendered = sorted((source_job / "rendered").glob("*-translated.pdf")) if (source_job / "rendered").is_dir() else []
    if rendered:
        translated = fitz.open(rendered[0])
        if translated.page_count:
            one_page = fitz.open()
            one_page.insert_pdf(translated, from_page=0, to_page=0)
            (job_root / "rendered").mkdir(parents=True, exist_ok=True)
            one_page.save(job_root / "rendered" / rendered[0].name)
            one_page.close()
        translated.close()
    return job_root


@pytest.fixture
def tiny_job_without_render(tiny_job: Path) -> Path:
    """同一份 job，但没有译文 PDF。

    读不回来的时候导出还得能跑完，并且退回 spec 的值——这条路在真实场景里很常见
    （只跑了翻译还没渲染，或者产物被清掉了）。
    """
    shutil.rmtree(tiny_job / "rendered", ignore_errors=True)
    return tiny_job


def _export(job_root: Path, out: Path, **kwargs):
    from retainpdf_pipeline.render.output.word.exporter import export_layout_docx

    return export_layout_docx(
        job_root=job_root, output_path=out, dpi=kwargs.pop("dpi", 72), **kwargs,
    )


def test_export_writes_a_docx(tiny_job: Path, tmp_path: Path):
    out = tmp_path / "layout.docx"
    result = _export(tiny_job, out)
    assert Path(result).exists(), "导出声称成功却没有产物"
    assert out.stat().st_size > 0


def test_each_page_becomes_its_own_section_at_the_source_size(tiny_job: Path, tmp_path: Path):
    """节 = 页，且页面尺寸取**源 PDF 的**，不是 Word 默认的 Letter。

    写死一个具体尺寸会把测试钉在这份夹具上；真正要保证的是「和源文档一致」。
    """
    source = sorted((tiny_job / "source").glob("*.pdf"))[0]
    with fitz.open(source) as doc:
        rect = doc[0].rect

    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    document = docx.Document(str(out))
    assert len(document.sections) == 1
    section = document.sections[0]
    assert round(section.page_width.pt) == round(rect.width)
    assert round(section.page_height.pt) == round(rect.height)


def test_translated_text_lands_in_absolute_textboxes(tiny_job: Path, tmp_path: Path):
    """译文必须在文本框里。

    直接写成段落的话，Word 会按流式重排，「保留排版」就不成立了。
    """
    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    boxes = body.findall(".//" + qn("w:txbxContent"))
    assert len(boxes) >= 2, f"只有 {len(boxes)} 个文本框"

    texts = [t.text for t in body.iter() if t.tag == qn("w:t") and t.text and t.text.strip()]
    assert texts, "文本框里一个字都没有"


def test_the_source_page_is_kept_as_a_background_image(tiny_job: Path, tmp_path: Path):
    """底图是「保留排版」的另一半:线条、图、表格都靠它。"""
    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    assert body.findall(".//" + qn("a:blip")), "没有背景图"


def test_upstream_already_drops_blocks_without_text(tiny_job: Path, tmp_path: Path):
    """空译文的块进不到 exporter 这一层。

    起初我给 exporter 里那句 `if not block.plain_text.strip(): continue` 写了一条
    「空块不该变成空文本框」的测试，反证时发现改坏它测试照样全绿。查下来原因是
    **build_render_page_specs 已经把空块滤掉了**，那句 continue 从来没执行过——
    任何针对它的断言都恒真。

    所以这里钉的是真正成立的那件事:上游保证了这一点。它哪天不再保证，这条会红，
    到时候 exporter 那句防御才真的开始起作用。
    """
    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    page_path = next((tiny_job / "translated").glob("page-*.json"))
    blocks = json.loads(page_path.read_text(encoding="utf-8"))

    blank = json.loads(json.dumps(blocks[0], ensure_ascii=False))
    blank["item_id"] = "p001-bblank"
    for key in list(blank):
        if key.endswith("translated_text"):
            blank[key] = ""
    blank["source_text"] = ""
    blocks.append(blank)
    page_path.write_text(json.dumps(blocks, ensure_ascii=False), encoding="utf-8")

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(tiny_job / "source"),
        translated_pages=translated_pages(tiny_job),
    )
    # 上游自己就把没有文本的块滤掉了：喂进去 N+1 个，出来的没有一个是空的。
    assert all(b.plain_text.strip() for b in specs[0].blocks), "上游放了空块进来"
    expected = len(specs[0].blocks)

    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    assert len(body.findall(".//" + qn("w:txbxContent"))) == expected


def test_max_pages_limits_the_export(tiny_job: Path, tmp_path: Path):
    out = tmp_path / "layout.docx"
    _export(tiny_job, out, max_pages=1)
    assert len(docx.Document(str(out)).sections) == 1


def test_the_console_subcommand_runs_end_to_end(tiny_job: Path, tmp_path: Path):
    """走 `retainpdf-pipeline layout-docx` 这条真实路径。

    Rust 那边起的就是这个——`derived_artifacts` 用 `deps.pipeline_command` 拼命令行，
    和 `side-by-side-pdf` 同一套。直接调函数测不出「子命令没注册」「参数名对不上」
    这两类错，而它们恰好是接 API 时最容易犯的。
    """
    out = tmp_path / "console.docx"
    proc = subprocess.run(
        [sys.executable, "-m", "retainpdf_pipeline.entrypoints.console", "layout-docx",
         "--job-root", str(tiny_job), "--output-docx", str(out), "--dpi", "72"],
        cwd=str(PIPELINE_ROOT), capture_output=True, text=True, timeout=300,
    )
    assert proc.returncode == 0, proc.stderr[-800:]
    assert out.exists(), f"子命令没有产出文件\nstdout={proc.stdout}\nstderr={proc.stderr[-500:]}"


def test_the_subcommand_is_listed_in_usage():
    """没注册进 COMMANDS 的话，Rust 那边拿到的是 exit code 2 加一句 unknown command。"""
    from retainpdf_pipeline.entrypoints import console

    assert "layout-docx" in console.COMMANDS


def test_the_export_ships_in_the_installed_package(tiny_job: Path):
    """导出代码必须在发布产物里——API 起的是**装好的** `retainpdf-pipeline`。

    它原来住在 `devtools/`，而 pyproject 的 `packages.find` 只收 `retainpdf_pipeline*`：
    装出来的 venv 里 `import devtools` 直接 ModuleNotFoundError。本地 pytest 能跑是因为
    仓库根目录恰好在 sys.path 上，这个差别在接 API 之前一直看不出来。
    """
    import tomllib

    manifest = tomllib.loads((PIPELINE_ROOT / "pyproject.toml").read_text(encoding="utf-8"))
    included = manifest["tool"]["setuptools"]["packages"]["find"]["include"]
    assert any(pattern.startswith("retainpdf_pipeline") for pattern in included)

    module = importlib.import_module("retainpdf_pipeline.render.output.word.exporter")
    assert Path(module.__file__).is_relative_to(PIPELINE_ROOT / "retainpdf_pipeline"), (
        f"导出模块在 {module.__file__}，不在发布包里"
    )

    # python-docx 同理:它原来只在 test extra 里，装出来的运行环境没有它。
    assert any("python-docx" in dep for dep in manifest["project"]["dependencies"]), (
        "python-docx 不在运行时依赖里，装出来的环境跑 layout-docx 会 ImportError"
    )


def _first_block(job_root: Path):
    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(job_root / "source"),
        translated_pages=translated_pages(job_root),
    )
    return specs[0].blocks[0]


def _observed(job_root: Path, block):
    """这个块在译文 PDF 里真正排出来的字号/行距。"""
    from retainpdf_pipeline.render.output.word.typography_readback import (
        converged_typography, open_translated_document, read_page_lines)

    document = open_translated_document(job_root)
    assert document is not None, "夹具里没带译文 PDF，读回路径测不到"
    try:
        lines = read_page_lines(document, 0)
        return converged_typography(lines, block.content_rect, len(block.plain_text.strip()))
    finally:
        document.close()


def test_font_size_is_the_size_typst_converged_to_not_the_upper_bound(
    tiny_job: Path, tmp_path: Path,
):
    """字号要用译文 PDF 里真正排出来的那个，不是 spec 里的上界。

    `block.font_size_pt` 是交给 Typst `pdftr_fit_markdown` 的 `max_size`——Typst 会在
    `[fit_min_font_size_pt, font_size_pt]` 里二分找装得下的字号。照上界排版，凡是当初
    被缩过的块在 Word 里都会溢出。本仓真实 job 的前 5 页里有 10 个块被缩过，最狠的一个
    是 11.35pt → 7.84pt。
    """
    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(tiny_job / "source"),
        translated_pages=translated_pages(tiny_job),
    )
    blocks = [b for b in specs[0].blocks if b.plain_text.strip()]
    shrunk = [
        (b, o) for b in blocks
        if (o := _observed(tiny_job, b)) is not None and b.font_size_pt - o.font_size_pt > 0.15
    ]
    assert shrunk, "夹具这一页没有任何块被缩过字号，这条分辨不出对错"

    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    sizes = {int(s.get(qn("w:val"))) for s in body.findall(".//" + qn("w:sz")) if s.get(qn("w:val"))}

    block, observed = max(shrunk, key=lambda pair: pair[0].font_size_pt - pair[1].font_size_pt)
    # w:sz 的单位是半磅，会取整；两个值取整后撞在一起就说明这块分辨不出来。
    converged = int(max(1.0, observed.font_size_pt) * 2)
    upper_bound = int(max(1.0, block.font_size_pt) * 2)
    assert converged != upper_bound, "这块缩得太少，半磅取整后两个值一样，换一块"
    assert converged in sizes, f"没有用收敛后的 {observed.font_size_pt}pt；出现的字号是 {sorted(sizes)}"
    assert upper_bound not in sizes, f"还在用上界 {block.font_size_pt}pt 排版，这块会溢出"


def test_line_height_is_measured_from_the_rendered_baselines(tiny_job: Path, tmp_path: Path):
    """行距量自译文 PDF 相邻行的基线距离。

    此前是拿 spec 的 leading_em 折算成 `font_size_pt * (1 + leading_em)`。折算本身方向
    是对的（Typst 的 `par(leading:)` 是行间空隙，Word 的 `w:line` 是行高本身，不能照搬
    当倍数），但结果偏高很多——本仓真实 job 上按字符加权，折算值比真实行距平均高
    **2.37pt**，一行十二三磅就是高了两成，正文一长就顶出框外。
    """
    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(tiny_job / "source"),
        translated_pages=translated_pages(tiny_job),
    )
    candidates = []
    for block in specs[0].blocks:
        if not block.plain_text.strip() or block.leading_em <= 0:
            continue
        observed = _observed(tiny_job, block)
        if observed is None or observed.line_step_pt <= 0:
            continue
        derived = int(max(1.0, block.font_size_pt * (1.0 + block.leading_em)) * 20)
        measured = int(max(1.0, observed.line_step_pt) * 20)
        if derived != measured:
            candidates.append((block, observed, derived, measured))
    assert candidates, "夹具这一页量不到和折算值不同的行距，这条分辨不出对错"

    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    values = {
        int(s.get(qn("w:line"))) for s in body.findall(".//" + qn("w:spacing")) if s.get(qn("w:line"))
    }

    _block, _observed_typography, derived, measured = max(
        candidates, key=lambda row: abs(row[2] - row[3]),
    )
    assert measured in values, f"没有用量到的行距 {measured / 20:.2f}pt；出现的是 {sorted(values)}"
    assert derived not in values, f"还在用折算的 {derived / 20:.2f}pt，正文会顶出框外"


def test_without_a_rendered_pdf_it_falls_back_to_the_spec(
    tiny_job_without_render: Path, tmp_path: Path,
):
    """读不到译文 PDF 时照样导得出来，并且退回 spec 的字号与折算行距。"""
    block = _first_block(tiny_job_without_render)
    out = tmp_path / "layout.docx"
    _export(tiny_job_without_render, out)

    body = docx.Document(str(out)).element.body
    sizes = {int(s.get(qn("w:val"))) for s in body.findall(".//" + qn("w:sz")) if s.get(qn("w:val"))}
    values = {
        int(s.get(qn("w:line"))) for s in body.findall(".//" + qn("w:spacing")) if s.get(qn("w:line"))
    }
    assert int(max(1.0, block.font_size_pt) * 2) in sizes, "没有退回 spec 的字号"
    assert block.leading_em > 0, "夹具里这一块没有行距值，测不到折算那一支"
    assert int(max(1.0, block.font_size_pt * (1.0 + block.leading_em)) * 20) in values, (
        "没有退回 (1 + leading_em) 的折算行距"
    )


def test_a_block_is_not_given_a_neighbours_font_size(tiny_job: Path):
    """归属按「行的中心落在框内」，不是 PyMuPDF 的 clip。

    用 `clip=` 量的话，压在框边上的邻块文字会被一起裁进来——之前拿它量出「52.7% 的
    字号和 spec 对不上」，那个数字整个是假的。这条钉的是:一个框里读不到自己的字时，
    宁可返回 None 退回 spec，也不要拿邻居的字号顶上。
    """
    from retainpdf_pipeline.render.output.word.typography_readback import converged_typography, _ObservedLine

    neighbour = _ObservedLine(
        x0=0.0, y0=0.0, x1=100.0, y1=10.0, baseline=8.0, sizes=((20.0, 300),),
    )
    # 框在 (0,100)-(100,140)，邻居那一行的中心在 y=5，压根不在框里。
    assert converged_typography([neighbour], [0.0, 100.0, 100.0, 140.0], 200) is None

    # 就算落在框内，读到的字远少于这个块该有的量，也不该据此定字号。
    inside = _ObservedLine(
        x0=0.0, y0=100.0, x1=100.0, y1=110.0, baseline=108.0, sizes=((20.0, 5),),
    )
    assert converged_typography([inside], [0.0, 100.0, 100.0, 140.0], 200) is None
    assert converged_typography([inside], [0.0, 100.0, 100.0, 140.0], 8) is not None


def test_bold_blocks_are_bold(tiny_job: Path, tmp_path: Path):
    """字重来自 font_weight。不接的话标题和正文一样粗，Word 里读不出层次。"""
    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(tiny_job / "source"),
        translated_pages=translated_pages(tiny_job),
    )
    blocks = specs[0].blocks
    bold_blocks = [b for b in blocks if str(b.font_weight or "").lower() == "bold"]
    assert bold_blocks, "夹具里没有加粗块，测不到东西"

    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    bold_runs = body.findall(".//" + qn("w:b"))
    assert bold_runs, "一个加粗都没有"


def test_regular_blocks_are_not_bold(tiny_job: Path, tmp_path: Path):
    """反过来也要成立——不能整篇都加粗。

    第一版比的是「加粗的 run 数 < 总 run 数」，反证时发现整篇强制加粗它照样绿:
    OMML 公式里的 run 走的是另一条路、永远不带 w:b，所以那个不等式恒成立。
    改成按**文本框**比:常规字重的块里不该出现加粗。
    """
    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(tiny_job / "source"),
        translated_pages=translated_pages(tiny_job),
    )
    blocks = [b for b in specs[0].blocks if b.plain_text.strip()]
    expected_bold = sum(1 for b in blocks if str(b.font_weight or "").lower() == "bold")
    assert 0 < expected_bold < len(blocks), (
        f"夹具里字重不够混杂（{expected_bold}/{len(blocks)} 加粗），这条分辨不出对错"
    )

    out = tmp_path / "layout.docx"
    _export(tiny_job, out)
    body = docx.Document(str(out)).element.body
    boxes = body.findall(".//" + qn("w:txbxContent"))
    bold_boxes = sum(1 for box in boxes if box.findall(".//" + qn("w:b")))
    assert bold_boxes == expected_bold, (
        f"{bold_boxes} 个文本框加粗，排版层说的是 {expected_bold} 个"
    )


def test_first_line_indent_is_wired_even_though_this_fixture_has_none(tiny_job: Path):
    """首行缩进接上了，但**这份夹具测不到它**。

    真实数据里这一页所有块的 first_line_indent_pt 都是 0（中文正文的两字缩进由
    翻译侧直接写进文本，而不是靠排版属性）。所以任何「导出后有没有 w:ind」的断言
    在这里都恒成立——反证时确认过:把接线改成写死 0，测试照样全绿。

    与其留一条骗人的测试，不如把缺口写下来:这里只钉「接线在」，行为等遇到真有缩进
    的文档再补。
    """
    source = (PIPELINE_ROOT / "retainpdf_pipeline" / "render" / "output" / "word" / "exporter.py").read_text()
    assert "first_line_indent_pt=block.first_line_indent_pt" in source

    from retainpdf_pipeline.render.output.word.job_io import single_pdf, translated_pages
    from retainpdf_pipeline.render.layout.page_specs import build_render_page_specs

    specs = build_render_page_specs(
        source_pdf_path=single_pdf(tiny_job / "source"),
        translated_pages=translated_pages(tiny_job),
    )
    indents = {b.first_line_indent_pt for b in specs[0].blocks}
    assert indents == {0.0}, (
        f"夹具里出现了非零缩进 {indents}——可以把这条换成真正的行为断言了"
    )


def test_two_dpis_do_not_share_a_background_image_directory(tiny_job: Path, tmp_path: Path):
    """不同清晰度的背景图必须分开放。

    API 那边的 in-flight 去重键按 DPI 分（`{job}:layout-docx:dpi{n}`），所以同一个 job
    的两次不同清晰度导出**可以同时在跑**。共用一个目录的话两边写同一批文件名，先跑的
    那个会把后跑的那个覆盖进去的图嵌进自己的文档里。
    """
    _export(tiny_job, tmp_path / "low.docx", dpi=72)
    _export(tiny_job, tmp_path / "high.docx", dpi=200)

    dirs = sorted(p.name for p in (tiny_job / "rendered" / "docx").iterdir() if p.is_dir())
    assert len(dirs) == 2, f"两个 DPI 共用了背景图目录：{dirs}"

    from PIL import Image

    sizes = []
    for name in dirs:
        page = sorted((tiny_job / "rendered" / "docx" / name).glob("*.png"))[0]
        with Image.open(page) as image:
            sizes.append(image.size)
    assert sizes[0] != sizes[1], f"两个目录里的背景图尺寸一样，说明没按 DPI 分开：{sizes}"

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
    import devtools.word_export as package

    failures = []
    for module in pkgutil.iter_modules(package.__path__):
        name = f"devtools.word_export.{module.name}"
        try:
            importlib.import_module(name)
        except Exception as exc:  # noqa: BLE001 - 这里就是要把失败原因摊开
            failures.append(f"{name}: {type(exc).__name__}: {exc}")
    assert not failures, "有模块 import 不了:\n" + "\n".join(failures)


def test_cli_has_an_entry_point():
    """`python -m …cli` 必须真的执行 main()。

    少了这一段,命令跑完既没有产物也没有报错——排查时看起来像「成功但没输出」。
    """
    source = (PIPELINE_ROOT / "devtools" / "word_export" / "cli.py").read_text()
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
    return job_root


def _export(job_root: Path, out: Path, **kwargs):
    from devtools.word_export.exporter import export_layout_docx

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
    from devtools.word_export.job_io import single_pdf, translated_pages
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


def test_cli_runs_end_to_end(tiny_job: Path, tmp_path: Path):
    """走一遍真正的命令行——单测直接调函数时，入口坏了是看不出来的。"""
    out = tmp_path / "cli.docx"
    proc = subprocess.run(
        [sys.executable, "-m", "devtools.word_export.cli",
         "--job-root", str(tiny_job), "--output", str(out), "--dpi", "72"],
        cwd=str(PIPELINE_ROOT), capture_output=True, text=True, timeout=300,
    )
    assert proc.returncode == 0, proc.stderr[-800:]
    assert out.exists(), f"CLI 没有产出文件\nstdout={proc.stdout}\nstderr={proc.stderr[-500:]}"

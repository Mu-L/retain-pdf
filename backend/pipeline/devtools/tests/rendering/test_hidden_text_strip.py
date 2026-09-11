import sys
from pathlib import Path


REPO_SCRIPTS_ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(REPO_SCRIPTS_ROOT))


import pikepdf
from pikepdf import Name

from retainpdf_pipeline.render.source.preparation.hidden_text_strip import _text_object_is_hidden
from retainpdf_pipeline.render.source.preparation.hidden_text_strip import _analyze_text_object_visibility
from retainpdf_pipeline.render.source.preparation.hidden_text_strip import _strip_hidden_text_objects_from_page


def test_text_object_is_hidden_when_all_text_show_uses_render_mode_3() -> None:
    text_object = [
        ([], "BT"),
        ([3], "Tr"),
        (["hello"], "Tj"),
        ([], "ET"),
    ]

    assert _text_object_is_hidden(text_object) is True


def test_text_object_is_not_hidden_when_text_show_uses_visible_render_mode() -> None:
    text_object = [
        ([], "BT"),
        ([0], "Tr"),
        (["hello"], "Tj"),
        ([], "ET"),
    ]

    assert _text_object_is_hidden(text_object) is False


def test_text_object_is_not_hidden_when_render_mode_switches_before_text_show() -> None:
    text_object = [
        ([], "BT"),
        ([3], "Tr"),
        ([0], "Tr"),
        (["visible"], "Tj"),
        ([], "ET"),
    ]

    assert _text_object_is_hidden(text_object) is False


def test_text_object_inherits_hidden_render_mode_from_previous_object() -> None:
    text_object = [
        ([], "BT"),
        (["inherited"], "Tj"),
        ([], "ET"),
    ]

    hidden, final_render_mode = _analyze_text_object_visibility(
        text_object,
        initial_render_mode=3,
    )

    assert hidden is True
    assert final_render_mode == 3


def test_text_object_returns_final_render_mode_for_following_objects() -> None:
    text_object = [
        ([], "BT"),
        ([3], "Tr"),
        (["hidden"], "Tj"),
        ([], "ET"),
    ]

    hidden, final_render_mode = _analyze_text_object_visibility(text_object)

    assert hidden is True
    assert final_render_mode == 3


def test_text_object_is_hidden_when_effective_opacity_is_zero() -> None:
    text_object = [
        ([], "BT"),
        ([0], "Tr"),
        (["invisible"], "Tj"),
        ([], "ET"),
    ]

    hidden, _ = _analyze_text_object_visibility(text_object, effective_opacity=0.0)

    assert hidden is True
    assert _text_object_is_hidden(text_object) is False


def test_strip_removes_zero_opacity_text_but_keeps_opaque_text() -> None:
    pdf = pikepdf.Pdf.new()
    page = pdf.add_blank_page(page_size=[300, 400])
    font = pdf.make_indirect(
        pikepdf.Dictionary(Type=Name("/Font"), Subtype=Name("/Type1"), BaseFont=Name("/Helvetica"))
    )
    transparent = pdf.make_indirect(pikepdf.Dictionary(Type=Name("/ExtGState"), ca=0))
    page.obj[Name("/Resources")] = pikepdf.Dictionary(
        Font=pikepdf.Dictionary(F1=font),
        ExtGState=pikepdf.Dictionary(GS0=transparent),
    )
    page.obj[Name("/Contents")] = pdf.make_stream(
        b"q /GS0 gs BT /F1 12 Tf 72 720 Td 0 Tr (hidden text) Tj ET Q "
        b"BT /F1 12 Tf 72 700 Td 0 Tr (visible text) Tj ET"
    )

    content_stream, removed = _strip_hidden_text_objects_from_page(page)
    assert removed >= 1
    assert content_stream is not None
    visible_hex = b"<" + "visible text".encode("latin-1").hex().encode("ascii") + b">"
    hidden_hex = b"<" + "hidden text".encode("latin-1").hex().encode("ascii") + b">"
    assert visible_hex in content_stream
    assert hidden_hex not in content_stream

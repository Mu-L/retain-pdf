import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from live_smoke import configure_translation


def test_full_pdf_workers_match_frozen_connection_without_reusing_page_selection():
    source = {"model": "qwen3.8-flash", "base_url": "https://dashscope.aliyuncs.com/compatible-mode/v1",
              "credential_ref": "cred_test", "api_key": "secret", "workers": 2,
              "start_page": 5, "end_page": 6, "page_ranges": [6]}
    result = configure_translation(source, workers=8, all_pages=True, fake_ip=True)
    assert result["workers"] == result["execution_connection"]["concurrency"] == 8
    assert (result["start_page"], result["end_page"], result["page_ranges"]) == (0, -1, [])
    assert result["api_key"] == ""
    assert result["execution_connection"]["thinking"] == "off"
    assert source["api_key"] == "secret" and source["start_page"] == 5


def test_default_smoke_remains_two_pages():
    result = configure_translation({"model": "qwen3.8-flash", "base_url": "https://example.org",
                                    "credential_ref": "cred_test"}, workers=2, all_pages=False, fake_ip=False)
    assert result["end_page"] == 1
    assert not result["execution_connection"]["allow_private_endpoint"]

"""环境变量配置。所有凭证只走环境变量,代码与仓库不落任何密钥。"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path


def _repo_root() -> Path:
    # backend/ai_service/retainpdf_ai/config.py -> 仓库根
    return Path(__file__).resolve().parents[3]


@dataclass(frozen=True)
class Settings:
    host: str = "127.0.0.1"
    port: int = 41100
    # 本服务自身的认证 key 集合(与 Rust API 同风格的 X-API-Key)
    api_keys: frozenset[str] = field(default_factory=frozenset)
    # 调用 Rust API 用
    rust_api_base: str = "http://127.0.0.1:41000"
    rust_api_key: str = ""
    # LLM(DeepSeek 或兼容端点)
    llm_base_url: str = "https://api.deepseek.com/v1"
    llm_model: str = "deepseek-v4-flash"
    llm_api_key: str = ""
    llm_timeout_s: float = 60.0
    # agent 循环护栏
    max_tool_rounds: int = 6
    # B2 memory：近期窗口 / 超过则压缩 / MemoryView 字符上限
    memory_window_turns: int = 6
    memory_compress_after_turns: int = 12
    memory_max_chars: int = 24000
    # 任务产物根目录(data/jobs/<job_id>/...)
    data_root: Path = field(default_factory=lambda: _repo_root() / "data")


def load_settings() -> Settings:
    # 钥匙单源：单机部署一把钥匙就够。RETAIN_AI_API_KEYS 缺省时回退
    # RETAIN_API_KEYS（rust_api 的钥匙集）——此前双 env 必须人肉保持同步，
    # 错配时前端只能看到费解的 401（审计 D4 备注）。显式设置仍优先，兼容不破。
    raw_keys = os.environ.get("RETAIN_AI_API_KEYS", "").strip() or os.environ.get(
        "RETAIN_API_KEYS", ""
    )
    api_keys = frozenset(key.strip() for key in raw_keys.split(",") if key.strip())
    data_root = os.environ.get("RETAIN_AI_DATA_ROOT", "").strip()
    return Settings(
        host=os.environ.get("RETAIN_AI_HOST", "127.0.0.1"),
        port=int(os.environ.get("RETAIN_AI_PORT", "41100")),
        api_keys=api_keys,
        rust_api_base=os.environ.get("RETAIN_AI_RUST_API_BASE", "http://127.0.0.1:41000").rstrip("/"),
        rust_api_key=os.environ.get("RETAIN_AI_RUST_API_KEY", "").strip(),
        llm_base_url=os.environ.get("RETAIN_AI_LLM_BASE_URL", "https://api.deepseek.com/v1").rstrip("/"),
        llm_model=os.environ.get("RETAIN_AI_LLM_MODEL", "deepseek-v4-flash"),
        llm_api_key=os.environ.get("RETAIN_AI_LLM_API_KEY", "").strip(),
        llm_timeout_s=float(os.environ.get("RETAIN_AI_LLM_TIMEOUT_S", "60")),
        max_tool_rounds=int(os.environ.get("RETAIN_AI_MAX_TOOL_ROUNDS", "6")),
        memory_window_turns=int(os.environ.get("RETAIN_AI_MEMORY_WINDOW_TURNS", "6")),
        memory_compress_after_turns=int(os.environ.get("RETAIN_AI_MEMORY_COMPRESS_AFTER_TURNS", "12")),
        memory_max_chars=int(os.environ.get("RETAIN_AI_MEMORY_MAX_CHARS", "24000")),
        data_root=Path(data_root) if data_root else _repo_root() / "data",
    )

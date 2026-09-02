# `backend/` 兼容目录

`backend/` 已不再是 RetainPDF 后端源码根目录。当前后端统一位于
[`services/`](../services/README.md)：

- Rust API、jobs daemon 和数据 crate：[`services/api/`](../services/api/README.md)
- Python OCR / 翻译 / 渲染流水线：[`services/pipeline/`](../services/pipeline/README.md)
- AI 问答和 PDF Agent：[`services/ai/`](../services/ai/README.md)
- 后端本地契约镜像：[`services/contracts/`](../services/contracts/README.md)
- Docker 后端入口：[`services/docker/`](../services/docker/README.md)

本目录目前只剩 `python-tests/` 迁移遗留和本地系统文件。不得在这里新增后端
源码、runtime、密钥或构建产物，也不要再把 `backend/rust_api`、
`backend/scripts` 写进新文档和自动化。

## 当前验证入口

```bash
# Rust API workspace
cargo test --manifest-path services/api/Cargo.toml --workspace

# Python 后端依赖与测试
uv sync --project services --extra test
uv run --project services python -m pytest services/ai/tests services/scripts/tests

# Python pipeline 架构门禁
uv run --project services python services/pipeline/devtools/check_pipeline_architecture.py

# 后端契约镜像
python3 services/contracts/check_parity.py --require-upstream
```

更完整的命令和边界见根目录
[`CONTRIBUTING.md`](../CONTRIBUTING.md) 与
[`docs/backend/ARCHITECTURE.md`](../docs/backend/ARCHITECTURE.md)。

## `python-tests/` 状态

`backend/python-tests/` 是目录迁移前的旧 runner，并仍包含旧
`backend/pipeline` 默认路径。它不再是正式测试入口；新增测试应进入对应的
`services/ai/tests`、`services/scripts/tests`、`services/pipeline/**/tests` 或 Rust
crate。清理该 runner 需要单独的代码迁移，不属于文档更新。

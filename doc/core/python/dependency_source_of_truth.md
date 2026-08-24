# Python 依赖单一事实来源

Python 后端按可部署单元维护依赖：

- Pipeline：[`services/pipeline/pyproject.toml`](../../../services/pipeline/pyproject.toml)
- AI 服务：[`services/ai/pyproject.toml`](../../../services/ai/pyproject.toml)
- 根 [`pyproject.toml`](../../../pyproject.toml) 只组合 uv workspace，不再重复声明第三方依赖

## 现在怎么维护

- 各服务运行时依赖：对应成员的 `project.dependencies`
- 各服务测试依赖：对应成员的 `project.optional-dependencies.test`
- Python 版本：
  `project.requires-python`
- 非 Python 二进制依赖：
  `tool.retain_pdf.external-binaries`

不要再直接手改这些生成产物：

- `infra/docker/requirements-app.txt`
- `infra/docker/requirements-test.txt`
- `apps/desktop/requirements-desktop-*.txt`
- `apps/desktop/requirements-ai-service.txt`

## 更新方式

修改成员 `pyproject.toml` 后，执行：

```bash
python services/pipeline/devtools/sync_python_requirements.py --repo-root .
```

如果只想检查是否漂移：

```bash
python services/pipeline/devtools/sync_python_requirements.py --repo-root . --check
```

## 当前口径

运行时 Python 包：

- `Pillow`
- `PyMuPDF`
- `pikepdf`
- `requests`
- `urllib3`

测试额外包：

- `pytest`
- `python-docx`（Word export 测试）

非 Python 二进制依赖：

- `typst`：必需
- `gs`：可选压缩路径依赖

## 为什么这样做

之前 Docker、desktop、CI 各自维护 requirements，容易出现：

- 某个平台漏装包
- 运行时和桌面打包版本漂移
- CI 通过，但本地或发布构建失败

现在的目标是：

- 只改一处
- 多处生成
- CI 用 `--check` 阻止漂移进入主线

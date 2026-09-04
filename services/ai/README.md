# retainpdf-ai

常驻 AI 服务。当前产品模式只回答一个任务的 `md/full.md`：不检索
`document.v1.json`、PDF、收藏、全库 FTS 或其他文档。Rust API 只用于把
`document_id` / `job_id` 锁到同一个任务；Markdown 以只读方式从任务目录加载。

## 架构

```
POST /v1/ask ──▶ AgentRuntime
                    ├── python-retrieval-v1 (默认)
                    └── vercel-fx-acp-v1 (实验开关)
                         ├── fx acp 0.0.5 (无 MCP，私有 HOME/workspace)
                         └── 宿主命令中介 → retainpdf-agent → Rust operation API
                  RetrievalAgent(薄循环,DeepSeek function calling)
                    │  工具注册表(与主流 agent SDK 同构的 name+schema+handler)
                    ├── search_markdown       → data/jobs/<job>/md/full.md
                    └── read_markdown_chunk   → 读取一个确定的 Markdown 片段
返回:answer + citations[](document/job + Markdown chunk 兼容锚点)+ tool_trace
```

旧的 `list_documents` / `search_fulltext` / `read_blocks` /
`search_favorites` handler 暂留在内部注册表，便于未来做显式模式切换；当前
agent 不会把它们暴露给模型，模型即使幻觉调用也会被拒绝。`md/full.md`
缺失时直接返回工具错误，不会静默回退到 JSON 或 FTS。

刻意不用 agent 框架:单 provider、单用户本地服务,裸循环全权掌控超时/
轮数/引用编号;工具定义同构,将来迁移只换循环外壳。

## 运行

```bash
RETAIN_AI_API_KEYS=dev-local-key \
RETAIN_AI_RUST_API_KEY=dev-local-key \
RETAIN_AI_LLM_API_KEY=sk-... \
retainpdf-ai
# 等价兼容入口：python3 -m retainpdf_ai
```

环境变量(均有默认值,凭证除外):

| 变量 | 默认 | 说明 |
|---|---|---|
| `RETAIN_AI_API_KEYS` | 必填 | 本服务的 X-API-Key 集合(逗号分隔) |
| `RETAIN_AI_RUST_API_KEY` | 必填 | 调用 Rust API 的 key |
| `RETAIN_AI_LLM_API_KEY` | 必填 | DeepSeek(或兼容端点)key |
| `RETAIN_AI_RUST_API_BASE` | `http://127.0.0.1:41000` | Rust API 地址 |
| `RETAIN_AI_LLM_BASE_URL` | `https://api.deepseek.com/v1` | LLM 端点 |
| `RETAIN_AI_LLM_MODEL` | `deepseek-v4-flash` | 模型 |
| `RETAIN_AI_PORT` | `41100` | 监听端口 |
| `RETAIN_AI_MAX_TOOL_ROUNDS` | `6` | agent 工具轮数上限 |
| `RETAIN_AI_MEMORY_WINDOW_TURNS` | `6` | 近期保留对话轮数 |
| `RETAIN_AI_MEMORY_COMPRESS_AFTER_TURNS` | `12` | 超过则抽取式压缩早期轮次 |
| `RETAIN_AI_MEMORY_MAX_CHARS` | `24000` | 喂给模型的 history 字符上限 |
| `RETAIN_AI_DATA_ROOT` | `<repo>/data` | 任务产物根目录 |
| `RETAIN_AI_RUNTIME` | `python` | `python` 或实验性的 `fx` |
| `RETAIN_AI_FX_COMMAND` | `fx` | 固定的 fx 可执行文件路径/名称 |
| `RETAIN_AI_FX_EXPECTED_VERSION` | `0.0.5` | ACP 初始化必须精确匹配的 fx 版本 |
| `RETAIN_AI_FX_GATEWAY_API_KEY` | 空 | 仅 fx 子进程使用，不复用 Rust API key |
| `RETAIN_AI_FX_MODEL` | 空 | 后端配置的 fx 模型；HTTP 请求不能指定 |
| `RETAIN_AI_FX_OPENAI_BASE_URL` | 空 | 可选 OpenAI Chat Completions 兼容端点；设置后由宿主回环桥接，不需要 Vercel Gateway key |
| `RETAIN_AI_FX_OPENAI_API_KEY` | 空 | 兼容端点 key；空值表示不发送 Authorization |
| `RETAIN_AI_FX_STATE_ROOT` | `data/agent-runtime/fx` | 私有 HOME、workspace 与 session 状态根 |
| `RETAIN_AI_FX_AGENT_CLI_COMMAND` | `retainpdf-agent` | 仅由宿主中介启动的真实控制 CLI 路径/名称 |

fx 只批准经过精确 argv 语法验证的 `retainpdf-agent` 控制命令。每次调用由
宿主签发单 action、60 秒的 document/conversation scoped capability，并在
独立子进程里执行真实 CLI；fx 环境和生成的 wrapper 都拿不到 capability 或
Rust API key。`operation run/commit` 还要求本次 HTTP 请求带有用户侧
`confirm_document_operation: true`，模型无法自行提升确认状态。
`operation run` 保持为同一个粗粒度工具：失败后可加 `--retry failed`；状态为
`ambiguous` 时必须使用 `--retry ambiguous --accept-duplicate-risk yes`。宿主把
它们映射成持久化 retry attempt，同一请求断网重放不会创建多个 attempt。

当前已支持 `retainpdf_page_program_v1`：通过 `select_pages` 和
`rotate_pages` 的顺序组合完成页面删除、重排、复制和旋转，生成真实 PDF
candidate。每个输出页还会按批准的页面计划做最长边最大 512px 的整页栅格化，
与对应源页的预期旋转结果做 RGB 像素比较；visual report 的 hash 由 Rust 在
发布前复核。执行的是固定
后端解释器，不是模型 Python；任意 Python、Typst、Ghostscript 程序仍需独立
OS/container 隔离后才能开放。

## 调用示例

```bash
curl -s -X POST http://127.0.0.1:41100/v1/ask \
  -H "X-API-Key: dev-local-key" -H "Content-Type: application/json" \
  -d '{"document_id":"doc-id","job_id":"job-id","question":"这篇文献对卤素锂交换的结论是什么?"}'
```

## 测试

```bash
python3 -m pip install "./services/ai[test]"
python3 -m pytest services/ai/tests/ -q
```

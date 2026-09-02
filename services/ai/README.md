# retainpdf-ai

常驻 AI 服务。默认的 `python-retrieval-v1` 只回答一个任务的 `md/full.md`：
不检索 `document.v1.json`、PDF、收藏、全库 FTS 或其他文档。实验性的
`vercel-fx-acp-v1` 通过 host-owned broker 创建 durable PDF operation；Rust
仍是 operation、candidate、commit 和恢复状态的唯一权威来源。

## 架构

```
POST /v1/ask ──▶ AgentRuntime
                    ├── python-retrieval-v1 (默认)
                    ├── openai-compatible-agent-v1
                    │    └── 自定义 URL/模型/Key → host broker → Rust operation API
                    └── vercel-fx-acp-v1 (实验开关)
                         ├── fx acp 0.0.5 (无 MCP，私有 HOME/workspace)
                         └── 宿主命令中介 → retainpdf-agent → Rust operation API
                  RetrievalAgent(薄循环,DeepSeek function calling)
                    │  工具注册表(与主流 agent SDK 同构的 name+schema+handler)
                    ├── search_markdown       → data/jobs/<job>/md/full.md
                    └── read_markdown_chunk   → 读取一个确定的 Markdown 片段
返回:answer + citations[](document/job + Markdown chunk 兼容锚点)+ tool_trace；
SSE 另提供 `agent_session`、`agent_operation`，`done.operation_refs` 作为断线前的
发现提示。浏览器收到提示后仍必须查询 Rust public operation API 获取权威状态。
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
| `RETAIN_AI_RUNTIME` | `python` | `python`、`openai` 或实验性的 `fx` |
| `RETAIN_AI_AGENT_CONFIRMATION_MODE` | `explicit` | `explicit` 或仅放行受限 PDF operation 的 `green_light` |
| `RETAIN_AI_AGENT_CLI_COMMAND` | `retainpdf-agent` | 所有文档 Agent 共用的宿主控制 CLI |
| `RETAIN_AI_FX_COMMAND` | `fx` | 固定的 fx 可执行文件路径/名称 |
| `RETAIN_AI_FX_EXPECTED_VERSION` | `0.0.5` | ACP 初始化必须精确匹配的 fx 版本 |
| `RETAIN_AI_FX_GATEWAY_BASE_URL` | 空（FX 官方 Gateway） | FX 0.0.5 自定义 Gateway；仅支持带端口的回环 HTTP |
| `RETAIN_AI_FX_GATEWAY_API_KEY` | 空 | 仅 fx 子进程使用，不复用 Rust API key |
| `RETAIN_AI_FX_MODEL` | 空 | 后端配置的 fx 模型；HTTP 请求不能指定 |
| `RETAIN_AI_FX_STATE_ROOT` | `data/agent-runtime/fx` | 私有 HOME、workspace 与 session 状态根 |
| `RETAIN_AI_FX_AGENT_CLI_COMMAND` | `retainpdf-agent` | 仅由宿主中介启动的真实控制 CLI 路径/名称 |

`openai` 使用 `RETAIN_AI_LLM_BASE_URL`、`RETAIN_AI_LLM_MODEL` 和
`RETAIN_AI_LLM_API_KEY`，因此可接入任意支持 Chat Completions function calling
的 OpenAI-compatible 模型端点。它与 FX 共用 host-owned broker、短期 capability、
显式 run/commit 确认、候选版本和 Rust 恢复状态；模型不会直接接触 Rust API key。

FX 0.0.5 没有公开的任意远程 endpoint 参数。它只接受环境变量形式的本地测试
覆盖，而且只信任 `http://127.0.0.1:<port>`、`http://localhost:<port>` 或
`http://[::1]:<port>`。配置自定义地址时，后端同时向私有 FX 子进程传入
`FX_GATEWAY_BASE_URL` 和派生的
`FX_GATEWAY_CHAT_URL=<base>/v3/ai/language-model`；只传前者不会改变主模型请求。
空值保留 FX 官方 Gateway。其他地址会在保存或启动前明确失败，避免 FX 静默回退
官方地址。需要远程自定义域名时应升级或修改 FX；普通 OpenAI-compatible 地址继续
使用 `openai` 模式。

主页“设置 → API 设置 → AI Agent”可一次性录入模型 Key、FX Gateway URL 或 FX
Gateway Key。浏览器只发送本次输入，不回填 Key、不写 localStorage；AI 服务把配置写到
`$RETAIN_AI_DATA_ROOT/secrets/ai-runtime.json`，目录权限为 `0700`、文件权限为
`0600`，GET 接口只返回配置状态和掩码。配置文件使用单调 revision、进程内锁、
跨进程文件锁和 compare-and-swap，避免两个局部更新互相覆盖；写入完成后还会
fsync 文件及父目录。保存前会校验 URL、必需 Key、FX ACP 能力，并对自定义本地
Gateway 做有界 TCP 可达性检查；保存成功后由 Rust 监督器重启 AI 子进程。
`/readyz` 只有在新进程载入同一 configured revision 且自定义 Gateway 仍可达时
才返回 200，`/healthz` 只表示进程存活。环境变量仍作为未创建安全配置文件时的
启动回退；显式保存空 FX URL 表示官方默认 Gateway，不会重新落回环境变量 URL。

对应的受鉴权入口经 Rust API 暴露为：

- `GET /api/v1/ai/runtime-config`
- `PUT /api/v1/ai/runtime-config`

响应绝不包含原始 Key。空密码输入表示沿用已保存值；显式清除使用
`clear_llm_api_key` / `clear_fx_gateway_api_key`，并继续受当前模式的必需凭据
校验约束。客户端可把 GET 返回的 `configured_revision` 作为 PUT 的
`expected_revision`；过期写入返回 409。GET 同时返回 `active_revision`、
`restart_state` 和实际派生的 FX base/chat URL，因而无需靠轮询猜测重启是否完成。

fx 只批准经过精确 argv 语法验证的 `retainpdf-agent` 控制命令。每次调用由
宿主签发单 action、60 秒的 document/conversation scoped capability，并在
独立子进程里执行真实 CLI；fx 环境和生成的 wrapper 都拿不到 capability 或
Rust API key。默认 `explicit` 模式下，`operation run/commit` 还要求本次 HTTP
请求带有用户侧 `confirm_document_operation: true`，模型无法自行提升确认状态；
未确认时响应会包含 `confirmation_requests`，流式请求还会产生
`agent_confirmation_required`，前端不应解析模型的“确认”文案。

`green_light` 模式把受限 PDF operation 的 run/commit 视为宿主已授权，允许 Agent
在状态机许可时直接生成并提交候选版本。它不会开放 shell、文件路径或任意程序：精确
命令语法、当前文档/会话范围、短期 capability、幂等键、Rust 状态校验和 candidate
验证全部保留。该模式默认关闭，可通过 runtime-config 的
`agent_confirmation_mode` 持久化修改，修改后需按 revision 机制重启生效。
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

# RetainPDF AI Runtime

**状态：** 当前实现说明

**更新：** 2026-09-02

**范围：** `services/ai`、Rust AI proxy 与公开问答/operation 契约

**非范围：** OCR、翻译和排版流水线内部实现

配套文档：

- [SESSION_AND_MEMORY.md](./SESSION_AND_MEMORY.md)：会话树、摘要与恢复
- [SKILLS.md](./SKILLS.md)：尚在演进的 Skill 设计
- [`services/ai/README.md`](../../services/ai/README.md)：运行、配置和运维入口
- [`services/api/src/services/document_operations/README.md`](../../services/api/src/services/document_operations/README.md)：PDF operation 状态机

## 1. 不可破坏的边界

1. Rust 是 document、conversation、job、operation、candidate 与 commit 的唯一
   持久化写入者；AI 服务不直接写 SQLite。
2. 浏览器、模型输出和 SSE 都不是权威状态。operation 事件只负责提示刷新，最终
   状态必须重新查询 Rust public API。
3. 用户消息、历史、摘要、Markdown 和工具结果均是不可信数据，不能提升权限。
4. `run`/`commit` 只能由请求级显式确认或已配置的 `green_light` 授权。
5. LLM、FX 和生成的 wrapper 均不能获得 Rust API key。实际操作使用单 action、
   短 TTL capability。
6. `/v1/ask` 的字段、SSE 类型和 done payload 由
   `services/contracts/ai-ask.v1.schema.json` 约束。

## 2. 当前调用链

```text
Frontend
  │ POST /api/v1/ai/ask
  ▼
Rust ai_proxy（按字节转发 JSON/SSE）
  │ POST /v1/ask
  ▼
app.py
  ├── 鉴权、FastAPI 初始化、health/config 路由注册
  └── AskOrchestrator.prepare()       在响应开始前完成 runtime/凭据校验
      ├── ConversationState           会话、可见分支、摘要与 durable 写入
      ├── AgentRuntime                python / openai / fx
      └── sync JSON 或 SSE worker
```

同步和流式路径共享同一个 `AskOrchestrator`。`app.py` 不实现工具循环、会话树、
凭据持久化或 broker 语法。

## 3. 模块职责

| 模块 | 职责 |
|---|---|
| `app.py` | 进程级依赖装配、鉴权、健康检查和薄 `/v1/ask` route |
| `api_contracts.py` | `AskInput`、`RuntimeConfigUpdate` |
| `ask_orchestration.py` | runtime 路由、请求级 LLM 设置、同步/SSE turn、结果投影 |
| `conversation_state.py` | 会话创建、历史读取、摘要提交、消息预写与最终回写 |
| `conversation_tree.py` | 纯可见分支算法；兼容无 `message_id/parent_id` 的旧记录 |
| `runtime_config_api.py` | runtime-config GET/PUT、revision CAS、自检与 `/readyz` |
| `runtime.py` | 旧 import 兼容 façade |
| `runtimes/contracts.py` | `AgentRuntime`、capabilities、`AskResult`、`Citation` |
| `runtimes/python.py` | Markdown 检索运行时适配 |
| `runtimes/openai.py` | OpenAI-compatible function-calling Agent |
| `runtimes/fx.py` | FX ACP turn 编排；其余 FX 细节位于相邻模块 |
| `agent.py` | 旧检索 Agent import 兼容 façade |
| `retrieval_agent.py` | bounded Markdown tool loop 与 scope 注入 |
| `agent_llm.py` | OpenAI-compatible HTTP/SSE transport、错误映射 |
| `agent_evidence.py` | 引用编号、模型可见安全投影、答案清洗 |
| `agent_command_broker.py` | broker 生命周期、capability 和真实 CLI 子进程 |
| `agent_broker_*.py` | broker 契约、精确命令语法、事件投影、socket framing |
| `tools.py` | 工具注册表与 RetainPDF 只读工具实现 |
| `rust_client.py` | AI 服务访问 Rust 权威 API 的客户端 |

依赖方向是 `app → orchestration → state/runtime → broker/tools`。兼容 façade 只做
re-export，不应重新吸收业务逻辑。

## 4. Runtime 与请求模式

进程级 `RETAIN_AI_RUNTIME` 支持：

| 配置值 | runtime id | 能力 |
|---|---|---|
| `python` | `python-retrieval-v1` | 当前任务 `md/full.md` 检索问答 |
| `openai` | `openai-compatible-agent-v1` | OpenAI-compatible 模型、读取能力与 durable PDF operation |
| `fx` | `vercel-fx-acp-v1` | FX ACP 管理的 PDF operation；不直接读取文档正文 |

请求字段 `assistant_mode` 再限定本轮能力：

- `reading`：使用可用的 Python Markdown 阅读 runtime。
- `operations`：只接受具有 `document_operations` capability 的 runtime。
- `auto`：使用进程默认 runtime；如果文档请求落到“能操作但不能阅读”的 FX，返回
  409，要求调用方明确选择 `reading` 或 `operations`，不猜测用户意图。

Python 阅读模式只向模型暴露 `search_markdown` 与 `read_markdown_chunk`。注册表里
保留的旧 FTS/blocks/favorites handler 当前不会暴露给该模型。

## 5. 一次 turn 的 durable 顺序

```text
1. 选择 runtime，并在 HTTP/SSE 响应开始前校验所需凭据
2. 由 job_id 解析 document_id（若请求未直接提供）
3. 复用或创建 conversation_id
4. 读取 conversation 全量记录并投影当前 head 的可见分支
5. 必要时生成 extractive_v1 摘要；摘要先经 Rust durable 写入
6. operation runtime 在执行前先 durable 写入本轮 user message
7. 执行 runtime；工具/SSE 仅发安全投影
8. 生成宿主 confirmation_requests
9. durable 写入 assistant 结果和 citations/tool trace
10. 最后发送 done；写入失败时 done.persisted=false
```

第 6 步保证 operation 的 `request_message_id` 一定对应权威会话消息。客户端使用稳定
`user_message_id` 重试时，若第一次写入成功但响应丢失，AI 服务只会复用 ID、role、
content 全部匹配的既有消息。

## 6. SSE 契约

当前事件类型：

| type | 含义 |
|---|---|
| `compress` | 新摘要已 durable 提交；随后 turn 使用该摘要分支 |
| `agent_session` | 本轮 conversation、request message、runtime 与 capability 视图 |
| `tool` | Python 检索工具调用提示 |
| `agent_tool` | Agent runtime 的安全工具过程投影 |
| `agent_operation` | operation 发现/刷新提示，不是权威状态 |
| `answer_delta` | 最终回答的增量文本片段，不是累积全文 |
| `agent_confirmation_required` | 宿主产生的结构化确认请求 |
| `done` | 最终结果；包含 persisted、runtime、operation refs 与 memory debug |
| `error` | 本轮失败；`RuntimeError` 使用可行动消息，其他异常保留类型名 |

典型顺序：

```text
compress? → agent_session → tool/agent_tool/agent_operation/answer_delta*
          → agent_confirmation_required* → durable persist → done
```

OpenAI-compatible 流式解析会暂存最初 64 个字符用于判断当前轮是否转为 tool call；
工具调用前言不会作为 `answer_delta` 泄漏。浏览器断开不会撤销已提交状态，恢复后应
从 Rust conversation/operation API 重新读取。

## 7. 凭据与 runtime 配置

受鉴权入口：

- `GET /api/v1/ai/runtime-config`
- `PUT /api/v1/ai/runtime-config`

安全配置保存在 `$RETAIN_AI_DATA_ROOT/secrets/ai-runtime.json`，GET 只返回掩码和
是否已配置，不回传明文。更新使用 `expected_revision` compare-and-swap；成功后由
监督器重启 AI 服务。`/healthz` 表示进程存活，`/readyz` 还验证配置 revision 已生效
以及自定义 FX Gateway 可达。

OpenAI runtime 使用普通 `llm_base_url/model/api_key`。FX 0.0.5 的自定义 Gateway
仅支持带端口的 loopback HTTP bridge；远程 DeepSeek/OpenAI-compatible 地址应选择
`openai` runtime。

## 8. PDF operation 安全边界

模型只能提出 broker 支持的精确 `retainpdf-agent` argv。宿主会再次解析参数、注入
conversation/document/request-message scope 和幂等键，再签发 60 秒单 action
capability。真实 CLI 在独立子进程运行，stdin 关闭，环境变量最小化，stdout/stderr
有大小限制并执行 capability 脱敏。

当前 page program 只支持 `select_pages` 与 `rotate_pages`。`create` 只产生 draft，
`run` 产生 candidate，`commit` 才切换活动版本。`explicit` 模式要求宿主确认；
`green_light` 也不会放开 shell、任意路径或任意程序。

## 9. 状态恢复

- 会话与消息树：Rust conversation API。
- Markdown 读取：job durable artifact。
- PDF operation/candidate/commit：Rust SQLite 与 artifact store。
- FX cursor：Rust runtime-session 映射；cursor 丢失时可用有界会话上下文重建 session。
- AI 进程内 queue、worker thread 和模型 token：非 durable，不作为恢复依据。

因此重启或断网后的原则是“重新读取权威快照”，不是重放浏览器最后看到的文本事件。

## 10. 验证

```bash
uv run --project services ruff check \
  services/ai/retainpdf_ai/app.py \
  services/ai/retainpdf_ai/ask_orchestration.py \
  services/ai/retainpdf_ai/agent.py \
  services/ai/retainpdf_ai/agent_llm.py \
  services/ai/retainpdf_ai/agent_evidence.py \
  services/ai/retainpdf_ai/retrieval_agent.py \
  services/ai/retainpdf_ai/conversation_state.py \
  services/ai/retainpdf_ai/conversation_tree.py \
  services/ai/tests/test_contract_schema.py
uv run --project services python -m pytest services/ai/tests -q
python services/contracts/check_parity.py --require-upstream
```

契约测试会扫描真正产生 SSE/done payload 的 `ask_orchestration.py`，而不是只扫描
薄 route `app.py`。

## 11. 尚未完成的路线图

- 声明式 Skill 加载和版本化策略包。
- 多 Agent handoff、critic 与共享 evidence snapshot。
- 跨 turn 持久化引用计数/evidence 表；当前 citations 是每轮快照。
- 真正的客户端取消向同步 runtime/LLM transport 传播。
- 任意代码、Typst 或 Ghostscript Agent 工具所需的独立 OS/container sandbox。

这些都是后续能力，不能在 API 或产品文案中描述为当前已实现。

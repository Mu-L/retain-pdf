# Schemas — 单一真值契约

本目录是 **RetainPDF 跨进程契约的唯一真相源**（JSON Schema）。

| 文件 | 作用 | 消费者 | 生产者 |
|------|------|--------|--------|
| `ai-ask.v1.schema.json` | `/v1/ask` SSE 协议 | `apps/web` `ai-ask-contract.test.mjs` | `backend/ai_service` `test_contract_schema.py` |
| `ai-conversations.v1.schema.json` | 会话 CRUD | `apps/web` `ai-conversations-contract.test.mjs` | `services/api` `conversations_contract.rs` + `backend/ai_service` |
| `jobs-control.v1.schema.json` | shell↔jobsd 控制面 | `services/api` `jobs_control_contract.rs` | `services/api` `retain-jobsd/contract_lock.rs` |
| `pipeline-stdout.v1.schema.json` | Python stdout 协议 | `services/pipeline` worker | `services/api` `retain-jobs/contract_lock.rs` |

**兼容**：旧路径 `backend/contracts/*` 保留为本地 symlink（`backend/contracts -> ../packages/schemas`，已 gitignore），CI 真值以本目录为准。

**规则**：改契约先改 schema，再让两端测试变绿。

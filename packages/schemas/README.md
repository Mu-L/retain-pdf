# Schemas — 单一真值契约

本目录是 **RetainPDF 跨进程契约的唯一真相源**（JSON Schema）。

| 文件 | 作用 | 消费者 | 生产者 |
|------|------|--------|--------|
| `ai-ask.v1.schema.json` | `/v1/ask` SSE 协议 | `apps/web` `ai-ask-contract.test.mjs` | `backend/ai_service` `test_contract_schema.py` |
| `ai-conversations.v1.schema.json` | 会话 CRUD | `apps/web` `ai-conversations-contract.test.mjs` | `services/api` `conversations_contract.rs` + `backend/ai_service` |
| `library-books.v1.schema.json` | 图书馆书架 `/api/v1/library/books` + `/api/v1/jobs` 列表 | `@retainpdf/api` + `apps/web` `library-books-contract.test.mjs` + `apps/web-react` library adapter | `services/api` `crates/retain-core/src/models/view/job_types.rs` `LibraryBookListView`/`JobListView` |
| `job-status.v1.schema.json` | 任务详情、脱敏请求参数、事件流与阶段进度 | `@retainpdf/api` + `packages/domain` + `apps/web`/`apps/web-react` | `services/api` 的 `JobDetailView`、`PublicResolvedJobSpec` 与 `JobEventRecord` |
| `jobs-control.v1.schema.json` | shell↔jobsd 控制面 | `services/api` `jobs_control_contract.rs` | `services/api` `retain-jobsd/contract_lock.rs` |
| `pipeline-stdout.v1.schema.json` | Python stdout 协议 | `services/pipeline` worker | `services/api` `retain-jobs/contract_lock.rs` |

**兼容**：旧路径 `backend/contracts/*` 保留为本地 symlink（`backend/contracts -> ../packages/schemas`，已 gitignore），CI 真值以本目录为准。

**规则**：改契约先改 schema，再让两端测试变绿。

## npm 包

本目录发布为 `@retainpdf/contracts`。Wire DTO 只从 `@retainpdf/contracts/job-status` 与 `@retainpdf/contracts/library-books` 导出；六份原始 schema 以文件名子路径显式导出。包没有根 DTO 入口、wildcard export 或 runtime dependency。

```bash
npm run lint:schemas
npm run generate
npm run generate:check
npm run typecheck
npm test
npm run build
```

`src/job-status.ts` 与 `src/library-books.ts` 由固定版本的 `json-schema-to-typescript` 生成并入库，禁止手改。`generate:check` 阻止生成漂移；测试还会锁定 `job-status` 与 `library-books` 重复 Job definitions 的结构一致性。`packages/domain` 保留的是归一化模型，不应替代 wire DTO。

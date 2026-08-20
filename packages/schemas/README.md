# Schemas — 单一真值契约

本目录是 **RetainPDF 跨进程契约的唯一真相源**（JSON Schema）。

| 文件 | 作用 | 消费者 | 生产者 |
|------|------|--------|--------|
| `ai-ask.v1.schema.json` | `/v1/ask` SSE 协议 | `apps/web` `ai-ask-contract.test.mjs` | `backend/ai_service` `test_contract_schema.py` |
| `ai-conversations.v1.schema.json` | 会话 CRUD | `apps/web` `ai-conversations-contract.test.mjs` | `services/api` `conversations_contract.rs` + `backend/ai_service` |
| `library-books.v1.schema.json` | 图书馆书架 `/api/v1/library/books` + `/api/v1/jobs` 列表 | `apps/web` `library-books-contract.test.mjs` + `apps/web-react` `library-api-types.ts` | `services/api` `crates/retain-core/src/models/view/job_types.rs` `LibraryBookListView`/`JobListView` |
| `job-status.v1.schema.json` | 任务状态与阶段进度（`JobDetailView`/`stage_snapshot`/`progress`/`cover_url`）| `apps/web` `job-status-contract.test.mjs` (`src/js/job/types.ts` & `src/js/job-status/types.ts`) + `apps/web-react` `src/features/status` | `services/api` `crates/retain-core/src/models/view/{job_types.rs,common.rs}` |
| `jobs-control.v1.schema.json` | shell↔jobsd 控制面 | `services/api` `jobs_control_contract.rs` | `services/api` `retain-jobsd/contract_lock.rs` |
| `pipeline-stdout.v1.schema.json` | Python stdout 协议 | `services/pipeline` worker | `services/api` `retain-jobs/contract_lock.rs` |

**兼容**：旧路径 `backend/contracts/*` 保留为本地 symlink（`backend/contracts -> ../packages/schemas`，已 gitignore），CI 真值以本目录为准。

**规则**：改契约先改 schema，再让两端测试变绿。

> **Rust↔TS 去重说明**：`library-books` 与 `job-status` 以本目录为真值，手写 TS 类型（`apps/web` `src/js/job/types.ts` / `src/js/job-status/types.ts` 与 `apps/web-react` `src/features/library/api/library-api-types.ts`）为镜像，契约测试锁定 `job_id/display_name/workflow/status/stage_snapshot/progress/cover_url` 等高重复字段。后续以本目录生成 TS（`packages/schemas` → `packages/types` 或 `openapi-typescript`/`json-schema-to-typescript`）替换手写，目前先以注释与测试门禁约束一致性。

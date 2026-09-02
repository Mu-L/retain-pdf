# Schemas — 单一真值契约

本目录是 **RetainPDF 跨进程契约的唯一真相源**（JSON Schema）。

| 文件 | 作用 | 消费者 | 生产者 |
|------|------|--------|--------|
| `ai-ask.v1.schema.json` | `/v1/ask` SSE 协议 | `apps/web/tests/contracts/ai-ask-contract.test.mjs` | `services/ai/tests/test_contract_schema.py` |
| `ai-conversations.v1.schema.json` | 会话 CRUD | `apps/web` 与 `services/ai` | `services/api/src/api_tests/conversations_contract.rs` |
| `library-books.v1.schema.json` | 图书馆书架 `/api/v1/library/books` + `/api/v1/jobs` 列表 | `@retainpdf/api`、`apps/web`、`apps/web-react` | `services/api/crates/retain-core/src/models/view/job_types.rs` |
| `job-status.v1.schema.json` | 任务详情、脱敏请求参数、事件流与阶段进度 | `@retainpdf/api`、`packages/domain`、`apps/web`、`apps/web-react` | `services/api` public view models |
| `jobs-control.v1.schema.json` | shell↔jobsd 控制面 | `services/api/src/api_tests/jobs_control_contract.rs` | `services/api/crates/retain-jobsd/src/contract_lock.rs` |
| `pipeline-stdout.v1.schema.json` | Python stdout 协议 | `services/api/crates/retain-jobs/src/job_runner/stdout_parser/contract_lock.rs` | `services/pipeline` worker 与对应 contract test |

`packages/schemas/*.schema.json` 是 monorepo 上游真值；
`services/contracts/*.schema.json` 是可独立提取后端使用的字节级镜像。
当前仓库不再依赖 `backend/contracts` 兼容路径。镜像一致性由
`python3 services/contracts/check_parity.py --require-upstream` 检查。

**规则**：改契约先改 schema，再让两端测试变绿。

## npm 包

本目录发布为 `@retainpdf/contracts`。Wire DTO 只从 `@retainpdf/contracts/job-status` 与 `@retainpdf/contracts/library-books` 导出；六份原始 schema 以文件名子路径显式导出。包没有根 DTO 入口、wildcard export 或 runtime dependency。

```bash
npm --prefix packages/schemas run lint:schemas
npm --prefix packages/schemas run generate
npm --prefix packages/schemas run generate:check
npm --prefix packages/schemas run typecheck
npm --prefix packages/schemas test
npm --prefix packages/schemas run build
```

`src/job-status.ts` 与 `src/library-books.ts` 由固定版本的 `json-schema-to-typescript` 生成并入库，禁止手改。`generate:check` 阻止生成漂移；测试还会锁定 `job-status` 与 `library-books` 重复 Job definitions 的结构一致性。`packages/domain` 保留的是归一化模型，不应替代 wire DTO。

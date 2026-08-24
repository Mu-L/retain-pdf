/**
 * Shared types for the job core model (normalize / terminal / artifacts).
 * Inferred from normalize.ts, mock job payloads, and status-card consumers.
 *
 * Source of truth: `packages/schemas/job-status.v1.schema.json` (JobDetailView / JobListView / JobProgressView / JobStageSnapshotView)
 * and `packages/schemas/library-books.v1.schema.json` (JobListItemView cover/progress fields).
 * These hand-written types are a mirror of the Rust views in
 * `services/api/crates/retain-core/src/models/view/job_types.rs` + `common.rs`.
 * Contract tests `tests/job-status-contract.test.mjs` + `tests/library-books-contract.test.mjs`
 * lock `job_id/display_name/workflow/status/stage_snapshot/progress/cover_url`等关键字段。
 * TODO: generate from schemas (json-schema-to-typescript) and re-export here.
 */
export {};

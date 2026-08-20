/**
 * Library / Job 状态类型 — Rust ↔ TS 重复区镜像。
 * 真值: `packages/schemas/library-books.v1.schema.json` 与 `packages/schemas/job-status.v1.schema.json`
 * Rust 视图: `services/api/crates/retain-core/src/models/view/job_types.rs`
 *   LibraryBookListView / LibraryBookListItemView / LibraryBookDetailView / JobListView / JobDetailView
 *   + common.rs JobProgressView / JobStagesView / JobStageSnapshotView
 * 关键字段锁: job_id / display_name / workflow / status / stage_snapshot / progress / cover_url
 * 契约测试: `apps/web/tests/library-books-contract.test.mjs` 与 `job-status-contract.test.mjs`
 * TODO: 改为生成类型——
 *   `npm run generate:types` 从 `packages/schemas/*.v1.schema.json` 用 json-schema-to-typescript 输出到
 *   `packages/types/src/library-books.ts` / `job-status.ts`，本文件改为 `export type * from '@retainpdf/schemas/library-books'`
 *   以彻底消除手写漂移；在此之前手写类型必须通过契约测试。
 */
export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export type JobStatusKind = 'queued' | 'running' | 'succeeded' | 'failed' | 'canceled' | string

export type JobProgressView = {
  current?: number | null
  total?: number | null
  percent?: number | null
}

export type JobListItemView = {
  id?: string
  job_id: string
  title?: string | null
  authors?: string | null
  display_name?: string
  workflow?: string
  status: JobStatusKind
  stage?: string | null
  stage_detail?: string | null
  progress?: JobProgressView | null
  page_count?: number | null
  source_file_name?: string | null
  cover_url?: string | null
  thumbnail_url?: string | null
  output_pdf_ready?: boolean
  markdown_ready?: boolean
  bundle_ready?: boolean
  created_at: string
  updated_at: string
  detail_path: string
  detail_url: string
}

export type JobListView = {
  items: JobListItemView[]
  invocation_summary?: unknown
}

export type JobBookSummaryView = {
  title?: string | null
  authors?: string | null
  page_count?: number | null
  source_language?: string | null
  target_language?: string | null
  source_file_name?: string | null
  cover_url?: string | null
  thumbnail_url?: string | null
  file_size_bytes?: number | null
}

export type JobArtifactDisplayView = {
  key: string
  label: string
  ready: boolean
  kind: string
  file_name?: string | null
  size_bytes?: number | null
  download_url?: string | null
}

export type JobDetailView = JobListItemView & {
  book_summary?: JobBookSummaryView | null
  artifacts_display?: JobArtifactDisplayView[] | null
  artifacts?: JobArtifactDisplayView[] | null
  source_language?: string | null
  target_language?: string | null
  file_size_bytes?: number | null
}

export type LibraryDeleteResultView = {
  deleted: boolean
  job_id: string
  removed_paths: string[]
  removed_child_jobs: string[]
}

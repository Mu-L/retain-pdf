// Shared API types — thin re-exports from @retainpdf/schemas (future: json-schema-to-typescript)
// For now, manual narrow types mirroring schemas/library-books.v1 + job-status.v1

export type JobStatusKind = "queued" | "running" | "succeeded" | "failed" | "canceled" | string;
export type WorkflowKind = "ocr" | "translate" | "render" | string;

export type JobProgressView = {
  current?: number | null;
  total?: number | null;
  percent?: number | null;
  unit?: string;
};

export type LibraryBookListItemView = {
  job_id: string;
  display_name: string;
  workflow: WorkflowKind;
  status: JobStatusKind;
  stage_snapshot?: unknown;
  progress?: JobProgressView | null;
  cover_url?: string | null;
  thumbnail_url?: string | null;
  page_count?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type ApiResponse<T> = {
  code: number;
  message: string;
  data: T;
};

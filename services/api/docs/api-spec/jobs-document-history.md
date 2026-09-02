# Document-scoped Job and Agent History

[Jobs API index](jobs.md) · [API spec index](../../API_SPEC.md)

## Frontend Library Contract

The backend is the source of truth for book/library state. Frontend clients should not persist
PDFs, covers, thumbnails, or generated artifacts locally; they should consume the job/list/detail
views and resource URLs returned by the API.

Storage ownership:

- `uploads`: source file name, source PDF size, and page count
- `jobs`: status, stage, progress, timestamps, and request/runtime state
- `artifacts.artifacts_json`: canonical per-job artifact paths plus cached book display metadata
- `job_artifact_entries`: normalized artifact manifest for download/listing views
- `events`: complete historical progress stream

Book display metadata:

- list items expose `display_name`, `page_count`, `source_file_name`, `cover_url`,
  `thumbnail_url`, `output_pdf_ready`, `markdown_ready`, and `bundle_ready`
- job detail exposes stable `book_summary` and `artifacts_display`
- `cover_url` and `thumbnail_url` are nullable; clients should use their local placeholder cover
  when they are null
- cover/thumbnail paths are cached in `artifacts.artifacts_json` as `cover_image_path` and
  `thumbnail_image_path`; filesystem scanning of published markdown images is only a fallback

Book media endpoints:

- `GET /api/v1/jobs/{job_id}/cover`
- `GET /api/v1/jobs/{job_id}/thumbnail`

## Document-scoped task and Agent version history

`GET /api/v1/documents/:document_id/jobs?limit=50&offset=0` returns the
document's OCR/translation runs in deterministic newest-first order. In
addition to `items` and `invocation_summary`, this projection returns:

- `total`: authoritative number of jobs linked through `jobs.document_id`
- `limit` / `offset`: the effective page request
- `has_more`: whether another page exists

Every `JobListItemView` exposes durable retry metadata from `runtime_json`:
`attempt` (one-based), `retry_count`, and `last_retry_at`. Artifact-manifest
items expose the same one-based `attempt`; clients must not infer it from event
counts or timestamps.

`GET /api/v1/documents/:document_id/agent-versions?limit=50&offset=0` returns
the safe document-level Agent candidate/commit history. Each item includes the
version and operation identity, status, active flag, content hash, timestamps,
and an authenticated `download_path` / `download_url`. Internal `artifact_key`
and filesystem paths are never returned.

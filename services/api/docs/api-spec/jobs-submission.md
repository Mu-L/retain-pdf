# Job Submission and Workflow Inputs

[Jobs API index](jobs.md) · [API spec index](../../API_SPEC.md)

## Upload PDF

`POST /api/v1/uploads`

Multipart fields:

- `file`: required, PDF file
- `developer_mode`: optional, `true/false`

Upload limit policy:

- `RUST_API_UPLOAD_MAX_BYTES`: a positive value is the PDF byte limit; unset or
  `0` uses the backend safety default of 512 MiB
- `RUST_API_UPLOAD_MAX_PAGES`: a positive value is the page limit; `0` disables
  only the page-count limit
- the same byte limit applies while streaming PDF fields for
  `/api/v1/uploads`, `/api/v1/ocr/jobs`, and `/api/v1/translate/bundle`
- a field that exceeds the byte limit is rejected with HTTP `413` and stable
  code `PAYLOAD_TOO_LARGE` before the complete field is buffered or persisted

Response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "upload_id": "20260327190000-ab12cd",
    "filename": "paper.pdf",
    "bytes": 1234567,
    "page_count": 18,
    "uploaded_at": "2026-03-27T11:00:00Z"
  }
}
```

## Create Job

`POST /api/v1/jobs`

Note:

- `workflow = "book"` is the current API workflow identifier for the full document flow
- this is a protocol enum; OCR provider selection remains under `ocr.provider`
- production `book` execution is Rust-orchestrated: OCR child/provider transport -> normalize -> translate -> render
- local manual entrypoints may still use `run_provider_case.py`, but that wrapper is not the production API orchestration path

Canonical JSON request:

```json
{
  "workflow": "book",
  "source": {
    "upload_id": "20260327190000-ab12cd",
    "source_url": "",
    "artifact_job_id": ""
  },
  "ocr": {
    "provider": "mineru",
    "mineru_token": "mineru-xxxx",
    "model_version": "vlm",
    "is_ocr": false,
    "disable_formula": false,
    "disable_table": false,
    "language": "ch",
    "page_ranges": "",
    "data_id": "",
    "no_cache": false,
    "cache_tolerance": 900,
    "extra_formats": "",
    "poll_interval": 5,
    "poll_timeout": 1800,
    "options": {}
  },
  "translation": {
    "mode": "sci",
    "math_mode": "direct_typst",
    "skip_title_translation": false,
    "classify_batch_size": 12,
    "rule_profile_name": "general_sci",
    "custom_rules_text": "",
    "glossary_id": "",
    "glossary_entries": [],
    "model": "deepseek-v4-flash",
    "base_url": "https://api.deepseek.com/v1",
    "credential_ref": "cred_0123456789abcdef",
    "start_page": 0,
    "end_page": -1,
    "batch_size": 1,
    "workers": 0
  },
  "render": {
    "render_mode": "auto",
    "compile_workers": 0,
    "typst_font_family": "Source Han Serif SC",
    "pdf_compress_dpi": 0,
    "translated_pdf_name": "",
    "body_font_size_factor": 0.95,
    "body_leading_factor": 1.08,
    "font_unify_mode": "role_min",
    "source_cleanup_strategy": "pikepdf_text_strip",
    "inner_bbox_shrink_x": 0.0,
    "inner_bbox_shrink_y": 0.0,
    "inner_bbox_dense_shrink_x": 0.0,
    "inner_bbox_dense_shrink_y": 0.0
  },
  "runtime": {
    "job_id": "",
    "timeout_seconds": 1800,
    "render_after_translation": false
  }
}
```

Security note:

- translation request bodies should use `translation.credential_ref`; inline
  `translation.api_key` remains a temporary compatibility path
- responses never echo raw credential values back
- job detail / diagnostics / events only expose redacted payloads
- credential presence is surfaced through `*_configured` booleans instead of plaintext secrets
- JSON and multipart extractor failures use the shared unified error object
  with fixed safe messages. Parser, schema-trace, and multipart-boundary
  details are not reflected to callers; oversized bodies retain `413` with
  `error.code=PAYLOAD_TOO_LARGE`.

Diagnostics note:

- `GET /api/v1/jobs/{job_id}/diagnostics` returns failure-oriented fields plus optional `render_diagnostics`
- `render_diagnostics` is copied from `artifacts/pipeline_summary.json` when present
- current render diagnostics include fallback summaries such as `typst_cover_fallback_pages` and `typst_cover_fallback_items`; these are operational diagnostics, not failure classification fields

Workflow contract:

- `workflow=book`: current provider-backed OCR -> Normalize -> Translate -> Render chain
- `workflow=translate`: OCR -> Normalize -> Translate; no render step
- `POST /api/v1/documents/{document_id}/translate` is document-scoped. When
  `source.artifact_job_id` is supplied it validates ownership, succeeded state,
  normalized/source/layout artifacts, provider compatibility, and page coverage,
  then runs Translate -> Render without creating an OCR child. This endpoint
  sets the internal `runtime.render_after_translation` policy while preserving
  `workflow=translate` in the public response.
- OCR reuse failures never fall back silently. They return `409` (or `404` for a
  missing source job) with `code`, `message`, `reason`, and
  `can_fallback_to_ocr=true`; callers must explicitly resubmit without
  `source.artifact_job_id` to authorize a new OCR run.
- `workflow=render`: reuse `source.artifact_job_id`; rerun render only
- `POST /api/v1/jobs/{job_id}/rerun`: if the source job already has committed `translations_dir + source_pdf`, the backend reuses the same `job_id`, resets render runtime state, and replaces render artifacts in place. If only `normalized_document_json + source_pdf` is available, it creates a new `book` recovery job. A failed/canceled source job with `translation_checkpoint_json` seeds the new job by copy-on-write; the worker reuses it only when the translation input fingerprint matches.
- `GET /api/v1/jobs/{job_id}/stage-actions` and `POST /api/v1/jobs/{job_id}/retry-stage` are the explicit stage-level retry contract for frontend stage cards. The backend decides reusable artifacts, rerun stages, and whether a request can run.

OCR artifact reuse owns these error codes:

| `error.code` | HTTP status | Meaning |
| --- | ---: | --- |
| `OCR_JOB_NOT_FOUND` | 404 | The referenced source job does not exist. |
| `OCR_JOB_NOT_SUCCEEDED` | 409 | The referenced job has no successful reusable OCR stage. |
| `OCR_ARTIFACT_MISSING` | 409 | A required durable OCR artifact is absent or expired. |
| `OCR_ARTIFACT_NOT_REUSABLE` | 409 | Ownership, layout, or provider compatibility validation failed. |
| `OCR_PAGE_COVERAGE_MISMATCH` | 409 | The OCR pages do not cover the requested translation range. |

The compatibility fields remain at the top level and are mirrored into the
uniform error object:

```json
{
  "code": "OCR_PAGE_COVERAGE_MISMATCH",
  "message": "OCR pages do not cover the requested translation range",
  "reason": "page_coverage_mismatch",
  "can_fallback_to_ocr": true,
  "error": {
    "code": "OCR_PAGE_COVERAGE_MISMATCH",
    "http_status": 409,
    "details": {
      "reason": "page_coverage_mismatch",
      "can_fallback_to_ocr": true
    }
  }
}
```

New consumers must branch on `error.code`. `reason` refines diagnostics but
does not replace the code, and `can_fallback_to_ocr=true` means the caller may
offer an explicit new-OCR action—it does not authorize an automatic fallback.
The top-level fields currently have no declared removal date. Error details do
not expose artifact paths, provider requests, credentials, or signed URLs. See
[Errors, storage, and implementation notes](storage-and-errors.md) for the
shared generic error codes.

Endpoint boundary:

- `/api/v1/jobs` is for `book`, `translate`, and `render`
- `/api/v1/ocr/jobs` is for OCR-only jobs
- `/api/v1/translate/bundle` is the synchronous multipart helper for the same full flow; flat multipart fields remain supported here, including `provider=paddle|mineru`
- `GET /api/v1/providers/ocr` returns discoverable OCR provider metadata, credentials, options, capabilities, and artifact layout

Required provider fields:

- `ocr.mineru_token` when `ocr.provider=mineru`
- `ocr.paddle_token` when `ocr.provider=paddle`
- `translation.base_url`, `translation.model`, and exactly one of
  `translation.credential_ref` or compatibility field `translation.api_key`
  when translation is required

OCR provider options:

- `ocr.options` is the canonical JSON object for provider-specific non-secret options.
- For multipart helper requests, send the same object as JSON string field `ocr_options`.
- Paddle `ocr.options.transport` accepts `official_http` (default) or `official_cli`.
- `official_cli` uses the externally installed official `paddleocr api` client and is only accepted by `/api/v1/ocr/jobs`. It is a Markdown/coarse document extraction path; its result does not provide the `bbox`/`prunedResult` contract required by translation and render, so `book` and `translate` requests must use `official_http`.
- Selecting `official_cli` does not install PaddleOCR or add it to the server base image. A missing executable is reported as a provider worker failure.
- Legacy fields such as `paddle_model` and `paddle_api_url` remain accepted for current built-in providers; new command providers should prefer `ocr.options`.
- Dynamic providers declared in `services/config/ocr_providers.json` (compat `backend/config`) with `kind=local_command` or `kind=remote_command` are discoverable through `/api/v1/providers/ocr` and are executed through `provider.stage.v1`.
- `remote_command` means the external command owns the remote API submit/poll/download state machine. The backend passes `source.file_url`, optional local file path, provider options, and credential env, then consumes only the resulting source PDF plus `document.v1.json`.
- Configured command provider credentials can be supplied through `ocr.options.credential`, `ocr.options.token`, `ocr.options.api_key`, or through the provider config `credential.env`. The worker exposes the resolved secret to the command as `RETAIN_OCR_CREDENTIAL`.

`GET /api/v1/providers/ocr` response example:

```json
{
  "code": 0,
  "message": "ok",
  "data": [
    {
      "key": "paddle",
      "display_name": "PaddleOCR",
      "provider_kind": "remote",
      "credential": {
        "field": "paddle_token",
        "env": "RETAIN_PADDLE_API_TOKEN",
        "required_for": ["remote_url", "local_upload"]
      },
      "options": {
        "transport": {
          "type": "string",
          "default": "official_http",
          "choices": ["official_http", "official_cli"]
        },
        "paddle_model": {
          "type": "string",
          "default": "PaddleOCR-VL-1.6",
          "aliases": {
            "paddleocr-vl": "PaddleOCR-VL-1.6"
          }
        }
      },
      "capabilities": {
        "supports_remote_url_submit": true,
        "supports_local_file_upload": true,
        "supports_polling": true,
        "supports_download_bundle": true,
        "supports_extra_formats": false,
        "supports_formula_toggle": false,
        "supports_table_toggle": false
      },
      "artifact_layout": {
        "provider_result_json": "paddle_result.json",
        "provider_bundle_zip": "paddle_bundle.zip",
        "provider_raw_dir": "paddle_raw",
        "layout_json": "paddle_result.json"
      }
    }
  ]
}
```

Translation options:

- `translation.math_mode` is optional
- `direct_typst` is the default
- `direct_typst` is an experimental mode that asks the model to output translated prose with inline `$...$` math directly

Render options:

- The normative render parameter contract is maintained in `RENDER_OPTIONS_CONTRACT.md`
- `render.pdf_compress_dpi` defaults to `0`; `0` disables the extra PDF image compression pass
- `render.body_font_size_factor` defaults to `0.95`
- `render.body_leading_factor` defaults to `1.08`
- `render.font_unify_mode` accepts `role_min` or `off`
- `role_min` is the default and enables role-aware font unification, including stronger book-level body font consistency
- `off` disables font unification only; it does not disable layout fit, line-height solving, collision handling, or background cleanup rules
- `render.source_cleanup_strategy` defaults to `pikepdf_text_strip`
- `pikepdf_text_strip` runs the path-level pikepdf content-stream text-op stripping pass before Typst overlay; visual cover still comes from Typst block fill
- `typst_fill` keeps source text covered by Typst background blocks instead of running bbox text stripping
- `bbox_text_strip` and `legacy` are compatibility aliases for the pikepdf text-strip path
- `redact_restore_formulas` is a compatibility alias for the current `pikepdf_text_strip` behavior; keep the name only for old configs/spec replay and do not treat it as a separate formula restore strategy
- `render.inner_bbox_shrink_x`, `render.inner_bbox_shrink_y`, `render.inner_bbox_dense_shrink_x`, and `render.inner_bbox_dense_shrink_y` default to `0.0`

Validation:

- `ocr.mineru_token` must not be a URL-like string
- `translation.base_url` must start with `http://` or `https://`
- `translation.api_key` must not be a URL-like string
- `translation.api_key` and `translation.credential_ref` are mutually exclusive
- a supplied `translation.credential_ref` must exist and have kind
  `translation_api_key`; invalid, missing, wrong-kind, or unavailable-vault
  references return structured `CREDENTIAL_*` errors
- render enum-like options are validated in Rust; unknown `render_mode`, `font_unify_mode`, or `source_cleanup_strategy` values return `400`
- provider-specific upstream limits apply only to the selected OCR provider, not to the shared `workflow=book` protocol itself
- Rust API no longer supplies default OCR provider / LLM credentials for `create_job`
- legacy flat JSON fields such as `upload_id`, `model`, and `api_key` are rejected by `/api/v1/jobs`; flat field mapping only remains in selected multipart helper endpoints

Response redaction rules:

- `request_payload.ocr.mineru_token`, `request_payload.ocr.paddle_token`, and `request_payload.translation.api_key` are always returned as empty strings
- `request_payload.ocr.mineru_token_configured`, `request_payload.ocr.paddle_token_configured`, and `request_payload.translation.api_key_configured` indicate whether the backend received those credentials
- `request_payload.translation.credential_ref` may be returned as an opaque,
  non-secret identifier; its secret is resolved only when the worker starts
- `error`, `log_tail`, `events[*].message`, `events[*].payload`, translation diagnostics payloads, translation debug item payloads, and replay payloads are redacted before leaving Rust API

Glossary v1 contract:

- `translation.glossary_id`: optional named glossary resource ID
- `translation.glossary_entries`: optional inline glossary array; each item is `{source, target, note}`
- if both are provided, the backend loads the named glossary first and then overlays inline entries by normalized `source`
- inline entries override resource entries with the same `source`
- glossary usage is prompt/guidance only in v1; the pipeline does not force a post-translation find/replace pass
- frontend should parse Excel itself and send JSON entries, or send CSV text to the helper parse endpoint below; backend does not add Excel parsing
- translation outputs now include glossary usage summary in `translation-manifest.json`, diagnostics, and pipeline summary when glossary is enabled

Response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "job_id": "20260327190500-ef3456",
    "status": "queued",
    "workflow": "book",
    "links": {
      "self_path": "/api/v1/jobs/20260327190500-ef3456",
      "self_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456",
      "artifacts_path": "/api/v1/jobs/20260327190500-ef3456/artifacts",
      "artifacts_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/artifacts",
      "artifacts_manifest_path": "/api/v1/jobs/20260327190500-ef3456/artifacts-manifest",
      "artifacts_manifest_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/artifacts-manifest",
      "events_path": "/api/v1/jobs/20260327190500-ef3456/events",
      "events_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/events",
      "cancel_path": "/api/v1/jobs/20260327190500-ef3456/cancel",
      "cancel_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/cancel"
    },
    "actions": {
      "open_job": {"enabled": true, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456"},
      "open_artifacts": {"enabled": true, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/artifacts", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/artifacts"},
      "cancel": {"enabled": true, "method": "POST", "path": "/api/v1/jobs/20260327190500-ef3456/cancel", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/cancel"},
      "download_pdf": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/pdf", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/pdf"},
      "open_markdown": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/markdown", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/markdown"},
      "open_markdown_raw": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/markdown?raw=true", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/markdown?raw=true"},
      "download_bundle": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/download", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/download"}
    }
  }
}
```

Execution model for `/api/v1/jobs`:

1. create parent translation job
2. create OCR child job `{job_id}-ocr`
3. OCR child completes provider transport + normalization
4. parent job reuses:
   - `normalized_document_json`
   - `normalization_report_json`
   - `layout_json`
   - `provider_raw_dir`
   - `provider_zip`
   - `provider_summary_json`
5. parent job enters translation/render

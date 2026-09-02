# Job Retry, Ambiguity Recovery, and Control

[Jobs API index](jobs.md) · [API spec index](../../API_SPEC.md)

## Stage Retry Actions

`GET /api/v1/jobs/{job_id}/stage-actions`

Returns frontend-ready stage buttons. This endpoint is for user-initiated stage
reruns and is separate from failure-oriented `resume-plan`.

Response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "job_id": "20260519010101-abcd12",
    "stages": [
      {
        "stage": "ocr",
        "label": "重试 OCR",
        "can_retry": true,
        "reason": "",
        "disabled_reason": "",
        "action": {
          "method": "POST",
          "url": "http://127.0.0.1:41000/api/v1/jobs/20260519010101-abcd12/retry-stage",
          "body": {"stage": "ocr", "ambiguous_request_policy": "block"}
        },
        "will_reuse": ["source_pdf"],
        "will_rerun": ["ocr", "translation", "render"],
        "danger": true
      },
      {
        "stage": "translation",
        "label": "重试翻译",
        "can_retry": true,
        "reason": "",
        "disabled_reason": "",
        "action": {
          "method": "POST",
          "url": "http://127.0.0.1:41000/api/v1/jobs/20260519010101-abcd12/retry-stage",
          "body": {"stage": "translation", "ambiguous_request_policy": "block"}
        },
        "will_reuse": ["source_pdf", "ocr_result"],
        "will_rerun": ["translation", "render"],
        "danger": false
      },
      {
        "stage": "render",
        "label": "重新渲染",
        "can_retry": true,
        "reason": "",
        "disabled_reason": "",
        "action": {
          "method": "POST",
          "url": "http://127.0.0.1:41000/api/v1/jobs/20260519010101-abcd12/retry-stage",
          "body": {"stage": "render", "ambiguous_request_policy": "block"}
        },
        "will_reuse": ["source_pdf", "ocr_result", "translation_result"],
        "will_rerun": ["render"],
        "danger": false
      }
    ]
  }
}
```
Rules:

- queued/running jobs return disabled stage actions; cancel the job before
  retrying a stage.
- OCR retry currently requires the original `upload_id` or `source_url` to still
  be available on the job. Jobs that only have `source_pdf` as an artifact may
  expose OCR as disabled until artifact-backed OCR retry is implemented.
- translation retry requires `source_pdf + normalized_document_json`.
- render retry requires `source_pdf + translations_dir`.

`POST /api/v1/jobs/{job_id}/retry-stage`

Request:

```json
{
  "stage": "translation",
  "mode": "from_stage",
  "create_new_job": true,
  "ambiguous_request_policy": "block",
  "overrides": {
    "translation": {
      "model": "deepseek-v4-flash",
      "glossary_id": "glossary-xxx",
      "workers": 50
    },
    "render": {
      "compile_workers": 8
    }
  }
}
```

Response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "job_id": "20260519010202-ef3456",
    "source_job_id": "20260519010101-abcd12",
    "status": "queued",
    "workflow": "book",
    "rerun_from_stage": "translation",
    "reused_artifacts": ["source_pdf", "ocr_result"],
    "rerun_stages": ["translation", "render"],
    "ambiguous_request_policy": "accept_duplicate_risk",
    "links": {},
    "actions": {}
  }
}
```

Request fields:

- `stage`: `ocr`, `translation`, or `render`.
- `mode`: optional; currently only `from_stage` is supported.
- `create_new_job`: optional; defaults to `true`.
- `ambiguous_request_policy`: optional; defaults to `block`. When the request
  journal contains an active ambiguous dispatch, translation retry returns
  `409` until the caller explicitly sends `accept_duplicate_risk`. Generic
  `/rerun` is also blocked in that state.
- `overrides`: optional object with `ocr`, `translation`, `render`, and
  `runtime` sections. Unknown sections are rejected. Each section is validated
  against the same input structs as normal job creation.

Execution semantics:

- `stage=ocr`: reuses the original upload or source URL, reruns OCR ->
  translation -> render, and creates a new `book` job.
- `stage=translation`: reuses source PDF and OCR result, reruns translation ->
  render, and creates a new `book` job.
- `stage=render`: reuses source PDF, OCR result, and translation result, reruns
  render, and creates a new `render` job by default.
- `stage=render` with `create_new_job=false`: reuses the existing job id and
  replaces render artifacts in place. This is the only in-place retry currently
  supported.

## Cancel Job

`POST /api/v1/jobs/{job_id}/cancel`

Current intent:

- best-effort kill of the running Python worker process
- mark job as `canceled`

Response:

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "job_id": "20260327190500-ef3456",
    "status": "canceled",
    "workflow": "book",
    "links": {
      "self_path": "/api/v1/jobs/20260327190500-ef3456",
      "self_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456",
      "artifacts_path": "/api/v1/jobs/20260327190500-ef3456/artifacts",
      "artifacts_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/artifacts",
      "cancel_path": "/api/v1/jobs/20260327190500-ef3456/cancel",
      "cancel_url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/cancel"
    },
    "actions": {
      "open_job": {"enabled": true, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456"},
      "open_artifacts": {"enabled": true, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/artifacts", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/artifacts"},
      "cancel": {"enabled": false, "method": "POST", "path": "/api/v1/jobs/20260327190500-ef3456/cancel", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/cancel"},
      "download_pdf": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/pdf", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/pdf"},
      "open_markdown": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/markdown", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/markdown"},
      "open_markdown_raw": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/markdown?raw=true", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/markdown?raw=true"},
      "download_bundle": {"enabled": false, "method": "GET", "path": "/api/v1/jobs/20260327190500-ef3456/download", "url": "http://127.0.0.1:41000/api/v1/jobs/20260327190500-ef3456/download"}
    }
  }
}
```

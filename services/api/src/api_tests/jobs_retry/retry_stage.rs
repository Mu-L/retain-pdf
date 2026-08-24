use axum::body::Body;
use axum::http::{Request, StatusCode};
use serde_json::json;
use tower::util::ServiceExt;

use crate::api_tests::jobs_common::{read_json, test_state};
use crate::app::build_app;
use crate::models::{JobArtifacts, JobStatusKind};

use super::common::{
    seed_ambiguous_translation_request_journal, seed_ocr_checkpoint_files,
    seed_translation_result_files, source_job_with_artifacts,
};

#[tokio::test]
async fn translation_retry_requires_explicit_duplicate_risk_acceptance() {
    let state = test_state("retry-stage-ambiguous-translation");
    let source_job_id = "job-retry-stage-ambiguous-translation";
    let mut source_job = source_job_with_artifacts(
        source_job_id,
        JobArtifacts {
            job_root: Some(format!("jobs/{source_job_id}")),
            source_pdf: Some("jobs/source/source/input.pdf".to_string()),
            normalized_document_json: Some("jobs/source/ocr/document.v1.json".to_string()),
            ..JobArtifacts::default()
        },
    );
    source_job.status = JobStatusKind::Failed;
    seed_ocr_checkpoint_files(&state, &source_job);
    seed_ambiguous_translation_request_journal(&state, &source_job);
    state.db.save_job(&source_job).expect("save source job");

    let diagnostics = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(format!("/api/v1/jobs/{source_job_id}/diagnostics"))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("diagnostics request"),
        )
        .await
        .expect("diagnostics response");
    assert_eq!(diagnostics.status(), StatusCode::OK);
    let diagnostics_payload = read_json(diagnostics).await;
    let recovery = &diagnostics_payload["data"]["translation_request_recovery"];
    assert_eq!(recovery["status"], "ambiguous");
    assert_eq!(recovery["unresolved_dispatches"], 1);
    assert_eq!(recovery["requires_confirmation"], true);
    assert_eq!(diagnostics_payload["data"]["resume_available"], false);

    let detail = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(format!("/api/v1/jobs/{source_job_id}"))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("detail request"),
        )
        .await
        .expect("detail response");
    assert_eq!(detail.status(), StatusCode::OK);
    let detail_payload = read_json(detail).await;
    assert_eq!(
        detail_payload["data"]["translation_request_recovery"]["requires_confirmation"],
        true
    );

    let actions = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("GET")
                .uri(format!("/api/v1/jobs/{source_job_id}/stage-actions"))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("stage actions request"),
        )
        .await
        .expect("stage actions response");
    let actions_payload = read_json(actions).await;
    let translation_action = actions_payload["data"]["stages"]
        .as_array()
        .expect("stage actions")
        .iter()
        .find(|item| item["stage"] == "translation")
        .expect("translation action");
    assert_eq!(translation_action["danger"], true);
    assert_eq!(
        translation_action["action"]["body"]["ambiguous_request_policy"],
        "block"
    );

    let blocked = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/jobs/{source_job_id}/retry-stage"))
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(json!({ "stage": "translation" }).to_string()))
                .expect("blocked retry request"),
        )
        .await
        .expect("blocked retry response");
    assert_eq!(blocked.status(), StatusCode::CONFLICT);
    let blocked_payload = read_json(blocked).await;
    assert!(blocked_payload["message"]
        .as_str()
        .unwrap_or_default()
        .contains("accept_duplicate_risk"));

    let generic_rerun = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/jobs/{source_job_id}/rerun"))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("generic rerun request"),
        )
        .await
        .expect("generic rerun response");
    assert_eq!(generic_rerun.status(), StatusCode::CONFLICT);

    let accepted = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/jobs/{source_job_id}/retry-stage"))
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(
                    json!({
                        "stage": "translation",
                        "ambiguous_request_policy": "accept_duplicate_risk"
                    })
                    .to_string(),
                ))
                .expect("accepted retry request"),
        )
        .await
        .expect("accepted retry response");
    assert_eq!(accepted.status(), StatusCode::OK);
    let accepted_payload = read_json(accepted).await;
    assert_eq!(
        accepted_payload["data"]["ambiguous_request_policy"],
        "accept_duplicate_risk"
    );
    let accepted_job_id = accepted_payload["data"]["job_id"]
        .as_str()
        .expect("accepted job id");
    let accepted_job = state.db.get_job(accepted_job_id).expect("accepted job");
    assert!(
        accepted_job
            .request_payload
            .translation
            .accepted_ambiguous_request_risk
    );

    let source_root = state
        .config
        .data_root
        .join("jobs")
        .join(source_job_id)
        .join("translated");
    std::fs::write(
        source_root.join("translation-request-journal.v1.jsonl"),
        b"{not-json}\n",
    )
    .expect("corrupt source journal");
    let corrupt_retry = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/jobs/{source_job_id}/retry-stage"))
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(
                    json!({
                        "stage": "translation",
                        "ambiguous_request_policy": "accept_duplicate_risk"
                    })
                    .to_string(),
                ))
                .expect("corrupt retry request"),
        )
        .await
        .expect("corrupt retry response");
    assert_eq!(corrupt_retry.status(), StatusCode::CONFLICT);
}

#[tokio::test]
async fn retry_stage_route_creates_translation_recovery_job_with_overrides() {
    let state = test_state("retry-stage-translation");
    let mut source_job = source_job_with_artifacts(
        "job-retry-stage-translation-source",
        JobArtifacts {
            source_pdf: Some("jobs/source/source/input.pdf".to_string()),
            normalized_document_json: Some("jobs/source/ocr/document.v1.json".to_string()),
            ..JobArtifacts::default()
        },
    );
    source_job.status = JobStatusKind::Succeeded;
    seed_ocr_checkpoint_files(&state, &source_job);
    state.db.save_job(&source_job).expect("save source job");

    let response = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/jobs/job-retry-stage-translation-source/retry-stage")
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(
                    json!({
                        "stage": "translation",
                        "overrides": {
                            "translation": {
                                "model": "deepseek-v4-flash",
                                "workers": 50
                            },
                            "render": {
                                "compile_workers": 8
                            }
                        }
                    })
                    .to_string(),
                ))
                .expect("retry stage request"),
        )
        .await
        .expect("retry stage response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = read_json(response).await;
    assert_eq!(
        payload["data"]["source_job_id"],
        "job-retry-stage-translation-source"
    );
    assert_eq!(payload["data"]["workflow"], "book");
    assert_eq!(payload["data"]["rerun_from_stage"], "translation");
    assert_eq!(
        payload["data"]["reused_artifacts"],
        json!(["source_pdf", "ocr_result"])
    );
    let retry_job_id = payload["data"]["job_id"].as_str().expect("job id");
    let retry_job = state.db.get_job(retry_job_id).expect("retry job");
    assert_eq!(retry_job.workflow, crate::models::WorkflowKind::Book);
    assert_eq!(
        retry_job.request_payload.source.artifact_job_id,
        "job-retry-stage-translation-source"
    );
    assert_eq!(retry_job.request_payload.translation.workers, 50);
    assert_eq!(retry_job.request_payload.render.compile_workers, 8);
}

#[tokio::test]
async fn retry_stage_route_creates_render_job_by_default() {
    let state = test_state("retry-stage-render");
    let mut source_job = source_job_with_artifacts(
        "job-retry-stage-render-source",
        JobArtifacts {
            source_pdf: Some("jobs/source/source/input.pdf".to_string()),
            normalized_document_json: Some("jobs/source/ocr/document.v1.json".to_string()),
            translations_dir: Some("jobs/source/translated".to_string()),
            ..JobArtifacts::default()
        },
    );
    source_job.status = JobStatusKind::Succeeded;
    seed_translation_result_files(&state, &source_job);
    state.db.save_job(&source_job).expect("save source job");

    let response = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/jobs/job-retry-stage-render-source/retry-stage")
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(json!({ "stage": "render" }).to_string()))
                .expect("retry render request"),
        )
        .await
        .expect("retry render response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = read_json(response).await;
    assert_eq!(payload["data"]["workflow"], "render");
    assert_eq!(payload["data"]["rerun_stages"], json!(["render"]));
    let retry_job_id = payload["data"]["job_id"].as_str().expect("job id");
    assert_ne!(retry_job_id, "job-retry-stage-render-source");
    let retry_job = state.db.get_job(retry_job_id).expect("retry job");
    assert_eq!(retry_job.workflow, crate::models::WorkflowKind::Render);
    assert_eq!(
        retry_job.request_payload.source.artifact_job_id,
        "job-retry-stage-render-source"
    );
}

#[tokio::test]
async fn retry_stage_route_allows_in_place_render_when_requested() {
    let state = test_state("retry-stage-render-in-place");
    let mut source_job = source_job_with_artifacts(
        "job-retry-stage-render-in-place",
        JobArtifacts {
            source_pdf: Some("jobs/source/source/input.pdf".to_string()),
            normalized_document_json: Some("jobs/source/ocr/document.v1.json".to_string()),
            translations_dir: Some("jobs/source/translated".to_string()),
            output_pdf: Some("jobs/source/output/old.pdf".to_string()),
            ..JobArtifacts::default()
        },
    );
    source_job.status = JobStatusKind::Succeeded;
    seed_translation_result_files(&state, &source_job);
    state.db.save_job(&source_job).expect("save source job");

    let response = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/jobs/job-retry-stage-render-in-place/retry-stage")
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(
                    json!({
                        "stage": "render",
                        "create_new_job": false
                    })
                    .to_string(),
                ))
                .expect("retry render in place request"),
        )
        .await
        .expect("retry render in place response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = read_json(response).await;
    assert_eq!(payload["data"]["job_id"], "job-retry-stage-render-in-place");
    assert_eq!(payload["data"]["workflow"], "render");
    let retry_job = state
        .db
        .get_job("job-retry-stage-render-in-place")
        .expect("retry job");
    assert_eq!(retry_job.workflow, crate::models::WorkflowKind::Render);
    assert_eq!(retry_job.status, JobStatusKind::Queued);
    assert!(retry_job
        .artifacts
        .as_ref()
        .expect("artifacts")
        .output_pdf
        .is_none());
}

#[tokio::test]
async fn retry_stage_route_applies_overrides_for_in_place_render() {
    let state = test_state("retry-stage-render-in-place-overrides");
    let mut source_job = source_job_with_artifacts(
        "job-retry-stage-render-in-place-overrides",
        JobArtifacts {
            source_pdf: Some("jobs/source/source/input.pdf".to_string()),
            normalized_document_json: Some("jobs/source/ocr/document.v1.json".to_string()),
            translations_dir: Some("jobs/source/translated".to_string()),
            output_pdf: Some("jobs/source/output/old.pdf".to_string()),
            ..JobArtifacts::default()
        },
    );
    source_job.status = JobStatusKind::Succeeded;
    source_job.request_payload.render.compile_workers = 1;
    source_job.request_payload.render.render_mode = "overlay".to_string();
    source_job.request_payload.runtime.timeout_seconds = 10;
    seed_translation_result_files(&state, &source_job);
    state.db.save_job(&source_job).expect("save source job");

    let response = build_app(state.clone())
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/jobs/job-retry-stage-render-in-place-overrides/retry-stage")
                .header("X-API-Key", "test-key")
                .header("Content-Type", "application/json")
                .body(Body::from(
                    json!({
                        "stage": "render",
                        "create_new_job": false,
                        "overrides": {
                            "render": {
                                "render_mode": "typst",
                                "compile_workers": 8
                            },
                            "runtime": {
                                "timeout_seconds": 120
                            }
                        }
                    })
                    .to_string(),
                ))
                .expect("retry render in place request"),
        )
        .await
        .expect("retry render in place response");

    assert_eq!(response.status(), StatusCode::OK);
    let payload = read_json(response).await;
    assert_eq!(
        payload["data"]["job_id"],
        "job-retry-stage-render-in-place-overrides"
    );
    let retry_job = state
        .db
        .get_job("job-retry-stage-render-in-place-overrides")
        .expect("retry job");
    assert_eq!(retry_job.request_payload.render.render_mode, "typst");
    assert_eq!(retry_job.request_payload.render.compile_workers, 8);
    assert_eq!(retry_job.request_payload.runtime.timeout_seconds, 120);
    assert_eq!(
        retry_job.request_payload.runtime.job_id,
        "job-retry-stage-render-in-place-overrides"
    );
}

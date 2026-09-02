use std::fs;
use std::time::Duration;

use axum::body::Body;
use axum::http::{Request, StatusCode};
use futures_util::StreamExt;
use serde_json::json;
use sha2::{Digest, Sha256};
use tower::util::ServiceExt;

use crate::app::build_app;
use crate::db::PipelineUnitCommit;
use crate::models::{CreateJobInput, JobArtifacts, JobSnapshot};

use super::jobs_common::{read_json, test_state};

fn sha256_hex(bytes: &[u8]) -> String {
    Sha256::digest(bytes)
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect()
}

fn seed_live_translation_job(state: &crate::AppState, test_name: &str) -> (JobSnapshot, Vec<u8>) {
    let mut job = JobSnapshot::new(
        format!("job-live-translation-{test_name}"),
        CreateJobInput::default(),
        vec!["python".to_string()],
    );
    let job_root = state.config.data_root.join("jobs").join(&job.job_id);
    let translated_dir = job_root.join("translated");
    let normalized_path = job_root.join("normalized").join("document.v1.json");
    fs::create_dir_all(normalized_path.parent().expect("normalized parent"))
        .expect("create normalized dir");
    fs::create_dir_all(
        translated_dir
            .join(".translation-checkpoints")
            .join("generation-1"),
    )
    .expect("create checkpoint dir");
    fs::write(
        &normalized_path,
        serde_json::to_vec(&json!({
            "pages": [{
                "page_index": 0,
                "width": 625.4,
                "height": 818.3,
                "blocks": [{
                    "block_id": "p001-b3",
                    "bbox": [56.9, 117.4, 310.2, 182.1],
                    "text": "Original text",
                    "sub_type": "paragraph"
                }]
            }]
        }))
        .expect("serialize normalized document"),
    )
    .expect("write normalized document");
    let snapshot = serde_json::to_vec(&json!([
        {
            "item_id": "p001-b3",
            "translated_text": "已经完成的译文",
            "status": "translated"
        },
        {
            "item_id": "p001-b4",
            "status": "pending"
        }
    ]))
    .expect("serialize translation page");
    fs::write(
        translated_dir
            .join(".translation-checkpoints")
            .join("generation-1")
            .join("page-001-deepseek.json"),
        &snapshot,
    )
    .expect("write committed snapshot");
    fs::write(
        translated_dir.join("page-001-deepseek.json"),
        br#"[{"item_id":"p001-b3","translated_text":"not committed"}]"#,
    )
    .expect("write uncommitted working page");

    job.artifacts = Some(JobArtifacts {
        job_root: Some(job_root.to_string_lossy().to_string()),
        normalized_document_json: Some(normalized_path.to_string_lossy().to_string()),
        // This field is normally published at terminal completion. The live
        // endpoint must derive the in-progress workspace from job_root.
        translations_dir: None,
        ..JobArtifacts::default()
    });
    state.db.save_job(&job).expect("save job");
    let cursor = state
        .db
        .acquire_pipeline_attempt(&job.job_id, "worker-live", "translate", 1)
        .expect("acquire pipeline attempt");
    state
        .db
        .commit_pipeline_unit(
            &cursor,
            &PipelineUnitCommit {
                unit_key: "p001-b3".to_string(),
                unit_order: 1,
                page_index: Some(0),
                page_hash: sha256_hex(&snapshot),
                producer_generation: Some(1),
                payload: json!({"phase": "translating", "status": "completed"}),
            },
        )
        .expect("commit translation unit");
    (job, snapshot)
}

#[tokio::test]
async fn live_translation_reads_layout_and_only_hash_matched_checkpoint_page() {
    let state = test_state("live-translation-page");
    let (job, snapshot) = seed_live_translation_job(&state, "page");
    let app = build_app(state);

    let layout_response = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/jobs/{}/live-translation/layout",
                    job.job_id
                ))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("layout request"),
        )
        .await
        .expect("layout response");
    assert_eq!(layout_response.status(), StatusCode::OK);
    let layout = read_json(layout_response).await;
    assert_eq!(layout["data"]["pages"][0]["page_idx"], 0);
    assert_eq!(layout["data"]["pages"][0]["width"], 625.4);
    assert_eq!(
        layout["data"]["pages"][0]["blocks"][0]["item_id"],
        "p001-b0003"
    );

    let page_response = app
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/jobs/{}/live-translation/pages/0",
                    job.job_id
                ))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("page request"),
        )
        .await
        .expect("page response");
    assert_eq!(page_response.status(), StatusCode::OK);
    let page = read_json(page_response).await;
    assert_eq!(page["data"]["attempt"], 1);
    assert_eq!(page["data"]["page_hash"], sha256_hex(&snapshot));
    assert_eq!(page["data"]["items"].as_array().expect("items").len(), 1);
    assert_eq!(
        page["data"]["items"][0]["translated_text"],
        "已经完成的译文"
    );
}

#[tokio::test]
async fn live_translation_refuses_snapshot_when_committed_hash_has_no_match() {
    let state = test_state("live-translation-hash-mismatch");
    let (job, _) = seed_live_translation_job(&state, "hash-mismatch");
    let checkpoint = state
        .config
        .data_root
        .join("jobs")
        .join(&job.job_id)
        .join("translated")
        .join(".translation-checkpoints")
        .join("generation-1")
        .join("page-001-deepseek.json");
    fs::write(checkpoint, b"[]").expect("tamper committed snapshot");

    let response = build_app(state)
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/jobs/{}/live-translation/pages/0",
                    job.job_id
                ))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("page request"),
        )
        .await
        .expect("page response");
    assert_eq!(response.status(), StatusCode::CONFLICT);
    let body = read_json(response).await;
    assert_eq!(body["code"], "LIVE_TRANSLATION_SNAPSHOT_UNAVAILABLE");
}

#[tokio::test]
async fn live_events_streams_authoritative_commit_with_database_sequence() {
    let state = test_state("live-translation-events");
    let (job, snapshot) = seed_live_translation_job(&state, "events");
    let response = build_app(state)
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/jobs/{}/live-events?after_seq=0",
                    job.job_id
                ))
                .header("X-API-Key", "test-key")
                .body(Body::empty())
                .expect("events request"),
        )
        .await
        .expect("events response");
    assert_eq!(response.status(), StatusCode::OK);
    let mut stream = response.into_body().into_data_stream();
    let chunk = tokio::time::timeout(Duration::from_secs(1), stream.next())
        .await
        .expect("event timeout")
        .expect("event chunk")
        .expect("event bytes");
    let event = String::from_utf8(chunk.to_vec()).expect("utf8 event");
    assert!(event.contains("event: translation_units_committed"));
    assert!(event.contains(&format!("\"page_hash\":\"{}\"", sha256_hex(&snapshot))));
    assert!(event.contains("\"changed_item_ids\":[\"p001-b0003\"]"));
}

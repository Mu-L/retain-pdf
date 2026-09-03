use std::sync::Arc;

use axum::body::{to_bytes, Body};
use axum::http::{header, Request, StatusCode};
use lopdf::content::{Content, Operation};
use lopdf::{dictionary, Document, Object, Stream};
use retain_data::credentials::resolve_credential;
use serde_json::Value;
use tower::util::ServiceExt;

use super::jobs_common::test_state;
use crate::app::{build_app, build_simple_app};

fn build_test_pdf_bytes() -> Vec<u8> {
    let dir = std::env::temp_dir().join(format!("rust-api-create-route-pdf-{}", fastrand::u64(..)));
    std::fs::create_dir_all(&dir).expect("create temp dir");
    let path = dir.join("input.pdf");
    let mut doc = Document::with_version("1.5");
    let pages_id = doc.new_object_id();
    let font_id = doc.add_object(dictionary! {
        "Type" => "Font",
        "Subtype" => "Type1",
        "BaseFont" => "Courier",
    });
    let resources_id = doc.add_object(dictionary! {
        "Font" => dictionary! { "F1" => font_id, },
    });
    let content = Content {
        operations: vec![
            Operation::new("BT", vec![]),
            Operation::new("Tf", vec!["F1".into(), 18.into()]),
            Operation::new("Td", vec![72.into(), 720.into()]),
            Operation::new("Tj", vec![Object::string_literal("Hello")]),
            Operation::new("ET", vec![]),
        ],
    };
    let content_id = doc.add_object(Stream::new(
        dictionary! {},
        content.encode().expect("encode content"),
    ));
    let page_id = doc.add_object(dictionary! {
        "Type" => "Page",
        "Parent" => pages_id,
        "Contents" => content_id,
    });
    doc.objects.insert(
        pages_id,
        Object::Dictionary(dictionary! {
            "Type" => "Pages",
            "Kids" => vec![Object::Reference(page_id)],
            "Count" => 1,
            "Resources" => resources_id,
            "MediaBox" => vec![0.into(), 0.into(), 595.into(), 842.into()],
        }),
    );
    let catalog_id = doc.add_object(dictionary! {
        "Type" => "Catalog",
        "Pages" => pages_id,
    });
    doc.trailer.set("Root", catalog_id);
    doc.compress();
    doc.save(&path).expect("save test pdf");
    std::fs::read(path).expect("read test pdf")
}

#[tokio::test]
async fn translate_bundle_route_returns_async_job_submission_json() {
    let state = test_state("translate-bundle-async");
    let db = state.db.clone();
    let data_root = state.config.data_root.clone();
    let boundary = "retainpdf-test-boundary";
    let pdf_bytes = build_test_pdf_bytes();
    let mut body = Vec::new();
    body.extend_from_slice(
        format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"workflow\"\r\n\r\nbook\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(
        format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"api_key\"\r\n\r\nsk-test\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(
        format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"model\"\r\n\r\ndeepseek-v4-flash\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(
        format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"base_url\"\r\n\r\nhttps://api.deepseek.com/v1\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(
        format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"mineru_token\"\r\n\r\nmineru-token\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(
        format!(
            "--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"input.pdf\"\r\nContent-Type: application/pdf\r\n\r\n"
        )
        .as_bytes(),
    );
    body.extend_from_slice(&pdf_bytes);
    body.extend_from_slice(format!("\r\n--{boundary}--\r\n").as_bytes());

    let response = build_simple_app(state)
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/translate/bundle")
                .header("X-API-Key", "test-key")
                .header(
                    header::CONTENT_TYPE,
                    format!("multipart/form-data; boundary={boundary}"),
                )
                .body(Body::from(body))
                .expect("request"),
        )
        .await
        .expect("response");

    assert_eq!(response.status(), StatusCode::OK);
    let content_type = response
        .headers()
        .get(header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("");
    assert!(content_type.starts_with("application/json"));
    let payload: Value = serde_json::from_slice(
        &to_bytes(response.into_body(), usize::MAX)
            .await
            .expect("body"),
    )
    .expect("json");
    assert_eq!(payload["data"]["status"], "queued");
    assert_eq!(payload["data"]["workflow"], "book");
    let job_id = payload["data"]["job_id"].as_str().unwrap_or("");
    assert!(job_id.len() > 8);

    let persisted = db.get_job(job_id).expect("load persisted bundle job");
    assert!(persisted.request_payload.ocr.mineru_token.is_empty());
    assert!(persisted.request_payload.translation.api_key.is_empty());
    let persisted_json = serde_json::to_string(&persisted).expect("serialize persisted job");
    assert!(!persisted_json.contains("mineru-token"));
    assert!(!persisted_json.contains("sk-test"));
    let ocr_credential = resolve_credential(
        &data_root,
        &persisted.request_payload.ocr.credential_ref,
        "ocr_provider_token",
    )
    .expect("resolve imported OCR credential");
    assert_eq!(ocr_credential.secret, "mineru-token");
    let translation_credential = resolve_credential(
        &data_root,
        &persisted.request_payload.translation.credential_ref,
        "translation_api_key",
    )
    .expect("resolve imported translation credential");
    assert_eq!(translation_credential.secret, "sk-test");
}

const UPLOAD_BOUNDARY: &str = "retainpdf-upload-route-test";

fn upload_file_field(filename: &str, value: &str) -> String {
    format!(
        "--{UPLOAD_BOUNDARY}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{filename}\"\r\nContent-Type: application/pdf\r\n\r\n{value}\r\n"
    )
}

fn upload_request(body: String) -> Request<Body> {
    Request::builder()
        .method("POST")
        .uri("/api/v1/uploads")
        .header("X-API-Key", "test-key")
        .header(
            header::CONTENT_TYPE,
            format!("multipart/form-data; boundary={UPLOAD_BOUNDARY}"),
        )
        .body(Body::from(body))
        .unwrap()
}

async fn response_json(response: axum::response::Response) -> Value {
    serde_json::from_slice(
        &to_bytes(response.into_body(), usize::MAX)
            .await
            .expect("read response body"),
    )
    .expect("parse response JSON")
}

#[tokio::test]
async fn upload_route_enforces_configured_stream_limit_without_content_length() {
    let mut state = test_state("upload-route-stream-limit");
    let mut config = (*state.config).clone();
    config.upload_max_bytes = 4;
    let uploads_dir = config.uploads_dir.clone();
    state.config = Arc::new(config);
    let body = format!(
        "{}--{UPLOAD_BOUNDARY}--\r\n",
        upload_file_field("input.pdf", "12345")
    );

    let response = build_app(state)
        .oneshot(upload_request(body))
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::PAYLOAD_TOO_LARGE);
    let payload = response_json(response).await;
    assert_eq!(payload["code"], 41300);
    assert_eq!(payload["message"], "request body is too large");
    assert_eq!(payload["error"]["code"], "PAYLOAD_TOO_LARGE");
    let entries = std::fs::read_dir(uploads_dir)
        .expect("read uploads directory")
        .collect::<Result<Vec<_>, _>>()
        .expect("collect uploads directory");
    assert!(entries.is_empty(), "oversize route upload created files");
}

#[tokio::test]
async fn upload_route_rejects_duplicate_file_before_reading_second_body() {
    let mut state = test_state("upload-route-duplicate-file");
    let mut config = (*state.config).clone();
    config.upload_max_bytes = 4;
    state.config = Arc::new(config);
    let body = format!(
        "{}{}--{UPLOAD_BOUNDARY}--\r\n",
        upload_file_field("first.pdf", "1234"),
        upload_file_field("second.pdf", "12345")
    );

    let response = build_app(state)
        .oneshot(upload_request(body))
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    let payload = response_json(response).await;
    assert_eq!(payload["code"], 40000);
    assert_eq!(payload["message"], "duplicate multipart field: file");
    assert_eq!(payload["error"]["code"], "BAD_REQUEST");
}

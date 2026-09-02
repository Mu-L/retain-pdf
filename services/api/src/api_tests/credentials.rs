use axum::body::Body;
use axum::http::{header, Method, Request, StatusCode};
use serde_json::{json, Value};
use tower::util::ServiceExt;

use super::jobs_common::{read_json, test_state};
use crate::app::build_app;

async fn request(
    app: axum::Router,
    method: Method,
    uri: &str,
    body: Option<Value>,
) -> (StatusCode, Value) {
    let mut builder = Request::builder()
        .method(method)
        .uri(uri)
        .header("X-API-Key", "test-key");
    let body = if let Some(value) = body {
        builder = builder.header(header::CONTENT_TYPE, "application/json");
        Body::from(value.to_string())
    } else {
        Body::empty()
    };
    let response = app
        .oneshot(builder.body(body).expect("credential request"))
        .await
        .expect("credential response");
    let status = response.status();
    (status, read_json(response).await)
}

#[tokio::test]
async fn credential_api_persists_only_safe_metadata_in_responses() {
    let state = test_state("credentials-roundtrip");
    let app = build_app(state.clone());
    let secret = "sk-backend-only-value";
    let (status, created) = request(
        app.clone(),
        Method::POST,
        "/api/v1/credentials",
        Some(json!({
            "kind": "translation_api_key",
            "provider": "deepseek",
            "label": "Primary translation model",
            "secret": secret,
            "expected_revision": 0
        })),
    )
    .await;
    assert_eq!(status, StatusCode::OK, "{created}");
    let credential_ref = created["data"]["credential"]["credential_ref"]
        .as_str()
        .expect("credential ref")
        .to_string();
    assert!(credential_ref.starts_with("cred_"));
    assert_eq!(created["data"]["revision"], 1);
    assert_eq!(created["data"]["credential"]["configured"], true);
    assert!(!created.to_string().contains(secret));
    assert!(created["data"]["credential"].get("secret").is_none());

    let (status, listed) = request(app.clone(), Method::GET, "/api/v1/credentials", None).await;
    assert_eq!(status, StatusCode::OK);
    assert_eq!(listed["data"]["revision"], 1);
    assert_eq!(
        listed["data"]["credentials"][0]["credential_ref"],
        credential_ref
    );
    assert!(!listed.to_string().contains(secret));

    let (status, stale) = request(
        app.clone(),
        Method::PUT,
        &format!("/api/v1/credentials/{credential_ref}"),
        Some(json!({"label": "stale", "expected_revision": 0})),
    )
    .await;
    assert_eq!(status, StatusCode::CONFLICT, "{stale}");

    let (status, deleted) = request(
        app,
        Method::DELETE,
        &format!("/api/v1/credentials/{credential_ref}?expected_revision=1"),
        None,
    )
    .await;
    assert_eq!(status, StatusCode::OK, "{deleted}");
    assert_eq!(deleted["data"]["deleted"], true);

    let persisted = std::fs::read_to_string(
        state
            .config
            .data_root
            .join("secrets")
            .join("credentials.json"),
    )
    .expect("credential vault file");
    assert!(
        !persisted.contains(secret),
        "deleted secrets must leave the vault"
    );

    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;

        let secrets_dir = state.config.data_root.join("secrets");
        let lock_metadata = std::fs::metadata(secrets_dir.join(".credentials.lock"))
            .expect("credential vault process lock");
        assert_eq!(lock_metadata.permissions().mode() & 0o777, 0o600);
        assert_eq!(
            std::fs::metadata(secrets_dir)
                .expect("credential vault directory")
                .permissions()
                .mode()
                & 0o777,
            0o700
        );
    }
}

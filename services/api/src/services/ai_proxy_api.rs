//! HTTP application facade for the retainpdf-ai reverse proxy.

use axum::body::Body;
use axum::http::{HeaderMap, StatusCode};
use axum::response::{IntoResponse, Response};
use serde_json::Value;

use crate::error::AppError;

fn forwarded_api_key(headers: &HeaderMap) -> &str {
    headers
        .get("X-API-Key")
        .and_then(|value| value.to_str().ok())
        .unwrap_or("")
}

fn response_metadata(upstream: &reqwest::Response) -> (StatusCode, String) {
    let status =
        StatusCode::from_u16(upstream.status().as_u16()).unwrap_or(StatusCode::BAD_GATEWAY);
    let content_type = upstream
        .headers()
        .get(reqwest::header::CONTENT_TYPE)
        .and_then(|value| value.to_str().ok())
        .unwrap_or("application/json")
        .to_string();
    (status, content_type)
}

pub async fn ask(headers: &HeaderMap, payload: Value) -> Result<Response, AppError> {
    let upstream = super::ai_proxy::ask(forwarded_api_key(headers), &payload).await?;
    let (status, content_type) = response_metadata(&upstream);
    let body = Body::from_stream(upstream.bytes_stream());
    Ok((
        status,
        [
            (axum::http::header::CONTENT_TYPE, content_type),
            (axum::http::header::CACHE_CONTROL, "no-cache".to_string()),
        ],
        body,
    )
        .into_response())
}

async fn buffered_runtime_config_response(
    upstream: reqwest::Response,
) -> Result<Response, AppError> {
    let (status, content_type) = response_metadata(&upstream);
    let body = upstream
        .bytes()
        .await
        .map_err(|error| AppError::bad_gateway(format!("AI service response failed: {error}")))?;
    Ok((
        status,
        [
            (axum::http::header::CONTENT_TYPE, content_type),
            (axum::http::header::CACHE_CONTROL, "no-store".to_string()),
        ],
        Body::from(body),
    )
        .into_response())
}

pub async fn get_runtime_config(headers: &HeaderMap) -> Result<Response, AppError> {
    let upstream = super::ai_proxy::get_runtime_config(forwarded_api_key(headers)).await?;
    buffered_runtime_config_response(upstream).await
}

pub async fn update_runtime_config(
    headers: &HeaderMap,
    payload: Value,
) -> Result<Response, AppError> {
    let upstream =
        super::ai_proxy::update_runtime_config(forwarded_api_key(headers), &payload).await?;
    buffered_runtime_config_response(upstream).await
}

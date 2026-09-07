//! HTTP adapters for the retainpdf-ai reverse proxy.

use axum::http::HeaderMap;
use axum::response::Response;

use crate::error::AppError;
use crate::routes::common::ApiJson;
use crate::services::ai_proxy_api;

pub async fn ask_proxy(
    headers: HeaderMap,
    ApiJson(payload): ApiJson<serde_json::Value>,
) -> Result<Response, AppError> {
    ai_proxy_api::ask(&headers, payload).await
}

pub async fn get_runtime_config_proxy(headers: HeaderMap) -> Result<Response, AppError> {
    ai_proxy_api::get_runtime_config(&headers).await
}

pub async fn update_runtime_config_proxy(
    headers: HeaderMap,
    ApiJson(payload): ApiJson<serde_json::Value>,
) -> Result<Response, AppError> {
    ai_proxy_api::update_runtime_config(&headers, payload).await
}

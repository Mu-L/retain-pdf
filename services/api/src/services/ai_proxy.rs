//! Internal HTTP gateway for the retainpdf-ai sidecar.

use once_cell::sync::Lazy;
use reqwest::{Method, Response};
use serde_json::Value;

use crate::error::AppError;

static PROXY_CLIENT: Lazy<reqwest::Client> = Lazy::new(|| {
    reqwest::Client::builder()
        .connect_timeout(crate::config::AiProxyConfig::from_env().connect_timeout)
        .build()
        .expect("build ai proxy client")
});

fn ai_service_base() -> String {
    std::env::var("RUST_API_AI_SERVICE_BASE")
        .ok()
        .map(|value| value.trim().trim_end_matches('/').to_string())
        .filter(|value| !value.is_empty())
        .unwrap_or_else(|| crate::config::AiServiceConfig::default().base_url())
}

fn ensure_ai_service_available() -> Result<(), AppError> {
    if super::ai_supervisor::ai_service_status() == super::ai_supervisor::AI_STATUS_UNHEALTHY {
        return Err(AppError::service_unavailable(
            "AI 服务暂不可用（监督器正在重启它），请稍后重试",
        ));
    }
    Ok(())
}

async fn send(
    method: Method,
    path: &str,
    api_key: &str,
    payload: Option<&Value>,
) -> Result<Response, AppError> {
    ensure_ai_service_available()?;
    let base_url = ai_service_base();
    let mut request = PROXY_CLIENT
        .request(method, format!("{base_url}{path}"))
        .header("X-API-Key", api_key);
    if let Some(payload) = payload {
        request = request.json(payload);
    }
    request.send().await.map_err(|error| {
        AppError::bad_gateway(format!("AI service unreachable at {base_url}: {error}"))
    })
}

pub(crate) async fn ask(api_key: &str, payload: &Value) -> Result<Response, AppError> {
    send(Method::POST, "/v1/ask", api_key, Some(payload)).await
}

pub(crate) async fn get_runtime_config(api_key: &str) -> Result<Response, AppError> {
    send(Method::GET, "/v1/runtime-config", api_key, None).await
}

pub(crate) async fn update_runtime_config(
    api_key: &str,
    payload: &Value,
) -> Result<Response, AppError> {
    send(Method::PUT, "/v1/runtime-config", api_key, Some(payload)).await
}

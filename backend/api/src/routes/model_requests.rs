//! Launcher routes require the application API key. Worker routes instead use
//! a short-lived capability bound to exactly one job; never accept an API key
//! as a worker capability and never accept an upstream URL in a model request.
use crate::services::model_executor::{
    ModelConnection, ModelConnectionPolicy, ModelExecutor, ModelRequest,
};
use crate::{app::AppState, error::AppError, models::domain::JobStatusKind};
use axum::{
    extract::{Path, State},
    http::HeaderMap,
    routing::{get, post},
    Json, Router,
};
use serde_json::{json, Value};
use std::sync::Arc;

pub fn worker_routes() -> Router<AppState> {
    Router::new()
        .route("/api/v1/internal/model/jobs/:job_id/requests", post(submit))
        .route(
            "/api/v1/internal/model/jobs/:job_id/requests/:operation_id",
            get(status),
        )
        .route(
            "/api/v1/internal/model/jobs/:job_id/requests/:operation_id/cancel",
            post(cancel),
        )
}
pub fn launcher_routes() -> Router<AppState> {
    Router::new().route(
        "/api/v1/internal/model/jobs/:job_id/capability",
        post(issue),
    )
}
fn executor(state: &AppState) -> Result<Arc<ModelExecutor>, AppError> {
    state
        .model_executor
        .clone()
        .ok_or_else(|| AppError::ServiceUnavailable("model executor rollout is not enabled".into()))
}
fn token(headers: &HeaderMap) -> Result<&str, AppError> {
    headers
        .get("authorization")
        .and_then(|v| v.to_str().ok())
        .and_then(|v| v.strip_prefix("Bearer "))
        .filter(|s| s.len() == 64)
        .ok_or_else(|| AppError::Unauthorized("worker capability required".into()))
}
fn active_job(state: &AppState, job_id: &str) -> Result<(), AppError> {
    let job = state
        .db
        .get_job(job_id)
        .map_err(|_| AppError::NotFound("job not found".into()))?;
    if !matches!(job.status, JobStatusKind::Queued | JobStatusKind::Running) {
        return Err(AppError::Conflict("job is not active".into()));
    }
    Ok(())
}
async fn issue(
    State(state): State<AppState>,
    Path(job_id): Path<String>,
    Json(profile): Json<ModelConnection>,
) -> Result<Json<Value>, AppError> {
    let executor = executor(&state)?;
    active_job(&state, &job_id)?;
    let job = state
        .db
        .get_job(&job_id)
        .map_err(|_| AppError::NotFound("job not found".into()))?;
    let translation = &job.request_payload.translation;
    if translation.execution_connection.as_ref() != Some(&profile) {
        return Err(AppError::Conflict(
            "model connection must match the complete submission snapshot".into(),
        ));
    }
    // The launcher may describe policy, but cannot swap the job's target/key.
    if profile.model != translation.model
        || profile.base_url.trim_end_matches('/') != translation.base_url.trim_end_matches('/')
        || profile.credential_ref != translation.credential_ref
        || profile.concurrency as i64 != translation.workers
    {
        return Err(AppError::Conflict(
            "connection does not match frozen job configuration".into(),
        ));
    }
    profile
        .validate()
        .map_err(|_| AppError::BadRequest("invalid model connection".into()))?;
    let capability = executor
        .register_job(&job_id, &profile, 3600)
        .map_err(|_| {
            AppError::Conflict("cannot register or change frozen model connection".into())
        })?;
    Ok(Json(
        json!({"token_type":"Bearer","capability":capability,"expires_in":3600}),
    ))
}
async fn submit(
    State(state): State<AppState>,
    Path(job_id): Path<String>,
    headers: HeaderMap,
    Json(request): Json<ModelRequest>,
) -> Result<Json<Value>, AppError> {
    let executor = executor(&state)?;
    let token = token(&headers)?;
    // Authenticate before revealing whether a job or operation exists.
    executor
        .status(&job_id, token, &request.operation_id)
        .map_err(|_| AppError::Unauthorized("invalid worker capability".into()))?;
    active_job(&state, &job_id)?;
    request
        .validate()
        .map_err(|_| AppError::BadRequest("invalid bounded model request".into()))?;
    let operation = executor
        .submit(&job_id, token, request)
        .await
        .map_err(|_| {
            AppError::Conflict(
                "model operation conflict, paused job or exhausted unit budget".into(),
            )
        })?;
    Ok(Json(json!(operation)))
}
async fn status(
    State(state): State<AppState>,
    Path((job_id, operation_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Result<Json<Value>, AppError> {
    let operation = executor(&state)?
        .status(&job_id, token(&headers)?, &operation_id)
        .map_err(|_| AppError::Unauthorized("invalid worker capability".into()))?
        .ok_or_else(|| AppError::NotFound("model operation not found".into()))?;
    Ok(Json(json!(operation)))
}
async fn cancel(
    State(state): State<AppState>,
    Path((job_id, operation_id)): Path<(String, String)>,
    headers: HeaderMap,
) -> Result<Json<Value>, AppError> {
    let changed = executor(&state)?
        .cancel(&job_id, token(&headers)?, &operation_id)
        .map_err(|_| AppError::Unauthorized("invalid worker capability".into()))?;
    Ok(Json(json!({"changed":changed})))
}

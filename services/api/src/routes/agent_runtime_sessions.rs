use axum::extract::{Path as AxumPath, State};
use axum::Json;

use crate::error::AppError;
use crate::models::api::ApiResponse;
use crate::routes::common::build_document_operation_route_deps;
use crate::services::agent_runtime_sessions::{
    clear_agent_runtime_session, get_agent_runtime_session, put_agent_runtime_session,
    AgentRuntimeSessionView, ClearAgentRuntimeSessionInput, PutAgentRuntimeSessionInput,
};
use crate::AppState;

pub async fn get_agent_runtime_session_route(
    State(state): State<AppState>,
    AxumPath(conversation_id): AxumPath<String>,
) -> Result<Json<ApiResponse<AgentRuntimeSessionView>>, AppError> {
    let deps = build_document_operation_route_deps(&state);
    Ok(Json(ApiResponse::ok(get_agent_runtime_session(
        deps.db,
        &conversation_id,
    )?)))
}

pub async fn put_agent_runtime_session_route(
    State(state): State<AppState>,
    AxumPath(conversation_id): AxumPath<String>,
    Json(input): Json<PutAgentRuntimeSessionInput>,
) -> Result<Json<ApiResponse<AgentRuntimeSessionView>>, AppError> {
    let deps = build_document_operation_route_deps(&state);
    Ok(Json(ApiResponse::ok(put_agent_runtime_session(
        deps.db,
        &conversation_id,
        &input,
    )?)))
}

pub async fn clear_agent_runtime_session_route(
    State(state): State<AppState>,
    AxumPath(conversation_id): AxumPath<String>,
    Json(input): Json<ClearAgentRuntimeSessionInput>,
) -> Result<Json<ApiResponse<AgentRuntimeSessionView>>, AppError> {
    let deps = build_document_operation_route_deps(&state);
    Ok(Json(ApiResponse::ok(clear_agent_runtime_session(
        deps.db,
        &conversation_id,
        &input,
    )?)))
}

use axum::extract::State;
use axum::http::StatusCode;
use axum::Json;
use serde::Serialize;

use crate::models::api::ApiResponse;
use crate::models::domain::{now_iso, JobStatusKind};
use crate::ocr_provider::supported_provider_keys;
use crate::routes::common::{build_health_route_deps, HealthRouteDeps};
use crate::AppState;

#[derive(Serialize)]
pub struct HealthView {
    pub status: &'static str,
    pub db: &'static str,
    pub queue_depth: i64,
    pub running_jobs: i64,
    pub provider_backends: Vec<String>,
    pub ai_service: &'static str,
    pub jobsd: &'static str,
    pub time: String,
}

#[derive(Debug, Serialize)]
pub struct ReadinessComponentView {
    pub required: bool,
    pub status: &'static str,
}

#[derive(Debug, Serialize)]
pub struct ReadinessComponentsView {
    pub db: ReadinessComponentView,
    pub ai_service: ReadinessComponentView,
    pub jobsd: ReadinessComponentView,
}

#[derive(Debug, Serialize)]
pub struct ReadinessView {
    pub status: &'static str,
    pub components: ReadinessComponentsView,
    pub reasons: Vec<&'static str>,
    pub time: String,
}

fn build_health_view(deps: HealthRouteDeps<'_>) -> HealthView {
    let db_ok = deps.db.ping().is_ok();
    let queued = deps
        .db
        .count_jobs_with_status(&JobStatusKind::Queued)
        .unwrap_or(0);
    let running = deps
        .db
        .count_jobs_with_status(&JobStatusKind::Running)
        .unwrap_or(0);
    HealthView {
        status: if db_ok { "up" } else { "degraded" },
        db: if db_ok { "ok" } else { "error" },
        queue_depth: queued,
        running_jobs: running,
        provider_backends: supported_provider_keys(),
        ai_service: crate::services::ai_supervisor::ai_service_status_label(),
        jobsd: crate::services::jobsd_supervisor::jobsd_status_label(),
        time: now_iso(),
    }
}

pub async fn health(State(state): State<AppState>) -> Json<ApiResponse<HealthView>> {
    Json(ApiResponse::ok(build_health_view(build_health_route_deps(
        &state,
    ))))
}

pub(crate) fn build_readiness_view(
    deps: HealthRouteDeps<'_>,
    ai_status: u8,
    jobsd_status: u8,
) -> ReadinessView {
    let db_ok = deps.db.ping().is_ok();
    let ai_required = deps.ai_supervised;
    let jobsd_required = deps.jobsd_supervised;
    let ai_ok = !ai_required || ai_status == crate::services::ai_supervisor::AI_STATUS_HEALTHY;
    let jobsd_ok =
        !jobsd_required || jobsd_status == crate::services::jobsd_supervisor::JOBSD_STATUS_HEALTHY;

    let mut reasons = Vec::new();
    if !db_ok {
        reasons.push("db_unavailable");
    }
    if !ai_ok {
        reasons.push("ai_service_not_healthy");
    }
    if !jobsd_ok {
        reasons.push("jobsd_not_healthy");
    }

    ReadinessView {
        status: if reasons.is_empty() {
            "ready"
        } else {
            "not_ready"
        },
        components: ReadinessComponentsView {
            db: ReadinessComponentView {
                required: true,
                status: if db_ok { "healthy" } else { "unhealthy" },
            },
            ai_service: ReadinessComponentView {
                required: ai_required,
                status: if ai_required {
                    ai_status_label(ai_status)
                } else {
                    "not_required"
                },
            },
            jobsd: ReadinessComponentView {
                required: jobsd_required,
                status: if jobsd_required {
                    jobsd_status_label(jobsd_status)
                } else {
                    "not_required"
                },
            },
        },
        reasons,
        time: now_iso(),
    }
}

fn ai_status_label(status: u8) -> &'static str {
    match status {
        crate::services::ai_supervisor::AI_STATUS_STARTING => "starting",
        crate::services::ai_supervisor::AI_STATUS_HEALTHY => "healthy",
        crate::services::ai_supervisor::AI_STATUS_UNHEALTHY => "unhealthy",
        _ => "unsupervised",
    }
}

fn jobsd_status_label(status: u8) -> &'static str {
    match status {
        crate::services::jobsd_supervisor::JOBSD_STATUS_STARTING => "starting",
        crate::services::jobsd_supervisor::JOBSD_STATUS_HEALTHY => "healthy",
        crate::services::jobsd_supervisor::JOBSD_STATUS_UNHEALTHY => "unhealthy",
        _ => "unsupervised",
    }
}

pub(crate) fn readiness_http_status(view: &ReadinessView) -> StatusCode {
    if view.reasons.is_empty() {
        StatusCode::OK
    } else {
        StatusCode::SERVICE_UNAVAILABLE
    }
}

pub async fn ready(
    State(state): State<AppState>,
) -> (StatusCode, Json<ApiResponse<ReadinessView>>) {
    let view = build_readiness_view(
        build_health_route_deps(&state),
        crate::services::ai_supervisor::ai_service_status(),
        crate::services::jobsd_supervisor::jobsd_status(),
    );
    let status = readiness_http_status(&view);
    (status, Json(ApiResponse::ok(view)))
}

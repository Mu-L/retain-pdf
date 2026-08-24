use anyhow::Result;
use tracing::warn;

use crate::config::AppConfig;
use crate::db::Db;
use crate::job_events::persist_job_with_resources;
use crate::models::domain::{now_iso, JobFailureInfo, JobStatusKind};

use super::worker_process::{terminate_job_process_tree_blocking, worker_process_exists};

/// Why a `Running`-status job found when its owning runtime starts is being reconciled.
enum StaleReason {
    /// No pid was ever recorded for this job.
    NoPid,
    /// The recorded pid is no longer alive.
    Dead(u32),
    /// The recorded pid is still alive, but the owning runtime restarted and
    /// can no longer consume its stdout or mark it finished.
    Orphaned(u32),
}

/// Reconcile workers only when the process that owns the runtime starts.
///
/// InProcess mode calls this from the HTTP shell. Remote mode calls it from
/// retain-jobsd. The shell must never call it for jobsd-owned workers.
pub fn reconcile_stale_running_jobs(config: &AppConfig, db: &Db) -> Result<usize> {
    let running_jobs = db.list_job_process_records_with_status(&JobStatusKind::Running)?;
    let mut reconciled = 0usize;
    for job_record in running_jobs {
        let reason = match job_record.pid {
            Some(pid) if worker_process_exists(pid) => StaleReason::Orphaned(pid),
            Some(pid) => StaleReason::Dead(pid),
            None => StaleReason::NoPid,
        };

        if let StaleReason::Orphaned(pid) = reason {
            warn!(
                "runtime startup found live orphaned worker process pid={pid} for job {} still running; terminating its process tree before recovering job state",
                job_record.job_id
            );
            if let Err(error) = terminate_job_process_tree_blocking(
                pid,
                config.job_runner.worker_terminate_grace_secs,
                config.job_runner.worker_terminate_poll_ms,
            ) {
                warn!(
                    "failed to terminate orphaned worker process pid={pid} for job {}: {error:#}",
                    job_record.job_id
                );
            }
        }

        let (detail, failure_category, failure_code) = match reason {
            StaleReason::Orphaned(pid) => (
                format!(
                    "任务运行时启动时发现遗留 running 任务，worker 进程 {pid} 仍在运行（孤儿进程），已终止该进程"
                ),
                "worker_orphaned_after_restart",
                "worker_orphaned_after_restart",
            ),
            StaleReason::Dead(pid) => (
                format!("任务运行时启动时发现遗留 running 任务，但 worker 进程 {pid} 已不存在"),
                "worker_process_missing",
                "worker_process_missing",
            ),
            StaleReason::NoPid => (
                "任务运行时启动时发现遗留 running 任务，但未记录 worker pid".to_string(),
                "worker_process_missing",
                "worker_process_missing",
            ),
        };
        let timestamp = now_iso();
        match db.get_job(&job_record.job_id) {
            Ok(mut job) => {
                job.append_log(&format!("ERROR: {detail}"));
                job.status = JobStatusKind::Failed;
                job.stage = Some("failed".to_string());
                job.stage_detail = Some("runtime startup stale running job recovered".to_string());
                job.error = Some(detail.clone());
                job.updated_at = timestamp.clone();
                job.finished_at = Some(timestamp.clone());
                job.pid = None;
                job.sync_runtime_state();
                job.replace_failure_info(Some(JobFailureInfo {
                    stage: "startup_recovery".to_string(),
                    category: failure_category.to_string(),
                    code: None,
                    failed_stage: Some("startup_recovery".to_string()),
                    failure_code: Some(failure_code.to_string()),
                    failure_category: Some("internal".to_string()),
                    provider_stage: None,
                    provider_code: None,
                    summary: "任务运行时启动时回收了遗留 running 任务".to_string(),
                    root_cause: Some(detail.clone()),
                    retryable: true,
                    upstream_host: None,
                    provider: None,
                    suggestion: Some(
                        "该任务对应的 worker 已不在运行；请重新提交或手动重试".to_string(),
                    ),
                    last_log_line: Some(detail.clone()),
                    raw_excerpt: Some(detail.clone()),
                    raw_error_excerpt: Some(detail.clone()),
                    raw_diagnostic: None,
                    ai_diagnostic: None,
                }));
                persist_job_with_resources(db, &config.data_root, &config.output_root, &job)?;
            }
            Err(error) => {
                warn!(
                    "runtime startup reconciliation fell back to raw DB recovery for {}: {}",
                    job_record.job_id, error
                );
                db.recover_stale_running_job(&job_record.job_id, &detail, &timestamp)?;
            }
        }
        reconciled += 1;
        warn!(
            "recovered stale running job during runtime startup: {}",
            job_record.job_id
        );
    }
    if reconciled > 0 {
        warn!("runtime startup reconciliation recovered {reconciled} stale running job(s)");
    }
    Ok(reconciled)
}

use std::collections::HashSet;
use std::process::ExitStatus;
use std::sync::Arc;
use std::time::Instant;

use anyhow::{Context, Result};
use tokio::sync::RwLock;
use tokio::time::{timeout, Duration};

use crate::config::WorkerProcessRuntimeConfig;
use crate::models::domain::JobRuntimeState;

use super::super::{terminate_job_process_tree, JobPersistDeps};
use super::io_support::{read_stdout, read_stream};
use super::timeout_support::persist_timeout_failure;

/// 进程退出(或被杀并 reap)之后,还要等 stdout / stderr 的读取任务收尾。
///
/// 正常情况下写端一关,`next_line()` 立刻返回 `None`,这两个 join 是瞬时的。
/// 但 worker 派生的孙进程若自己 `setpgid` 脱出了进程组、又继承着这两个管道
/// 的写端,`terminate_job_process_tree` 的组杀就打不到它——管道永远不关闭,
/// `next_line()` 也就永远不返回。无条件 `await` 会让 runner 在这里无限期挂住:
/// 这个 job 再不推进,DB 里停在 running,而且没有任何日志说明发生了什么。
///
/// 所以给收尾 join 一个上限(`RUST_API_WORKER_OUTPUT_DRAIN_SECS`,默认 30 秒),
/// 超时就放弃那段输出、abort 掉读取任务,带着已知信息走完终态。少收一段
/// stdout 远好过一个永远卡死的 runner。
pub(super) struct CompletedProcess {
    pub(super) status: ExitStatus,
    pub(super) started: Instant,
    pub(super) stdout_text: String,
    pub(super) stderr_text: String,
    pub(super) latest_job: JobRuntimeState,
}

pub(super) enum ProcessExecution {
    Completed(CompletedProcess),
    TimedOut(JobRuntimeState),
}

pub(super) async fn collect_process_execution(
    persist: &JobPersistDeps,
    canceled_jobs: &Arc<RwLock<HashSet<String>>>,
    worker_runtime: &WorkerProcessRuntimeConfig<'_>,
    mut child: tokio::process::Child,
    job: JobRuntimeState,
    runtime_secrets: Vec<String>,
    extra_cancel_job_ids: &[String],
) -> Result<ProcessExecution> {
    let job_id = job.job_id.clone();
    let drain_secs = worker_runtime.worker_output_drain_secs;
    let stdout = child.stdout.take().context("missing stdout pipe")?;
    let stderr = child.stderr.take().context("missing stderr pipe")?;
    let child_pid = job.pid;
    let timeout_secs = job.request_payload.runtime.timeout_seconds;
    let stdout_handle = tokio::spawn(read_stdout(
        persist.clone(),
        canceled_jobs.clone(),
        job,
        stdout,
        runtime_secrets.clone(),
        extra_cancel_job_ids.to_vec(),
    ));
    let stderr_handle = tokio::spawn(read_stream(stderr, runtime_secrets));
    let started = Instant::now();

    let status = if timeout_secs > 0 {
        match timeout(Duration::from_secs(timeout_secs as u64), child.wait()).await {
            Ok(result) => result?,
            Err(_) => {
                if let Some(pid) = child_pid {
                    let _ = terminate_job_process_tree(
                        pid,
                        worker_runtime.worker_terminate_grace_secs,
                        worker_runtime.worker_terminate_poll_ms,
                    )
                    .await;
                }
                // `terminate_job_process_tree` signals the process group
                // directly via libc, bypassing tokio's own reaping. Without
                // an explicit `wait()` here, dropping `child` below (it is
                // not spawned with `kill_on_drop`) would leave a zombie
                // entry around until the whole server process exits. Guard
                // the wait so a pathological unreapable child can't hang the
                // runner indefinitely.
                match timeout(Duration::from_secs(5), child.wait()).await {
                    Ok(Ok(_)) => {}
                    Ok(Err(error)) => {
                        tracing::warn!("failed to reap timed-out worker process: {error:#}")
                    }
                    Err(_) => tracing::warn!(
                        "timed out waiting to reap worker process after termination; it may remain a zombie until the server exits"
                    ),
                }
                let (stdout_text, stdout_job) =
                    drain_stdout(stdout_handle, persist, &job_id, drain_secs).await?;
                let stderr_text = drain_stderr(stderr_handle, &job_id, drain_secs).await;
                return Ok(ProcessExecution::TimedOut(persist_timeout_failure(
                    persist,
                    worker_runtime.project_root,
                    stdout_job,
                    started,
                    stdout_text,
                    stderr_text,
                )?));
            }
        }
    } else {
        child.wait().await?
    };

    let (stdout_text, latest_job) = drain_stdout(stdout_handle, persist, &job_id, drain_secs).await?;
    let stderr_text = drain_stderr(stderr_handle, &job_id, drain_secs).await;
    Ok(ProcessExecution::Completed(CompletedProcess {
        status,
        started,
        stdout_text,
        stderr_text,
        latest_job,
    }))
}

/// 见 [`collect_process_execution`] 顶部关于收尾上限的说明。放弃时的 job 状态从 DB 重读——读取任务
/// 已经把它一路 checkpoint 进去了,内存里那份没有额外信息。
async fn drain_stdout(
    mut handle: tokio::task::JoinHandle<Result<(String, JobRuntimeState)>>,
    persist: &JobPersistDeps,
    job_id: &str,
    drain_secs: u64,
) -> Result<(String, JobRuntimeState)> {
    match timeout(Duration::from_secs(drain_secs), &mut handle).await {
        Ok(joined) => joined?,
        Err(_) => {
            handle.abort();
            tracing::warn!(
                "job={job_id}: 进程已退出但 stdout 读取任务 {drain_secs}s 未结束，\
                 疑有脱离进程组的孙进程仍持有管道写端；放弃收集 stdout 继续收尾"
            );
            Ok((String::new(), persist.db.get_job(job_id)?.into_runtime()))
        }
    }
}

/// 见 [`collect_process_execution`] 顶部关于收尾上限的说明。stderr 只用于附在失败信息里,拿不到就
/// 空着,不值得为它让整个收尾失败。
async fn drain_stderr(
    mut handle: tokio::task::JoinHandle<Result<String>>,
    job_id: &str,
    drain_secs: u64,
) -> String {
    match timeout(Duration::from_secs(drain_secs), &mut handle).await {
        Ok(Ok(Ok(text))) => text,
        Ok(Ok(Err(error))) => {
            tracing::warn!("job={job_id}: 读取 stderr 失败: {error:#}");
            String::new()
        }
        Ok(Err(error)) => {
            tracing::warn!("job={job_id}: stderr 读取任务异常退出: {error:#}");
            String::new()
        }
        Err(_) => {
            handle.abort();
            tracing::warn!(
                "job={job_id}: 进程已退出但 stderr 读取任务 {drain_secs}s 未结束；\
                 放弃收集 stderr 继续收尾"
            );
            String::new()
        }
    }
}

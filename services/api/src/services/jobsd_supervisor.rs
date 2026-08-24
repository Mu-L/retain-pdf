//! retain-jobsd 监督器（ADR-002 Phase 3）。
//!
//! 复用 `ai_supervisor` 模式：rust_api（壳）成为 jobsd 的唯一 supervisor。
//! 默认关闭（`RUST_API_JOBS_SUPERVISE=0`），开启后：拉起 → /healthz 就绪等待
//! → 周期探活 → 退出/连续失败阈值 → 指数退避重启 → 随壳优雅退出回收进程树。

use std::sync::atomic::{AtomicU8, Ordering};
use std::time::Duration;

use tokio::process::{Child, Command};
use tokio::sync::watch;
use tokio::task::JoinHandle;

use crate::config::AppConfig;
use crate::process::{configure_child_process, terminate_job_process_tree};

pub const JOBSD_STATUS_DISABLED: u8 = 0;
pub const JOBSD_STATUS_STARTING: u8 = 1;
pub const JOBSD_STATUS_HEALTHY: u8 = 2;
pub const JOBSD_STATUS_UNHEALTHY: u8 = 3;

static JOBSD_STATUS: AtomicU8 = AtomicU8::new(JOBSD_STATUS_DISABLED);

pub fn jobsd_status() -> u8 {
    JOBSD_STATUS.load(Ordering::Relaxed)
}

pub fn jobsd_status_label() -> &'static str {
    match jobsd_status() {
        JOBSD_STATUS_STARTING => "starting",
        JOBSD_STATUS_HEALTHY => "healthy",
        JOBSD_STATUS_UNHEALTHY => "unhealthy",
        _ => "unsupervised",
    }
}

fn set_status(status: u8) {
    JOBSD_STATUS.store(status, Ordering::Relaxed);
}

#[cfg(test)]
pub fn set_status_for_test(status: u8) {
    set_status(status);
}

fn resolve_command(app: &AppConfig) -> (String, Vec<String>) {
    let cfg = &app.jobs_service;
    if !cfg.command.is_empty() {
        return (cfg.command.clone(), cfg.args.clone());
    }
    // 默认：与当前可执行文件同目录下的 retain-jobsd 二进制
    if let Ok(current_exe) = std::env::current_exe() {
        if let Some(dir) = current_exe.parent() {
            let candidate = if cfg!(windows) {
                dir.join("retain-jobsd.exe")
            } else {
                dir.join("retain-jobsd")
            };
            if candidate.is_file() {
                return (candidate.to_string_lossy().to_string(), Vec::new());
            }
        }
    }
    // 开发回退：尝试 PATH 中的 retain-jobsd
    ("retain-jobsd".to_string(), Vec::new())
}

fn spawn_child(app: &AppConfig) -> std::io::Result<Child> {
    let (command, args) = resolve_command(app);
    let mut cmd = Command::new(&command);
    if !args.is_empty() {
        cmd.args(&args);
    }
    cmd.env(
        "RETAIN_OCR_PROVIDER_CONFIG",
        &app.provider_runtime.ocr_provider_config_path,
    );
    configure_child_process(&mut cmd);
    if let Some(cwd) = &app.jobs_service.cwd {
        cmd.current_dir(cwd);
    }
    // 继承壳的全部 env（已含 RUST_API_*、RETAIN_* 等），jobsd 直接复用
    cmd.kill_on_drop(true);
    cmd.spawn()
}

async fn terminate_child(child: &mut Child, grace_secs: u64, poll_ms: u64) {
    if let Some(pid) = child.id() {
        if terminate_job_process_tree(pid, grace_secs, poll_ms)
            .await
            .is_ok()
        {
            let _ = child.wait().await;
            return;
        }
    }
    let _ = child.kill().await;
    let _ = child.wait().await;
}

async fn probe(client: &reqwest::Client, url: &str) -> bool {
    matches!(client.get(url).send().await, Ok(resp) if resp.status().is_success())
}

async fn sleep_or_shutdown(duration: Duration, shutdown: &mut watch::Receiver<bool>) -> bool {
    if *shutdown.borrow() {
        return true;
    }
    tokio::select! {
        _ = tokio::time::sleep(duration) => false,
        _ = shutdown.changed() => true,
    }
}

enum RunOutcome {
    Shutdown,
    Restart,
}

async fn run_once(
    app: &AppConfig,
    client: &reqwest::Client,
    health_url: &str,
    shutdown: &mut watch::Receiver<bool>,
) -> RunOutcome {
    set_status(JOBSD_STATUS_STARTING);
    let grace = app.job_runner.worker_terminate_grace_secs;
    let poll = app.job_runner.worker_terminate_poll_ms;

    let mut child = match spawn_child(app) {
        Ok(child) => child,
        Err(error) => {
            tracing::warn!("jobsd_supervisor: spawn failed: {error}");
            set_status(JOBSD_STATUS_UNHEALTHY);
            return RunOutcome::Restart;
        }
    };
    tracing::info!(
        "jobsd_supervisor: spawned jobsd (pid {:?}) health_url={}",
        child.id(),
        health_url
    );

    let deadline = tokio::time::Instant::now() + app.jobs_service.startup_timeout;
    loop {
        if *shutdown.borrow() {
            terminate_child(&mut child, grace, poll).await;
            return RunOutcome::Shutdown;
        }
        if let Ok(Some(status)) = child.try_wait() {
            tracing::warn!("jobsd_supervisor: exited during startup: {status}");
            set_status(JOBSD_STATUS_UNHEALTHY);
            return RunOutcome::Restart;
        }
        if probe(client, health_url).await {
            break;
        }
        if tokio::time::Instant::now() >= deadline {
            tracing::warn!("jobsd_supervisor: healthz not ready within startup timeout");
            set_status(JOBSD_STATUS_UNHEALTHY);
            terminate_child(&mut child, grace, poll).await;
            return RunOutcome::Restart;
        }
        if sleep_or_shutdown(Duration::from_millis(250), shutdown).await {
            terminate_child(&mut child, grace, poll).await;
            return RunOutcome::Shutdown;
        }
    }
    set_status(JOBSD_STATUS_HEALTHY);
    tracing::info!("jobsd_supervisor: healthy at {health_url}");

    let mut consecutive_failures: u32 = 0;
    loop {
        if sleep_or_shutdown(app.jobs_service.health_interval, shutdown).await {
            terminate_child(&mut child, grace, poll).await;
            return RunOutcome::Shutdown;
        }
        if let Ok(Some(status)) = child.try_wait() {
            tracing::warn!("jobsd_supervisor: process exited: {status}");
            set_status(JOBSD_STATUS_UNHEALTHY);
            return RunOutcome::Restart;
        }
        if probe(client, health_url).await {
            if consecutive_failures > 0 {
                tracing::info!("jobsd_supervisor: health recovered");
            }
            consecutive_failures = 0;
            set_status(JOBSD_STATUS_HEALTHY);
            continue;
        }
        consecutive_failures += 1;
        tracing::warn!(
            "jobsd_supervisor: health probe failed ({consecutive_failures}/{})",
            app.jobs_service.health_fail_threshold
        );
        if consecutive_failures >= app.jobs_service.health_fail_threshold {
            set_status(JOBSD_STATUS_UNHEALTHY);
            terminate_child(&mut child, grace, poll).await;
            return RunOutcome::Restart;
        }
    }
}

/// 启动监督循环。返回 None 表示未开启（Disabled）。
pub fn spawn_jobsd_supervisor(
    app: std::sync::Arc<AppConfig>,
    shutdown: watch::Receiver<bool>,
) -> Option<JoinHandle<()>> {
    if !app.jobs_service.supervise {
        return None;
    }
    // 仅在 remote 模式下监督才有意义；InProcess 时 jobsd 不应存在
    if !app.jobs_service.is_remote() {
        tracing::warn!("jobsd_supervisor: RUST_API_JOBS_SUPERVISE=1 but mode is not remote; supervisor not started");
        return None;
    }
    set_status(JOBSD_STATUS_STARTING);
    Some(tokio::spawn(async move {
        let client = reqwest::Client::builder()
            .connect_timeout(app.jobs_service.health_probe_connect_timeout)
            .timeout(app.jobs_service.health_probe_timeout)
            .build()
            .expect("build jobsd supervisor client");
        let health_url = app.jobs_service.health_url();
        let mut shutdown = shutdown;
        let mut backoff = app.jobs_service.backoff_initial;
        loop {
            let healthy_before = jobsd_status() == JOBSD_STATUS_HEALTHY;
            match run_once(&app, &client, &health_url, &mut shutdown).await {
                RunOutcome::Shutdown => break,
                RunOutcome::Restart => {
                    backoff = if healthy_before {
                        app.jobs_service.backoff_initial
                    } else {
                        (backoff * 2).min(app.jobs_service.backoff_max)
                    };
                    tracing::info!("jobsd_supervisor: restarting in {backoff:?}");
                    if sleep_or_shutdown(backoff, &mut shutdown).await {
                        break;
                    }
                }
            }
        }
        set_status(JOBSD_STATUS_DISABLED);
        tracing::info!("jobsd_supervisor: stopped");
    }))
}

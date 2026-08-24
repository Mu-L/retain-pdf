#[cfg(windows)]
use std::process::Command as StdCommand;
use std::process::Stdio;

#[cfg(windows)]
use anyhow::anyhow;
use anyhow::{Context, Result};
use tokio::process::{Child, Command};

use crate::config::WorkerProcessRuntimeConfig;
use crate::models::domain::JobRuntimeState;
use crate::ocr_provider::{
    configured_provider_credential_env, is_configured_command_provider, provider_token,
    provider_token_env_name, require_supported_provider,
};

pub(super) fn spawn_worker_process(
    config: &WorkerProcessRuntimeConfig<'_>,
    job: &JobRuntimeState,
) -> Result<Child> {
    let mut command = Command::new(&job.command[0]);
    command
        .args(&job.command[1..])
        .env("RUST_API_DATA_ROOT", config.data_root)
        .env("RUST_API_OUTPUT_ROOT", config.output_root)
        .env("OUTPUT_ROOT", config.output_root)
        .env(
            "RETAIN_OCR_PROVIDER_CONFIG",
            config.ocr_provider_config_path,
        )
        .env("PYTHONUNBUFFERED", "1")
        .current_dir(config.project_root)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped());
    apply_job_credentials(&mut command, job);
    configure_child_process(&mut command);

    let program = job.command.first().cloned().unwrap_or_default();
    command
        .spawn()
        .with_context(|| format!("failed to spawn python worker: {program}"))
}

fn apply_job_credentials(command: &mut Command, job: &JobRuntimeState) {
    if !job.request_payload.translation.api_key.trim().is_empty() {
        command.env(
            "RETAIN_TRANSLATION_API_KEY",
            job.request_payload.translation.api_key.trim(),
        );
    }
    if let Ok(provider_kind) = require_supported_provider(&job.request_payload.ocr.provider) {
        if is_configured_command_provider(&job.request_payload.ocr.provider) {
            apply_configured_provider_credential(command, job);
            return;
        }
        let token = provider_token(&provider_kind, &job.request_payload.ocr);
        if !token.is_empty() {
            if let Some(env_name) = provider_token_env_name(&provider_kind) {
                command.env(env_name, token);
            }
        }
    }
}

fn apply_configured_provider_credential(command: &mut Command, job: &JobRuntimeState) {
    let Some(env_name) = configured_provider_credential_env(&job.request_payload.ocr.provider)
    else {
        return;
    };
    let token = configured_provider_token(job);
    if token.is_empty() {
        return;
    }
    command.env(&env_name, &token);
    command.env("RETAIN_OCR_CREDENTIAL", token);
}

fn configured_provider_token(job: &JobRuntimeState) -> String {
    for key in ["credential", "token", "api_key"] {
        let Some(value) = job.request_payload.ocr.options.get(key) else {
            continue;
        };
        if let Some(text) = value
            .as_str()
            .map(str::trim)
            .filter(|item| !item.is_empty())
        {
            return text.to_string();
        }
    }
    std::env::var(
        configured_provider_credential_env(&job.request_payload.ocr.provider).unwrap_or_default(),
    )
    .unwrap_or_default()
    .trim()
    .to_string()
}

// 进程工具已迁往 retain-proc（ADR-002 Phase 2：零任务语义的 OS 操作
// 不应住在任务执行栈里）。此处 re-export 保持 job_runner:: 路径不变。
pub use retain_proc::{
    configure_child_process, terminate_job_process_tree, terminate_job_process_tree_blocking,
    worker_process_exists,
};

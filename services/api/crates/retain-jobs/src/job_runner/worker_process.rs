#[cfg(windows)]
use std::process::Command as StdCommand;
use std::process::Stdio;

#[cfg(windows)]
use anyhow::anyhow;
use anyhow::{Context, Result};
use retain_data::credentials::resolve_credential;
use tokio::process::{Child, Command};

use crate::config::WorkerProcessRuntimeConfig;
use crate::models::domain::JobRuntimeState;
use crate::ocr_provider::{
    configured_provider_credential_env, is_configured_command_provider, provider_token,
    provider_token_env_name, require_supported_provider,
};

const OCR_PROVIDER_CREDENTIAL_KIND: &str = "ocr_provider_token";

pub(super) fn spawn_worker_process(
    config: &WorkerProcessRuntimeConfig<'_>,
    job: &JobRuntimeState,
) -> Result<(Child, Vec<String>)> {
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
    let runtime_secrets = apply_job_credentials(&mut command, config.data_root, job)?;
    configure_child_process(&mut command);

    let program = job.command.first().cloned().unwrap_or_default();
    let child = command
        .spawn()
        .with_context(|| format!("failed to spawn python worker: {program}"))?;
    Ok((child, runtime_secrets))
}

fn apply_job_credentials(
    command: &mut Command,
    data_root: &std::path::Path,
    job: &JobRuntimeState,
) -> Result<Vec<String>> {
    let mut runtime_secrets = Vec::new();
    if let Some(api_key) = resolve_translation_api_key(data_root, job)? {
        command.env("RETAIN_TRANSLATION_API_KEY", &api_key);
        runtime_secrets.push(api_key);
    }
    if let Ok(provider_kind) = require_supported_provider(&job.request_payload.ocr.provider) {
        let referenced_token = resolve_ocr_provider_token(data_root, job)?;
        if is_configured_command_provider(&job.request_payload.ocr.provider) {
            if let Some(token) =
                apply_configured_provider_credential(command, job, referenced_token)?
            {
                runtime_secrets.push(token);
            }
            return Ok(runtime_secrets);
        }
        let token = referenced_token.unwrap_or_else(|| {
            provider_token(&provider_kind, &job.request_payload.ocr).to_string()
        });
        if !token.is_empty() {
            if let Some(env_name) = provider_token_env_name(&provider_kind) {
                command.env(env_name, &token);
                runtime_secrets.push(token);
            }
        }
    }
    Ok(runtime_secrets)
}

fn resolve_ocr_provider_token(
    data_root: &std::path::Path,
    job: &JobRuntimeState,
) -> Result<Option<String>> {
    let credential_ref = job.request_payload.ocr.credential_ref.trim();
    if credential_ref.is_empty() {
        return Ok(None);
    }
    let expected_provider = job.request_payload.ocr.provider.trim().to_ascii_lowercase();
    let resolved = resolve_credential(data_root, credential_ref, OCR_PROVIDER_CREDENTIAL_KIND)
        .with_context(|| format!("resolve OCR credential_ref {credential_ref}"))?;
    if resolved.provider.trim().to_ascii_lowercase() != expected_provider {
        anyhow::bail!(
            "OCR credential provider mismatch for credential_ref {credential_ref}: expected {expected_provider}"
        );
    }
    Ok(Some(resolved.secret))
}

fn resolve_translation_api_key(
    data_root: &std::path::Path,
    job: &JobRuntimeState,
) -> Result<Option<String>> {
    let inline = job.request_payload.translation.api_key.trim();
    if !inline.is_empty() {
        return Ok(Some(inline.to_string()));
    }
    let credential_ref = job.request_payload.translation.credential_ref.trim();
    if credential_ref.is_empty() {
        return Ok(None);
    }
    let resolved = resolve_credential(data_root, credential_ref, "translation_api_key")
        .with_context(|| format!("resolve translation credential_ref {credential_ref}"))?;
    Ok(Some(resolved.secret))
}

fn apply_configured_provider_credential(
    command: &mut Command,
    job: &JobRuntimeState,
    referenced_token: Option<String>,
) -> Result<Option<String>> {
    let token = referenced_token.unwrap_or_else(|| configured_provider_token(job));
    if token.is_empty() {
        return Ok(None);
    }
    if let Some(env_name) = configured_provider_credential_env(&job.request_payload.ocr.provider) {
        command.env(env_name, &token);
    }
    command.env("RETAIN_OCR_CREDENTIAL", &token);
    Ok(Some(token))
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

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::{Path, PathBuf};

    use super::*;
    use crate::models::domain::{JobSnapshot, OcrProviderKind};
    use crate::models::request::CreateJobInput;

    fn test_root(name: &str) -> PathBuf {
        let root = std::env::temp_dir().join(format!(
            "retainpdf-worker-credential-{name}-{}",
            fastrand::u64(..)
        ));
        fs::create_dir_all(root.join("secrets")).expect("create credential test root");
        root
    }

    fn write_credential(
        root: &Path,
        credential_ref: &str,
        kind: &str,
        provider: &str,
        secret: &str,
    ) {
        let path = root.join("secrets").join("credentials.json");
        fs::write(
            &path,
            serde_json::json!({
                "schema": "retainpdf_credential_vault_v1",
                "credentials": {
                    (credential_ref): {
                        "kind": kind,
                        "provider": provider,
                        "secret": secret
                    }
                }
            })
            .to_string(),
        )
        .expect("write credential vault");
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            fs::set_permissions(&path, fs::Permissions::from_mode(0o600))
                .expect("secure credential vault");
        }
    }

    fn job_with_ocr_ref(provider: &str, credential_ref: &str) -> JobRuntimeState {
        let mut input = CreateJobInput::default();
        input.ocr.provider = provider.to_string();
        input.ocr.credential_ref = credential_ref.to_string();
        JobSnapshot::new("job-ocr-ref".to_string(), input, vec!["true".to_string()]).into_runtime()
    }

    fn command_env(command: &Command, name: &str) -> Option<String> {
        command
            .as_std()
            .get_envs()
            .find(|(key, _)| *key == std::ffi::OsStr::new(name))
            .and_then(|(_, value)| value)
            .map(|value| value.to_string_lossy().into_owned())
    }

    #[test]
    fn builtin_ocr_credential_ref_is_resolved_into_provider_env() {
        let root = test_root("builtin");
        let credential_ref = "cred_ocr_paddle";
        let secret = "paddle-vault-secret";
        write_credential(
            &root,
            credential_ref,
            OCR_PROVIDER_CREDENTIAL_KIND,
            "  Paddle  ",
            secret,
        );
        let job = job_with_ocr_ref("paddle", credential_ref);
        let mut command = Command::new("true");

        let runtime_secrets =
            apply_job_credentials(&mut command, &root, &job).expect("apply OCR credential");

        let env_name = provider_token_env_name(&OcrProviderKind::Paddle).expect("paddle env");
        assert_eq!(command_env(&command, env_name).as_deref(), Some(secret));
        assert_eq!(runtime_secrets, vec![secret.to_string()]);
    }

    #[test]
    fn configured_ocr_credential_ref_is_available_through_generic_env() {
        let root = test_root("configured");
        let credential_ref = "cred_ocr_local";
        let secret = "local-vault-secret";
        write_credential(
            &root,
            credential_ref,
            OCR_PROVIDER_CREDENTIAL_KIND,
            "local",
            secret,
        );
        let job = job_with_ocr_ref("local", credential_ref);
        let mut command = Command::new("true");

        let runtime_secrets =
            apply_job_credentials(&mut command, &root, &job).expect("apply OCR credential");

        assert_eq!(
            command_env(&command, "RETAIN_OCR_CREDENTIAL").as_deref(),
            Some(secret)
        );
        assert_eq!(runtime_secrets, vec![secret.to_string()]);
    }

    #[test]
    fn ocr_credential_provider_mismatch_fails_without_leaking_secret() {
        let root = test_root("mismatch");
        let credential_ref = "cred_ocr_wrong_provider";
        let secret = "must-not-appear-in-error";
        write_credential(
            &root,
            credential_ref,
            OCR_PROVIDER_CREDENTIAL_KIND,
            "mineru",
            secret,
        );
        let job = job_with_ocr_ref("paddle", credential_ref);
        let mut command = Command::new("true");

        let error = apply_job_credentials(&mut command, &root, &job)
            .expect_err("provider mismatch must fail");
        let message = format!("{error:#}");

        assert!(message.contains("OCR credential provider mismatch"));
        assert!(message.contains("expected paddle"));
        assert!(!message.contains(secret));
        assert!(command_env(&command, "RETAIN_OCR_CREDENTIAL").is_none());
    }

    #[test]
    fn credential_child_process_helper() {
        let Some(output_root) = std::env::var_os("RUST_API_OUTPUT_ROOT") else {
            return;
        };
        let Some(secret) = std::env::var_os("RETAIN_PADDLE_API_TOKEN") else {
            return;
        };
        fs::write(
            PathBuf::from(output_root).join("credential-child.txt"),
            secret.to_string_lossy().as_bytes(),
        )
        .expect("write child credential observation");
    }

    #[tokio::test]
    async fn spawned_worker_process_receives_vault_credential() {
        let root = test_root("spawned-process");
        let data_root = root.join("data");
        let output_root = root.join("output");
        fs::create_dir_all(data_root.join("secrets")).expect("create data secrets root");
        fs::create_dir_all(&output_root).expect("create worker output root");
        let credential_ref = "cred_ocr_spawned_process";
        let secret = "spawned-process-vault-secret";
        write_credential(
            &data_root,
            credential_ref,
            OCR_PROVIDER_CREDENTIAL_KIND,
            "paddle",
            secret,
        );

        let executable = std::env::current_exe().expect("current test executable");
        let mut input = CreateJobInput::default();
        input.ocr.provider = "paddle".to_string();
        input.ocr.credential_ref = credential_ref.to_string();
        let job = JobSnapshot::new(
            "job-spawned-credential".to_string(),
            input,
            vec![
                executable.to_string_lossy().into_owned(),
                "--exact".to_string(),
                "job_runner::worker_process::tests::credential_child_process_helper".to_string(),
                "--nocapture".to_string(),
            ],
        )
        .into_runtime();
        let persisted = serde_json::to_string(&job).expect("serialize persisted runtime state");
        assert!(persisted.contains(credential_ref));
        assert!(!persisted.contains(secret));
        let restored_job: JobRuntimeState =
            serde_json::from_str(&persisted).expect("restore runtime state after restart");
        let provider_config = root.join("ocr-providers.json");
        let config = WorkerProcessRuntimeConfig {
            project_root: &root,
            data_root: &data_root,
            output_root: &output_root,
            ocr_provider_config_path: &provider_config,
            worker_terminate_grace_secs: 1,
            worker_terminate_poll_ms: 10,
        };

        let (child, runtime_secrets) = spawn_worker_process(&config, &restored_job)
            .expect("spawn credential child from restored state");
        let output = child
            .wait_with_output()
            .await
            .expect("wait for credential child");

        assert!(
            output.status.success(),
            "credential child failed: {}",
            String::from_utf8_lossy(&output.stderr)
        );
        assert_eq!(runtime_secrets, vec![secret.to_string()]);
        assert_eq!(
            fs::read_to_string(output_root.join("credential-child.txt"))
                .expect("read child credential observation"),
            secret
        );
    }
}

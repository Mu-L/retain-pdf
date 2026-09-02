use std::collections::HashSet;
use std::path::{Path, PathBuf};

use anyhow::{bail, Result};

mod ai_proxy;
mod ai_service;
mod asset;
mod auth;
mod cleanup;
mod db;
pub mod env_vars;
mod job_runner;
mod jobs_service;
pub mod limits;
mod paths;
mod provider;
pub mod provider_config;
mod rag;
mod reader_llm;
mod server;
mod upload;

pub use ai_proxy::AiProxyConfig;
pub use ai_service::AiServiceConfig;
pub use asset::AssetConfig;
use auth::AuthRuntimeConfig;
pub use cleanup::CleanupConfig;
pub use db::DbConfig;
pub use job_runner::JobRunnerConfig;
pub use jobs_service::{JobsRuntimeMode, JobsServiceConfig};
use paths::{create_runtime_dirs, RuntimePathsConfig};
pub use provider::{
    DeepSeekRuntimeConfig, MineruRuntimeConfig, PaddleRuntimeConfig, ProviderLimitsConfig,
    ProviderRuntimeConfig,
};
pub use rag::RagConfig;
pub use reader_llm::ReaderLlmConfig;
use server::ServerRuntimeConfig;
pub use upload::{effective_upload_max_bytes, UploadRuntimeConfig, DEFAULT_UPLOAD_MAX_BYTES};

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum PythonWorkerEntrypointMode {
    Script,
    Console,
}

impl PythonWorkerEntrypointMode {
    pub fn from_env(pipeline_command: &str) -> Result<Self> {
        Self::from_env_with_auto_default(pipeline_command, true)
    }

    fn from_env_with_auto_default(
        pipeline_command: &str,
        auto_detect_when_unset: bool,
    ) -> Result<Self> {
        let configured = env_vars::env_optional_string("RUST_API_PYTHON_ENTRYPOINT_MODE");
        Self::resolve_with_auto_default(
            configured.as_deref(),
            pipeline_command,
            auto_detect_when_unset,
        )
    }

    fn resolve_with_auto_default(
        configured: Option<&str>,
        pipeline_command: &str,
        auto_detect_when_unset: bool,
    ) -> Result<Self> {
        if configured.is_none() && !auto_detect_when_unset {
            return Ok(Self::Script);
        }
        Self::resolve(configured, pipeline_command)
    }

    fn resolve(configured: Option<&str>, pipeline_command: &str) -> Result<Self> {
        match configured.as_deref().map(str::trim) {
            None | Some("") => Ok(if pipeline_command_is_available(pipeline_command) {
                Self::Console
            } else {
                Self::Script
            }),
            Some(value) if value.eq_ignore_ascii_case("auto") => {
                Ok(if pipeline_command_is_available(pipeline_command) {
                    Self::Console
                } else {
                    Self::Script
                })
            }
            Some(value) => Self::parse(value),
        }
    }

    fn parse(value: &str) -> Result<Self> {
        match value.trim().to_ascii_lowercase().as_str() {
            "script" | "scripts" | "path" | "file" => Ok(Self::Script),
            "console" | "command" | "commands" | "package" => Ok(Self::Console),
            other => bail!(
                "invalid RUST_API_PYTHON_ENTRYPOINT_MODE `{other}`; expected auto, script, or console"
            ),
        }
    }
}

#[cfg(test)]
mod python_entrypoint_tests {
    use super::*;

    #[test]
    fn explicit_entrypoint_modes_remain_stable() {
        assert_eq!(
            PythonWorkerEntrypointMode::parse("script").expect("script mode"),
            PythonWorkerEntrypointMode::Script
        );
        assert_eq!(
            PythonWorkerEntrypointMode::parse("PACKAGE").expect("console mode"),
            PythonWorkerEntrypointMode::Console
        );
        assert!(PythonWorkerEntrypointMode::parse("unknown").is_err());
    }

    #[test]
    fn absolute_pipeline_command_availability_is_detected() {
        let root = std::env::temp_dir().join(format!(
            "retainpdf-pipeline-command-{}-{}",
            std::process::id(),
            fastrand::u64(..)
        ));
        std::fs::create_dir_all(&root).expect("temp dir");
        let command = root.join("retainpdf-pipeline");
        std::fs::write(&command, b"test").expect("fake command");
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            std::fs::set_permissions(&command, std::fs::Permissions::from_mode(0o700))
                .expect("make fake command executable");
        }
        assert!(pipeline_command_is_available(&command.to_string_lossy()));
        assert_eq!(
            PythonWorkerEntrypointMode::resolve(None, &command.to_string_lossy())
                .expect("auto console mode"),
            PythonWorkerEntrypointMode::Console
        );
        assert_eq!(
            PythonWorkerEntrypointMode::resolve_with_auto_default(
                None,
                &command.to_string_lossy(),
                false,
            )
            .expect("desktop script default"),
            PythonWorkerEntrypointMode::Script
        );
        assert!(!pipeline_command_is_available(
            &root.join("missing-command").to_string_lossy()
        ));
        assert_eq!(
            PythonWorkerEntrypointMode::resolve(
                Some("auto"),
                &root.join("missing-command").to_string_lossy()
            )
            .expect("auto script fallback"),
            PythonWorkerEntrypointMode::Script
        );
        let _ = std::fs::remove_dir_all(root);
    }
}

pub fn pipeline_command_is_available(command: &str) -> bool {
    let command = command.trim();
    if command.is_empty() {
        return false;
    }
    let command_path = Path::new(command);
    if command_path.components().count() > 1 {
        return is_executable_file(command_path);
    }
    std::env::var_os("PATH")
        .map(|path| {
            std::env::split_paths(&path).any(|directory| {
                let candidate = directory.join(command);
                if is_executable_file(&candidate) {
                    return true;
                }
                #[cfg(windows)]
                {
                    return ["exe", "cmd", "bat"].iter().any(|extension| {
                        is_executable_file(&directory.join(format!("{command}.{extension}")))
                    });
                }
                #[cfg(not(windows))]
                false
            })
        })
        .unwrap_or(false)
}

fn is_executable_file(path: &Path) -> bool {
    let Ok(metadata) = path.metadata() else {
        return false;
    };
    if !metadata.is_file() {
        return false;
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        metadata.permissions().mode() & 0o111 != 0
    }
    #[cfg(not(unix))]
    true
}

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub project_root: PathBuf,
    pub rust_api_root: PathBuf,
    pub data_root: PathBuf,
    pub scripts_dir: PathBuf,
    pub run_provider_case_script: PathBuf,
    pub run_provider_ocr_script: PathBuf,
    pub run_normalize_ocr_script: PathBuf,
    pub run_translate_from_ocr_script: PathBuf,
    pub run_translate_only_script: PathBuf,
    pub run_render_only_script: PathBuf,
    pub run_failure_ai_diagnosis_script: PathBuf,
    pub uploads_dir: PathBuf,
    pub downloads_dir: PathBuf,
    pub jobs_db_path: PathBuf,
    pub output_root: PathBuf,
    pub python_bin: String,
    pub pipeline_command: String,
    pub python_entrypoint_mode: PythonWorkerEntrypointMode,
    pub bind_host: String,
    pub port: u16,
    pub simple_port: u16,
    pub upload_max_bytes: u64,
    pub upload_max_pages: u32,
    pub api_keys: HashSet<String>,
    pub max_running_jobs: usize,
    pub provider_limits: ProviderLimitsConfig,
    pub provider_runtime: ProviderRuntimeConfig,
    pub job_runner: JobRunnerConfig,
    pub ai_service: AiServiceConfig,
    pub jobs_service: JobsServiceConfig,
    pub asset: AssetConfig,
    pub cleanup: CleanupConfig,
    pub db: DbConfig,
    pub ai_proxy: AiProxyConfig,
    pub reader_llm: ReaderLlmConfig,
    pub rag: RagConfig,
}

#[derive(Clone, Copy, Debug)]
pub struct WorkerCommandRuntimeConfig<'a> {
    pub python_bin: &'a str,
    pub pipeline_command: &'a str,
    pub python_entrypoint_mode: PythonWorkerEntrypointMode,
    pub run_provider_case_script: &'a Path,
    pub run_provider_ocr_script: &'a Path,
    pub run_normalize_ocr_script: &'a Path,
    pub run_translate_only_script: &'a Path,
    pub run_render_only_script: &'a Path,
}

#[derive(Clone, Copy, Debug)]
pub struct WorkerProcessRuntimeConfig<'a> {
    pub project_root: &'a Path,
    pub data_root: &'a Path,
    pub output_root: &'a Path,
    pub ocr_provider_config_path: &'a Path,
    pub worker_terminate_grace_secs: u64,
    pub worker_terminate_poll_ms: u64,
}

#[derive(Clone, Copy, Debug)]
pub struct JobSnapshotRuntimeConfig<'a> {
    pub data_root: &'a Path,
    pub output_root: &'a Path,
    pub worker_command: WorkerCommandRuntimeConfig<'a>,
    pub provider_limits: &'a ProviderLimitsConfig,
}

#[derive(Clone, Copy, Debug)]
pub struct FailureAiDiagnosisRuntimeConfig<'a> {
    pub python_bin: &'a str,
    pub pipeline_command: &'a str,
    pub python_entrypoint_mode: PythonWorkerEntrypointMode,
    pub script_path: &'a Path,
    pub project_root: &'a Path,
    pub data_root: &'a Path,
    pub output_root: &'a Path,
    pub timeout_secs: u64,
}

struct AppConfigParts {
    paths: RuntimePathsConfig,
    auth: AuthRuntimeConfig,
    server: ServerRuntimeConfig,
    upload: UploadRuntimeConfig,
    provider_limits: ProviderLimitsConfig,
    provider_runtime: ProviderRuntimeConfig,
    job_runner: JobRunnerConfig,
    asset: AssetConfig,
    auto_detect_pipeline_command: bool,
}

impl AppConfig {
    pub fn worker_command_runtime(&self) -> WorkerCommandRuntimeConfig<'_> {
        WorkerCommandRuntimeConfig {
            python_bin: &self.python_bin,
            pipeline_command: &self.pipeline_command,
            python_entrypoint_mode: self.python_entrypoint_mode,
            run_provider_case_script: &self.run_provider_case_script,
            run_provider_ocr_script: &self.run_provider_ocr_script,
            run_normalize_ocr_script: &self.run_normalize_ocr_script,
            run_translate_only_script: &self.run_translate_only_script,
            run_render_only_script: &self.run_render_only_script,
        }
    }

    pub fn worker_process_runtime(&self) -> WorkerProcessRuntimeConfig<'_> {
        WorkerProcessRuntimeConfig {
            project_root: &self.project_root,
            data_root: &self.data_root,
            output_root: &self.output_root,
            ocr_provider_config_path: &self.provider_runtime.ocr_provider_config_path,
            worker_terminate_grace_secs: self.job_runner.worker_terminate_grace_secs,
            worker_terminate_poll_ms: self.job_runner.worker_terminate_poll_ms,
        }
    }

    pub fn job_snapshot_runtime(&self) -> JobSnapshotRuntimeConfig<'_> {
        JobSnapshotRuntimeConfig {
            data_root: &self.data_root,
            output_root: &self.output_root,
            worker_command: self.worker_command_runtime(),
            provider_limits: &self.provider_limits,
        }
    }

    pub fn failure_ai_diagnosis_runtime(&self) -> FailureAiDiagnosisRuntimeConfig<'_> {
        FailureAiDiagnosisRuntimeConfig {
            python_bin: &self.python_bin,
            pipeline_command: &self.pipeline_command,
            python_entrypoint_mode: self.python_entrypoint_mode,
            script_path: &self.run_failure_ai_diagnosis_script,
            project_root: &self.project_root,
            data_root: &self.data_root,
            output_root: &self.output_root,
            timeout_secs: self.job_runner.failure_ai_diagnosis_timeout_secs,
        }
    }

    pub fn from_env() -> Result<Self> {
        let paths = RuntimePathsConfig::from_env()?;
        create_runtime_dirs(&paths)?;
        let auth = AuthRuntimeConfig::from_env_or_file(&paths.auth_config_path)?;

        Self::try_from_parts(AppConfigParts {
            paths,
            auth,
            server: ServerRuntimeConfig::from_env(),
            upload: UploadRuntimeConfig::from_env(),
            provider_limits: ProviderLimitsConfig::from_env(),
            provider_runtime: ProviderRuntimeConfig::from_env(),
            job_runner: JobRunnerConfig::from_env(),
            asset: AssetConfig::from_env(),
            auto_detect_pipeline_command: true,
        })
    }

    pub fn from_desktop(
        resource_root: PathBuf,
        data_root: PathBuf,
        python_bin: String,
        port: u16,
        simple_port: u16,
        api_key: String,
    ) -> Result<Self> {
        let paths = RuntimePathsConfig::from_desktop(resource_root, data_root);
        create_runtime_dirs(&paths)?;
        let auth = AuthRuntimeConfig::from_desktop(simple_port, api_key, 4);

        Self::try_from_parts(AppConfigParts {
            paths,
            auth,
            server: ServerRuntimeConfig::from_desktop(python_bin, port),
            upload: UploadRuntimeConfig::desktop_defaults(),
            provider_limits: ProviderLimitsConfig::from_env(),
            provider_runtime: ProviderRuntimeConfig::from_env(),
            job_runner: JobRunnerConfig::from_env(),
            asset: AssetConfig::from_env(),
            // A packaged desktop must not accidentally execute a same-named
            // command from the host PATH. It uses bundled scripts unless the
            // entrypoint mode is explicitly configured.
            auto_detect_pipeline_command: false,
        })
    }

    fn try_from_parts(parts: AppConfigParts) -> Result<Self> {
        let AppConfigParts {
            paths,
            auth,
            server,
            upload,
            provider_limits,
            provider_runtime,
            job_runner,
            asset,
            auto_detect_pipeline_command,
        } = parts;

        let ai_service = AiServiceConfig::from_env(&paths.project_root, &server.python_bin);
        let jobs_service = JobsServiceConfig::from_env();
        let pipeline_command = env_vars::env_optional_string("RUST_API_PIPELINE_COMMAND")
            .unwrap_or_else(|| "retainpdf-pipeline".to_string());
        let python_entrypoint_mode = PythonWorkerEntrypointMode::from_env_with_auto_default(
            &pipeline_command,
            auto_detect_pipeline_command,
        )?;
        Ok(Self {
            project_root: paths.project_root,
            rust_api_root: paths.rust_api_root,
            data_root: paths.data_root,
            scripts_dir: paths.scripts_dir,
            run_provider_case_script: paths.run_provider_case_script,
            run_provider_ocr_script: paths.run_provider_ocr_script,
            run_normalize_ocr_script: paths.run_normalize_ocr_script,
            run_translate_from_ocr_script: paths.run_translate_from_ocr_script,
            run_translate_only_script: paths.run_translate_only_script,
            run_render_only_script: paths.run_render_only_script,
            run_failure_ai_diagnosis_script: paths.run_failure_ai_diagnosis_script,
            uploads_dir: paths.uploads_dir,
            downloads_dir: paths.downloads_dir,
            jobs_db_path: paths.jobs_db_path,
            output_root: paths.output_root,
            python_bin: server.python_bin,
            pipeline_command,
            python_entrypoint_mode,
            bind_host: server.bind_host,
            port: server.port,
            simple_port: auth.simple_port,
            upload_max_bytes: upload.upload_max_bytes,
            upload_max_pages: upload.upload_max_pages,
            api_keys: auth.api_keys,
            max_running_jobs: auth.max_running_jobs,
            provider_limits,
            provider_runtime,
            job_runner,
            ai_service,
            jobs_service,
            asset,
            cleanup: CleanupConfig::from_env(),
            db: DbConfig::from_env(),
            ai_proxy: AiProxyConfig::from_env(),
            reader_llm: ReaderLlmConfig::from_env(),
            rag: RagConfig::from_env(),
        })
    }
}

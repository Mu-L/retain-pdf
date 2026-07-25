//! 任务运行时落点配置（ADR-002：壳 + 后端进程组）。
//!
//! 默认 `InProcess` —— 与拆分前逐字节同行为，单进程跑，测试与桌面现状不受
//! 任何影响。设 `RUST_API_JOBS_MODE=remote` 后，壳把 launch/cancel/terminate
//! 四个操作经内部 HTTP 交给 retain-jobsd 进程执行（契约见
//! backend/contracts/jobs-control.v1.schema.json）。
//!
//! 拆开的收益是**开发粒度**：改路由/服务只重启壳，jobsd 与其 worker 子进程
//! 不受影响，正在跑的翻译任务继续。

use super::env_vars::env_u16;

/// 任务运行时跑在哪儿。
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum JobsRuntimeMode {
    /// 进程内直调（默认，历史行为）
    InProcess,
    /// 经内部 HTTP 交给 retain-jobsd
    Remote,
}

#[derive(Clone, Debug)]
pub struct JobsServiceConfig {
    pub mode: JobsRuntimeMode,
    /// jobsd 监听端口（RUST_API_JOBS_PORT，默认 41002）
    pub port: u16,
}

impl JobsServiceConfig {
    pub fn from_env() -> Self {
        let mode = match std::env::var("RUST_API_JOBS_MODE")
            .unwrap_or_default()
            .trim()
            .to_ascii_lowercase()
            .as_str()
        {
            "remote" => JobsRuntimeMode::Remote,
            // 任何其他取值（含未设置、拼错）一律回落进程内：这个开关只应
            // 在明确要求时改变行为，绝不因笔误把生产拓扑换掉。
            _ => JobsRuntimeMode::InProcess,
        };
        Self {
            mode,
            port: env_u16("RUST_API_JOBS_PORT", 41002),
        }
    }

    /// jobsd 内部基址；仅回环，不对外暴露。
    pub fn base_url(&self) -> String {
        format!("http://127.0.0.1:{}", self.port)
    }

    pub fn is_remote(&self) -> bool {
        self.mode == JobsRuntimeMode::Remote
    }
}

impl Default for JobsServiceConfig {
    fn default() -> Self {
        Self {
            mode: JobsRuntimeMode::InProcess,
            port: 41002,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn default_is_in_process_so_existing_topology_is_untouched() {
        let config = JobsServiceConfig::default();
        assert_eq!(config.mode, JobsRuntimeMode::InProcess);
        assert!(!config.is_remote());
    }

    #[test]
    fn base_url_is_loopback_only() {
        let config = JobsServiceConfig {
            mode: JobsRuntimeMode::Remote,
            port: 41002,
        };
        assert_eq!(config.base_url(), "http://127.0.0.1:41002");
    }
}

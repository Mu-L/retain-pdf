use super::env_vars::env_u64;

#[derive(Clone, Debug)]
pub struct JobRunnerConfig {
    pub queue_poll_interval_ms: u64,
    pub worker_terminate_grace_secs: u64,
    pub worker_terminate_poll_ms: u64,
    /// 进程退出后,等 stdout / stderr 读取任务收尾的上限(秒)。
    /// 正常情况下这两个 join 是瞬时的;设上限是为了防脱离进程组的孙进程
    /// 继承管道写端后把 runner 永久挂住。详见
    /// `job_runner::process_runner::execution` 里的说明。
    pub worker_output_drain_secs: u64,
    pub failure_ai_diagnosis_timeout_secs: u64,
    pub sync_bundle_wait_interval_ms: u64,
}

impl JobRunnerConfig {
    pub fn from_env() -> Self {
        Self {
            queue_poll_interval_ms: env_u64("RUST_API_QUEUE_POLL_INTERVAL_MS", 250),
            worker_terminate_grace_secs: env_u64("RUST_API_WORKER_TERMINATE_GRACE_SECS", 3),
            worker_terminate_poll_ms: env_u64("RUST_API_WORKER_TERMINATE_POLL_MS", 100),
            worker_output_drain_secs: env_u64("RUST_API_WORKER_OUTPUT_DRAIN_SECS", 30),
            failure_ai_diagnosis_timeout_secs: env_u64(
                "RUST_API_FAILURE_AI_DIAGNOSIS_TIMEOUT_SECS",
                60,
            ),
            sync_bundle_wait_interval_ms: env_u64("RUST_API_SYNC_BUNDLE_WAIT_INTERVAL_MS", 1500),
        }
    }
}

impl Default for JobRunnerConfig {
    fn default() -> Self {
        Self::from_env()
    }
}

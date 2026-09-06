use std::time::Duration;

use super::env_vars::env_u64;

#[derive(Clone, Debug)]
pub struct AiProxyConfig {
    pub connect_timeout: Duration,
}

impl AiProxyConfig {
    pub fn from_env() -> Self {
        Self {
            connect_timeout: Duration::from_secs(env_u64(
                "RUST_API_AI_PROXY_CONNECT_TIMEOUT_SECS",
                3,
            )),
        }
    }
}

impl Default for AiProxyConfig {
    fn default() -> Self {
        Self::from_env()
    }
}

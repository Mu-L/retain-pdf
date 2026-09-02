use std::num::NonZeroU64;

use super::env_vars::{env_u32, env_u64};

pub const DEFAULT_UPLOAD_MAX_BYTES: u64 = 512 * 1024 * 1024;

pub fn effective_upload_max_bytes(configured_max_bytes: u64) -> NonZeroU64 {
    NonZeroU64::new(configured_max_bytes).unwrap_or_else(|| {
        NonZeroU64::new(DEFAULT_UPLOAD_MAX_BYTES).expect("default upload limit is non-zero")
    })
}

#[derive(Clone, Debug)]
pub struct UploadRuntimeConfig {
    pub upload_max_bytes: u64,
    pub upload_max_pages: u32,
}

impl UploadRuntimeConfig {
    pub fn from_env() -> Self {
        Self {
            upload_max_bytes: env_u64("RUST_API_UPLOAD_MAX_BYTES", 0),
            upload_max_pages: env_u32("RUST_API_UPLOAD_MAX_PAGES", 0),
        }
    }

    pub fn desktop_defaults() -> Self {
        Self {
            upload_max_bytes: 0,
            upload_max_pages: 0,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn effective_limit_preserves_non_zero_configuration() {
        assert_eq!(effective_upload_max_bytes(7).get(), 7);
    }

    #[test]
    fn effective_limit_uses_safe_default_for_zero_configuration() {
        assert_eq!(
            effective_upload_max_bytes(0).get(),
            DEFAULT_UPLOAD_MAX_BYTES
        );
    }
}

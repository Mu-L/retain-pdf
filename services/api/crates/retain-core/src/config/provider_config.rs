use std::env;
use std::fs;
use std::path::PathBuf;

use serde_json::Value;

const OCR_PROVIDER_CONFIG_ENV: &str = "RUST_API_OCR_PROVIDER_CONFIG";
const OCR_PROVIDER_CONFIG_COMPAT_ENV: &str = "RETAIN_OCR_PROVIDER_CONFIG";
const PADDLE_DEFAULT_MODEL_ENV: &str = "RUST_API_PADDLE_DEFAULT_MODEL";
const PADDLE_DEFAULT_MODEL_COMPAT_ENV: &str = "RETAIN_PADDLE_DEFAULT_MODEL";
const PADDLE_DEFAULT_MODEL_FALLBACK: &str = "PaddleOCR-VL-1.6";

pub fn paddle_default_model() -> String {
    env_override(PADDLE_DEFAULT_MODEL_ENV)
        .or_else(|| env_override(PADDLE_DEFAULT_MODEL_COMPAT_ENV))
        .or_else(|| {
            paddle_config()
                .get("default_model")
                .and_then(Value::as_str)
                .map(str::trim)
                .filter(|value| !value.is_empty())
                .map(ToString::to_string)
        })
        .unwrap_or_else(|| PADDLE_DEFAULT_MODEL_FALLBACK.to_string())
}

pub fn normalize_paddle_model_name(model: &str) -> String {
    let trimmed = model.trim();
    if trimmed.is_empty() {
        return paddle_default_model();
    }
    let lowered = trimmed.to_ascii_lowercase();
    paddle_config()
        .get("model_aliases")
        .and_then(Value::as_object)
        .and_then(|aliases| aliases.get(&lowered))
        .and_then(Value::as_str)
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(ToString::to_string)
        .unwrap_or_else(|| trimmed.to_string())
}

pub fn ocr_provider_definitions() -> serde_json::Map<String, Value> {
    ocr_provider_config()
        .get("providers")
        .and_then(Value::as_object)
        .cloned()
        .filter(|providers| !providers.is_empty())
        .unwrap_or_else(legacy_provider_definitions)
}

pub fn ocr_provider_definition(provider: &str) -> Option<Value> {
    let provider_key = provider.trim().to_ascii_lowercase();
    if provider_key.is_empty() {
        return None;
    }
    ocr_provider_definitions().get(&provider_key).cloned()
}

pub fn configured_provider_kind(provider: &str) -> Option<String> {
    ocr_provider_definition(provider).and_then(|definition| {
        definition
            .get("kind")
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(ToString::to_string)
    })
}

pub fn is_configured_command_provider(provider: &str) -> bool {
    configured_provider_kind(provider)
        .map(|kind| matches!(kind.as_str(), "local_command" | "remote_command"))
        .unwrap_or(false)
}

pub fn configured_provider_credential_env(provider: &str) -> Option<String> {
    ocr_provider_definition(provider).and_then(|definition| {
        definition
            .get("credential")
            .and_then(Value::as_object)
            .and_then(|credential| credential.get("env"))
            .and_then(Value::as_str)
            .map(str::trim)
            .filter(|value| !value.is_empty())
            .map(ToString::to_string)
    })
}

fn paddle_config() -> Value {
    let payload = ocr_provider_config();
    let mut legacy = payload.get("paddle").cloned().unwrap_or(Value::Null);
    if !legacy.is_object() {
        legacy = Value::Object(serde_json::Map::new());
    }
    let Some(model_option) = payload
        .get("providers")
        .and_then(Value::as_object)
        .and_then(|providers| providers.get("paddle"))
        .and_then(|paddle| paddle.get("options"))
        .and_then(Value::as_object)
        .and_then(|options| options.get("paddle_model"))
        .and_then(Value::as_object)
    else {
        return legacy;
    };
    if let Some(object) = legacy.as_object_mut() {
        if !object.contains_key("default_model") {
            if let Some(default_model) = model_option.get("default").and_then(Value::as_str) {
                object.insert(
                    "default_model".to_string(),
                    Value::String(default_model.to_string()),
                );
            }
        }
        if !object.contains_key("model_aliases") {
            if let Some(aliases) = model_option.get("aliases").cloned() {
                object.insert("model_aliases".to_string(), aliases);
            }
        }
    }
    legacy
}

fn ocr_provider_config() -> Value {
    let Some(path) = config_path() else {
        return Value::Null;
    };
    let Ok(text) = fs::read_to_string(path) else {
        return Value::Null;
    };
    serde_json::from_str(&text).unwrap_or(Value::Null)
}

fn legacy_provider_definitions() -> serde_json::Map<String, Value> {
    let mut providers = serde_json::Map::new();
    providers.insert(
        "mineru".to_string(),
        serde_json::json!({
            "display_name": "MinerU",
            "kind": "remote",
            "credential": {
                "field": "mineru_token",
                "env": "RETAIN_MINERU_API_TOKEN",
                "required_for": ["remote_url", "local_upload"]
            },
            "options": {
                "model_version": {"type": "string", "default": "vlm"},
                "language": {"type": "string", "default": "ch"},
                "disable_formula": {"type": "boolean", "default": false},
                "disable_table": {"type": "boolean", "default": false}
            }
        }),
    );
    providers.insert(
        "paddle".to_string(),
        serde_json::json!({
            "display_name": "PaddleOCR",
            "kind": "remote",
            "credential": {
                "field": "paddle_token",
                "env": "RETAIN_PADDLE_API_TOKEN",
                "required_for": ["remote_url", "local_upload"]
            },
            "options": {
                "transport": {
                    "type": "string",
                    "default": "official_http",
                    "choices": ["official_http", "official_cli"]
                },
                "paddle_api_url": {"type": "string", "default": ""},
                "paddle_model": {
                    "type": "string",
                    "default": paddle_default_model(),
                    "aliases": paddle_config()
                        .get("model_aliases")
                        .cloned()
                        .unwrap_or(Value::Object(serde_json::Map::new()))
                }
            }
        }),
    );
    providers.insert(
        "local".to_string(),
        serde_json::json!({
            "display_name": "Local OCR",
            "kind": "local_command",
            "credential": null,
            "options": {
                "command": {"type": "string", "env": "RETAIN_LOCAL_OCR_COMMAND", "default": ""},
                "raw_provider": {"type": "string", "env": "RETAIN_OCR_RAW_PROVIDER", "default": "generic_flat_ocr"}
            }
        }),
    );
    providers
}

fn config_path() -> Option<PathBuf> {
    env_override(OCR_PROVIDER_CONFIG_ENV)
        .or_else(|| env_override(OCR_PROVIDER_CONFIG_COMPAT_ENV))
        .map(PathBuf::from)
        .or_else(|| {
            // Phase3-2: 主真值已迁移至 packages/config (跨 services/api + services/pipeline 共享)
            // 兼容路径：backend/config -> ../packages/config (本地 symlink, 已 gitignore)
            // Monorepo 整理前：CARGO_MANIFEST_DIR = <repo>/backend/rust_api/crates/retain-core → 3 级到 <repo>/backend
            // 整理后：<repo>/services/api/crates/retain-core → 4 级到 <repo>，再拼接 packages/config
            let core_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
            if let Some(repo_root) = core_root.ancestors().nth(4) {
                let candidates = [
                    repo_root
                        .join("packages")
                        .join("config")
                        .join("ocr_providers.json"),
                    repo_root.join("backend").join("config").join("ocr_providers.json"),
                    repo_root
                        .join("services")
                        .join("config")
                        .join("ocr_providers.json"),
                ];
                for candidate in &candidates {
                    if candidate.exists() {
                        return Some(candidate.clone());
                    }
                }
                // 默认走 packages/config（缺文件时返回 Null 由上层 fallback）
                return Some(
                    repo_root
                        .join("packages")
                        .join("config")
                        .join("ocr_providers.json"),
                );
            }
            core_root.ancestors().nth(3).map(|root| {
                // 兼容旧 backend/rust_api 布局：nth(3) 为 <repo>/backend，此处仍需兼容 packages/config
                if root.file_name().and_then(|n| n.to_str()) == Some("backend") {
                    if let Some(repo_root) = root.parent() {
                        let pkg = repo_root
                            .join("packages")
                            .join("config")
                            .join("ocr_providers.json");
                        if pkg.exists() {
                            return pkg;
                        }
                    }
                }
                if root.file_name().and_then(|n| n.to_str()) == Some("services") {
                    if let Some(repo_root) = root.parent() {
                        let pkg = repo_root
                            .join("packages")
                            .join("config")
                            .join("ocr_providers.json");
                        if pkg.exists() {
                            return pkg;
                        }
                    }
                }
                root.join("config").join("ocr_providers.json")
            })
        })
}

fn env_override(name: &str) -> Option<String> {
    env::var(name)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn paddle_default_model_reads_shared_config() {
        assert_eq!(paddle_default_model(), "PaddleOCR-VL-1.6");
    }

    #[test]
    fn normalize_paddle_model_name_uses_shared_aliases() {
        assert_eq!(normalize_paddle_model_name(""), "PaddleOCR-VL-1.6");
        assert_eq!(
            normalize_paddle_model_name("paddleocr-vl"),
            "PaddleOCR-VL-1.6"
        );
        assert_eq!(
            normalize_paddle_model_name("paddleocr-vl-1.5"),
            "PaddleOCR-VL-1.5"
        );
    }
}

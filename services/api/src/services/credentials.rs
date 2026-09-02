use std::collections::BTreeMap;
use std::fs::{self, OpenOptions};
use std::io::Write;
use std::path::{Path, PathBuf};
use std::sync::{RwLock, RwLockReadGuard};

use axum::http::StatusCode;
use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use serde_json::Value;

use crate::db::Db;
use crate::error::AppError;
use crate::models::domain::now_iso;

const VAULT_SCHEMA: &str = "retainpdf_credential_vault_v1";
const VAULT_LOCK_NAME: &str = ".credentials.lock";
const MAX_VAULT_BYTES: u64 = 256 * 1024;
const MAX_SECRET_BYTES: usize = 8192;
const AI_RUNTIME_SCHEMA: &str = "retainpdf_ai_runtime_credentials_v1";
const MAX_AI_RUNTIME_BYTES: u64 = 64 * 1024;
static VAULT_ACCESS_LOCK: Lazy<RwLock<()>> = Lazy::new(|| RwLock::new(()));

struct VaultFileLock {
    file: fs::File,
}

#[cfg(unix)]
impl Drop for VaultFileLock {
    fn drop(&mut self) {
        use std::os::fd::AsRawFd;

        // SAFETY: `file` remains open for the lifetime of this guard and flock
        // only reads the descriptor value. Unlock failure cannot be recovered
        // during Drop; closing the descriptor releases the lock as a fallback.
        let _ = unsafe { libc::flock(self.file.as_raw_fd(), libc::LOCK_UN) };
    }
}

#[cfg(not(unix))]
impl Drop for VaultFileLock {
    fn drop(&mut self) {}
}

/// Keeps a credential reference stable from validation through job
/// persistence. The process-local read guard permits concurrent submissions;
/// the file guard extends the same ordering across backend processes on POSIX.
pub(crate) struct CredentialUsageLock {
    _process_guard: RwLockReadGuard<'static, ()>,
    _file_guard: VaultFileLock,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct StoredCredential {
    kind: String,
    provider: String,
    label: String,
    secret: String,
    created_at: String,
    updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct CredentialVault {
    schema: String,
    revision: u64,
    credentials: BTreeMap<String, StoredCredential>,
}

impl Default for CredentialVault {
    fn default() -> Self {
        Self {
            schema: VAULT_SCHEMA.to_string(),
            revision: 0,
            credentials: BTreeMap::new(),
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CreateCredentialInput {
    pub kind: String,
    #[serde(default)]
    pub provider: String,
    #[serde(default)]
    pub label: String,
    pub secret: String,
    #[serde(default)]
    pub expected_revision: Option<u64>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct UpdateCredentialInput {
    #[serde(default)]
    pub kind: Option<String>,
    #[serde(default)]
    pub provider: Option<String>,
    #[serde(default)]
    pub label: Option<String>,
    #[serde(default)]
    pub secret: Option<String>,
    #[serde(default)]
    pub expected_revision: Option<u64>,
}

#[derive(Debug, Clone, Deserialize, Default)]
#[serde(deny_unknown_fields)]
pub struct DeleteCredentialQuery {
    #[serde(default)]
    pub expected_revision: Option<u64>,
    #[serde(default)]
    pub force: bool,
}

#[derive(Debug, Clone, Serialize)]
pub struct CredentialMetadataView {
    pub credential_ref: String,
    pub kind: String,
    pub provider: String,
    pub label: String,
    pub configured: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize)]
pub struct CredentialListView {
    pub credentials: Vec<CredentialMetadataView>,
    pub revision: u64,
}

#[derive(Debug, Clone, Serialize)]
pub struct CredentialMutationView {
    pub credential: CredentialMetadataView,
    pub revision: u64,
}

#[derive(Debug, Clone, Serialize)]
pub struct CredentialDeleteView {
    pub credential_ref: String,
    pub deleted: bool,
    pub revision: u64,
}

pub fn list_credentials(data_root: &Path) -> Result<CredentialListView, AppError> {
    let vault = load_vault(data_root)?;
    Ok(CredentialListView {
        credentials: vault
            .credentials
            .iter()
            .map(|(credential_ref, credential)| metadata(credential_ref, credential))
            .collect(),
        revision: vault.revision,
    })
}

pub fn get_credential_metadata(
    data_root: &Path,
    credential_ref: &str,
) -> Result<CredentialMutationView, AppError> {
    validate_credential_ref(credential_ref)?;
    let vault = load_vault(data_root)?;
    let credential = vault
        .credentials
        .get(credential_ref)
        .ok_or_else(|| AppError::not_found("credential reference not found"))?;
    Ok(CredentialMutationView {
        credential: metadata(credential_ref, credential),
        revision: vault.revision,
    })
}

pub fn create_credential(
    data_root: &Path,
    input: CreateCredentialInput,
) -> Result<CredentialMutationView, AppError> {
    let kind = validate_kind(&input.kind)?;
    let provider = normalize_short_text("provider", &input.provider, 128)?;
    let label = normalize_short_text("label", &input.label, 256)?;
    let secret = validate_secret(&input.secret)?;
    mutate_vault(data_root, input.expected_revision, move |vault| {
        let credential_ref = loop {
            let candidate = format!("cred_{:016x}", fastrand::u64(..));
            if !vault.credentials.contains_key(&candidate) {
                break candidate;
            }
        };
        let timestamp = now_iso();
        let credential = StoredCredential {
            kind,
            provider,
            label,
            secret,
            created_at: timestamp.clone(),
            updated_at: timestamp,
        };
        vault
            .credentials
            .insert(credential_ref.clone(), credential.clone());
        Ok((credential_ref, credential))
    })
}

pub fn update_credential(
    data_root: &Path,
    credential_ref: &str,
    input: UpdateCredentialInput,
) -> Result<CredentialMutationView, AppError> {
    validate_credential_ref(credential_ref)?;
    let credential_ref = credential_ref.to_string();
    let kind = input.kind.as_deref().map(validate_kind).transpose()?;
    let provider = input
        .provider
        .as_deref()
        .map(|value| normalize_short_text("provider", value, 128))
        .transpose()?;
    let label = input
        .label
        .as_deref()
        .map(|value| normalize_short_text("label", value, 256))
        .transpose()?;
    let secret = input.secret.as_deref().map(validate_secret).transpose()?;
    if kind.is_none() && provider.is_none() && label.is_none() && secret.is_none() {
        return Err(AppError::bad_request("credential update is empty"));
    }
    mutate_vault(data_root, input.expected_revision, move |vault| {
        let current = vault
            .credentials
            .get_mut(&credential_ref)
            .ok_or_else(|| AppError::not_found("credential reference not found"))?;
        if let Some(value) = kind {
            current.kind = value;
        }
        if let Some(value) = provider {
            current.provider = value;
        }
        if let Some(value) = label {
            current.label = value;
        }
        if let Some(value) = secret {
            current.secret = value;
        }
        current.updated_at = now_iso();
        Ok((credential_ref.clone(), current.clone()))
    })
}

pub fn delete_credential(
    db: &Db,
    data_root: &Path,
    credential_ref: &str,
    expected_revision: Option<u64>,
    force: bool,
) -> Result<CredentialDeleteView, AppError> {
    validate_credential_ref(credential_ref)?;
    let _guard = VAULT_ACCESS_LOCK
        .write()
        .map_err(|_| AppError::internal("credential vault lock is poisoned"))?;
    let _file_guard = acquire_vault_file_lock(data_root, true)?;
    let mut vault = load_vault(data_root)?;
    require_revision(&vault, expected_revision)?;
    if !vault.credentials.contains_key(credential_ref) {
        return Err(AppError::not_found("credential reference not found"));
    }
    let is_referenced = if force {
        false
    } else {
        let referenced_by_job = db
            .count_jobs_referencing_credential(credential_ref)
            .map_err(|_| AppError::internal("credential reference usage cannot be determined"))?
            > 0;
        referenced_by_job || ai_runtime_references_credential(data_root, credential_ref)?
    };
    if is_referenced {
        return Err(AppError::credential_reference(
            StatusCode::CONFLICT,
            "CREDENTIAL_IN_USE",
            "credential is referenced by persisted jobs; use force=true only after confirming the recovery impact",
        ));
    }
    vault.credentials.remove(credential_ref);
    vault.revision = vault.revision.saturating_add(1);
    save_vault(data_root, &vault)?;
    Ok(CredentialDeleteView {
        credential_ref: credential_ref.to_string(),
        deleted: true,
        revision: vault.revision,
    })
}

fn mutate_vault<F>(
    data_root: &Path,
    expected_revision: Option<u64>,
    mutation: F,
) -> Result<CredentialMutationView, AppError>
where
    F: FnOnce(&mut CredentialVault) -> Result<(String, StoredCredential), AppError>,
{
    let _guard = VAULT_ACCESS_LOCK
        .write()
        .map_err(|_| AppError::internal("credential vault lock is poisoned"))?;
    let _file_guard = acquire_vault_file_lock(data_root, true)?;
    let mut vault = load_vault(data_root)?;
    require_revision(&vault, expected_revision)?;
    let (credential_ref, credential) = mutation(&mut vault)?;
    vault.revision = vault.revision.saturating_add(1);
    save_vault(data_root, &vault)?;
    Ok(CredentialMutationView {
        credential: metadata(&credential_ref, &credential),
        revision: vault.revision,
    })
}

fn require_revision(vault: &CredentialVault, expected: Option<u64>) -> Result<(), AppError> {
    if expected.is_some_and(|expected| expected != vault.revision) {
        return Err(AppError::conflict(
            "credential vault changed; reload metadata before saving",
        ));
    }
    Ok(())
}

fn metadata(credential_ref: &str, credential: &StoredCredential) -> CredentialMetadataView {
    CredentialMetadataView {
        credential_ref: credential_ref.to_string(),
        kind: credential.kind.clone(),
        provider: credential.provider.clone(),
        label: credential.label.clone(),
        configured: !credential.secret.is_empty(),
        created_at: credential.created_at.clone(),
        updated_at: credential.updated_at.clone(),
    }
}

fn vault_path(data_root: &Path) -> PathBuf {
    data_root.join("secrets").join("credentials.json")
}

fn ai_runtime_references_credential(
    data_root: &Path,
    credential_ref: &str,
) -> Result<bool, AppError> {
    if [
        "RETAIN_AI_LLM_CREDENTIAL_REF",
        "RETAIN_AI_FX_GATEWAY_CREDENTIAL_REF",
    ]
    .iter()
    .any(|name| std::env::var(name).is_ok_and(|value| value.trim() == credential_ref))
    {
        return Ok(true);
    }
    let path = data_root.join("secrets").join("ai-runtime.json");
    let metadata = match fs::symlink_metadata(&path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(false),
        Err(_) => {
            return Err(AppError::internal(
                "AI runtime credential references cannot be read",
            ))
        }
    };
    if metadata.file_type().is_symlink()
        || !metadata.is_file()
        || metadata.len() > MAX_AI_RUNTIME_BYTES
    {
        return Err(AppError::internal(
            "AI runtime credential reference path is unsafe",
        ));
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        if metadata.permissions().mode() & 0o077 != 0 {
            return Err(AppError::internal(
                "AI runtime credential reference permissions must be 0600",
            ));
        }
    }
    let bytes = fs::read(path)
        .map_err(|_| AppError::internal("AI runtime credential references cannot be read"))?;
    let value: Value = serde_json::from_slice(&bytes)
        .map_err(|_| AppError::internal("AI runtime credential references are invalid"))?;
    if value.get("schema").and_then(Value::as_str) != Some(AI_RUNTIME_SCHEMA) {
        return Err(AppError::internal(
            "AI runtime credential references use an unsupported schema",
        ));
    }
    Ok(["llm_credential_ref", "fx_gateway_credential_ref"]
        .iter()
        .any(|field| value.get(field).and_then(Value::as_str) == Some(credential_ref)))
}

fn load_vault(data_root: &Path) -> Result<CredentialVault, AppError> {
    let path = vault_path(data_root);
    let metadata = match fs::symlink_metadata(&path) {
        Ok(metadata) => metadata,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => {
            return Ok(CredentialVault::default())
        }
        Err(_) => return Err(AppError::internal("credential vault is unreadable")),
    };
    if metadata.file_type().is_symlink() || !metadata.is_file() || metadata.len() > MAX_VAULT_BYTES
    {
        return Err(AppError::internal("credential vault path is unsafe"));
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        if metadata.permissions().mode() & 0o077 != 0 {
            return Err(AppError::internal(
                "credential vault permissions must be 0600",
            ));
        }
    }
    let bytes =
        fs::read(&path).map_err(|_| AppError::internal("credential vault is unreadable"))?;
    let vault: CredentialVault = serde_json::from_slice(&bytes)
        .map_err(|_| AppError::internal("credential vault is invalid"))?;
    if vault.schema != VAULT_SCHEMA
        || vault.credentials.iter().any(|(credential_ref, item)| {
            validate_credential_ref(credential_ref).is_err()
                || item.secret.is_empty()
                || item.secret.len() > MAX_SECRET_BYTES
                || validate_credential_ref_shape(&item.kind).is_err()
        })
    {
        return Err(AppError::internal("credential vault is invalid"));
    }
    Ok(vault)
}

fn save_vault(data_root: &Path, vault: &CredentialVault) -> Result<(), AppError> {
    let path = vault_path(data_root);
    let directory = prepare_vault_directory(data_root)?;
    debug_assert_eq!(path.parent(), Some(directory.as_path()));
    let directory = directory.as_path();
    let encoded = serde_json::to_vec(vault)
        .map_err(|_| AppError::internal("credential vault cannot be encoded"))?;
    if encoded.len() as u64 > MAX_VAULT_BYTES {
        return Err(AppError::bad_request("credential vault is full"));
    }
    let temporary = directory.join(format!(
        ".credentials.json.{}-{:016x}.tmp",
        std::process::id(),
        fastrand::u64(..)
    ));
    let mut options = OpenOptions::new();
    options.write(true).create_new(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        options.mode(0o600).custom_flags(libc::O_NOFOLLOW);
    }
    let result = (|| -> Result<(), AppError> {
        let mut file = options
            .open(&temporary)
            .map_err(|_| AppError::internal("credential vault cannot be written"))?;
        file.write_all(&encoded)
            .and_then(|_| file.sync_all())
            .map_err(|_| AppError::internal("credential vault cannot be written"))?;
        fs::rename(&temporary, &path)
            .map_err(|_| AppError::internal("credential vault cannot be published"))?;
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            fs::set_permissions(&path, fs::Permissions::from_mode(0o600))
                .map_err(|_| AppError::internal("credential vault cannot be secured"))?;
            let directory_handle = fs::File::open(directory)
                .map_err(|_| AppError::internal("credential vault directory cannot be synced"))?;
            directory_handle
                .sync_all()
                .map_err(|_| AppError::internal("credential vault directory cannot be synced"))?;
        }
        Ok(())
    })();
    if result.is_err() {
        let _ = fs::remove_file(&temporary);
    }
    result
}

fn prepare_vault_directory(data_root: &Path) -> Result<PathBuf, AppError> {
    let directory = vault_path(data_root)
        .parent()
        .ok_or_else(|| AppError::internal("credential vault path is invalid"))?
        .to_path_buf();
    fs::create_dir_all(&directory)
        .map_err(|_| AppError::internal("credential vault directory cannot be created"))?;
    let directory_metadata = fs::symlink_metadata(&directory)
        .map_err(|_| AppError::internal("credential vault directory is unreadable"))?;
    if directory_metadata.file_type().is_symlink() || !directory_metadata.is_dir() {
        return Err(AppError::internal("credential vault directory is unsafe"));
    }
    #[cfg(unix)]
    {
        use std::os::unix::fs::PermissionsExt;
        fs::set_permissions(&directory, fs::Permissions::from_mode(0o700))
            .map_err(|_| AppError::internal("credential vault directory cannot be secured"))?;
    }
    Ok(directory)
}

pub(crate) fn acquire_credential_usage_lock(
    data_root: &Path,
) -> Result<CredentialUsageLock, AppError> {
    let process_guard = VAULT_ACCESS_LOCK
        .read()
        .map_err(|_| AppError::internal("credential vault lock is poisoned"))?;
    let file_guard = acquire_vault_file_lock(data_root, false)?;
    Ok(CredentialUsageLock {
        _process_guard: process_guard,
        _file_guard: file_guard,
    })
}

fn acquire_vault_file_lock(data_root: &Path, exclusive: bool) -> Result<VaultFileLock, AppError> {
    let directory = prepare_vault_directory(data_root)?;
    let lock_path = directory.join(VAULT_LOCK_NAME);
    let mut options = OpenOptions::new();
    options.read(true).write(true).create(true);
    #[cfg(unix)]
    {
        use std::os::unix::fs::OpenOptionsExt;
        options.mode(0o600).custom_flags(libc::O_NOFOLLOW);
    }
    let file = options
        .open(&lock_path)
        .map_err(|_| AppError::internal("credential vault lock cannot be opened"))?;
    let metadata = fs::symlink_metadata(&lock_path)
        .map_err(|_| AppError::internal("credential vault lock is unreadable"))?;
    if metadata.file_type().is_symlink() || !metadata.is_file() {
        return Err(AppError::internal("credential vault lock path is unsafe"));
    }
    #[cfg(unix)]
    {
        use std::os::fd::AsRawFd;
        use std::os::unix::fs::PermissionsExt;

        fs::set_permissions(&lock_path, fs::Permissions::from_mode(0o600))
            .map_err(|_| AppError::internal("credential vault lock cannot be secured"))?;
        // SAFETY: the descriptor is valid and retained by `VaultFileLock`
        // until the critical section finishes.
        let operation = if exclusive {
            libc::LOCK_EX
        } else {
            libc::LOCK_SH
        };
        if unsafe { libc::flock(file.as_raw_fd(), operation) } != 0 {
            return Err(AppError::internal(
                "credential vault lock cannot be acquired",
            ));
        }
    }
    Ok(VaultFileLock { file })
}

fn validate_credential_ref(value: &str) -> Result<(), AppError> {
    if !value.starts_with("cred_") || validate_credential_ref_shape(value).is_err() {
        return Err(AppError::bad_request("credential_ref is invalid"));
    }
    Ok(())
}

fn validate_credential_ref_shape(value: &str) -> Result<(), ()> {
    if value.is_empty()
        || value.len() > 64
        || !value.bytes().all(|byte| {
            byte.is_ascii_lowercase() || byte.is_ascii_digit() || byte == b'_' || byte == b'-'
        })
    {
        return Err(());
    }
    Ok(())
}

fn validate_kind(value: &str) -> Result<String, AppError> {
    let value = value.trim().to_ascii_lowercase();
    validate_credential_ref_shape(&value)
        .map_err(|_| AppError::bad_request("credential kind is invalid"))?;
    Ok(value)
}

fn normalize_short_text(name: &str, value: &str, max: usize) -> Result<String, AppError> {
    let value = value.trim();
    if value.len() > max || value.chars().any(char::is_control) {
        return Err(AppError::bad_request(format!("{name} is invalid")));
    }
    Ok(value.to_string())
}

fn validate_secret(value: &str) -> Result<String, AppError> {
    let value = value.trim();
    if value.is_empty() || value.len() > MAX_SECRET_BYTES || value.contains('\0') {
        return Err(AppError::bad_request("credential secret is invalid"));
    }
    Ok(value.to_string())
}

#[cfg(test)]
mod tests {
    use std::sync::mpsc;
    use std::time::Duration;

    use crate::models::domain::JobSnapshot;
    use crate::models::request::CreateJobInput;

    use super::*;

    #[test]
    fn concurrent_job_persistence_fences_credential_deletion() {
        let data_root = std::env::temp_dir().join(format!(
            "retainpdf-credential-lifecycle-{}-{:016x}",
            std::process::id(),
            fastrand::u64(..)
        ));
        let db = Db::new(data_root.join("db/jobs.db"), data_root.clone());
        db.init().expect("initialize jobs db");
        let created = create_credential(
            &data_root,
            CreateCredentialInput {
                kind: "translation_api_key".to_string(),
                provider: "deepseek".to_string(),
                label: "lifecycle test".to_string(),
                secret: "sk-lifecycle-test".to_string(),
                expected_revision: Some(0),
            },
        )
        .expect("create credential");
        let credential_ref = created.credential.credential_ref;

        let usage_guard =
            acquire_credential_usage_lock(&data_root).expect("acquire credential usage lock");
        let deletion_db = db.clone();
        let deletion_root = data_root.clone();
        let deletion_ref = credential_ref.clone();
        let (started_tx, started_rx) = mpsc::channel();
        let (done_tx, done_rx) = mpsc::channel();
        let deletion = std::thread::spawn(move || {
            started_tx.send(()).expect("signal deletion start");
            let result =
                delete_credential(&deletion_db, &deletion_root, &deletion_ref, Some(1), false);
            done_tx.send(result).expect("return deletion result");
        });
        started_rx.recv().expect("deletion thread started");
        assert!(
            done_rx.recv_timeout(Duration::from_millis(50)).is_err(),
            "deletion must wait while task creation holds the usage lock"
        );

        let mut input = CreateJobInput::default();
        input.translation.credential_ref = credential_ref;
        db.save_job(&JobSnapshot::new(
            "job-created-during-delete".to_string(),
            input,
            vec!["python3".to_string()],
        ))
        .expect("persist job before releasing usage lock");
        drop(usage_guard);

        let result = done_rx
            .recv_timeout(Duration::from_secs(2))
            .expect("deletion finishes after usage lock release");
        match result {
            Err(AppError::CredentialReference { code, status, .. }) => {
                assert_eq!(code, "CREDENTIAL_IN_USE");
                assert_eq!(status, StatusCode::CONFLICT);
            }
            other => panic!("unexpected deletion result: {other:?}"),
        }
        deletion.join().expect("join deletion thread");
    }
}

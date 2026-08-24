use std::path::{Path, PathBuf};

use retain_core::models::domain::{
    now_iso, DocumentOperationLimits, DocumentOperationStatus, DocumentOperationWorkspaceManifest,
    DocumentOperationWorkspaceState, UploadRecord, DOCUMENT_OPERATION_MANIFEST_SCHEMA,
    DOCUMENT_OPERATION_SCHEMA_VERSION, DOCUMENT_OPERATION_STATE_SCHEMA,
};
use retain_core::storage_paths::{resolve_data_path, to_relative_data_path};
use retain_data::db::{CommitDocumentCandidateResult, Db, DocumentVersionRecord};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use sha2::{Digest, Sha256};
use walkdir::WalkDir;

use crate::config::AppConfig;
use crate::error::AppError;

use super::contracts::{
    CancelDocumentOperationInput, CommitDocumentOperationInput, CreateDocumentOperationInput,
    DocumentOperationEventView, DocumentOperationView, RunDocumentOperationInput,
    DOCUMENT_OPERATION_CANCEL_INPUT_SCHEMA, DOCUMENT_OPERATION_COMMIT_INPUT_SCHEMA,
    DOCUMENT_OPERATION_CREATE_INPUT_SCHEMA, DOCUMENT_OPERATION_RUN_INPUT_SCHEMA,
    DOCUMENT_OPERATION_VIEW_SCHEMA,
};
use super::program::canonical_program_sha256;
use super::workspace::{
    materialize_operation_workspace, require_regular_file, sha256_file, write_state_mirror,
    write_validation_report, OperationWorkspacePaths,
};
use super::{
    ControlPlanePreviewExecutor, DocumentOperationControl, DocumentOperationExecutor,
    RestrictedPageProgramExecutor, CONTROL_PLANE_PREVIEW_PROFILE, RESTRICTED_PAGE_PROGRAM_PROFILE,
};

pub fn create_document_operation(
    db: &Db,
    config: &AppConfig,
    input: &CreateDocumentOperationInput,
) -> Result<DocumentOperationView, AppError> {
    validate_schema(
        &input.schema,
        DOCUMENT_OPERATION_CREATE_INPUT_SCHEMA,
        "create",
    )?;
    validate_idempotency_key(&input.idempotency_key)?;
    let (operation_id, dispatch_id) = operation_identity(input);

    if let Some(existing) = db
        .get_document_operation(&operation_id)
        .map_err(internal_error)?
    {
        let attempt = db
            .get_document_operation_attempt(&operation_id, existing.current_attempt)
            .map_err(internal_error)?
            .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
        ensure_create_replay_matches(input, &attempt.manifest)?;
        return get_document_operation_view(db, config, &operation_id, true);
    }

    let document = db
        .get_document(&input.document_id)
        .map_err(|_| AppError::not_found(format!("document not found: {}", input.document_id)))?;
    if !input.conversation_id.trim().is_empty() {
        let conversation = db
            .get_conversation(input.conversation_id.trim())
            .map_err(internal_error)?
            .ok_or_else(|| {
                AppError::not_found(format!(
                    "conversation not found: {}",
                    input.conversation_id.trim()
                ))
            })?;
        if conversation
            .document_id
            .as_deref()
            .is_some_and(|document_id| document_id != input.document_id)
        {
            return Err(AppError::conflict(
                "conversation is scoped to a different document",
            ));
        }
        if db
            .get_message(
                input.conversation_id.trim(),
                input.request_message_id.trim(),
            )
            .map_err(internal_error)?
            .is_none()
        {
            return Err(AppError::not_found(format!(
                "request message not found: {}",
                input.request_message_id.trim()
            )));
        }
    }
    let base_version_id = db
        .get_active_document_version_id(&input.document_id)
        .map_err(internal_error)?;
    let base_job_id = input
        .base_job_id
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_string)
        .or(document.active_job_id)
        .unwrap_or_else(|| format!("source-{}", short_identity(&input.document_id)));
    let (executor_profile, source_path, source_pdf_sha256) = match &input.program {
        Some(program) => {
            let actual_program_sha = canonical_program_sha256(program).map_err(|error| {
                AppError::bad_request(format!("invalid document operation program: {error}"))
            })?;
            if actual_program_sha != input.program_sha256 {
                return Err(AppError::bad_request(
                    "program_sha256 does not match canonical program content",
                ));
            }
            let source_path = resolve_operation_source(
                db,
                &config.data_root,
                &input.document_id,
                base_version_id.as_deref(),
            )?;
            let actual_source_sha = sha256_file(&source_path).map_err(internal_error)?;
            if input
                .source_pdf_sha256
                .as_deref()
                .is_some_and(|expected| expected != actual_source_sha)
            {
                return Err(AppError::conflict(
                    "source_pdf_sha256 does not match the active document version",
                ));
            }
            (
                RESTRICTED_PAGE_PROGRAM_PROFILE,
                Some(source_path),
                actual_source_sha,
            )
        }
        None => (
            CONTROL_PLANE_PREVIEW_PROFILE,
            None,
            input
                .source_pdf_sha256
                .clone()
                .unwrap_or_else(|| input.document_id.clone()),
        ),
    };
    let created_at = now_iso();
    let manifest = DocumentOperationWorkspaceManifest {
        schema: DOCUMENT_OPERATION_MANIFEST_SCHEMA.to_string(),
        schema_version: DOCUMENT_OPERATION_SCHEMA_VERSION,
        operation_id: operation_id.clone(),
        attempt: 1,
        dispatch_id,
        document_id: input.document_id.clone(),
        base_job_id,
        conversation_id: input.conversation_id.trim().to_string(),
        request_message_id: input.request_message_id.trim().to_string(),
        intent_summary: input.intent_summary.trim().to_string(),
        source_pdf_sha256,
        normalized_document_sha256: input.normalized_document_sha256.clone(),
        program_sha256: input.program_sha256.clone(),
        executor_profile: executor_profile.to_string(),
        limits: input.limits.clone().unwrap_or_else(default_limits),
        created_at: created_at.clone(),
    };
    manifest
        .validate()
        .map_err(|error| AppError::bad_request(format!("invalid operation manifest: {error}")))?;
    if manifest.request_message_id.is_empty() {
        return Err(AppError::bad_request("request_message_id is required"));
    }
    let state = DocumentOperationWorkspaceState {
        schema: DOCUMENT_OPERATION_STATE_SCHEMA.to_string(),
        schema_version: DOCUMENT_OPERATION_SCHEMA_VERSION,
        operation_id: operation_id.clone(),
        attempt: 1,
        dispatch_id: manifest.dispatch_id.clone(),
        program_sha256: manifest.program_sha256.clone(),
        status: DocumentOperationStatus::Draft,
        dispatch_intent_at: None,
        dispatch_receipt: None,
        terminal_receipt_at: None,
        candidate_pdf_sha256: None,
        error_code: None,
        detail: None,
        updated_at: created_at,
    };
    if let (Some(program), Some(source_path)) = (&input.program, source_path.as_deref()) {
        materialize_operation_workspace(&config.data_root, source_path, program, &manifest, &state)
            .map_err(|error| {
                AppError::conflict(format!(
                    "prepare document operation workspace failed: {error}"
                ))
            })?;
    }
    db.create_document_operation(&manifest, &state, base_version_id.as_deref())
        .map_err(|error| {
            AppError::conflict(format!("create document operation failed: {error}"))
        })?;
    get_document_operation_view(db, config, &operation_id, false)
}

pub fn run_document_operation(
    db: &Db,
    config: &AppConfig,
    operation_id: &str,
    input: &RunDocumentOperationInput,
) -> Result<DocumentOperationView, AppError> {
    validate_schema(&input.schema, DOCUMENT_OPERATION_RUN_INPUT_SCHEMA, "run")?;
    validate_idempotency_key(&input.idempotency_key)?;
    if input.accept_duplicate_risk && !input.retry {
        return Err(AppError::bad_request(
            "accept_duplicate_risk is valid only for an explicit retry",
        ));
    }
    let mut operation = require_operation(db, operation_id)?;
    let mut retry_replay = false;
    if input.retry {
        if !input.confirmed {
            return Err(AppError::conflict(
                "document operation retry requires explicit confirmation",
            ));
        }
        if let Some(existing_retry) = db
            .get_document_operation_attempt_by_retry_key(operation_id, &input.idempotency_key)
            .map_err(internal_error)?
        {
            retry_replay = true;
            if existing_retry.manifest.attempt != operation.current_attempt {
                return get_document_operation_view(db, config, operation_id, true);
            }
            materialize_retry_workspace(db, config, &existing_retry.manifest)?;
            if !matches!(
                operation.status,
                DocumentOperationStatus::Draft | DocumentOperationStatus::AwaitingConfirmation
            ) {
                refresh_and_publish(db, config, operation_id)?;
                return get_document_operation_view(db, config, operation_id, true);
            }
        } else {
            if !matches!(
                operation.status,
                DocumentOperationStatus::Failed | DocumentOperationStatus::Ambiguous
            ) {
                return Err(AppError::conflict(format!(
                    "document operation cannot retry from status {}",
                    operation.status.as_str()
                )));
            }
            if operation.status == DocumentOperationStatus::Ambiguous
                && !input.accept_duplicate_risk
            {
                return Err(AppError::conflict(
                    "ambiguous document operation retry requires accept_duplicate_risk=true",
                ));
            }
            create_retry_attempt(db, config, &operation, input)?;
            operation = require_operation(db, operation_id)?;
        }
    }
    if matches!(
        operation.status,
        DocumentOperationStatus::Queued
            | DocumentOperationStatus::Running
            | DocumentOperationStatus::Validating
            | DocumentOperationStatus::ResultReady
            | DocumentOperationStatus::Committed
    ) {
        refresh_and_publish(db, config, operation_id)?;
        return get_document_operation_view(db, config, operation_id, true);
    }
    if operation.status == DocumentOperationStatus::Draft && !input.confirmed {
        return Err(AppError::conflict(
            "document operation requires explicit confirmation before dispatch",
        ));
    }
    if !matches!(
        operation.status,
        DocumentOperationStatus::Draft | DocumentOperationStatus::AwaitingConfirmation
    ) {
        return Err(AppError::conflict(format!(
            "document operation cannot run from status {}",
            operation.status.as_str()
        )));
    }
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    let executor = executor_for(config, &attempt.manifest.executor_profile)?;
    let control = DocumentOperationControl::new(db, executor.as_ref());
    if operation.status == DocumentOperationStatus::Draft {
        control.confirm(operation_id).map_err(conflict_error)?;
    }
    control.dispatch(operation_id).map_err(conflict_error)?;
    refresh_and_publish(db, config, operation_id)?;
    get_document_operation_view(db, config, operation_id, retry_replay)
}

fn create_retry_attempt(
    db: &Db,
    config: &AppConfig,
    operation: &retain_data::db::StoredDocumentOperation,
    input: &RunDocumentOperationInput,
) -> Result<(), AppError> {
    let previous = db
        .get_document_operation_attempt(&operation.operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    let attempt_number = operation
        .current_attempt
        .checked_add(1)
        .ok_or_else(|| AppError::conflict("document operation attempt limit was reached"))?;
    let created_at = now_iso();
    let mut manifest = previous.manifest;
    manifest.attempt = attempt_number;
    manifest.dispatch_id = retry_dispatch_identity(&operation.operation_id, attempt_number);
    manifest.created_at = created_at.clone();
    let state = DocumentOperationWorkspaceState {
        schema: DOCUMENT_OPERATION_STATE_SCHEMA.to_string(),
        schema_version: DOCUMENT_OPERATION_SCHEMA_VERSION,
        operation_id: operation.operation_id.clone(),
        attempt: attempt_number,
        dispatch_id: manifest.dispatch_id.clone(),
        program_sha256: manifest.program_sha256.clone(),
        status: DocumentOperationStatus::Draft,
        dispatch_intent_at: None,
        dispatch_receipt: None,
        terminal_receipt_at: None,
        candidate_pdf_sha256: None,
        error_code: None,
        detail: None,
        updated_at: created_at,
    };
    db.create_next_document_operation_attempt(
        &manifest,
        &state,
        &input.idempotency_key,
        input.accept_duplicate_risk,
    )
    .map_err(conflict_error)?;
    materialize_retry_workspace(db, config, &manifest)
}

fn materialize_retry_workspace(
    db: &Db,
    config: &AppConfig,
    manifest: &DocumentOperationWorkspaceManifest,
) -> Result<(), AppError> {
    if manifest.attempt <= 1 || manifest.executor_profile == CONTROL_PLANE_PREVIEW_PROFILE {
        return Ok(());
    }
    if manifest.executor_profile != RESTRICTED_PAGE_PROGRAM_PROFILE {
        return Err(AppError::conflict(format!(
            "document operation executor profile is unavailable: {}",
            manifest.executor_profile
        )));
    }
    let previous = db
        .get_document_operation_attempt(&manifest.operation_id, manifest.attempt - 1)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("previous document operation attempt is missing"))?;
    let previous_paths =
        OperationWorkspacePaths::for_manifest(&config.data_root, &previous.manifest);
    require_regular_file(&previous_paths.source_pdf, "previous operation source PDF")
        .map_err(internal_error)?;
    require_regular_file(
        &previous_paths.program_json,
        "previous operation page program",
    )
    .map_err(internal_error)?;
    if sha256_file(&previous_paths.source_pdf).map_err(internal_error)?
        != manifest.source_pdf_sha256
        || sha256_file(&previous_paths.program_json).map_err(internal_error)?
            != manifest.program_sha256
    {
        return Err(AppError::conflict(
            "previous operation workspace no longer matches immutable retry inputs",
        ));
    }
    let program: Value = serde_json::from_slice(
        &std::fs::read(&previous_paths.program_json).map_err(internal_error)?,
    )
    .map_err(internal_error)?;
    if canonical_program_sha256(&program).map_err(AppError::conflict)? != manifest.program_sha256 {
        return Err(AppError::conflict(
            "previous operation page program is not canonical",
        ));
    }
    let attempt = db
        .get_document_operation_attempt(&manifest.operation_id, manifest.attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("retry document operation attempt is missing"))?;
    materialize_operation_workspace(
        &config.data_root,
        &previous_paths.source_pdf,
        &program,
        manifest,
        &attempt.state,
    )
    .map(|_| ())
    .map_err(|error| {
        AppError::conflict(format!(
            "prepare retry document operation workspace failed: {error}"
        ))
    })
}

pub fn cancel_document_operation(
    db: &Db,
    config: &AppConfig,
    operation_id: &str,
    input: &CancelDocumentOperationInput,
) -> Result<DocumentOperationView, AppError> {
    validate_schema(
        &input.schema,
        DOCUMENT_OPERATION_CANCEL_INPUT_SCHEMA,
        "cancel",
    )?;
    validate_idempotency_key(&input.idempotency_key)?;
    let operation = require_operation(db, operation_id)?;
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    let executor = executor_for(config, &attempt.manifest.executor_profile)?;
    DocumentOperationControl::new(db, executor.as_ref())
        .cancel(operation_id, &input.reason)
        .map_err(conflict_error)?;
    get_document_operation_view(db, config, operation_id, false)
}

pub fn commit_document_operation(
    db: &Db,
    config: &AppConfig,
    operation_id: &str,
    input: &CommitDocumentOperationInput,
) -> Result<DocumentOperationView, AppError> {
    validate_schema(
        &input.schema,
        DOCUMENT_OPERATION_COMMIT_INPUT_SCHEMA,
        "commit",
    )?;
    validate_idempotency_key(&input.idempotency_key)?;
    let operation = require_operation(db, operation_id)?;
    if operation.status == DocumentOperationStatus::Committed {
        project_committed_candidate_as_source(db, config, operation_id)?;
        return get_document_operation_view(db, config, operation_id, true);
    }
    if operation.status != DocumentOperationStatus::ResultReady {
        return Err(AppError::conflict(format!(
            "document operation cannot commit from status {}",
            operation.status.as_str()
        )));
    }
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    let mut committed = attempt.state;
    committed.status = DocumentOperationStatus::Committed;
    committed.updated_at = now_iso();
    match db
        .commit_document_candidate(&committed)
        .map_err(conflict_error)?
    {
        CommitDocumentCandidateResult::Committed => {
            project_committed_candidate_as_source(db, config, operation_id)?;
            get_document_operation_view(db, config, operation_id, false)
        }
        CommitDocumentCandidateResult::StaleBase => Err(AppError::conflict(
            "document candidate base version is stale",
        )),
    }
}

pub fn get_document_operation_view(
    db: &Db,
    config: &AppConfig,
    operation_id: &str,
    idempotent_replay: bool,
) -> Result<DocumentOperationView, AppError> {
    refresh_and_publish(db, config, operation_id)?;
    let operation = require_operation(db, operation_id)?;
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    let events = db
        .list_document_operation_events(operation_id)
        .map_err(internal_error)?
        .into_iter()
        .map(|event| {
            let payload = serde_json::from_str(&event.payload_json).map_err(internal_error)?;
            Ok(DocumentOperationEventView {
                seq: event.seq,
                attempt: event.attempt,
                ts: event.ts,
                event: event.event,
                status: event.status,
                payload,
            })
        })
        .collect::<Result<Vec<_>, AppError>>()?;
    let candidate_version = db
        .get_document_version_for_operation(operation_id)
        .map_err(internal_error)?
        .map(Into::into);
    Ok(DocumentOperationView {
        schema: DOCUMENT_OPERATION_VIEW_SCHEMA,
        operation_id: operation.operation_id,
        conversation_id: operation.conversation_id,
        request_message_id: operation.request_message_id,
        document_id: operation.document_id,
        base_job_id: operation.base_job_id,
        base_version_id: operation.base_version_id,
        intent_summary: operation.intent_summary,
        status: operation.status,
        current_attempt: operation.current_attempt,
        manifest: attempt.manifest,
        state: attempt.state,
        candidate_version,
        events,
        idempotent_replay,
        created_at: operation.created_at,
        updated_at: operation.updated_at,
    })
}

fn refresh_and_publish(db: &Db, config: &AppConfig, operation_id: &str) -> Result<(), AppError> {
    let operation = require_operation(db, operation_id)?;
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    if attempt.manifest.executor_profile == RESTRICTED_PAGE_PROGRAM_PROFILE
        && matches!(
            operation.status,
            DocumentOperationStatus::Queued | DocumentOperationStatus::Running
        )
    {
        let executor = executor_for(config, &attempt.manifest.executor_profile)?;
        let control = DocumentOperationControl::new(db, executor.as_ref());
        if operation.status == DocumentOperationStatus::Queued {
            control
                .reconcile_unreceipted_operation(operation_id)
                .map_err(internal_error)?;
        } else {
            control.refresh(operation_id).map_err(internal_error)?;
        }
    }
    let operation = require_operation(db, operation_id)?;
    if operation.status != DocumentOperationStatus::Validating {
        return Ok(());
    }
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    if let Err(error) = validate_and_publish_candidate(db, config, &operation, &attempt) {
        let mut failed = attempt.state;
        failed.status = DocumentOperationStatus::Failed;
        failed.error_code = Some("candidate_validation_failed".to_string());
        failed.detail = Some(
            error
                .to_string()
                .replace(
                    &config.data_root.to_string_lossy().to_string(),
                    "[DATA_ROOT]",
                )
                .chars()
                .take(2000)
                .collect(),
        );
        failed.updated_at = now_iso();
        db.transition_document_operation(
            &failed,
            "candidate_validation_failed",
            r#"{"failed":true}"#,
        )
        .map_err(internal_error)?;
        let paths = OperationWorkspacePaths::for_manifest(&config.data_root, &attempt.manifest);
        let _ = write_state_mirror(&paths, &failed);
    }
    Ok(())
}

fn executor_for(
    config: &AppConfig,
    profile: &str,
) -> Result<Box<dyn DocumentOperationExecutor>, AppError> {
    match profile {
        CONTROL_PLANE_PREVIEW_PROFILE => Ok(Box::new(ControlPlanePreviewExecutor)),
        RESTRICTED_PAGE_PROGRAM_PROFILE => Ok(Box::new(RestrictedPageProgramExecutor::new(
            &config.data_root,
            &config.scripts_dir,
            &config.python_bin,
        ))),
        _ => Err(AppError::conflict(format!(
            "document operation executor profile is unavailable: {profile}"
        ))),
    }
}

fn resolve_operation_source(
    db: &Db,
    data_root: &Path,
    document_id: &str,
    base_version_id: Option<&str>,
) -> Result<PathBuf, AppError> {
    let path = if let Some(version_id) = base_version_id {
        let version = db
            .get_document_version(version_id)
            .map_err(internal_error)?
            .ok_or_else(|| AppError::conflict("active document version is missing"))?;
        if version.document_id != document_id || version.status != "committed" {
            return Err(AppError::conflict(
                "active document version is not a committed version for this document",
            ));
        }
        resolve_data_path(data_root, &version.artifact_key).map_err(internal_error)?
    } else {
        let upload = db
            .find_upload_for_document(document_id)
            .map_err(internal_error)?
            .ok_or_else(|| AppError::not_found("document source PDF is missing"))?;
        PathBuf::from(upload.stored_path)
    };
    require_regular_file(&path, "active document source PDF").map_err(internal_error)?;
    let canonical_root = data_root.canonicalize().map_err(internal_error)?;
    let canonical_path = path.canonicalize().map_err(internal_error)?;
    if !canonical_path.starts_with(&canonical_root) {
        return Err(AppError::conflict(
            "active document source PDF is outside the backend data root",
        ));
    }
    Ok(canonical_path)
}

#[derive(Serialize)]
struct CandidateValidationReport {
    schema: &'static str,
    valid: bool,
    source_pdf_sha256: String,
    program_sha256: String,
    candidate_pdf_sha256: String,
    candidate_bytes: u64,
    page_count: usize,
    executor_output_file_count: u64,
    executor_output_total_bytes: u64,
    visual_validation_sha256: String,
    visual_renderer: String,
    visual_renderer_version: String,
    visual_render_max_dimension: u32,
    visual_rendered_pixel_count: u64,
    page_plan_sha256: String,
    page_geometry_sha256: String,
    dropped_source_pages: u32,
    duplicated_output_pages: u32,
    rotated_output_pages: u32,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct ExecutorCompletedResult {
    schema: String,
    status: String,
    input_page_count: u32,
    output_page_count: u32,
    output_bytes: u64,
    candidate_pdf_sha256: String,
    program_sha256: String,
    visual_validation_sha256: String,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct VisualValidationReport {
    schema: String,
    valid: bool,
    renderer: String,
    renderer_version: String,
    render_max_dimension: u32,
    source_pdf_sha256: String,
    program_sha256: String,
    candidate_pdf_sha256: String,
    source_page_count: u32,
    candidate_page_count: u32,
    rendered_page_count: u32,
    rendered_pixel_count: u64,
    page_plan_sha256: String,
    page_geometry_sha256: String,
    expected_pixels_sha256: String,
    candidate_pixels_sha256: String,
    mismatch_count: u32,
    mismatched_pages: Vec<u32>,
    dropped_source_pages: u32,
    duplicated_output_pages: u32,
    rotated_output_pages: u32,
}

fn validate_and_publish_candidate(
    db: &Db,
    config: &AppConfig,
    operation: &retain_data::db::StoredDocumentOperation,
    attempt: &retain_data::db::StoredDocumentOperationAttempt,
) -> anyhow::Result<()> {
    let manifest = &attempt.manifest;
    let paths = OperationWorkspacePaths::for_manifest(&config.data_root, manifest);
    for (path, label) in [
        (&paths.source_pdf, "operation source PDF"),
        (&paths.program_json, "operation page program"),
        (&paths.candidate_pdf, "candidate PDF"),
        (&paths.result_json, "executor terminal result"),
        (&paths.visual_validation_json, "candidate visual validation"),
    ] {
        require_regular_file(path, label)?;
    }
    let source_sha = sha256_file(&paths.source_pdf)?;
    let program_sha = sha256_file(&paths.program_json)?;
    let candidate_sha = sha256_file(&paths.candidate_pdf)?;
    let visual_validation_sha = sha256_file(&paths.visual_validation_json)?;
    if source_sha != manifest.source_pdf_sha256 || program_sha != manifest.program_sha256 {
        anyhow::bail!("immutable operation input hash changed before validation");
    }
    if attempt.state.candidate_pdf_sha256.as_deref() != Some(candidate_sha.as_str()) {
        anyhow::bail!("candidate hash does not match executor terminal receipt");
    }
    let program_value: Value = serde_json::from_slice(&std::fs::read(&paths.program_json)?)?;
    if canonical_program_sha256(&program_value).map_err(anyhow::Error::msg)? != program_sha {
        anyhow::bail!("page program canonical hash changed");
    }
    let terminal: ExecutorCompletedResult =
        serde_json::from_slice(&std::fs::read(&paths.result_json)?)?;
    if terminal.schema != "retainpdf_page_program_result_v1"
        || terminal.status != "completed"
        || terminal.candidate_pdf_sha256 != candidate_sha
        || terminal.program_sha256 != program_sha
        || terminal.visual_validation_sha256 != visual_validation_sha
    {
        anyhow::bail!("executor terminal result identity is inconsistent");
    }
    let visual: VisualValidationReport =
        serde_json::from_slice(&std::fs::read(&paths.visual_validation_json)?)?;
    for digest in [
        &visual_validation_sha,
        &visual.page_plan_sha256,
        &visual.page_geometry_sha256,
        &visual.expected_pixels_sha256,
        &visual.candidate_pixels_sha256,
    ] {
        require_sha256(digest)?;
    }
    if visual.schema != "retainpdf_visual_validation_v1"
        || visual.renderer != "pymupdf"
        || !visual.valid
        || visual.source_pdf_sha256 != source_sha
        || visual.program_sha256 != program_sha
        || visual.candidate_pdf_sha256 != candidate_sha
        || visual.expected_pixels_sha256 != visual.candidate_pixels_sha256
        || visual.mismatch_count != 0
        || !visual.mismatched_pages.is_empty()
    {
        anyhow::bail!("candidate raster validation does not match the approved page program");
    }
    let candidate_bytes = std::fs::metadata(&paths.candidate_pdf)?.len();
    if candidate_bytes == 0 || candidate_bytes > manifest.limits.output_bytes {
        anyhow::bail!("candidate PDF exceeds the operation output limit");
    }
    let candidate = lopdf::Document::load(&paths.candidate_pdf)?;
    let page_count = candidate.get_pages().len();
    if page_count == 0 {
        anyhow::bail!("candidate PDF has no readable pages");
    }
    if terminal.input_page_count != visual.source_page_count
        || terminal.output_page_count != page_count as u32
        || terminal.output_page_count != visual.candidate_page_count
        || visual.rendered_page_count != terminal.output_page_count
        || terminal.output_bytes != candidate_bytes
    {
        anyhow::bail!("candidate structural and raster validation counts are inconsistent");
    }
    let mut output_file_count = 0u64;
    let mut output_total_bytes = 0u64;
    for entry in WalkDir::new(paths.root.join("outputs")).follow_links(false) {
        let entry = entry?;
        if entry.file_type().is_symlink() {
            anyhow::bail!("operation output contains a symlink");
        }
        if entry.file_type().is_file() {
            output_file_count += 1;
            output_total_bytes = output_total_bytes.saturating_add(entry.metadata()?.len());
        }
    }
    if output_file_count > u64::from(manifest.limits.file_count)
        || output_total_bytes > manifest.limits.output_bytes
    {
        anyhow::bail!("operation outputs exceed file-count or byte limits");
    }
    let report = CandidateValidationReport {
        schema: "document_operation_validation_v2",
        valid: true,
        source_pdf_sha256: source_sha,
        program_sha256: program_sha,
        candidate_pdf_sha256: candidate_sha.clone(),
        candidate_bytes,
        page_count,
        executor_output_file_count: output_file_count,
        executor_output_total_bytes: output_total_bytes,
        visual_validation_sha256: visual_validation_sha,
        visual_renderer: visual.renderer,
        visual_renderer_version: visual.renderer_version,
        visual_render_max_dimension: visual.render_max_dimension,
        visual_rendered_pixel_count: visual.rendered_pixel_count,
        page_plan_sha256: visual.page_plan_sha256,
        page_geometry_sha256: visual.page_geometry_sha256,
        dropped_source_pages: visual.dropped_source_pages,
        duplicated_output_pages: visual.duplicated_output_pages,
        rotated_output_pages: visual.rotated_output_pages,
    };
    write_validation_report(&paths, &report)?;
    let mut ready = attempt.state.clone();
    ready.status = DocumentOperationStatus::ResultReady;
    ready.updated_at = now_iso();
    let artifact_key = to_relative_data_path(&config.data_root, &paths.candidate_pdf)?;
    let version_digest =
        Sha256::digest(format!("{}\0{}", operation.operation_id, candidate_sha).as_bytes());
    let version_digest = digest_hex(&version_digest);
    let version_id = format!("version-{}", &version_digest[..40]);
    db.publish_document_candidate(
        &DocumentVersionRecord {
            version_id,
            document_id: operation.document_id.clone(),
            base_version_id: operation.base_version_id.clone(),
            operation_id: operation.operation_id.clone(),
            source_job_id: operation.base_job_id.clone(),
            artifact_key,
            content_sha256: candidate_sha,
            status: "candidate".to_string(),
            created_at: ready.updated_at.clone(),
            committed_at: None,
        },
        &ready,
    )?;
    let _ = write_state_mirror(&paths, &ready);
    Ok(())
}

fn project_committed_candidate_as_source(
    db: &Db,
    config: &AppConfig,
    operation_id: &str,
) -> Result<(), AppError> {
    let operation = require_operation(db, operation_id)?;
    if operation.status != DocumentOperationStatus::Committed {
        return Ok(());
    }
    let attempt = db
        .get_document_operation_attempt(operation_id, operation.current_attempt)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("document operation attempt is missing"))?;
    if attempt.manifest.executor_profile != RESTRICTED_PAGE_PROGRAM_PROFILE {
        return Ok(());
    }
    let version = db
        .get_document_version_for_operation(operation_id)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("committed document version is missing"))?;
    if version.status != "committed" || version.document_id != operation.document_id {
        return Err(AppError::internal(
            "committed document version identity is inconsistent",
        ));
    }
    let candidate_path =
        resolve_data_path(&config.data_root, &version.artifact_key).map_err(internal_error)?;
    require_regular_file(&candidate_path, "committed candidate PDF").map_err(internal_error)?;
    let candidate = lopdf::Document::load(&candidate_path).map_err(internal_error)?;
    let page_count = candidate.get_pages().len() as u32;
    let bytes = std::fs::metadata(&candidate_path)
        .map_err(internal_error)?
        .len();
    let document = db
        .get_document(&operation.document_id)
        .map_err(internal_error)?;
    db.save_upload(&UploadRecord {
        upload_id: format!("version-upload-{}", version.version_id),
        filename: if document.source_filename.trim().is_empty() {
            format!("{}.pdf", operation.document_id)
        } else {
            document.source_filename
        },
        stored_path: version.artifact_key,
        bytes,
        page_count,
        uploaded_at: version.committed_at.unwrap_or_else(now_iso),
        developer_mode: false,
        // document_id becomes the stable lineage identity after the first
        // committed edit; the immutable version keeps the actual content hash.
        content_hash: operation.document_id,
    })
    .map_err(internal_error)?;
    let projected = db
        .find_upload_for_document(&version.document_id)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::internal("committed source projection is missing"))?;
    db.upsert_document_from_upload(&projected)
        .map_err(internal_error)?;
    Ok(())
}

fn require_operation(
    db: &Db,
    operation_id: &str,
) -> Result<retain_data::db::StoredDocumentOperation, AppError> {
    retain_core::models::domain::validate_operation_id(operation_id)
        .map_err(AppError::bad_request)?;
    db.get_document_operation(operation_id)
        .map_err(internal_error)?
        .ok_or_else(|| AppError::not_found(format!("document operation not found: {operation_id}")))
}

fn validate_schema(actual: &str, expected: &str, action: &str) -> Result<(), AppError> {
    if actual != expected {
        return Err(AppError::bad_request(format!(
            "unsupported document operation {action} schema: {actual}"
        )));
    }
    Ok(())
}

fn validate_idempotency_key(value: &str) -> Result<(), AppError> {
    let value = value.trim();
    if value.is_empty() || value.len() > 128 || value.chars().any(char::is_whitespace) {
        return Err(AppError::bad_request(
            "idempotency_key must be 1..128 non-whitespace characters",
        ));
    }
    Ok(())
}

fn operation_identity(input: &CreateDocumentOperationInput) -> (String, String) {
    let scope = if input.conversation_id.trim().is_empty() {
        input.document_id.trim()
    } else {
        input.conversation_id.trim()
    };
    let digest = Sha256::digest(format!("{scope}\0{}", input.idempotency_key.trim()).as_bytes());
    let hex = digest_hex(&digest);
    (
        format!("op-{}", &hex[..40]),
        format!("dispatch-{}", &hex[..40]),
    )
}

fn retry_dispatch_identity(operation_id: &str, attempt: u32) -> String {
    let digest = Sha256::digest(format!("{operation_id}\0retry\0{attempt}").as_bytes());
    format!("dispatch-{}", &digest_hex(&digest)[..40])
}

fn ensure_create_replay_matches(
    input: &CreateDocumentOperationInput,
    manifest: &DocumentOperationWorkspaceManifest,
) -> Result<(), AppError> {
    let base_job_matches = input
        .base_job_id
        .as_deref()
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .is_none_or(|value| value == manifest.base_job_id);
    let source_matches = input
        .source_pdf_sha256
        .as_deref()
        .is_none_or(|value| value == manifest.source_pdf_sha256);
    if manifest.document_id != input.document_id
        || manifest.conversation_id != input.conversation_id.trim()
        || manifest.request_message_id != input.request_message_id.trim()
        || manifest.intent_summary != input.intent_summary.trim()
        || manifest.normalized_document_sha256 != input.normalized_document_sha256
        || manifest.program_sha256 != input.program_sha256
        || input
            .limits
            .as_ref()
            .is_some_and(|limits| limits != &manifest.limits)
        || !base_job_matches
        || !source_matches
    {
        return Err(AppError::conflict(
            "idempotency key was already used with a different create payload",
        ));
    }
    Ok(())
}

fn short_identity(value: &str) -> String {
    let digest = Sha256::digest(value.as_bytes());
    digest_hex(&digest)[..16].to_string()
}

fn digest_hex(digest: &[u8]) -> String {
    digest.iter().map(|byte| format!("{byte:02x}")).collect()
}

fn require_sha256(value: &str) -> anyhow::Result<()> {
    if value.len() != 64 || !value.bytes().all(|byte| byte.is_ascii_hexdigit()) {
        anyhow::bail!("validation artifact contains an invalid SHA-256 identity");
    }
    Ok(())
}

fn default_limits() -> DocumentOperationLimits {
    DocumentOperationLimits {
        wall_time_seconds: 60,
        cpu_time_seconds: 45,
        memory_bytes: 512 * 1024 * 1024,
        scratch_bytes: 256 * 1024 * 1024,
        output_bytes: 128 * 1024 * 1024,
        process_count: 1,
        file_descriptor_count: 32,
        file_count: 16,
        stdout_bytes: 1024 * 1024,
        stderr_bytes: 1024 * 1024,
    }
}

fn internal_error(error: impl std::fmt::Display) -> AppError {
    AppError::internal(error.to_string())
}

fn conflict_error(error: impl std::fmt::Display) -> AppError {
    AppError::conflict(error.to_string())
}

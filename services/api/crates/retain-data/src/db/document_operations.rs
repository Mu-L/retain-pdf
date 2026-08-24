use std::str::FromStr;

use anyhow::{bail, Context, Result};
use rusqlite::{params, OptionalExtension, Transaction};

use crate::models::domain::{
    now_iso, DocumentOperationStatus, DocumentOperationWorkspaceManifest,
    DocumentOperationWorkspaceState,
};

use super::Db;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StoredDocumentOperation {
    pub operation_id: String,
    pub conversation_id: Option<String>,
    pub request_message_id: String,
    pub document_id: String,
    pub base_job_id: String,
    pub base_version_id: Option<String>,
    pub intent_summary: String,
    pub status: DocumentOperationStatus,
    pub current_attempt: u32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct StoredDocumentOperationAttempt {
    pub manifest: DocumentOperationWorkspaceManifest,
    pub state: DocumentOperationWorkspaceState,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DocumentOperationEventRecord {
    pub seq: u64,
    pub attempt: u32,
    pub ts: String,
    pub event: String,
    pub status: DocumentOperationStatus,
    pub payload_json: String,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DocumentVersionRecord {
    pub version_id: String,
    pub document_id: String,
    pub base_version_id: Option<String>,
    pub operation_id: String,
    pub source_job_id: String,
    pub artifact_key: String,
    pub content_sha256: String,
    pub status: String,
    pub created_at: String,
    pub committed_at: Option<String>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommitDocumentCandidateResult {
    Committed,
    StaleBase,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CreateDocumentOperationAttemptResult {
    Created,
    IdempotentReplay,
}

impl Db {
    pub fn create_document_operation(
        &self,
        manifest: &DocumentOperationWorkspaceManifest,
        state: &DocumentOperationWorkspaceState,
        base_version_id: Option<&str>,
    ) -> Result<()> {
        manifest.validate().map_err(anyhow::Error::msg)?;
        state.validate_for(manifest).map_err(anyhow::Error::msg)?;
        if state.status != DocumentOperationStatus::Draft {
            bail!("new document operation must start in draft");
        }

        let mut conn = self.connect()?;
        let tx = conn.transaction()?;
        tx.execute(
            r#"
            INSERT INTO document_operations (
                operation_id, conversation_id, request_message_id, document_id,
                base_job_id, base_version_id, intent_summary, status,
                current_attempt, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?10)
            "#,
            params![
                manifest.operation_id,
                non_empty(&manifest.conversation_id),
                manifest.request_message_id,
                manifest.document_id,
                manifest.base_job_id,
                base_version_id,
                manifest.intent_summary,
                state.status.as_str(),
                manifest.attempt,
                manifest.created_at,
            ],
        )?;
        insert_attempt(&tx, manifest, state, "")?;
        append_event(
            &tx,
            &manifest.operation_id,
            manifest.attempt,
            &manifest.created_at,
            "created",
            &state.status,
            "{}",
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn get_document_operation(
        &self,
        operation_id: &str,
    ) -> Result<Option<StoredDocumentOperation>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT operation_id, conversation_id, request_message_id, document_id,
                   base_job_id, base_version_id, intent_summary, status,
                   current_attempt, created_at, updated_at
            FROM document_operations WHERE operation_id = ?1
            "#,
            params![operation_id],
            row_to_operation,
        )
        .optional()
        .map_err(Into::into)
    }

    pub fn get_document_operation_attempt(
        &self,
        operation_id: &str,
        attempt: u32,
    ) -> Result<Option<StoredDocumentOperationAttempt>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT manifest_json, state_json
            FROM document_operation_attempts
            WHERE operation_id = ?1 AND attempt = ?2
            "#,
            params![operation_id, attempt],
            |row| {
                let manifest_json: String = row.get(0)?;
                let state_json: String = row.get(1)?;
                Ok((manifest_json, state_json))
            },
        )
        .optional()?
        .map(|(manifest_json, state_json)| decode_attempt(&manifest_json, &state_json))
        .transpose()
    }

    pub fn get_active_document_version_id(&self, document_id: &str) -> Result<Option<String>> {
        let conn = self.connect()?;
        let version_id = conn
            .query_row(
                "SELECT active_version_id FROM documents WHERE document_id = ?1",
                params![document_id],
                |row| row.get(0),
            )
            .optional()?
            .flatten();
        Ok(version_id)
    }

    pub fn get_document_version_for_operation(
        &self,
        operation_id: &str,
    ) -> Result<Option<DocumentVersionRecord>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT version_id, document_id, base_version_id, operation_id,
                   source_job_id, artifact_key, content_sha256, status,
                   created_at, committed_at
            FROM document_versions WHERE operation_id = ?1
            "#,
            params![operation_id],
            row_to_version,
        )
        .optional()
        .map_err(Into::into)
    }

    pub fn get_document_version(&self, version_id: &str) -> Result<Option<DocumentVersionRecord>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT version_id, document_id, base_version_id, operation_id,
                   source_job_id, artifact_key, content_sha256, status,
                   created_at, committed_at
            FROM document_versions WHERE version_id = ?1
            "#,
            params![version_id],
            row_to_version,
        )
        .optional()
        .map_err(Into::into)
    }

    pub fn create_next_document_operation_attempt(
        &self,
        manifest: &DocumentOperationWorkspaceManifest,
        state: &DocumentOperationWorkspaceState,
        retry_idempotency_key: &str,
        accept_duplicate_risk: bool,
    ) -> Result<CreateDocumentOperationAttemptResult> {
        manifest.validate().map_err(anyhow::Error::msg)?;
        state.validate_for(manifest).map_err(anyhow::Error::msg)?;
        if state.status != DocumentOperationStatus::Draft {
            bail!("new document operation attempt must start in draft");
        }
        if retry_idempotency_key.trim().is_empty()
            || retry_idempotency_key.len() > 128
            || retry_idempotency_key.chars().any(char::is_whitespace)
        {
            bail!("retry idempotency key is invalid");
        }

        let mut conn = self.connect()?;
        let tx = conn.transaction()?;
        let existing: Option<i64> = tx
            .query_row(
                r#"
                SELECT attempt FROM document_operation_attempts
                WHERE operation_id = ?1 AND retry_idempotency_key = ?2
                "#,
                params![manifest.operation_id, retry_idempotency_key],
                |row| row.get(0),
            )
            .optional()?;
        if existing.is_some() {
            tx.commit()?;
            return Ok(CreateDocumentOperationAttemptResult::IdempotentReplay);
        }
        let operation = load_operation(&tx, &manifest.operation_id)?;
        if !matches!(
            operation.status,
            DocumentOperationStatus::Failed | DocumentOperationStatus::Ambiguous
        ) {
            bail!("document operation is not retryable");
        }
        if operation.status == DocumentOperationStatus::Ambiguous && !accept_duplicate_risk {
            bail!("ambiguous document operation retry requires accepting duplicate execution risk");
        }
        if manifest.attempt != operation.current_attempt + 1 {
            bail!("retry attempt must increment current_attempt by one");
        }
        let previous = load_attempt(&tx, &manifest.operation_id, operation.current_attempt)?;
        if previous.state.status != operation.status {
            bail!("document operation and current attempt status disagree");
        }
        if !retry_manifest_preserves_scope(manifest, &previous.manifest) {
            bail!("retry manifest changed immutable operation scope");
        }
        let active_version_id: Option<String> = tx.query_row(
            "SELECT active_version_id FROM documents WHERE document_id = ?1",
            params![operation.document_id],
            |row| row.get(0),
        )?;
        if active_version_id != operation.base_version_id {
            bail!("document operation base version is stale");
        }
        let changed = tx.execute(
            r#"
            UPDATE document_operations
            SET status = 'draft', current_attempt = ?1, updated_at = ?2
            WHERE operation_id = ?3 AND current_attempt = ?4 AND status = ?5
            "#,
            params![
                manifest.attempt,
                state.updated_at,
                manifest.operation_id,
                operation.current_attempt,
                operation.status.as_str(),
            ],
        )?;
        if changed != 1 {
            bail!("document operation changed concurrently while creating retry attempt");
        }
        insert_attempt(&tx, manifest, state, retry_idempotency_key)?;
        let payload = serde_json::to_string(&serde_json::json!({
            "retry": true,
            "previous_attempt": operation.current_attempt,
            "previous_status": operation.status.as_str(),
            "accepted_duplicate_risk": operation.status == DocumentOperationStatus::Ambiguous
                && accept_duplicate_risk,
        }))?;
        append_event(
            &tx,
            &manifest.operation_id,
            manifest.attempt,
            &state.updated_at,
            "retry_attempt_created",
            &state.status,
            &payload,
        )?;
        tx.commit()?;
        Ok(CreateDocumentOperationAttemptResult::Created)
    }

    pub fn get_document_operation_attempt_by_retry_key(
        &self,
        operation_id: &str,
        retry_idempotency_key: &str,
    ) -> Result<Option<StoredDocumentOperationAttempt>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT manifest_json, state_json
            FROM document_operation_attempts
            WHERE operation_id = ?1 AND retry_idempotency_key = ?2
            "#,
            params![operation_id, retry_idempotency_key],
            |row| Ok((row.get::<_, String>(0)?, row.get::<_, String>(1)?)),
        )
        .optional()?
        .map(|(manifest_json, state_json)| decode_attempt(&manifest_json, &state_json))
        .transpose()
    }

    pub fn transition_document_operation(
        &self,
        next: &DocumentOperationWorkspaceState,
        event: &str,
        payload_json: &str,
    ) -> Result<()> {
        let payload: serde_json::Value = serde_json::from_str(payload_json)
            .context("document operation event payload must be valid JSON")?;
        if !payload.is_object() {
            bail!("document operation event payload must be a JSON object");
        }

        let mut conn = self.connect()?;
        let tx = conn.transaction()?;
        let (manifest_json, current_state_json): (String, String) = tx.query_row(
            r#"
            SELECT manifest_json, state_json
            FROM document_operation_attempts
            WHERE operation_id = ?1 AND attempt = ?2
            "#,
            params![next.operation_id, next.attempt],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )?;
        let current = decode_attempt(&manifest_json, &current_state_json)?;
        next.validate_for(&current.manifest)
            .map_err(anyhow::Error::msg)?;
        if !current.state.status.can_transition_to(&next.status) {
            bail!(
                "invalid document operation transition: {} -> {}",
                current.state.status.as_str(),
                next.status.as_str()
            );
        }
        persist_state_transition(&tx, &current.state.status, next, event, payload_json)?;
        tx.commit()?;
        Ok(())
    }

    pub fn recover_unreceipted_document_operations(&self) -> Result<Vec<String>> {
        let states = self.list_unreceipted_document_operation_attempts()?;
        let mut recovered = Vec::new();
        for mut state in states {
            state.status = DocumentOperationStatus::Ambiguous;
            state.detail =
                Some("dispatch intent is durable but no executor receipt is available".to_string());
            state.updated_at = now_iso();
            self.transition_document_operation(
                &state,
                "recovered_unreceipted_dispatch",
                r#"{"requires_confirmation":true}"#,
            )?;
            recovered.push(state.operation_id);
        }
        Ok(recovered)
    }

    pub fn list_unreceipted_document_operation_attempts(
        &self,
    ) -> Result<Vec<DocumentOperationWorkspaceState>> {
        let conn = self.connect()?;
        let mut stmt = conn.prepare(
            r#"
            SELECT state_json
            FROM document_operation_attempts
            WHERE status = 'queued'
              AND dispatch_intent_at IS NOT NULL
              AND dispatch_receipt_json IS NULL
            ORDER BY updated_at
            "#,
        )?;
        let rows = stmt.query_map([], |row| row.get::<_, String>(0))?;
        let mut states = Vec::new();
        for row in rows {
            let state_json = row?;
            states.push(serde_json::from_str::<DocumentOperationWorkspaceState>(
                &state_json,
            )?);
        }
        Ok(states)
    }

    pub fn publish_document_candidate(
        &self,
        version: &DocumentVersionRecord,
        next: &DocumentOperationWorkspaceState,
    ) -> Result<()> {
        if next.status != DocumentOperationStatus::ResultReady {
            bail!("candidate publication requires result_ready state");
        }
        if version.status != "candidate"
            || version.version_id.trim().is_empty()
            || version.artifact_key.trim().is_empty()
        {
            bail!("candidate version identity is incomplete");
        }
        if next.candidate_pdf_sha256.as_deref() != Some(version.content_sha256.as_str()) {
            bail!("candidate version hash does not match operation state");
        }

        let mut conn = self.connect()?;
        let tx = conn.transaction()?;
        let (manifest_json, current_state_json): (String, String) = tx.query_row(
            r#"
            SELECT manifest_json, state_json
            FROM document_operation_attempts
            WHERE operation_id = ?1 AND attempt = ?2
            "#,
            params![next.operation_id, next.attempt],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )?;
        let current = decode_attempt(&manifest_json, &current_state_json)?;
        next.validate_for(&current.manifest)
            .map_err(anyhow::Error::msg)?;
        if !current.state.status.can_transition_to(&next.status) {
            bail!("candidate publication requires a valid validating transition");
        }
        let operation = load_operation(&tx, &next.operation_id)?;
        if operation.document_id != version.document_id
            || operation.base_version_id != version.base_version_id
            || operation.operation_id != version.operation_id
        {
            bail!("candidate version identity does not match document operation");
        }
        tx.execute(
            r#"
            INSERT INTO document_versions (
                version_id, document_id, base_version_id, operation_id,
                source_job_id, artifact_key, content_sha256, status,
                created_at, committed_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'candidate', ?8, NULL)
            "#,
            params![
                version.version_id,
                version.document_id,
                version.base_version_id,
                version.operation_id,
                version.source_job_id,
                version.artifact_key,
                version.content_sha256,
                version.created_at,
            ],
        )?;
        persist_state_transition(
            &tx,
            &current.state.status,
            next,
            "candidate_published",
            r#"{"candidate_ready":true}"#,
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn commit_document_candidate(
        &self,
        next: &DocumentOperationWorkspaceState,
    ) -> Result<CommitDocumentCandidateResult> {
        if next.status != DocumentOperationStatus::Committed {
            bail!("candidate commit requires committed state");
        }
        let mut conn = self.connect()?;
        let tx = conn.transaction()?;
        let operation = load_operation(&tx, &next.operation_id)?;
        if operation.status != DocumentOperationStatus::ResultReady {
            bail!("document operation is not result_ready");
        }
        let version: DocumentVersionRecord = tx.query_row(
            r#"
            SELECT version_id, document_id, base_version_id, operation_id,
                   source_job_id, artifact_key, content_sha256, status,
                   created_at, committed_at
            FROM document_versions WHERE operation_id = ?1
            "#,
            params![next.operation_id],
            row_to_version,
        )?;
        if version.status != "candidate" {
            bail!("document version is not a candidate");
        }

        let changed = tx.execute(
            r#"
            UPDATE documents
            SET active_version_id = ?1, updated_at = ?2
            WHERE document_id = ?3 AND active_version_id IS ?4
            "#,
            params![
                version.version_id,
                next.updated_at,
                operation.document_id,
                operation.base_version_id,
            ],
        )?;
        if changed == 0 {
            return Ok(CommitDocumentCandidateResult::StaleBase);
        }

        let (manifest_json, current_state_json): (String, String) = tx.query_row(
            r#"
            SELECT manifest_json, state_json
            FROM document_operation_attempts
            WHERE operation_id = ?1 AND attempt = ?2
            "#,
            params![next.operation_id, next.attempt],
            |row| Ok((row.get(0)?, row.get(1)?)),
        )?;
        let current = decode_attempt(&manifest_json, &current_state_json)?;
        next.validate_for(&current.manifest)
            .map_err(anyhow::Error::msg)?;
        if !current.state.status.can_transition_to(&next.status) {
            bail!("invalid candidate commit transition");
        }
        tx.execute(
            r#"
            UPDATE document_versions
            SET status = 'committed', committed_at = ?1
            WHERE version_id = ?2
            "#,
            params![next.updated_at, version.version_id],
        )?;
        persist_state_transition(
            &tx,
            &current.state.status,
            next,
            "candidate_committed",
            r#"{"committed":true}"#,
        )?;
        tx.commit()?;
        Ok(CommitDocumentCandidateResult::Committed)
    }

    pub fn list_document_operation_events(
        &self,
        operation_id: &str,
    ) -> Result<Vec<DocumentOperationEventRecord>> {
        let conn = self.connect()?;
        let mut stmt = conn.prepare(
            r#"
            SELECT seq, attempt, ts, event, status, payload_json
            FROM document_operation_events
            WHERE operation_id = ?1 ORDER BY seq
            "#,
        )?;
        let rows = stmt.query_map(params![operation_id], |row| {
            let status: String = row.get(4)?;
            Ok((
                row.get::<_, i64>(0)?,
                row.get::<_, i64>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                status,
                row.get::<_, String>(5)?,
            ))
        })?;
        let mut events = Vec::new();
        for row in rows {
            let (seq, attempt, ts, event, status, payload_json) = row?;
            events.push(DocumentOperationEventRecord {
                seq: seq as u64,
                attempt: attempt as u32,
                ts,
                event,
                status: DocumentOperationStatus::from_str(&status).map_err(anyhow::Error::msg)?,
                payload_json,
            });
        }
        Ok(events)
    }
}

fn insert_attempt(
    tx: &Transaction<'_>,
    manifest: &DocumentOperationWorkspaceManifest,
    state: &DocumentOperationWorkspaceState,
    retry_idempotency_key: &str,
) -> Result<()> {
    let inserted = tx.execute(
        r#"
        INSERT INTO document_operation_attempts (
            operation_id, attempt, dispatch_id, program_sha256,
            manifest_json, state_json, status, dispatch_intent_at,
            dispatch_receipt_json, terminal_receipt_at, candidate_pdf_sha256,
            created_at, updated_at, retry_idempotency_key
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
        "#,
        params![
            manifest.operation_id,
            manifest.attempt,
            manifest.dispatch_id,
            manifest.program_sha256,
            serde_json::to_string(manifest)?,
            serde_json::to_string(state)?,
            state.status.as_str(),
            state.dispatch_intent_at,
            state
                .dispatch_receipt
                .as_ref()
                .map(serde_json::to_string)
                .transpose()?,
            state.terminal_receipt_at,
            state.candidate_pdf_sha256,
            manifest.created_at,
            state.updated_at,
            retry_idempotency_key,
        ],
    )?;
    if inserted != 1 {
        bail!("document operation attempt was not inserted");
    }
    Ok(())
}

fn load_attempt(
    tx: &Transaction<'_>,
    operation_id: &str,
    attempt: u32,
) -> Result<StoredDocumentOperationAttempt> {
    let (manifest_json, state_json): (String, String) = tx.query_row(
        r#"
        SELECT manifest_json, state_json FROM document_operation_attempts
        WHERE operation_id = ?1 AND attempt = ?2
        "#,
        params![operation_id, attempt],
        |row| Ok((row.get(0)?, row.get(1)?)),
    )?;
    decode_attempt(&manifest_json, &state_json)
}

fn retry_manifest_preserves_scope(
    next: &DocumentOperationWorkspaceManifest,
    previous: &DocumentOperationWorkspaceManifest,
) -> bool {
    next.operation_id == previous.operation_id
        && next.attempt == previous.attempt + 1
        && next.document_id == previous.document_id
        && next.base_job_id == previous.base_job_id
        && next.conversation_id == previous.conversation_id
        && next.request_message_id == previous.request_message_id
        && next.intent_summary == previous.intent_summary
        && next.source_pdf_sha256 == previous.source_pdf_sha256
        && next.normalized_document_sha256 == previous.normalized_document_sha256
        && next.program_sha256 == previous.program_sha256
        && next.executor_profile == previous.executor_profile
        && next.limits == previous.limits
}

fn persist_state_transition(
    tx: &Transaction<'_>,
    current_status: &DocumentOperationStatus,
    next: &DocumentOperationWorkspaceState,
    event: &str,
    payload_json: &str,
) -> Result<()> {
    let changed = tx.execute(
        r#"
        UPDATE document_operation_attempts
        SET state_json = ?1, status = ?2, dispatch_intent_at = ?3,
            dispatch_receipt_json = ?4, terminal_receipt_at = ?5,
            candidate_pdf_sha256 = ?6, updated_at = ?7
        WHERE operation_id = ?8 AND attempt = ?9 AND status = ?10
        "#,
        params![
            serde_json::to_string(next)?,
            next.status.as_str(),
            next.dispatch_intent_at,
            next.dispatch_receipt
                .as_ref()
                .map(serde_json::to_string)
                .transpose()?,
            next.terminal_receipt_at,
            next.candidate_pdf_sha256,
            next.updated_at,
            next.operation_id,
            next.attempt,
            current_status.as_str(),
        ],
    )?;
    if changed != 1 {
        bail!("document operation attempt changed concurrently");
    }
    let operation_changed = tx.execute(
        r#"
        UPDATE document_operations
        SET status = ?1, updated_at = ?2
        WHERE operation_id = ?3 AND current_attempt = ?4 AND status = ?5
        "#,
        params![
            next.status.as_str(),
            next.updated_at,
            next.operation_id,
            next.attempt,
            current_status.as_str(),
        ],
    )?;
    if operation_changed != 1 {
        bail!("document operation changed concurrently");
    }
    append_event(
        tx,
        &next.operation_id,
        next.attempt,
        &next.updated_at,
        event,
        &next.status,
        payload_json,
    )?;
    Ok(())
}

fn append_event(
    tx: &Transaction<'_>,
    operation_id: &str,
    attempt: u32,
    ts: &str,
    event: &str,
    status: &DocumentOperationStatus,
    payload_json: &str,
) -> Result<()> {
    let seq: i64 = tx.query_row(
        "SELECT COALESCE(MAX(seq), 0) + 1 FROM document_operation_events WHERE operation_id = ?1",
        params![operation_id],
        |row| row.get(0),
    )?;
    tx.execute(
        r#"
        INSERT INTO document_operation_events (
            operation_id, seq, attempt, ts, event, status, payload_json
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
        "#,
        params![
            operation_id,
            seq,
            attempt,
            ts,
            event,
            status.as_str(),
            payload_json
        ],
    )?;
    Ok(())
}

fn load_operation(tx: &Transaction<'_>, operation_id: &str) -> Result<StoredDocumentOperation> {
    tx.query_row(
        r#"
        SELECT operation_id, conversation_id, request_message_id, document_id,
               base_job_id, base_version_id, intent_summary, status,
               current_attempt, created_at, updated_at
        FROM document_operations WHERE operation_id = ?1
        "#,
        params![operation_id],
        row_to_operation,
    )
    .map_err(Into::into)
}

fn row_to_operation(row: &rusqlite::Row<'_>) -> rusqlite::Result<StoredDocumentOperation> {
    let status: String = row.get(7)?;
    let status = DocumentOperationStatus::from_str(&status).map_err(|error| {
        rusqlite::Error::FromSqlConversionFailure(
            7,
            rusqlite::types::Type::Text,
            Box::new(std::io::Error::new(std::io::ErrorKind::InvalidData, error)),
        )
    })?;
    Ok(StoredDocumentOperation {
        operation_id: row.get(0)?,
        conversation_id: row.get(1)?,
        request_message_id: row.get(2)?,
        document_id: row.get(3)?,
        base_job_id: row.get(4)?,
        base_version_id: row.get(5)?,
        intent_summary: row.get(6)?,
        status,
        current_attempt: row.get::<_, i64>(8)? as u32,
        created_at: row.get(9)?,
        updated_at: row.get(10)?,
    })
}

fn row_to_version(row: &rusqlite::Row<'_>) -> rusqlite::Result<DocumentVersionRecord> {
    Ok(DocumentVersionRecord {
        version_id: row.get(0)?,
        document_id: row.get(1)?,
        base_version_id: row.get(2)?,
        operation_id: row.get(3)?,
        source_job_id: row.get(4)?,
        artifact_key: row.get(5)?,
        content_sha256: row.get(6)?,
        status: row.get(7)?,
        created_at: row.get(8)?,
        committed_at: row.get(9)?,
    })
}

fn decode_attempt(manifest_json: &str, state_json: &str) -> Result<StoredDocumentOperationAttempt> {
    let manifest: DocumentOperationWorkspaceManifest = serde_json::from_str(manifest_json)?;
    let state: DocumentOperationWorkspaceState = serde_json::from_str(state_json)?;
    manifest.validate().map_err(anyhow::Error::msg)?;
    state.validate_for(&manifest).map_err(anyhow::Error::msg)?;
    Ok(StoredDocumentOperationAttempt { manifest, state })
}

fn non_empty(value: &str) -> Option<&str> {
    (!value.trim().is_empty()).then_some(value)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::models::domain::{
        DocumentOperationDispatchReceipt, DocumentOperationLimits,
        DOCUMENT_OPERATION_MANIFEST_SCHEMA, DOCUMENT_OPERATION_SCHEMA_VERSION,
        DOCUMENT_OPERATION_STATE_SCHEMA,
    };

    fn digest(character: char) -> String {
        std::iter::repeat_n(character, 64).collect()
    }

    fn test_db(name: &str) -> Db {
        let root = std::env::temp_dir().join(format!(
            "retain-document-operations-{name}-{}-{}",
            std::process::id(),
            fastrand::u64(..)
        ));
        let db = Db::new(root.join("retain.db"), root.clone());
        db.init().expect("init database");
        let conn = db.connect().expect("connect database");
        conn.execute(
            r#"
            INSERT INTO documents (
                document_id, title, source_filename, page_count, bytes,
                active_job_id, reading_status, added_at, updated_at
            ) VALUES ('document-a', 'Document', 'source.pdf', 1, 100,
                      'job-a', 'unread', '2026-08-23T00:00:00Z', '2026-08-23T00:00:00Z')
            "#,
            [],
        )
        .expect("seed document");
        db
    }

    fn manifest(operation_id: &str, dispatch_id: &str) -> DocumentOperationWorkspaceManifest {
        DocumentOperationWorkspaceManifest {
            schema: DOCUMENT_OPERATION_MANIFEST_SCHEMA.to_string(),
            schema_version: DOCUMENT_OPERATION_SCHEMA_VERSION,
            operation_id: operation_id.to_string(),
            attempt: 1,
            dispatch_id: dispatch_id.to_string(),
            document_id: "document-a".to_string(),
            base_job_id: "job-a".to_string(),
            conversation_id: String::new(),
            request_message_id: "message-a".to_string(),
            intent_summary: "Create a candidate".to_string(),
            source_pdf_sha256: digest('a'),
            normalized_document_sha256: Some(digest('b')),
            program_sha256: digest('c'),
            executor_profile: "deterministic_test_v1".to_string(),
            limits: DocumentOperationLimits {
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
            },
            created_at: "2026-08-23T00:00:00Z".to_string(),
        }
    }

    fn draft(manifest: &DocumentOperationWorkspaceManifest) -> DocumentOperationWorkspaceState {
        DocumentOperationWorkspaceState {
            schema: DOCUMENT_OPERATION_STATE_SCHEMA.to_string(),
            schema_version: DOCUMENT_OPERATION_SCHEMA_VERSION,
            operation_id: manifest.operation_id.clone(),
            attempt: manifest.attempt,
            dispatch_id: manifest.dispatch_id.clone(),
            program_sha256: manifest.program_sha256.clone(),
            status: DocumentOperationStatus::Draft,
            dispatch_intent_at: None,
            dispatch_receipt: None,
            terminal_receipt_at: None,
            candidate_pdf_sha256: None,
            error_code: None,
            detail: None,
            updated_at: manifest.created_at.clone(),
        }
    }

    fn transition(
        db: &Db,
        state: &mut DocumentOperationWorkspaceState,
        status: DocumentOperationStatus,
        event: &str,
    ) {
        state.status = status;
        state.updated_at = now_iso();
        db.transition_document_operation(state, event, "{}")
            .expect("transition operation");
    }

    #[test]
    fn unreceipted_dispatch_recovers_to_ambiguous_once() {
        let db = test_db("ambiguous");
        let manifest = manifest("op-ambiguous", "dispatch-ambiguous");
        let mut state = draft(&manifest);
        db.create_document_operation(&manifest, &state, None)
            .expect("create operation");
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::AwaitingConfirmation,
            "confirmation_requested",
        );
        state.dispatch_intent_at = Some(now_iso());
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::Queued,
            "dispatch_intent",
        );

        assert_eq!(
            db.recover_unreceipted_document_operations()
                .expect("recover operations"),
            vec!["op-ambiguous".to_string()]
        );
        assert!(db
            .recover_unreceipted_document_operations()
            .expect("second recovery")
            .is_empty());
        let operation = db
            .get_document_operation("op-ambiguous")
            .expect("load operation")
            .expect("operation exists");
        assert_eq!(operation.status, DocumentOperationStatus::Ambiguous);
        let events = db
            .list_document_operation_events("op-ambiguous")
            .expect("load events");
        assert_eq!(events.len(), 4);
        assert_eq!(
            events.last().expect("last event").event,
            "recovered_unreceipted_dispatch"
        );

        let mut retry_manifest = manifest.clone();
        retry_manifest.attempt = 2;
        retry_manifest.dispatch_id = "dispatch-retry".to_string();
        retry_manifest.created_at = now_iso();
        let retry_state = draft(&retry_manifest);
        assert!(db
            .create_next_document_operation_attempt(
                &retry_manifest,
                &retry_state,
                "retry-key-ambiguous",
                false,
            )
            .expect_err("ambiguous retry must require risk acceptance")
            .to_string()
            .contains("duplicate execution risk"));
        let mut changed_manifest = retry_manifest.clone();
        changed_manifest.source_pdf_sha256 = digest('f');
        let changed_state = draft(&changed_manifest);
        assert!(db
            .create_next_document_operation_attempt(
                &changed_manifest,
                &changed_state,
                "retry-key-changed",
                true,
            )
            .expect_err("retry must preserve immutable inputs")
            .to_string()
            .contains("immutable operation scope"));
        assert_eq!(
            db.create_next_document_operation_attempt(
                &retry_manifest,
                &retry_state,
                "retry-key-ambiguous",
                true,
            )
            .expect("create retry attempt"),
            CreateDocumentOperationAttemptResult::Created
        );
        assert_eq!(
            db.create_next_document_operation_attempt(
                &retry_manifest,
                &retry_state,
                "retry-key-ambiguous",
                true,
            )
            .expect("replay retry attempt"),
            CreateDocumentOperationAttemptResult::IdempotentReplay
        );
        assert_eq!(
            db.get_document_operation("op-ambiguous")
                .expect("load retried operation")
                .expect("retried operation exists")
                .current_attempt,
            2
        );
        assert_eq!(
            db.get_document_operation_attempt("op-ambiguous", 1)
                .expect("load first attempt")
                .expect("first attempt exists")
                .state
                .status,
            DocumentOperationStatus::Ambiguous
        );
        let events = db
            .list_document_operation_events("op-ambiguous")
            .expect("load retry events");
        let retry_payload: serde_json::Value =
            serde_json::from_str(&events.last().expect("retry event").payload_json)
                .expect("retry payload");
        assert_eq!(retry_payload["previous_attempt"], 1);
        assert_eq!(retry_payload["previous_status"], "ambiguous");
        assert_eq!(retry_payload["accepted_duplicate_risk"], true);
    }

    #[test]
    fn retry_rejects_a_document_whose_active_base_changed() {
        let db = test_db("retry-stale-base");
        let manifest = manifest("op-retry-stale", "dispatch-retry-stale");
        let mut state = draft(&manifest);
        db.create_document_operation(&manifest, &state, None)
            .expect("create operation");
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::AwaitingConfirmation,
            "confirmation_received",
        );
        state.dispatch_intent_at = Some(now_iso());
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::Queued,
            "dispatch_intent",
        );
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::Failed,
            "executor_failed",
        );
        db.connect()
            .expect("connect database")
            .execute(
                "UPDATE documents SET active_version_id = 'external-version' WHERE document_id = 'document-a'",
                [],
            )
            .expect("change active base");

        let mut retry_manifest = manifest.clone();
        retry_manifest.attempt = 2;
        retry_manifest.dispatch_id = "dispatch-retry-stale-next".to_string();
        retry_manifest.created_at = now_iso();
        let retry_state = draft(&retry_manifest);
        assert!(db
            .create_next_document_operation_attempt(
                &retry_manifest,
                &retry_state,
                "retry-key-stale-base",
                false,
            )
            .expect_err("stale base must reject retry")
            .to_string()
            .contains("base version is stale"));
        let operation = db
            .get_document_operation(&manifest.operation_id)
            .expect("load operation")
            .expect("operation exists");
        assert_eq!(operation.current_attempt, 1);
        assert_eq!(operation.status, DocumentOperationStatus::Failed);
    }

    #[test]
    fn candidate_commit_uses_base_version_compare_and_swap() {
        let db = test_db("commit");
        let manifest = manifest("op-commit", "dispatch-commit");
        let mut state = draft(&manifest);
        db.create_document_operation(&manifest, &state, None)
            .expect("create operation");
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::AwaitingConfirmation,
            "confirmation_requested",
        );
        state.dispatch_intent_at = Some(now_iso());
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::Queued,
            "dispatch_intent",
        );
        state.dispatch_receipt = Some(DocumentOperationDispatchReceipt {
            dispatch_id: manifest.dispatch_id.clone(),
            run_id: "run-commit".to_string(),
            executor_profile_digest: digest('d'),
            accepted_at: now_iso(),
        });
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::Running,
            "dispatch_receipt",
        );
        state.terminal_receipt_at = Some(now_iso());
        transition(
            &db,
            &mut state,
            DocumentOperationStatus::Validating,
            "execution_succeeded",
        );
        state.candidate_pdf_sha256 = Some(digest('e'));
        state.status = DocumentOperationStatus::ResultReady;
        state.updated_at = now_iso();
        db.publish_document_candidate(
            &DocumentVersionRecord {
                version_id: "version-a".to_string(),
                document_id: "document-a".to_string(),
                base_version_id: None,
                operation_id: manifest.operation_id.clone(),
                source_job_id: "job-result".to_string(),
                artifact_key: "candidate_pdf".to_string(),
                content_sha256: digest('e'),
                status: "candidate".to_string(),
                created_at: now_iso(),
                committed_at: None,
            },
            &state,
        )
        .expect("publish candidate");

        state.status = DocumentOperationStatus::Committed;
        state.updated_at = now_iso();
        let conn = db.connect().expect("connect database");
        conn.execute(
            "UPDATE documents SET active_version_id = 'external-version' WHERE document_id = 'document-a'",
            [],
        )
        .expect("simulate concurrent version commit");
        drop(conn);
        assert_eq!(
            db.commit_document_candidate(&state)
                .expect("detect stale candidate"),
            CommitDocumentCandidateResult::StaleBase
        );
        assert_eq!(
            db.get_document_operation("op-commit")
                .expect("load stale operation")
                .expect("stale operation exists")
                .status,
            DocumentOperationStatus::ResultReady
        );
        let conn = db.connect().expect("connect database");
        conn.execute(
            "UPDATE documents SET active_version_id = NULL WHERE document_id = 'document-a'",
            [],
        )
        .expect("restore expected base version");
        drop(conn);
        assert_eq!(
            db.commit_document_candidate(&state)
                .expect("commit candidate"),
            CommitDocumentCandidateResult::Committed
        );
        let conn = db.connect().expect("connect database");
        let active_version: Option<String> = conn
            .query_row(
                "SELECT active_version_id FROM documents WHERE document_id = 'document-a'",
                [],
                |row| row.get(0),
            )
            .expect("active version");
        assert_eq!(active_version.as_deref(), Some("version-a"));
    }

    #[test]
    fn duplicate_dispatch_identity_is_rejected() {
        let db = test_db("duplicate-dispatch");
        let first = manifest("op-first", "dispatch-shared");
        db.create_document_operation(&first, &draft(&first), None)
            .expect("create first operation");
        let second = manifest("op-second", "dispatch-shared");
        assert!(db
            .create_document_operation(&second, &draft(&second), None)
            .is_err());
    }
}

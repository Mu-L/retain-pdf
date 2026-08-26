use anyhow::{anyhow, bail, Context, Result};
use rusqlite::{params, OptionalExtension, Transaction, TransactionBehavior};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use crate::models::domain::{now_iso, JobSnapshot};

use super::job_writes::{persist_prepared_job, prepare_job_write};
use super::Db;

const ATTEMPT_RUNNING: &str = "running";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PipelineAttemptCursor {
    pub job_id: String,
    pub attempt: u32,
    pub generation: u64,
    pub worker_id: String,
    pub stage_key: String,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PipelineCheckpoint {
    pub job_id: String,
    pub attempt: u32,
    pub generation: u64,
    pub stage_key: String,
    pub last_committed_unit_key: Option<String>,
    pub last_committed_unit_order: Option<u64>,
    pub last_page_hash: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PipelineUnitCommit {
    pub unit_key: String,
    pub unit_order: u64,
    pub page_index: Option<u32>,
    pub page_hash: String,
    pub producer_generation: Option<u64>,
    #[serde(default)]
    pub payload: Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PipelineUnitRecord {
    pub unit_key: String,
    pub unit_order: u64,
    pub generation: u64,
    pub producer_generation: Option<u64>,
    pub page_index: Option<u32>,
    pub page_hash: String,
    pub payload: Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PipelineStageObservation {
    pub producer_seq: u64,
    pub producer_ts: String,
    pub event_type: String,
    pub raw_stage: String,
    pub substage: Option<String>,
    pub stage_detail: Option<String>,
    pub message: String,
    pub provider: Option<String>,
    pub provider_stage: Option<String>,
    pub progress_current: Option<i64>,
    pub progress_total: Option<i64>,
    pub progress_unit: Option<String>,
    #[serde(default)]
    pub payload: Value,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PipelineStageState {
    pub job_id: String,
    pub attempt: u32,
    pub stage_key: String,
    pub generation: u64,
    pub status: String,
    pub raw_stage: Option<String>,
    pub substage: Option<String>,
    pub stage_detail: Option<String>,
    pub progress_current: Option<i64>,
    pub progress_total: Option<i64>,
    pub progress_unit: Option<String>,
    pub producer_seq: Option<u64>,
    pub payload: Value,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct PipelineDispatchIntent {
    pub dispatch_key: String,
    pub provider: String,
    pub operation: String,
    pub request_hash: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct PipelineDispatchRecord {
    pub job_id: String,
    pub attempt: u32,
    pub stage_key: String,
    pub dispatch_key: String,
    pub generation: u64,
    pub provider: String,
    pub operation: String,
    pub request_hash: String,
    pub status: String,
    pub receipt: Option<Value>,
    pub ambiguity_reason: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum PipelineDispatchBegin {
    Send {
        cursor: PipelineAttemptCursor,
    },
    Resume {
        cursor: PipelineAttemptCursor,
        receipt: Value,
    },
    Ambiguous {
        cursor: PipelineAttemptCursor,
        reason: String,
    },
}

impl Db {
    pub fn has_pipeline_attempt(&self, job_id: &str) -> Result<bool> {
        let conn = self.connect()?;
        let exists = conn
            .query_row(
                "SELECT 1 FROM pipeline_attempts WHERE job_id = ?1 LIMIT 1",
                params![job_id],
                |_| Ok(()),
            )
            .optional()?
            .is_some();
        Ok(exists)
    }

    pub fn has_running_pipeline_attempt(&self, job_id: &str) -> Result<bool> {
        let conn = self.connect()?;
        let exists = conn
            .query_row(
                r#"
                SELECT 1 FROM pipeline_attempts
                WHERE job_id = ?1 AND status = 'running'
                ORDER BY attempt DESC LIMIT 1
                "#,
                params![job_id],
                |_| Ok(()),
            )
            .optional()?
            .is_some();
        Ok(exists)
    }

    pub fn running_pipeline_stage_key(&self, job_id: &str) -> Result<Option<String>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT current_stage FROM pipeline_attempts
            WHERE job_id = ?1 AND status = 'running'
            ORDER BY attempt DESC LIMIT 1
            "#,
            params![job_id],
            |row| row.get::<_, Option<String>>(0),
        )
        .optional()
        .map(|value| value.flatten())
        .map_err(Into::into)
    }

    pub fn list_resumable_pipeline_job_ids(&self) -> Result<Vec<String>> {
        let conn = self.connect()?;
        let queued = serde_json::to_string(&crate::models::domain::JobStatusKind::Queued)?;
        let mut stmt = conn.prepare(
            r#"
            SELECT DISTINCT jobs.job_id
            FROM jobs
            JOIN pipeline_attempts ON pipeline_attempts.job_id = jobs.job_id
            WHERE jobs.status_json = ?1 AND pipeline_attempts.status = 'running'
            ORDER BY jobs.updated_at, jobs.job_id
            "#,
        )?;
        let rows = stmt.query_map(params![queued], |row| row.get::<_, String>(0))?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(Into::into)
    }

    pub fn running_pipeline_stage_state(&self, job_id: &str) -> Result<Option<PipelineStageState>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT a.attempt, a.current_stage, s.generation, s.status,
                   s.raw_stage, s.substage, s.stage_detail,
                   s.progress_current, s.progress_total, s.progress_unit,
                   s.producer_seq, s.observation_payload_json
            FROM pipeline_attempts a
            JOIN pipeline_stages s
              ON s.job_id = a.job_id AND s.attempt = a.attempt
             AND s.stage_key = a.current_stage
            WHERE a.job_id = ?1 AND a.status = 'running'
            ORDER BY a.attempt DESC LIMIT 1
            "#,
            params![job_id],
            |row| {
                let payload_json: String = row.get(11)?;
                Ok(PipelineStageState {
                    job_id: job_id.to_string(),
                    attempt: row.get::<_, i64>(0)? as u32,
                    stage_key: row.get(1)?,
                    generation: row.get::<_, i64>(2)? as u64,
                    status: row.get(3)?,
                    raw_stage: row.get(4)?,
                    substage: row.get(5)?,
                    stage_detail: row.get(6)?,
                    progress_current: row.get(7)?,
                    progress_total: row.get(8)?,
                    progress_unit: row.get(9)?,
                    producer_seq: row.get::<_, Option<i64>>(10)?.map(|value| value as u64),
                    payload: serde_json::from_str(&payload_json).unwrap_or(Value::Null),
                })
            },
        )
        .optional()
        .map_err(Into::into)
    }

    /// Claims the latest active attempt, or creates the next attempt after a
    /// terminal one. Claiming advances `generation`, fencing any previous
    /// worker that still has stdout to publish.
    pub fn acquire_pipeline_attempt(
        &self,
        job_id: &str,
        worker_id: &str,
        stage_key: &str,
        stage_order: u32,
    ) -> Result<PipelineAttemptCursor> {
        validate_identity("job_id", job_id)?;
        validate_identity("worker_id", worker_id)?;
        validate_identity("stage_key", stage_key)?;
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        let latest = tx
            .query_row(
                r#"
                SELECT attempt, generation, status, current_stage
                FROM pipeline_attempts
                WHERE job_id = ?1
                ORDER BY attempt DESC
                LIMIT 1
                "#,
                params![job_id],
                |row| {
                    Ok((
                        row.get::<_, i64>(0)?,
                        row.get::<_, i64>(1)?,
                        row.get::<_, String>(2)?,
                        row.get::<_, Option<String>>(3)?,
                    ))
                },
            )
            .optional()?;
        let timestamp = now_iso();
        let (attempt, generation, event, effective_stage_key, effective_stage_order) = match latest
        {
            Some((attempt, generation, status, current_stage)) if status == ATTEMPT_RUNNING => {
                let effective_stage_key = current_stage
                    .filter(|value| !value.trim().is_empty())
                    .unwrap_or_else(|| stage_key.to_string());
                let effective_stage_order = tx
                    .query_row(
                        r#"
                        SELECT stage_order FROM pipeline_stages
                        WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
                        "#,
                        params![job_id, attempt, effective_stage_key],
                        |row| row.get::<_, i64>(0),
                    )
                    .optional()?
                    .map(|value| value as u32)
                    .unwrap_or(stage_order);
                let next_generation = generation + 1;
                let changed = tx.execute(
                    r#"
                    UPDATE pipeline_attempts
                    SET generation = ?1, worker_id = ?2, current_stage = ?3, updated_at = ?4
                    WHERE job_id = ?5 AND attempt = ?6 AND generation = ?7 AND status = 'running'
                    "#,
                    params![
                        next_generation,
                        worker_id,
                        effective_stage_key,
                        timestamp,
                        job_id,
                        attempt,
                        generation
                    ],
                )?;
                if changed != 1 {
                    bail!("pipeline attempt claim raced for job {job_id}");
                }
                (
                    attempt,
                    next_generation,
                    "pipeline_attempt_resumed",
                    effective_stage_key,
                    effective_stage_order,
                )
            }
            Some((attempt, _, _, _)) => {
                let next_attempt = attempt + 1;
                tx.execute(
                    r#"
                    INSERT INTO pipeline_attempts (
                        job_id, attempt, generation, status, worker_id, current_stage,
                        created_at, updated_at
                    ) VALUES (?1, ?2, 1, 'running', ?3, ?4, ?5, ?5)
                    "#,
                    params![job_id, next_attempt, worker_id, stage_key, timestamp],
                )?;
                (
                    next_attempt,
                    1,
                    "pipeline_attempt_started",
                    stage_key.to_string(),
                    stage_order,
                )
            }
            None => {
                tx.execute(
                    r#"
                    INSERT INTO pipeline_attempts (
                        job_id, attempt, generation, status, worker_id, current_stage,
                        created_at, updated_at
                    ) VALUES (?1, 1, 1, 'running', ?2, ?3, ?4, ?4)
                    "#,
                    params![job_id, worker_id, stage_key, timestamp],
                )?;
                (
                    1,
                    1,
                    "pipeline_attempt_started",
                    stage_key.to_string(),
                    stage_order,
                )
            }
        };
        tx.execute(
            r#"
            INSERT INTO pipeline_stages (
                job_id, attempt, stage_key, stage_order, generation, status,
                created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, 'running', ?6, ?6)
            ON CONFLICT(job_id, attempt, stage_key) DO UPDATE SET
                generation = excluded.generation,
                status = 'running',
                updated_at = excluded.updated_at,
                finished_at = NULL
            "#,
            params![
                job_id,
                attempt,
                effective_stage_key,
                effective_stage_order,
                generation,
                timestamp
            ],
        )?;
        append_state_event(
            &tx,
            job_id,
            &effective_stage_key,
            event,
            &format!("pipeline attempt {attempt} claimed by {worker_id}"),
            json!({
                "attempt": attempt,
                "generation": generation,
                "worker_id": worker_id,
                "stage": effective_stage_key,
                "stage_order": effective_stage_order,
            }),
        )?;
        tx.commit()?;
        Ok(PipelineAttemptCursor {
            job_id: job_id.to_string(),
            attempt: attempt as u32,
            generation: generation as u64,
            worker_id: worker_id.to_string(),
            stage_key: effective_stage_key,
        })
    }

    /// Atomically commits one durable unit and advances the attempt fencing
    /// generation. The event row is inserted in the same transaction and is
    /// therefore a projection of committed state, never of raw stdout.
    pub fn commit_pipeline_unit(
        &self,
        cursor: &PipelineAttemptCursor,
        unit: &PipelineUnitCommit,
    ) -> Result<PipelineCheckpoint> {
        validate_identity("unit_key", &unit.unit_key)?;
        validate_page_hash(&unit.page_hash)?;
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        assert_cursor(&tx, cursor)?;
        let previous = stage_checkpoint(&tx, cursor)?;
        let latest_producer_generation = tx.query_row(
            r#"
            SELECT MAX(producer_generation)
            FROM pipeline_units
            WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
            "#,
            params![cursor.job_id, cursor.attempt, cursor.stage_key],
            |row| row.get::<_, Option<i64>>(0),
        )?;
        if let (Some(incoming), Some(latest)) = (
            unit.producer_generation,
            latest_producer_generation.map(|v| v as u64),
        ) {
            if incoming < latest {
                bail!(
                    "producer checkpoint generation regressed for job {}: {} < {}",
                    cursor.job_id,
                    incoming,
                    latest
                );
            }
            if incoming == latest {
                let duplicate = tx
                    .query_row(
                        r#"
                        SELECT 1 FROM pipeline_units
                        WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
                          AND unit_key = ?4 AND page_hash = ?5
                          AND producer_generation = ?6
                        "#,
                        params![
                            cursor.job_id,
                            cursor.attempt,
                            cursor.stage_key,
                            unit.unit_key,
                            unit.page_hash,
                            incoming,
                        ],
                        |_| Ok(()),
                    )
                    .optional()?
                    .is_some();
                if duplicate {
                    return Ok(previous);
                }
                bail!(
                    "producer checkpoint generation {} conflicts for job {}",
                    incoming,
                    cursor.job_id
                );
            }
        }
        if let Some(previous_order) = previous.last_committed_unit_order {
            if unit.unit_order < previous_order {
                bail!(
                    "pipeline unit order regressed for job {} stage {}: {} < {}",
                    cursor.job_id,
                    cursor.stage_key,
                    unit.unit_order,
                    previous_order
                );
            }
            if unit.unit_order == previous_order
                && previous.last_committed_unit_key.as_deref() != Some(unit.unit_key.as_str())
            {
                bail!(
                    "pipeline unit order {} already belongs to a different unit for job {}",
                    unit.unit_order,
                    cursor.job_id
                );
            }
        }
        let next_generation = cursor.generation + 1;
        let timestamp = now_iso();
        let payload_json = serde_json::to_string(&unit.payload)?;
        tx.execute(
            r#"
            INSERT INTO pipeline_units (
                job_id, attempt, stage_key, unit_key, unit_order, generation,
                producer_generation, status, page_index, page_hash, payload_json,
                committed_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'committed', ?8, ?9, ?10, ?11, ?11)
            ON CONFLICT(job_id, attempt, stage_key, unit_key) DO UPDATE SET
                generation = excluded.generation,
                producer_generation = excluded.producer_generation,
                status = 'committed',
                page_index = excluded.page_index,
                page_hash = excluded.page_hash,
                payload_json = excluded.payload_json,
                updated_at = excluded.updated_at
            "#,
            params![
                cursor.job_id,
                cursor.attempt,
                cursor.stage_key,
                unit.unit_key,
                unit.unit_order,
                next_generation,
                unit.producer_generation,
                unit.page_index,
                unit.page_hash,
                payload_json,
                timestamp,
            ],
        )?;
        let changed = tx.execute(
            r#"
            UPDATE pipeline_attempts
            SET generation = ?1, current_stage = ?2, updated_at = ?3
            WHERE job_id = ?4 AND attempt = ?5 AND generation = ?6
              AND worker_id = ?7 AND status = 'running'
            "#,
            params![
                next_generation,
                cursor.stage_key,
                timestamp,
                cursor.job_id,
                cursor.attempt,
                cursor.generation,
                cursor.worker_id,
            ],
        )?;
        if changed != 1 {
            bail!("stale pipeline generation while committing unit");
        }
        tx.execute(
            r#"
            UPDATE pipeline_stages
            SET generation = ?1, status = 'running', last_committed_unit_key = ?2,
                last_committed_unit_order = ?3, last_page_hash = ?4, updated_at = ?5
            WHERE job_id = ?6 AND attempt = ?7 AND stage_key = ?8
            "#,
            params![
                next_generation,
                unit.unit_key,
                unit.unit_order,
                unit.page_hash,
                timestamp,
                cursor.job_id,
                cursor.attempt,
                cursor.stage_key,
            ],
        )?;
        append_state_event(
            &tx,
            &cursor.job_id,
            &cursor.stage_key,
            "pipeline_unit_committed",
            &format!("committed pipeline unit {}", unit.unit_key),
            json!({
                "attempt": cursor.attempt,
                "generation": next_generation,
                "stage": cursor.stage_key,
                "unit_key": unit.unit_key,
                "unit_order": unit.unit_order,
                "page_index": unit.page_index,
                "page_hash": unit.page_hash,
                "producer_generation": unit.producer_generation,
            }),
        )?;
        tx.commit()?;
        Ok(PipelineCheckpoint {
            job_id: cursor.job_id.clone(),
            attempt: cursor.attempt,
            generation: next_generation,
            stage_key: cursor.stage_key.clone(),
            last_committed_unit_key: Some(unit.unit_key.clone()),
            last_committed_unit_order: Some(unit.unit_order),
            last_page_hash: Some(unit.page_hash.clone()),
        })
    }

    /// Commits the latest worker stage observation under the attempt fencing
    /// token, then derives the public progress event in the same transaction.
    /// `activate_stage=false` records a background lane (currently render
    /// prewarm) without completing or replacing the attempt's main stage.
    pub fn observe_pipeline_stage(
        &self,
        cursor: &PipelineAttemptCursor,
        stage_key: &str,
        stage_order: u32,
        activate_stage: bool,
        observation: &PipelineStageObservation,
    ) -> Result<PipelineAttemptCursor> {
        validate_identity("stage_key", stage_key)?;
        validate_identity("raw_stage", &observation.raw_stage)?;
        if !matches!(
            observation.event_type.as_str(),
            "stage_transition" | "stage_progress"
        ) {
            bail!(
                "unsupported pipeline stage observation event: {}",
                observation.event_type
            );
        }
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        assert_cursor(&tx, cursor)?;
        if activate_stage && cursor.stage_key != stage_key {
            let current_order = tx
                .query_row(
                    r#"
                    SELECT stage_order FROM pipeline_stages
                    WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
                    "#,
                    params![cursor.job_id, cursor.attempt, cursor.stage_key],
                    |row| row.get::<_, i64>(0),
                )
                .optional()?
                .map(|value| value as u32)
                .unwrap_or(0);
            if stage_order < current_order {
                bail!(
                    "pipeline stage order regressed for job {}: {}({}) -> {}({})",
                    cursor.job_id,
                    cursor.stage_key,
                    current_order,
                    stage_key,
                    stage_order
                );
            }
        }

        let existing = tx
            .query_row(
                r#"
                SELECT producer_seq, raw_stage, substage, stage_detail,
                       progress_current, progress_total, progress_unit,
                       observation_payload_json
                FROM pipeline_stages
                WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
                "#,
                params![cursor.job_id, cursor.attempt, stage_key],
                |row| {
                    Ok((
                        row.get::<_, Option<i64>>(0)?,
                        row.get::<_, Option<String>>(1)?,
                        row.get::<_, Option<String>>(2)?,
                        row.get::<_, Option<String>>(3)?,
                        row.get::<_, Option<i64>>(4)?,
                        row.get::<_, Option<i64>>(5)?,
                        row.get::<_, Option<String>>(6)?,
                        row.get::<_, String>(7)?,
                    ))
                },
            )
            .optional()?;
        if let Some((Some(previous_seq), ..)) = existing.as_ref() {
            if observation.producer_seq <= *previous_seq as u64 {
                bail!(
                    "pipeline stage observation sequence regressed for job {} stage {}: {} <= {}",
                    cursor.job_id,
                    stage_key,
                    observation.producer_seq,
                    previous_seq
                );
            }
        }
        let mut accepted_observation = observation.clone();
        if let Some((
            _,
            _,
            previous_substage,
            _,
            previous_current,
            previous_total,
            previous_unit,
            _,
        )) = existing.as_ref()
        {
            let same_progress_lane = previous_substage.as_deref()
                == accepted_observation.substage.as_deref()
                && previous_total == &accepted_observation.progress_total
                && previous_unit.as_deref() == accepted_observation.progress_unit.as_deref();
            if same_progress_lane {
                if let (Some(previous), Some(incoming)) =
                    (*previous_current, accepted_observation.progress_current)
                {
                    accepted_observation.progress_current = Some(previous.max(incoming));
                }
            }
        }

        let next_generation = cursor.generation + 1;
        let timestamp = now_iso();
        if activate_stage && cursor.stage_key != stage_key {
            tx.execute(
                r#"
                UPDATE pipeline_stages
                SET generation = ?1, status = 'completed', updated_at = ?2,
                    finished_at = COALESCE(finished_at, ?2)
                WHERE job_id = ?3 AND attempt = ?4 AND stage_key = ?5
                  AND status = 'running'
                "#,
                params![
                    next_generation,
                    timestamp,
                    cursor.job_id,
                    cursor.attempt,
                    cursor.stage_key,
                ],
            )?;
        }
        let payload_json = serde_json::to_string(&accepted_observation.payload)?;
        tx.execute(
            r#"
            INSERT INTO pipeline_stages (
                job_id, attempt, stage_key, stage_order, generation, status,
                raw_stage, substage, stage_detail, progress_current,
                progress_total, progress_unit, producer_seq,
                observation_payload_json, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, 'running', ?6, ?7, ?8, ?9,
                      ?10, ?11, ?12, ?13, ?14, ?14)
            ON CONFLICT(job_id, attempt, stage_key) DO UPDATE SET
                stage_order = excluded.stage_order,
                generation = excluded.generation,
                status = 'running',
                raw_stage = excluded.raw_stage,
                substage = excluded.substage,
                stage_detail = excluded.stage_detail,
                progress_current = excluded.progress_current,
                progress_total = excluded.progress_total,
                progress_unit = excluded.progress_unit,
                producer_seq = excluded.producer_seq,
                observation_payload_json = excluded.observation_payload_json,
                updated_at = excluded.updated_at,
                finished_at = NULL
            "#,
            params![
                cursor.job_id,
                cursor.attempt,
                stage_key,
                stage_order,
                next_generation,
                accepted_observation.raw_stage,
                accepted_observation.substage,
                accepted_observation.stage_detail,
                accepted_observation.progress_current,
                accepted_observation.progress_total,
                accepted_observation.progress_unit,
                accepted_observation.producer_seq,
                payload_json,
                timestamp,
            ],
        )?;
        let current_stage = if activate_stage {
            stage_key
        } else {
            cursor.stage_key.as_str()
        };
        let changed = tx.execute(
            r#"
            UPDATE pipeline_attempts
            SET generation = ?1, current_stage = ?2, updated_at = ?3
            WHERE job_id = ?4 AND attempt = ?5 AND generation = ?6
              AND worker_id = ?7 AND status = 'running'
            "#,
            params![
                next_generation,
                current_stage,
                timestamp,
                cursor.job_id,
                cursor.attempt,
                cursor.generation,
                cursor.worker_id,
            ],
        )?;
        if changed != 1 {
            bail!("stale pipeline generation while observing stage");
        }
        append_stage_observation_event(
            &tx,
            cursor,
            next_generation,
            stage_key,
            activate_stage,
            &accepted_observation,
        )?;
        tx.commit()?;
        Ok(PipelineAttemptCursor {
            job_id: cursor.job_id.clone(),
            attempt: cursor.attempt,
            generation: next_generation,
            worker_id: cursor.worker_id.clone(),
            stage_key: current_stage.to_string(),
        })
    }

    /// Persists an external dispatch intent before the request is sent.
    /// A prior receipt is replay-safe; a prior bare intent is not.
    pub fn begin_pipeline_dispatch(
        &self,
        cursor: &PipelineAttemptCursor,
        intent: &PipelineDispatchIntent,
    ) -> Result<PipelineDispatchBegin> {
        validate_identity("dispatch_key", &intent.dispatch_key)?;
        validate_identity("provider", &intent.provider)?;
        validate_identity("operation", &intent.operation)?;
        validate_page_hash(&intent.request_hash)?;
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        assert_cursor(&tx, cursor)?;
        let existing = dispatch_record(&tx, cursor, &intent.dispatch_key)?;
        if let Some(existing) = existing {
            if existing.request_hash != intent.request_hash
                || existing.provider != intent.provider
                || existing.operation != intent.operation
            {
                bail!(
                    "pipeline dispatch identity changed for job {} key {}",
                    cursor.job_id,
                    intent.dispatch_key
                );
            }
            if existing.status == "receipted" {
                let receipt = existing.receipt.ok_or_else(|| {
                    anyhow!(
                        "receipted pipeline dispatch is missing receipt for job {} key {}",
                        cursor.job_id,
                        intent.dispatch_key
                    )
                })?;
                return Ok(PipelineDispatchBegin::Resume {
                    cursor: cursor.clone(),
                    receipt,
                });
            }
            if existing.status == "ambiguous" {
                return Ok(PipelineDispatchBegin::Ambiguous {
                    cursor: cursor.clone(),
                    reason: existing
                        .ambiguity_reason
                        .unwrap_or_else(|| "dispatch intent has no durable receipt".to_string()),
                });
            }
            let reason =
                "runtime recovered an OCR dispatch intent without a provider receipt".to_string();
            let next = transition_dispatch_status(
                &tx,
                cursor,
                &intent.dispatch_key,
                "ambiguous",
                None,
                Some(&reason),
                "pipeline_dispatch_ambiguous",
            )?;
            tx.commit()?;
            return Ok(PipelineDispatchBegin::Ambiguous {
                cursor: next,
                reason,
            });
        }

        let timestamp = now_iso();
        let next_generation = cursor.generation + 1;
        tx.execute(
            r#"
            INSERT INTO pipeline_dispatches (
                job_id, attempt, stage_key, dispatch_key, generation, provider,
                operation, request_hash, status, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'intent', ?9, ?9)
            "#,
            params![
                cursor.job_id,
                cursor.attempt,
                cursor.stage_key,
                intent.dispatch_key,
                next_generation,
                intent.provider,
                intent.operation,
                intent.request_hash,
                timestamp,
            ],
        )?;
        advance_pipeline_generation(&tx, cursor, next_generation, &timestamp)?;
        append_state_event(
            &tx,
            &cursor.job_id,
            &cursor.stage_key,
            "pipeline_dispatch_intent",
            &format!("prepared external dispatch {}", intent.dispatch_key),
            json!({
                "attempt": cursor.attempt,
                "generation": next_generation,
                "stage": cursor.stage_key,
                "dispatch_key": intent.dispatch_key,
                "provider": intent.provider,
                "operation": intent.operation,
                "request_hash": intent.request_hash,
            }),
        )?;
        tx.commit()?;
        Ok(PipelineDispatchBegin::Send {
            cursor: PipelineAttemptCursor {
                generation: next_generation,
                ..cursor.clone()
            },
        })
    }

    pub fn receipt_pipeline_dispatch(
        &self,
        cursor: &PipelineAttemptCursor,
        dispatch_key: &str,
        receipt: &Value,
    ) -> Result<PipelineAttemptCursor> {
        validate_identity("dispatch_key", dispatch_key)?;
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        assert_cursor(&tx, cursor)?;
        let existing = dispatch_record(&tx, cursor, dispatch_key)?
            .ok_or_else(|| anyhow!("pipeline dispatch intent not found: {dispatch_key}"))?;
        if existing.status == "receipted" {
            if existing.receipt.as_ref() == Some(receipt) {
                return Ok(cursor.clone());
            }
            bail!("pipeline dispatch receipt conflicts for key {dispatch_key}");
        }
        if existing.status != "intent" {
            bail!(
                "pipeline dispatch {dispatch_key} cannot receive receipt from status {}",
                existing.status
            );
        }
        let next = transition_dispatch_status(
            &tx,
            cursor,
            dispatch_key,
            "receipted",
            Some(receipt),
            None,
            "pipeline_dispatch_receipted",
        )?;
        tx.commit()?;
        Ok(next)
    }

    pub fn mark_pipeline_dispatch_ambiguous(
        &self,
        cursor: &PipelineAttemptCursor,
        dispatch_key: &str,
        reason: &str,
    ) -> Result<PipelineAttemptCursor> {
        validate_identity("dispatch_key", dispatch_key)?;
        validate_identity("ambiguity_reason", reason)?;
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        assert_cursor(&tx, cursor)?;
        let existing = dispatch_record(&tx, cursor, dispatch_key)?
            .ok_or_else(|| anyhow!("pipeline dispatch intent not found: {dispatch_key}"))?;
        if existing.status == "ambiguous" {
            return Ok(cursor.clone());
        }
        if existing.status != "intent" {
            bail!(
                "pipeline dispatch {dispatch_key} cannot become ambiguous from status {}",
                existing.status
            );
        }
        let next = transition_dispatch_status(
            &tx,
            cursor,
            dispatch_key,
            "ambiguous",
            None,
            Some(reason),
            "pipeline_dispatch_ambiguous",
        )?;
        tx.commit()?;
        Ok(next)
    }

    pub fn complete_pipeline_stage(
        &self,
        cursor: &PipelineAttemptCursor,
    ) -> Result<PipelineCheckpoint> {
        transition_stage(self, cursor, "completed", "pipeline_stage_completed")
    }

    /// Finalizes the active attempt after the job-row CAS has accepted the
    /// terminal result. This coordinator action also closes any still-running
    /// stages, which covers stages whose workers do not yet emit unit commits.
    pub fn finish_latest_pipeline_attempt(&self, job_id: &str, status: &str) -> Result<bool> {
        if !matches!(status, "succeeded" | "failed" | "canceled") {
            bail!("invalid terminal pipeline attempt status: {status}");
        }
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        let current = tx
            .query_row(
                r#"
                SELECT attempt, generation, current_stage
                FROM pipeline_attempts
                WHERE job_id = ?1 AND status = 'running'
                ORDER BY attempt DESC LIMIT 1
                "#,
                params![job_id],
                |row| {
                    Ok((
                        row.get::<_, i64>(0)?,
                        row.get::<_, i64>(1)?,
                        row.get::<_, Option<String>>(2)?,
                    ))
                },
            )
            .optional()?;
        let Some((attempt, generation, current_stage)) = current else {
            return Ok(false);
        };
        let timestamp = now_iso();
        let next_generation = generation + 1;
        tx.execute(
            r#"
            UPDATE pipeline_attempts
            SET generation = ?1, status = ?2, updated_at = ?3, finished_at = ?3
            WHERE job_id = ?4 AND attempt = ?5 AND generation = ?6 AND status = 'running'
            "#,
            params![
                next_generation,
                status,
                timestamp,
                job_id,
                attempt,
                generation
            ],
        )?;
        let stage_status = if status == "succeeded" {
            "completed"
        } else {
            status
        };
        tx.execute(
            r#"
            UPDATE pipeline_stages
            SET generation = ?1, status = ?2, updated_at = ?3, finished_at = ?3
            WHERE job_id = ?4 AND attempt = ?5 AND status = 'running'
            "#,
            params![next_generation, stage_status, timestamp, job_id, attempt],
        )?;
        let stage = current_stage.unwrap_or_else(|| "pipeline".to_string());
        append_state_event(
            &tx,
            job_id,
            &stage,
            "pipeline_attempt_terminal",
            &format!("pipeline attempt {attempt} {status}"),
            json!({
                "attempt": attempt,
                "generation": next_generation,
                "status": status,
                "stage": stage,
            }),
        )?;
        tx.commit()?;
        Ok(true)
    }

    pub fn pipeline_checkpoint(
        &self,
        job_id: &str,
        attempt: u32,
        stage_key: &str,
    ) -> Result<Option<PipelineCheckpoint>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT a.generation, s.last_committed_unit_key,
                   s.last_committed_unit_order, s.last_page_hash
            FROM pipeline_attempts a
            JOIN pipeline_stages s ON s.job_id = a.job_id AND s.attempt = a.attempt
            WHERE a.job_id = ?1 AND a.attempt = ?2 AND s.stage_key = ?3
            "#,
            params![job_id, attempt, stage_key],
            |row| {
                Ok(PipelineCheckpoint {
                    job_id: job_id.to_string(),
                    attempt,
                    generation: row.get::<_, i64>(0)? as u64,
                    stage_key: stage_key.to_string(),
                    last_committed_unit_key: row.get(1)?,
                    last_committed_unit_order: row.get::<_, Option<i64>>(2)?.map(|v| v as u64),
                    last_page_hash: row.get(3)?,
                })
            },
        )
        .optional()
        .map_err(Into::into)
    }

    pub fn list_pipeline_units(
        &self,
        job_id: &str,
        attempt: u32,
        stage_key: &str,
    ) -> Result<Vec<PipelineUnitRecord>> {
        let conn = self.connect()?;
        let mut stmt = conn.prepare(
            r#"
            SELECT unit_key, unit_order, generation, producer_generation,
                   page_index, page_hash, payload_json
            FROM pipeline_units
            WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
            ORDER BY unit_order, unit_key
            "#,
        )?;
        let rows = stmt.query_map(params![job_id, attempt, stage_key], |row| {
            let payload_json: String = row.get(6)?;
            Ok(PipelineUnitRecord {
                unit_key: row.get(0)?,
                unit_order: row.get::<_, i64>(1)? as u64,
                generation: row.get::<_, i64>(2)? as u64,
                producer_generation: row.get::<_, Option<i64>>(3)?.map(|v| v as u64),
                page_index: row.get::<_, Option<i64>>(4)?.map(|v| v as u32),
                page_hash: row.get(5)?,
                payload: serde_json::from_str(&payload_json).unwrap_or(Value::Null),
            })
        })?;
        rows.collect::<std::result::Result<Vec<_>, _>>()
            .map_err(Into::into)
    }

    pub fn pipeline_stage_state(
        &self,
        job_id: &str,
        attempt: u32,
        stage_key: &str,
    ) -> Result<Option<PipelineStageState>> {
        let conn = self.connect()?;
        conn.query_row(
            r#"
            SELECT generation, status, raw_stage, substage, stage_detail,
                   progress_current, progress_total, progress_unit,
                   producer_seq, observation_payload_json
            FROM pipeline_stages
            WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
            "#,
            params![job_id, attempt, stage_key],
            |row| {
                let payload_json: String = row.get(9)?;
                Ok(PipelineStageState {
                    job_id: job_id.to_string(),
                    attempt,
                    stage_key: stage_key.to_string(),
                    generation: row.get::<_, i64>(0)? as u64,
                    status: row.get(1)?,
                    raw_stage: row.get(2)?,
                    substage: row.get(3)?,
                    stage_detail: row.get(4)?,
                    progress_current: row.get(5)?,
                    progress_total: row.get(6)?,
                    progress_unit: row.get(7)?,
                    producer_seq: row.get::<_, Option<i64>>(8)?.map(|value| value as u64),
                    payload: serde_json::from_str(&payload_json).unwrap_or(Value::Null),
                })
            },
        )
        .optional()
        .map_err(Into::into)
    }

    pub fn pipeline_dispatch(
        &self,
        job_id: &str,
        attempt: u32,
        dispatch_key: &str,
    ) -> Result<Option<PipelineDispatchRecord>> {
        let conn = self.connect()?;
        dispatch_record_by_identity(&conn, job_id, attempt, dispatch_key)
    }

    pub fn latest_pipeline_dispatch(
        &self,
        job_id: &str,
        dispatch_key: &str,
    ) -> Result<Option<PipelineDispatchRecord>> {
        validate_identity("dispatch_key", dispatch_key)?;
        let conn = self.connect()?;
        let attempt = conn
            .query_row(
                r#"
                SELECT attempt FROM pipeline_dispatches
                WHERE job_id = ?1 AND dispatch_key = ?2
                ORDER BY attempt DESC LIMIT 1
                "#,
                params![job_id, dispatch_key],
                |row| row.get::<_, i64>(0),
            )
            .optional()?;
        attempt
            .map(|attempt| dispatch_record_by_identity(&conn, job_id, attempt as u32, dispatch_key))
            .transpose()
            .map(Option::flatten)
    }

    /// Atomically resolves one ambiguous source dispatch and creates the
    /// queued recovery job plus its resumable OCR attempt. A bound receipt is
    /// seeded on the new attempt; duplicate-risk recovery leaves dispatch
    /// creation to the worker but still creates the attempt so startup can
    /// resume a crash between this commit and worker launch.
    pub fn create_ocr_recovery_job_state(
        &self,
        source_dispatch: &PipelineDispatchRecord,
        recovery_job: &JobSnapshot,
        resolution: &str,
        bound_receipt: Option<&Value>,
    ) -> Result<bool> {
        validate_identity("resolution", resolution)?;
        let prepared = prepare_job_write(self, recovery_job)?;
        let mut conn = self.connect()?;
        let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
        let timestamp = now_iso();
        let resolution_detail =
            format!("resolved:{resolution}:recovery_job={}", recovery_job.job_id);
        let changed = tx.execute(
            r#"
            UPDATE pipeline_dispatches
            SET status = 'resolved', ambiguity_reason = ?1, updated_at = ?2
            WHERE job_id = ?3 AND attempt = ?4 AND dispatch_key = ?5
              AND stage_key = 'ocr' AND status = 'ambiguous'
              AND provider = ?6 AND operation = ?7 AND request_hash = ?8
            "#,
            params![
                resolution_detail,
                timestamp,
                source_dispatch.job_id,
                source_dispatch.attempt,
                source_dispatch.dispatch_key,
                source_dispatch.provider,
                source_dispatch.operation,
                source_dispatch.request_hash,
            ],
        )?;
        if changed != 1 {
            return Ok(false);
        }

        persist_prepared_job(&tx, prepared)?;
        let worker_id = format!("ocr-recovery-seed:{}", std::process::id());
        tx.execute(
            r#"
            INSERT INTO pipeline_attempts (
                job_id, attempt, generation, status, worker_id, current_stage,
                created_at, updated_at
            ) VALUES (?1, 1, 1, 'running', ?2, 'ocr', ?3, ?3)
            "#,
            params![recovery_job.job_id, worker_id, timestamp],
        )?;
        tx.execute(
            r#"
            INSERT INTO pipeline_stages (
                job_id, attempt, stage_key, stage_order, generation, status,
                created_at, updated_at, observation_payload_json
            ) VALUES (?1, 1, 'ocr', 0, 1, 'running', ?2, ?2, '{}')
            "#,
            params![recovery_job.job_id, timestamp],
        )?;
        let receipt_fields = bound_receipt
            .and_then(Value::as_object)
            .map(|object| object.keys().cloned().collect::<Vec<_>>())
            .unwrap_or_default();
        if let Some(receipt) = bound_receipt {
            tx.execute(
                r#"
                INSERT INTO pipeline_dispatches (
                    job_id, attempt, stage_key, dispatch_key, generation,
                    provider, operation, request_hash, status, receipt_json,
                    created_at, updated_at, receipted_at
                ) VALUES (?1, 1, 'ocr', ?2, 1, ?3, ?4, ?5, 'receipted', ?6, ?7, ?7, ?7)
                "#,
                params![
                    recovery_job.job_id,
                    source_dispatch.dispatch_key,
                    source_dispatch.provider,
                    source_dispatch.operation,
                    source_dispatch.request_hash,
                    serde_json::to_string(receipt)?,
                    timestamp,
                ],
            )?;
        }
        let audit_payload = json!({
            "resolution": resolution,
            "source_job_id": source_dispatch.job_id,
            "recovery_job_id": recovery_job.job_id,
            "provider": source_dispatch.provider,
            "operation": source_dispatch.operation,
            "dispatch_key": source_dispatch.dispatch_key,
            "receipt_present": bound_receipt.is_some(),
            "receipt_fields": receipt_fields,
        });
        append_state_event(
            &tx,
            &source_dispatch.job_id,
            "ocr",
            "ocr_ambiguity_resolved",
            "OCR ambiguous request resolution recorded",
            audit_payload.clone(),
        )?;
        append_state_event(
            &tx,
            &recovery_job.job_id,
            "ocr",
            "ocr_recovery_created",
            "OCR recovery job created from explicit resolution",
            audit_payload,
        )?;
        tx.commit()?;
        Ok(true)
    }
}

fn dispatch_record(
    tx: &Transaction<'_>,
    cursor: &PipelineAttemptCursor,
    dispatch_key: &str,
) -> Result<Option<PipelineDispatchRecord>> {
    dispatch_record_by_identity(tx, &cursor.job_id, cursor.attempt, dispatch_key)
}

fn dispatch_record_by_identity(
    conn: &rusqlite::Connection,
    job_id: &str,
    attempt: u32,
    dispatch_key: &str,
) -> Result<Option<PipelineDispatchRecord>> {
    conn.query_row(
        r#"
        SELECT stage_key, generation, provider, operation, request_hash,
               status, receipt_json, ambiguity_reason
        FROM pipeline_dispatches
        WHERE job_id = ?1 AND attempt = ?2 AND dispatch_key = ?3
        "#,
        params![job_id, attempt, dispatch_key],
        |row| {
            let receipt_json: Option<String> = row.get(6)?;
            Ok(PipelineDispatchRecord {
                job_id: job_id.to_string(),
                attempt,
                stage_key: row.get(0)?,
                dispatch_key: dispatch_key.to_string(),
                generation: row.get::<_, i64>(1)? as u64,
                provider: row.get(2)?,
                operation: row.get(3)?,
                request_hash: row.get(4)?,
                status: row.get(5)?,
                receipt: receipt_json
                    .as_deref()
                    .and_then(|value| serde_json::from_str(value).ok()),
                ambiguity_reason: row.get(7)?,
            })
        },
    )
    .optional()
    .map_err(Into::into)
}

#[allow(clippy::too_many_arguments)]
fn transition_dispatch_status(
    tx: &Transaction<'_>,
    cursor: &PipelineAttemptCursor,
    dispatch_key: &str,
    status: &str,
    receipt: Option<&Value>,
    ambiguity_reason: Option<&str>,
    event: &str,
) -> Result<PipelineAttemptCursor> {
    let next_generation = cursor.generation + 1;
    let timestamp = now_iso();
    let receipt_json = receipt.map(serde_json::to_string).transpose()?;
    tx.execute(
        r#"
        UPDATE pipeline_dispatches
        SET generation = ?1, status = ?2, receipt_json = ?3,
            ambiguity_reason = ?4, updated_at = ?5,
            receipted_at = CASE WHEN ?2 = 'receipted' THEN ?5 ELSE receipted_at END
        WHERE job_id = ?6 AND attempt = ?7 AND dispatch_key = ?8
        "#,
        params![
            next_generation,
            status,
            receipt_json,
            ambiguity_reason,
            timestamp,
            cursor.job_id,
            cursor.attempt,
            dispatch_key,
        ],
    )?;
    advance_pipeline_generation(tx, cursor, next_generation, &timestamp)?;
    let receipt_fields = receipt
        .and_then(Value::as_object)
        .map(|object| object.keys().cloned().collect::<Vec<_>>())
        .unwrap_or_default();
    append_state_event(
        tx,
        &cursor.job_id,
        &cursor.stage_key,
        event,
        &format!("external dispatch {dispatch_key} {status}"),
        json!({
            "attempt": cursor.attempt,
            "generation": next_generation,
            "stage": cursor.stage_key,
            "dispatch_key": dispatch_key,
            "status": status,
            "receipt_present": receipt.is_some(),
            "receipt_fields": receipt_fields,
            "ambiguity_reason": ambiguity_reason,
        }),
    )?;
    Ok(PipelineAttemptCursor {
        generation: next_generation,
        ..cursor.clone()
    })
}

fn advance_pipeline_generation(
    tx: &Transaction<'_>,
    cursor: &PipelineAttemptCursor,
    next_generation: u64,
    timestamp: &str,
) -> Result<()> {
    let changed = tx.execute(
        r#"
        UPDATE pipeline_attempts
        SET generation = ?1, updated_at = ?2
        WHERE job_id = ?3 AND attempt = ?4 AND generation = ?5
          AND worker_id = ?6 AND status = 'running'
        "#,
        params![
            next_generation,
            timestamp,
            cursor.job_id,
            cursor.attempt,
            cursor.generation,
            cursor.worker_id,
        ],
    )?;
    if changed != 1 {
        bail!("stale pipeline generation while updating external dispatch");
    }
    tx.execute(
        r#"
        UPDATE pipeline_stages SET generation = ?1, updated_at = ?2
        WHERE job_id = ?3 AND attempt = ?4 AND stage_key = ?5
        "#,
        params![
            next_generation,
            timestamp,
            cursor.job_id,
            cursor.attempt,
            cursor.stage_key,
        ],
    )?;
    Ok(())
}

fn append_stage_observation_event(
    tx: &Transaction<'_>,
    cursor: &PipelineAttemptCursor,
    generation: u64,
    stage_key: &str,
    activate_stage: bool,
    observation: &PipelineStageObservation,
) -> Result<()> {
    let next_seq: i64 = tx.query_row(
        "SELECT COALESCE(MAX(seq), 0) + 1 FROM events WHERE job_id = ?1",
        params![cursor.job_id],
        |row| row.get(0),
    )?;
    let timestamp = now_iso();
    let payload = json!({
        "raw_source_kind": "pipeline_state",
        "authority": {
            "attempt": cursor.attempt,
            "generation": generation,
            "stage_key": stage_key,
            "producer_seq": observation.producer_seq,
            "producer_ts": observation.producer_ts,
            "lane": if activate_stage { "main" } else { "background" },
        },
        "observation": observation.payload,
    });
    tx.execute(
        r#"
        INSERT INTO events (
            job_id, seq, ts, level, stage, stage_detail, provider,
            provider_stage, event, event_type, progress_current,
            progress_total, payload_json, message
        ) VALUES (?1, ?2, ?3, 'info', ?4, ?5, ?6, ?7, ?8, ?8, ?9,
                  ?10, ?11, ?12)
        "#,
        params![
            cursor.job_id,
            next_seq,
            timestamp,
            observation.raw_stage,
            observation.stage_detail,
            observation.provider,
            observation
                .substage
                .as_ref()
                .or(observation.provider_stage.as_ref()),
            observation.event_type,
            observation.progress_current,
            observation.progress_total,
            serde_json::to_string(&payload)?,
            observation.message,
        ],
    )?;
    Ok(())
}

fn transition_stage(
    db: &Db,
    cursor: &PipelineAttemptCursor,
    status: &str,
    event: &str,
) -> Result<PipelineCheckpoint> {
    let mut conn = db.connect()?;
    let tx = conn.transaction_with_behavior(TransactionBehavior::Immediate)?;
    assert_cursor(&tx, cursor)?;
    let previous = stage_checkpoint(&tx, cursor)?;
    let next_generation = cursor.generation + 1;
    let timestamp = now_iso();
    tx.execute(
        r#"
        UPDATE pipeline_stages
        SET generation = ?1, status = ?2, updated_at = ?3, finished_at = ?3
        WHERE job_id = ?4 AND attempt = ?5 AND stage_key = ?6
        "#,
        params![
            next_generation,
            status,
            timestamp,
            cursor.job_id,
            cursor.attempt,
            cursor.stage_key,
        ],
    )?;
    tx.execute(
        r#"
        UPDATE pipeline_attempts
        SET generation = ?1, updated_at = ?2
        WHERE job_id = ?3 AND attempt = ?4 AND generation = ?5
          AND worker_id = ?6 AND status = 'running'
        "#,
        params![
            next_generation,
            timestamp,
            cursor.job_id,
            cursor.attempt,
            cursor.generation,
            cursor.worker_id,
        ],
    )?;
    append_state_event(
        &tx,
        &cursor.job_id,
        &cursor.stage_key,
        event,
        &format!("pipeline stage {} {status}", cursor.stage_key),
        json!({
            "attempt": cursor.attempt,
            "generation": next_generation,
            "stage": cursor.stage_key,
            "last_committed_unit_key": previous.last_committed_unit_key,
            "last_committed_unit_order": previous.last_committed_unit_order,
            "last_page_hash": previous.last_page_hash,
        }),
    )?;
    tx.commit()?;
    Ok(PipelineCheckpoint {
        generation: next_generation,
        ..previous
    })
}

fn assert_cursor(tx: &Transaction<'_>, cursor: &PipelineAttemptCursor) -> Result<()> {
    let current = tx
        .query_row(
            r#"
            SELECT generation, worker_id, status
            FROM pipeline_attempts
            WHERE job_id = ?1 AND attempt = ?2
            "#,
            params![cursor.job_id, cursor.attempt],
            |row| {
                Ok((
                    row.get::<_, i64>(0)? as u64,
                    row.get::<_, String>(1)?,
                    row.get::<_, String>(2)?,
                ))
            },
        )
        .optional()?
        .ok_or_else(|| anyhow!("pipeline attempt not found for job {}", cursor.job_id))?;
    if current.0 != cursor.generation
        || current.1 != cursor.worker_id
        || current.2 != ATTEMPT_RUNNING
    {
        bail!(
            "stale pipeline cursor for job {}: expected generation {} worker {}, found generation {} worker {} status {}",
            cursor.job_id,
            cursor.generation,
            cursor.worker_id,
            current.0,
            current.1,
            current.2
        );
    }
    Ok(())
}

fn stage_checkpoint(
    tx: &Transaction<'_>,
    cursor: &PipelineAttemptCursor,
) -> Result<PipelineCheckpoint> {
    tx.query_row(
        r#"
        SELECT last_committed_unit_key, last_committed_unit_order, last_page_hash
        FROM pipeline_stages
        WHERE job_id = ?1 AND attempt = ?2 AND stage_key = ?3
        "#,
        params![cursor.job_id, cursor.attempt, cursor.stage_key],
        |row| {
            Ok(PipelineCheckpoint {
                job_id: cursor.job_id.clone(),
                attempt: cursor.attempt,
                generation: cursor.generation,
                stage_key: cursor.stage_key.clone(),
                last_committed_unit_key: row.get(0)?,
                last_committed_unit_order: row.get::<_, Option<i64>>(1)?.map(|v| v as u64),
                last_page_hash: row.get(2)?,
            })
        },
    )
    .with_context(|| {
        format!(
            "pipeline stage {} missing for job {} attempt {}",
            cursor.stage_key, cursor.job_id, cursor.attempt
        )
    })
}

fn append_state_event(
    tx: &Transaction<'_>,
    job_id: &str,
    stage: &str,
    event: &str,
    message: &str,
    payload: Value,
) -> Result<()> {
    let next_seq: i64 = tx.query_row(
        "SELECT COALESCE(MAX(seq), 0) + 1 FROM events WHERE job_id = ?1",
        params![job_id],
        |row| row.get(0),
    )?;
    let timestamp = now_iso();
    tx.execute(
        r#"
        INSERT INTO events (
            job_id, seq, ts, level, stage, stage_detail, event, event_type,
            payload_json, message
        ) VALUES (?1, ?2, ?3, 'info', ?4, ?5, ?6, ?6, ?7, ?8)
        "#,
        params![
            job_id,
            next_seq,
            timestamp,
            stage,
            message,
            event,
            serde_json::to_string(&payload)?,
            message,
        ],
    )?;
    Ok(())
}

fn validate_identity(label: &str, value: &str) -> Result<()> {
    if value.trim().is_empty() {
        bail!("{label} must not be empty");
    }
    Ok(())
}

fn validate_page_hash(value: &str) -> Result<()> {
    if value.len() != 64
        || !value
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        bail!("page_hash must be a lowercase 64-character hexadecimal sha256");
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::sync::{Arc, Barrier};
    use std::thread;

    use super::*;
    use crate::models::domain::JobSnapshot;
    use crate::models::request::CreateJobInput;

    struct Fixture {
        root: std::path::PathBuf,
        db: Db,
    }

    impl Fixture {
        fn new(name: &str) -> Self {
            let root = std::env::temp_dir().join(format!(
                "retain-pipeline-state-{name}-{}-{}",
                std::process::id(),
                fastrand::u64(..)
            ));
            fs::create_dir_all(&root).expect("fixture root");
            let db = Db::new(root.join("jobs.db"), root.clone());
            db.init().expect("init db");
            db.save_job(&JobSnapshot::new(
                "job-1".to_string(),
                CreateJobInput::default(),
                vec!["python".to_string()],
            ))
            .expect("seed job");
            Self { root, db }
        }
    }

    impl Drop for Fixture {
        fn drop(&mut self) {
            let _ = fs::remove_dir_all(&self.root);
        }
    }

    fn unit(order: u64, key: &str, hash_digit: char) -> PipelineUnitCommit {
        PipelineUnitCommit {
            unit_key: key.to_string(),
            unit_order: order,
            page_index: Some(order as u32),
            page_hash: hash_digit.to_string().repeat(64),
            producer_generation: Some(order + 10),
            payload: json!({"phase": "translating"}),
        }
    }

    fn observation(seq: u64, raw_stage: &str, current: i64) -> PipelineStageObservation {
        PipelineStageObservation {
            producer_seq: seq,
            producer_ts: "2026-08-26T00:00:00Z".to_string(),
            event_type: "stage_progress".to_string(),
            raw_stage: raw_stage.to_string(),
            substage: Some(raw_stage.to_string()),
            stage_detail: Some(format!("{raw_stage} {current}/10")),
            message: format!("{raw_stage} {current}/10"),
            provider: None,
            provider_stage: None,
            progress_current: Some(current),
            progress_total: Some(10),
            progress_unit: Some("page".to_string()),
            payload: json!({"source": "worker"}),
        }
    }

    fn dispatch_intent() -> PipelineDispatchIntent {
        PipelineDispatchIntent {
            dispatch_key: "ocr-submit".to_string(),
            provider: "mineru".to_string(),
            operation: "create_extract_task".to_string(),
            request_hash: "a".repeat(64),
        }
    }

    #[test]
    fn crash_after_request_dispatch_does_not_advance_checkpoint() {
        let fixture = Fixture::new("request-before-commit");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        let checkpoint = fixture
            .db
            .pipeline_checkpoint("job-1", cursor.attempt, "translate")
            .expect("checkpoint")
            .expect("stage checkpoint");
        assert_eq!(checkpoint.generation, 1);
        assert_eq!(checkpoint.last_committed_unit_key, None);
        assert!(fixture
            .db
            .list_pipeline_units("job-1", cursor.attempt, "translate")
            .expect("units")
            .is_empty());
    }

    #[test]
    fn page_saved_but_not_committed_resumes_from_last_committed_unit() {
        let fixture = Fixture::new("page-before-checkpoint");
        let mut cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        let checkpoint = fixture
            .db
            .commit_pipeline_unit(&cursor, &unit(1, "page-1:item-1", 'a'))
            .expect("commit one");
        cursor.generation = checkpoint.generation;
        // Simulate a page file becoming visible with no durable commit.
        fs::write(fixture.root.join("page-2.json"), b"new page bytes").expect("page write");
        let resumed = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-b", "translate", 1)
            .expect("restart claim");
        let durable = fixture
            .db
            .pipeline_checkpoint("job-1", resumed.attempt, "translate")
            .expect("checkpoint")
            .expect("checkpoint exists");
        assert_eq!(
            durable.last_committed_unit_key.as_deref(),
            Some("page-1:item-1")
        );
        let first_hash = "a".repeat(64);
        assert_eq!(durable.last_page_hash.as_deref(), Some(first_hash.as_str()));
    }

    #[test]
    fn repair_updates_same_committed_unit_without_regressing_order() {
        let fixture = Fixture::new("repair");
        let mut cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        cursor.generation = fixture
            .db
            .commit_pipeline_unit(&cursor, &unit(7, "page-2:item-7", 'a'))
            .expect("translate commit")
            .generation;
        let mut repair_unit = unit(7, "page-2:item-7", 'b');
        repair_unit.producer_generation = Some(18);
        let repaired = fixture
            .db
            .commit_pipeline_unit(&cursor, &repair_unit)
            .expect("repair commit");
        let repaired_hash = "b".repeat(64);
        assert_eq!(
            repaired.last_page_hash.as_deref(),
            Some(repaired_hash.as_str())
        );
        let units = fixture
            .db
            .list_pipeline_units("job-1", cursor.attempt, "translate")
            .expect("units");
        assert_eq!(units.len(), 1);
        assert_eq!(units[0].page_hash, "b".repeat(64));
    }

    #[test]
    fn restart_fences_the_previous_worker() {
        let fixture = Fixture::new("restart");
        let old = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-old", "translate", 1)
            .expect("old worker");
        let new = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-new", "translate", 1)
            .expect("new worker");
        assert!(fixture
            .db
            .commit_pipeline_unit(&old, &unit(1, "stale", 'a'))
            .expect_err("old worker fenced")
            .to_string()
            .contains("stale pipeline cursor"));
        assert!(fixture
            .db
            .commit_pipeline_unit(&new, &unit(1, "fresh", 'b'))
            .is_ok());
    }

    #[test]
    fn concurrent_workers_have_one_authoritative_generation() {
        let fixture = Fixture::new("concurrent");
        let db = Arc::new(fixture.db.clone());
        let barrier = Arc::new(Barrier::new(3));
        let mut handles = Vec::new();
        for worker in ["worker-a", "worker-b"] {
            let db = db.clone();
            let barrier = barrier.clone();
            handles.push(thread::spawn(move || {
                barrier.wait();
                db.acquire_pipeline_attempt("job-1", worker, "translate", 1)
                    .expect("claim")
            }));
        }
        barrier.wait();
        let cursors: Vec<_> = handles
            .into_iter()
            .map(|handle| handle.join().expect("join"))
            .collect();
        let winner = cursors
            .iter()
            .max_by_key(|cursor| cursor.generation)
            .expect("winner");
        let loser = cursors
            .iter()
            .min_by_key(|cursor| cursor.generation)
            .expect("loser");
        assert!(db
            .commit_pipeline_unit(winner, &unit(1, "winner", 'c'))
            .is_ok());
        assert!(db
            .commit_pipeline_unit(loser, &unit(1, "loser", 'd'))
            .is_err());
    }

    #[test]
    fn events_are_inserted_only_after_authoritative_commit() {
        let fixture = Fixture::new("events");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        fixture
            .db
            .commit_pipeline_unit(&cursor, &unit(1, "unit-1", 'e'))
            .expect("commit");
        let events = fixture.db.list_job_events("job-1", 100, 0).expect("events");
        assert!(events
            .iter()
            .any(|event| event.event == "pipeline_unit_committed"));
        assert!(!events
            .iter()
            .any(|event| event.message.contains("raw stdout")));
    }

    #[test]
    fn stage_observation_updates_state_and_event_in_one_fenced_transition() {
        let fixture = Fixture::new("stage-observation");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        let next = fixture
            .db
            .observe_pipeline_stage(
                &cursor,
                "translate",
                1,
                true,
                &observation(4, "translating", 3),
            )
            .expect("observe");
        assert_eq!(next.generation, cursor.generation + 1);
        let state = fixture
            .db
            .pipeline_stage_state("job-1", cursor.attempt, "translate")
            .expect("stage state")
            .expect("stage");
        assert_eq!(state.raw_stage.as_deref(), Some("translating"));
        assert_eq!(state.progress_current, Some(3));
        assert_eq!(state.producer_seq, Some(4));
        let events = fixture.db.list_job_events("job-1", 100, 0).expect("events");
        let progress = events
            .iter()
            .find(|event| event.event == "stage_progress")
            .expect("derived progress event");
        assert_eq!(progress.stage.as_deref(), Some("translating"));
        assert_eq!(progress.progress_current, Some(3));
        assert_eq!(
            progress
                .payload
                .as_ref()
                .and_then(|payload| payload.pointer("/authority/generation"))
                .and_then(Value::as_u64),
            Some(next.generation)
        );

        let later = fixture
            .db
            .observe_pipeline_stage(
                &next,
                "translate",
                1,
                true,
                &observation(5, "translating", 1),
            )
            .expect("observe restarted lower progress");
        assert_eq!(later.generation, next.generation + 1);
        assert_eq!(
            fixture
                .db
                .pipeline_stage_state("job-1", cursor.attempt, "translate")
                .expect("stage state")
                .expect("stage")
                .progress_current,
            Some(3)
        );
    }

    #[test]
    fn background_stage_does_not_replace_main_stage() {
        let fixture = Fixture::new("background-stage");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        let mut prewarm = observation(5, "render_preprocess", 2);
        prewarm.substage = Some("render_prewarm".to_string());
        let next = fixture
            .db
            .observe_pipeline_stage(&cursor, "render", 2, false, &prewarm)
            .expect("observe background");
        assert_eq!(next.stage_key, "translate");
        assert_eq!(
            fixture
                .db
                .pipeline_stage_state("job-1", cursor.attempt, "translate")
                .expect("main state")
                .expect("main stage")
                .status,
            "running"
        );
        assert_eq!(
            fixture
                .db
                .pipeline_stage_state("job-1", cursor.attempt, "render")
                .expect("background state")
                .expect("background stage")
                .substage
                .as_deref(),
            Some("render_prewarm")
        );
    }

    #[test]
    fn main_stage_transition_completes_previous_stage_and_fences_old_cursor() {
        let fixture = Fixture::new("main-stage-transition");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        let next = fixture
            .db
            .observe_pipeline_stage(&cursor, "render", 2, true, &observation(6, "rendering", 1))
            .expect("enter render");
        assert_eq!(next.stage_key, "render");
        assert_eq!(
            fixture
                .db
                .pipeline_stage_state("job-1", cursor.attempt, "translate")
                .expect("translation state")
                .expect("translation stage")
                .status,
            "completed"
        );
        assert!(fixture
            .db
            .observe_pipeline_stage(
                &cursor,
                "translate",
                1,
                true,
                &observation(7, "translating", 7),
            )
            .expect_err("old cursor fenced")
            .to_string()
            .contains("stale pipeline cursor"));
    }

    #[test]
    fn restart_claim_preserves_last_authoritative_stage() {
        let fixture = Fixture::new("resume-stage-cursor");
        let translate = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire translate");
        let render = fixture
            .db
            .observe_pipeline_stage(
                &translate,
                "render",
                2,
                true,
                &observation(9, "rendering", 4),
            )
            .expect("enter render");
        assert_eq!(render.stage_key, "render");

        // The compatibility JobSnapshot may still say translation during
        // startup. The durable attempt cursor must win over that hint.
        let resumed = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-b", "translate", 1)
            .expect("resume");
        assert_eq!(resumed.attempt, translate.attempt);
        assert_eq!(resumed.stage_key, "render");
        assert!(resumed.generation > render.generation);
    }

    #[test]
    fn main_stage_order_cannot_regress() {
        let fixture = Fixture::new("stage-order-regression");
        let translate = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire translate");
        let render = fixture
            .db
            .observe_pipeline_stage(
                &translate,
                "render",
                2,
                true,
                &observation(10, "rendering", 4),
            )
            .expect("enter render");
        assert!(fixture
            .db
            .observe_pipeline_stage(
                &render,
                "translate",
                1,
                true,
                &observation(11, "translating", 5),
            )
            .expect_err("stage regression rejected")
            .to_string()
            .contains("stage order regressed"));
    }

    #[test]
    fn request_sent_without_receipt_becomes_ambiguous_after_restart() {
        let fixture = Fixture::new("dispatch-intent-crash");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "ocr", 0)
            .expect("acquire");
        let send_cursor = match fixture
            .db
            .begin_pipeline_dispatch(&cursor, &dispatch_intent())
            .expect("begin dispatch")
        {
            PipelineDispatchBegin::Send { cursor } => cursor,
            other => panic!("expected send, got {other:?}"),
        };
        assert!(send_cursor.generation > cursor.generation);

        // Simulate the provider accepting the request while the runtime dies
        // before persisting its returned handle.
        let restarted = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-b", "ocr", 0)
            .expect("restart claim");
        let ambiguous = fixture
            .db
            .begin_pipeline_dispatch(&restarted, &dispatch_intent())
            .expect("recover dispatch");
        assert!(matches!(ambiguous, PipelineDispatchBegin::Ambiguous { .. }));
        let record = fixture
            .db
            .pipeline_dispatch("job-1", cursor.attempt, "ocr-submit")
            .expect("dispatch")
            .expect("record");
        assert_eq!(record.status, "ambiguous");
        assert!(record.receipt.is_none());
    }

    #[test]
    fn durable_provider_receipt_resumes_polling_without_resubmit() {
        let fixture = Fixture::new("dispatch-receipt-resume");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "ocr", 0)
            .expect("acquire");
        let send_cursor = match fixture
            .db
            .begin_pipeline_dispatch(&cursor, &dispatch_intent())
            .expect("begin dispatch")
        {
            PipelineDispatchBegin::Send { cursor } => cursor,
            other => panic!("expected send, got {other:?}"),
        };
        let receipt = json!({"task_id": "task-123", "trace_id": "trace-1"});
        let receipted = fixture
            .db
            .receipt_pipeline_dispatch(&send_cursor, "ocr-submit", &receipt)
            .expect("receipt");

        let restarted = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-b", "ocr", 0)
            .expect("restart claim");
        let resumed = fixture
            .db
            .begin_pipeline_dispatch(&restarted, &dispatch_intent())
            .expect("resume dispatch");
        match resumed {
            PipelineDispatchBegin::Resume {
                cursor,
                receipt: loaded,
            } => {
                assert_eq!(cursor.generation, restarted.generation);
                assert_eq!(loaded, receipt);
            }
            other => panic!("expected receipt resume, got {other:?}"),
        }
        assert!(receipted.generation < restarted.generation);
    }

    #[test]
    fn stale_worker_cannot_publish_provider_receipt() {
        let fixture = Fixture::new("dispatch-stale-receipt");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "ocr", 0)
            .expect("acquire");
        let send_cursor = match fixture
            .db
            .begin_pipeline_dispatch(&cursor, &dispatch_intent())
            .expect("begin dispatch")
        {
            PipelineDispatchBegin::Send { cursor } => cursor,
            other => panic!("expected send, got {other:?}"),
        };
        fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-b", "ocr", 0)
            .expect("superseding claim");
        assert!(
            fixture
                .db
                .receipt_pipeline_dispatch(
                    &send_cursor,
                    "ocr-submit",
                    &json!({"task_id": "late-task"}),
                )
                .expect_err("stale receipt fenced")
                .to_string()
                .contains("stale pipeline cursor")
        );
    }

    #[test]
    fn atomic_ocr_resolution_survives_restart_and_resumes_bound_receipt() {
        let fixture = Fixture::new("ocr-resolution-restart");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-before-crash", "ocr", 0)
            .expect("source attempt");
        let intent = dispatch_intent();
        fixture
            .db
            .begin_pipeline_dispatch(&cursor, &intent)
            .expect("source intent");
        let restarted = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-after-crash", "ocr", 0)
            .expect("restart claim");
        assert!(matches!(
            fixture
                .db
                .begin_pipeline_dispatch(&restarted, &intent)
                .expect("mark ambiguous"),
            PipelineDispatchBegin::Ambiguous { .. }
        ));
        fixture
            .db
            .finish_latest_pipeline_attempt("job-1", "failed")
            .expect("close source");
        let source_dispatch = fixture
            .db
            .latest_pipeline_dispatch("job-1", "ocr-submit")
            .expect("source dispatch")
            .expect("source record");
        let mut recovery = JobSnapshot::new(
            "job-recovery".to_string(),
            CreateJobInput::default(),
            vec!["python".to_string()],
        );
        recovery.status = crate::models::domain::JobStatusKind::Queued;
        let receipt = json!({
            "kind": "mineru_task",
            "task_id": "task-existing",
            "trace_id": "secret-value"
        });
        assert!(fixture
            .db
            .create_ocr_recovery_job_state(
                &source_dispatch,
                &recovery,
                "bind_existing_receipt",
                Some(&receipt),
            )
            .expect("atomic recovery"));

        assert_eq!(
            fixture
                .db
                .list_resumable_pipeline_job_ids()
                .expect("restart candidates"),
            vec!["job-recovery".to_string()]
        );
        let claimed = fixture
            .db
            .acquire_pipeline_attempt("job-recovery", "worker-after-service-restart", "ocr", 0)
            .expect("claim recovery");
        match fixture
            .db
            .begin_pipeline_dispatch(&claimed, &intent)
            .expect("resume receipt")
        {
            PipelineDispatchBegin::Resume { receipt, .. } => {
                assert_eq!(receipt["task_id"], "task-existing");
            }
            other => panic!("expected receipt resume, got {other:?}"),
        }
        let events = fixture
            .db
            .list_job_events("job-recovery", 100, 0)
            .expect("recovery events");
        assert!(!serde_json::to_string(&events)
            .expect("event json")
            .contains("secret-value"));
    }

    #[test]
    fn concurrent_ocr_resolution_creates_exactly_one_recovery_job() {
        let fixture = Fixture::new("ocr-resolution-concurrent");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "ocr", 0)
            .expect("source attempt");
        let intent = dispatch_intent();
        fixture
            .db
            .begin_pipeline_dispatch(&cursor, &intent)
            .expect("source intent");
        let restarted = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-b", "ocr", 0)
            .expect("restart claim");
        fixture
            .db
            .begin_pipeline_dispatch(&restarted, &intent)
            .expect("mark ambiguous");
        fixture
            .db
            .finish_latest_pipeline_attempt("job-1", "failed")
            .expect("close source");
        let source_dispatch = fixture
            .db
            .latest_pipeline_dispatch("job-1", "ocr-submit")
            .expect("source dispatch")
            .expect("source record");
        let db = Arc::new(fixture.db.clone());
        let barrier = Arc::new(Barrier::new(2));
        let handles = (1..=2)
            .map(|index| {
                let db = db.clone();
                let barrier = barrier.clone();
                let source_dispatch = source_dispatch.clone();
                thread::spawn(move || {
                    let recovery = JobSnapshot::new(
                        format!("job-recovery-{index}"),
                        CreateJobInput::default(),
                        vec!["python".to_string()],
                    );
                    barrier.wait();
                    (
                        recovery.job_id.clone(),
                        db.create_ocr_recovery_job_state(
                            &source_dispatch,
                            &recovery,
                            "accept_duplicate_risk",
                            None,
                        )
                        .expect("resolution attempt"),
                    )
                })
            })
            .collect::<Vec<_>>();
        let results = handles
            .into_iter()
            .map(|handle| handle.join().expect("resolution thread"))
            .collect::<Vec<_>>();
        assert_eq!(results.iter().filter(|(_, created)| *created).count(), 1);
        for (job_id, created) in results {
            assert_eq!(fixture.db.get_job(&job_id).is_ok(), created);
        }
        assert_eq!(
            fixture
                .db
                .latest_pipeline_dispatch("job-1", "ocr-submit")
                .expect("resolved dispatch")
                .expect("resolved record")
                .status,
            "resolved"
        );
    }

    #[test]
    fn terminal_job_closes_attempt_and_removes_it_from_resume_queue() {
        let fixture = Fixture::new("terminal");
        let cursor = fixture
            .db
            .acquire_pipeline_attempt("job-1", "worker-a", "translate", 1)
            .expect("acquire");
        fixture
            .db
            .commit_pipeline_unit(&cursor, &unit(1, "unit-1", 'f'))
            .expect("commit");
        assert!(fixture
            .db
            .finish_latest_pipeline_attempt("job-1", "succeeded")
            .expect("finish attempt"));
        assert!(!fixture
            .db
            .has_running_pipeline_attempt("job-1")
            .expect("active attempt"));
        assert!(fixture
            .db
            .list_resumable_pipeline_job_ids()
            .expect("resume queue")
            .is_empty());
    }
}

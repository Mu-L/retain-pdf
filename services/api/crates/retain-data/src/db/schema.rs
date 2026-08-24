use anyhow::Result;
use rusqlite::Connection;

/// 图书馆数据层的编号迁移阶梯(PRAGMA user_version)。
///
/// 现有 ensure_schema 的幂等 DDL 与 ensure_*_column 增量加列继续负责
/// 任务系统的表;平台新表(documents/favorites/...)从这里走版本化
/// 迁移,后续破坏性变更只能追加新版本,不允许改历史条目。
/// 迁移阶梯当前版本数——测试用它做幂等断言，加迁移时无需再手改测试。
pub(crate) fn versioned_migration_count() -> i64 {
    VERSIONED_MIGRATIONS.len() as i64
}

const VERSIONED_MIGRATIONS: &[&str] = &[
    // v1: 图书馆地基 —— 文档一等公民 + 锚点收藏 + 合集/标签 + FTS5
    r#"
    CREATE TABLE IF NOT EXISTS documents (
        document_id     TEXT PRIMARY KEY,
        title           TEXT NOT NULL DEFAULT '',
        authors_json    TEXT NOT NULL DEFAULT '[]',
        year            INTEGER,
        doi             TEXT NOT NULL DEFAULT '',
        source_filename TEXT NOT NULL,
        page_count      INTEGER NOT NULL DEFAULT 0,
        bytes           INTEGER NOT NULL DEFAULT 0,
        active_job_id   TEXT,
        reading_status  TEXT NOT NULL DEFAULT 'unread',
        added_at        TEXT NOT NULL,
        last_opened_at  TEXT,
        updated_at      TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_documents_added_at ON documents(added_at DESC);
    CREATE TABLE IF NOT EXISTS favorites (
        favorite_id     TEXT PRIMARY KEY,
        document_id     TEXT NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
        job_id          TEXT NOT NULL,
        page_idx        INTEGER NOT NULL,
        block_id        TEXT NOT NULL,
        char_start      INTEGER,
        char_end        INTEGER,
        kind            TEXT NOT NULL DEFAULT 'sentence',
        quote_text      TEXT NOT NULL,
        translated_quote_text TEXT NOT NULL DEFAULT '',
        note            TEXT NOT NULL DEFAULT '',
        created_at      TEXT NOT NULL,
        updated_at      TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_favorites_document ON favorites(document_id, page_idx);
    CREATE TABLE IF NOT EXISTS collections (
        collection_id   TEXT PRIMARY KEY,
        name            TEXT NOT NULL,
        parent_id       TEXT REFERENCES collections(collection_id) ON DELETE SET NULL,
        sort_order      INTEGER NOT NULL DEFAULT 0,
        created_at      TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS collection_documents (
        collection_id   TEXT NOT NULL REFERENCES collections(collection_id) ON DELETE CASCADE,
        document_id     TEXT NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
        added_at        TEXT NOT NULL,
        PRIMARY KEY(collection_id, document_id)
    );
    CREATE TABLE IF NOT EXISTS document_tags (
        document_id     TEXT NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
        tag             TEXT NOT NULL,
        PRIMARY KEY(document_id, tag)
    );
    CREATE INDEX IF NOT EXISTS idx_document_tags_tag ON document_tags(tag);
    CREATE VIRTUAL TABLE IF NOT EXISTS blocks_fts USING fts5(
        document_id UNINDEXED, job_id UNINDEXED, page_idx UNINDEXED, block_id UNINDEXED,
        source_text, translated_text,
        tokenize='trigram'
    );
    "#,
    // v2: 资产存储(内容寻址,收藏图片附件)+ AI 问答会话/消息。
    // 设计原则:用户策展(收藏)是硬锚点,机器生成(问答引用)是软锚点
    // ——引用只存 citations_json 快照,不做 job 删除保护。
    r#"
    CREATE TABLE IF NOT EXISTS assets (
        asset_id    TEXT PRIMARY KEY,          -- sha256(文件字节)
        mime        TEXT NOT NULL,
        bytes       INTEGER NOT NULL,
        width       INTEGER,
        height      INTEGER,
        created_at  TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ai_conversations (
        conversation_id TEXT PRIMARY KEY,
        title           TEXT NOT NULL DEFAULT '',
        document_id     TEXT REFERENCES documents(document_id) ON DELETE SET NULL,
        created_at      TEXT NOT NULL,
        updated_at      TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated ON ai_conversations(updated_at DESC);
    CREATE TABLE IF NOT EXISTS ai_messages (
        message_id      TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES ai_conversations(conversation_id) ON DELETE CASCADE,
        seq             INTEGER NOT NULL,
        role            TEXT NOT NULL,
        content         TEXT NOT NULL,
        citations_json  TEXT NOT NULL DEFAULT '[]',
        tool_trace_json TEXT NOT NULL DEFAULT '[]',
        model           TEXT NOT NULL DEFAULT '',
        created_at      TEXT NOT NULL,
        UNIQUE(conversation_id, seq)
    );
    ALTER TABLE favorites ADD COLUMN asset_id  TEXT NOT NULL DEFAULT '';
    ALTER TABLE favorites ADD COLUMN rect_json TEXT NOT NULL DEFAULT '';
    "#,
    // v3: AI 消息树分支 —— parent_id 形成兄弟分支; head_id 记录当前可见叶。
    // 与 ChatGPT / assistant-ui 一致:同 parent 的多条 message 即 alternate。
    // 兼容:旧行 parent_id 为空,按 seq 串成线性链;load 时无 head 或 max(seq)。
    r#"
    ALTER TABLE ai_conversations ADD COLUMN head_id TEXT NOT NULL DEFAULT '';
    ALTER TABLE ai_messages ADD COLUMN parent_id TEXT NOT NULL DEFAULT '';
    CREATE INDEX IF NOT EXISTS idx_ai_messages_parent
        ON ai_messages(conversation_id, parent_id);
    "#,
    // v4: favorites.job_id 外键硬约束（与应用层 books.rs 409 语义一致 ON DELETE RESTRICT）
    r#"
    PRAGMA foreign_keys=OFF;
    CREATE TABLE favorites_new (
        favorite_id     TEXT PRIMARY KEY,
        document_id     TEXT NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
        job_id          TEXT NOT NULL REFERENCES jobs(job_id) ON DELETE RESTRICT,
        page_idx        INTEGER NOT NULL,
        block_id        TEXT NOT NULL,
        char_start      INTEGER,
        char_end        INTEGER,
        kind            TEXT NOT NULL DEFAULT 'sentence',
        quote_text      TEXT NOT NULL,
        translated_quote_text TEXT NOT NULL DEFAULT '',
        note            TEXT NOT NULL DEFAULT '',
        created_at      TEXT NOT NULL,
        updated_at      TEXT NOT NULL,
        asset_id        TEXT NOT NULL DEFAULT '',
        rect_json       TEXT NOT NULL DEFAULT ''
    );
    INSERT INTO favorites_new (favorite_id, document_id, job_id, page_idx, block_id, char_start, char_end, kind, quote_text, translated_quote_text, note, created_at, updated_at, asset_id, rect_json)
        SELECT favorite_id, document_id, job_id, page_idx, block_id, char_start, char_end, kind, quote_text, translated_quote_text, note, created_at, updated_at, asset_id, rect_json FROM favorites;
    DROP TABLE favorites;
    ALTER TABLE favorites_new RENAME TO favorites;
    CREATE INDEX IF NOT EXISTS idx_favorites_document ON favorites(document_id, page_idx);
    PRAGMA foreign_keys=ON;
    "#,
    // v5: durable AI-invokable document operation control plane. Attempts keep
    // immutable manifest/state snapshots; events are append-only; candidate
    // document versions require an explicit compare-and-swap commit.
    r#"
    CREATE TABLE IF NOT EXISTS document_operations (
        operation_id       TEXT PRIMARY KEY,
        conversation_id    TEXT REFERENCES ai_conversations(conversation_id) ON DELETE SET NULL,
        request_message_id TEXT NOT NULL DEFAULT '',
        document_id        TEXT NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
        base_job_id        TEXT NOT NULL,
        base_version_id    TEXT,
        intent_summary     TEXT NOT NULL,
        status             TEXT NOT NULL,
        current_attempt    INTEGER NOT NULL,
        created_at         TEXT NOT NULL,
        updated_at         TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_document_operations_document
        ON document_operations(document_id, updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_document_operations_status
        ON document_operations(status, updated_at);

    CREATE TABLE IF NOT EXISTS document_operation_attempts (
        operation_id       TEXT NOT NULL REFERENCES document_operations(operation_id) ON DELETE CASCADE,
        attempt            INTEGER NOT NULL,
        dispatch_id        TEXT NOT NULL UNIQUE,
        program_sha256     TEXT NOT NULL,
        manifest_json      TEXT NOT NULL,
        state_json         TEXT NOT NULL,
        status             TEXT NOT NULL,
        dispatch_intent_at TEXT,
        dispatch_receipt_json TEXT,
        terminal_receipt_at TEXT,
        candidate_pdf_sha256 TEXT,
        created_at         TEXT NOT NULL,
        updated_at         TEXT NOT NULL,
        PRIMARY KEY(operation_id, attempt)
    );
    CREATE INDEX IF NOT EXISTS idx_document_operation_attempts_status
        ON document_operation_attempts(status, updated_at);

    CREATE TABLE IF NOT EXISTS document_operation_events (
        operation_id TEXT NOT NULL REFERENCES document_operations(operation_id) ON DELETE CASCADE,
        seq          INTEGER NOT NULL,
        attempt      INTEGER NOT NULL,
        ts           TEXT NOT NULL,
        event        TEXT NOT NULL,
        status       TEXT NOT NULL,
        payload_json TEXT NOT NULL DEFAULT '{}',
        PRIMARY KEY(operation_id, seq)
    );

    CREATE TABLE IF NOT EXISTS document_versions (
        version_id       TEXT PRIMARY KEY,
        document_id      TEXT NOT NULL REFERENCES documents(document_id) ON DELETE CASCADE,
        base_version_id  TEXT REFERENCES document_versions(version_id) ON DELETE SET NULL,
        operation_id     TEXT NOT NULL UNIQUE REFERENCES document_operations(operation_id) ON DELETE CASCADE,
        source_job_id    TEXT NOT NULL DEFAULT '',
        artifact_key     TEXT NOT NULL,
        content_sha256   TEXT NOT NULL,
        status           TEXT NOT NULL,
        created_at       TEXT NOT NULL,
        committed_at     TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_document_versions_document
        ON document_versions(document_id, created_at);

    ALTER TABLE documents ADD COLUMN active_version_id TEXT;
    "#,
    // v6: durable adapter cursor for one agent runtime session per
    // conversation. The cursor is internal control-plane state and is not
    // exposed through the public conversation record. Revision provides a
    // compare-and-swap boundary when a crashed runtime and its replacement
    // race to publish a new session.
    r#"
    ALTER TABLE ai_conversations ADD COLUMN agent_runtime_id TEXT NOT NULL DEFAULT '';
    ALTER TABLE ai_conversations ADD COLUMN agent_session_cursor TEXT NOT NULL DEFAULT '';
    ALTER TABLE ai_conversations ADD COLUMN agent_session_revision INTEGER NOT NULL DEFAULT 0;
    ALTER TABLE ai_conversations ADD COLUMN agent_session_updated_at TEXT NOT NULL DEFAULT '';
    "#,
    // v7: a retry is a new immutable document-operation attempt. Persist the
    // request idempotency key on that attempt so a lost HTTP response cannot
    // turn one confirmed retry into multiple executor dispatches.
    r#"
    ALTER TABLE document_operation_attempts
        ADD COLUMN retry_idempotency_key TEXT NOT NULL DEFAULT '';
    CREATE UNIQUE INDEX IF NOT EXISTS idx_document_operation_attempt_retry_key
        ON document_operation_attempts(operation_id, retry_idempotency_key)
        WHERE retry_idempotency_key <> '';
    "#,
];

pub(super) fn run_versioned_migrations(conn: &Connection) -> Result<()> {
    let current: i64 = conn.query_row("PRAGMA user_version", [], |row| row.get(0))?;
    for (index, migration) in VERSIONED_MIGRATIONS.iter().enumerate() {
        let version = (index + 1) as i64;
        if version <= current {
            continue;
        }
        conn.execute_batch(&format!(
            "BEGIN;\n{migration}\nPRAGMA user_version = {version};\nCOMMIT;"
        ))?;
    }
    Ok(())
}

pub(super) fn ensure_uploads_column(
    conn: &Connection,
    column: &str,
    column_def: &str,
) -> Result<()> {
    ensure_table_column(conn, "uploads", column, column_def)
}

pub(super) fn ensure_jobs_column(conn: &Connection, column: &str, column_def: &str) -> Result<()> {
    ensure_table_column(conn, "jobs", column, column_def)
}

pub(super) fn ensure_events_column(
    conn: &Connection,
    column: &str,
    column_def: &str,
) -> Result<()> {
    ensure_table_column(conn, "events", column, column_def)
}

pub(super) fn ensure_glossaries_column(
    conn: &Connection,
    column: &str,
    column_def: &str,
) -> Result<()> {
    ensure_table_column(conn, "glossaries", column, column_def)
}

fn ensure_table_column(
    conn: &Connection,
    table: &str,
    column: &str,
    column_def: &str,
) -> Result<()> {
    let mut stmt = conn.prepare(&format!("PRAGMA table_info({table})"))?;
    let rows = stmt.query_map([], |row| row.get::<_, String>(1))?;
    let mut has_column = false;
    for row in rows {
        if row? == column {
            has_column = true;
            break;
        }
    }
    if !has_column {
        conn.execute(
            &format!("ALTER TABLE {table} ADD COLUMN {column} {column_def}"),
            [],
        )?;
    }
    Ok(())
}

pub(super) fn ensure_no_legacy_artifacts_json(conn: &Connection) -> Result<()> {
    let mut stmt = conn.prepare("PRAGMA table_info(jobs)")?;
    let rows = stmt.query_map([], |row| row.get::<_, String>(1))?;
    let mut has_legacy_column = false;
    for row in rows {
        if row? == "artifacts_json" {
            has_legacy_column = true;
            break;
        }
    }
    if !has_legacy_column {
        return Ok(());
    }
    let legacy_count: i64 = conn.query_row(
        r#"
        SELECT COUNT(*)
        FROM jobs
        WHERE artifacts_json IS NOT NULL AND TRIM(artifacts_json) <> ''
        "#,
        [],
        |row| row.get(0),
    )?;
    if legacy_count > 0 {
        anyhow::bail!(
            "legacy jobs.artifacts_json storage is no longer supported; found {legacy_count} legacy rows, clear the DB or rerun those jobs"
        );
    }
    Ok(())
}

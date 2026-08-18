use std::env;

/// Max `limit` for `GET /api/v1/conversations` (and `list_conversations`).
pub const MAX_CONVERSATION_LIMIT: u32 = 200;
/// Max `limit` for `GET /api/v1/search` (block FTS).
pub const MAX_SEARCH_LIMIT: u32 = 100;
/// Max `limit` for `GET /api/v1/documents`.
pub const MAX_DOCUMENT_LIMIT: u32 = 500;
/// Max `limit` for job listings and job events (`GET /api/v1/jobs*`, `.../events`).
pub const MAX_JOB_LIMIT: u32 = 500;
/// Alias for job events; kept equal to `MAX_JOB_LIMIT`.
pub const MAX_JOB_EVENT_LIMIT: u32 = MAX_JOB_LIMIT;

fn resolve_limit(specific_env: &str, fallback: u32) -> u32 {
    if let Ok(raw) = env::var(specific_env) {
        if let Ok(parsed) = raw.trim().parse::<u32>() {
            if parsed > 0 {
                return parsed;
            }
        }
    }
    if let Ok(raw) = env::var("RUST_API_MAX_LIST_LIMIT") {
        if let Ok(parsed) = raw.trim().parse::<u32>() {
            if parsed > 0 {
                return parsed;
            }
        }
    }
    fallback
}

/// Env-aware limit for conversations. Reads `RUST_API_MAX_CONVERSATION_LIMIT`
/// then `RUST_API_MAX_LIST_LIMIT`, else `MAX_CONVERSATION_LIMIT`.
pub fn max_conversation_limit() -> u32 {
    resolve_limit("RUST_API_MAX_CONVERSATION_LIMIT", MAX_CONVERSATION_LIMIT)
}

/// Env-aware limit for search. Reads `RUST_API_MAX_SEARCH_LIMIT` then generic.
pub fn max_search_limit() -> u32 {
    resolve_limit("RUST_API_MAX_SEARCH_LIMIT", MAX_SEARCH_LIMIT)
}

/// Env-aware limit for documents.
pub fn max_document_limit() -> u32 {
    resolve_limit("RUST_API_MAX_DOCUMENT_LIMIT", MAX_DOCUMENT_LIMIT)
}

/// Env-aware limit for jobs (list and events).
pub fn max_job_limit() -> u32 {
    resolve_limit("RUST_API_MAX_JOB_LIMIT", MAX_JOB_LIMIT)
}

/// Env-aware limit for job events. Reads `RUST_API_MAX_JOB_EVENT_LIMIT` then generic.
pub fn max_job_event_limit() -> u32 {
    resolve_limit("RUST_API_MAX_JOB_EVENT_LIMIT", MAX_JOB_EVENT_LIMIT)
}

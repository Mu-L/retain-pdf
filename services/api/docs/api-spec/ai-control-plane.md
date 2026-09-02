# AI Proxy, Conversations, and Public Operation Control

[API spec index](../../API_SPEC.md) ·
[internal Agent execution contract](agent-document-operations.md)

This page describes the Rust-owned public control plane used by the web client.
The Python AI service produces answers and Agent events, but Rust remains the
authenticated public entrypoint and the only writer for conversations,
operations, attempts, events, and document versions.

## AI service proxy

```text
POST /api/v1/ai/ask
GET  /api/v1/ai/runtime-config
PUT  /api/v1/ai/runtime-config
```

Rust forwards these routes to the supervised AI service's `/v1/ask` and
`/v1/runtime-config` endpoints. `POST /api/v1/ai/ask` preserves the upstream
status, content type, and streaming body, so SSE event order and error payloads
come from the AI service. Runtime-config responses are buffered and use
`Cache-Control: no-store`. The caller's Rust `X-API-Key` is forwarded to the
sidecar; model and Gateway credentials are never returned in cleartext.

The ask payload and SSE/result fields are defined by
[`services/contracts/ai-ask.v1.schema.json`](../../../contracts/ai-ask.v1.schema.json).
Runtime configuration updates and redacted views are defined by
[`services/contracts/runtime-config.v1.schema.json`](../../../contracts/runtime-config.v1.schema.json).
Important state rules are:

- `assistant_mode=reading` selects document retrieval without operation tools;
- `assistant_mode=operations` selects the configured operation-capable runtime;
- a document-scoped `auto` request fails with `409` when the selected runtime
  can operate on a PDF but cannot read its content, rather than silently
  changing capabilities;
- `agent_session` identifies the actual runtime and durable request message;
- `agent_operation` is only a refresh hint; clients must query the operation
  endpoint below for authoritative state;
- `agent_confirmation_required` and `confirmation_requests` are host-generated
  action descriptions. Clients must not parse model prose for authority;
- `done.persisted=false` means the answer was produced but conversation writeback
  was not durable.

In `explicit` mode, an Agent turn may create a draft, but run/commit/retry need
independent user confirmation through `confirm_document_operation=true` on a
new ask request. `green_light` supplies that host confirmation automatically;
it does not bypass operation state, idempotency, candidate validation, or
document-version compare-and-swap checks.

## Durable conversation tree

```text
POST   /api/v1/ai/conversations
GET    /api/v1/ai/conversations
POST   /api/v1/ai/conversations/fork
GET    /api/v1/ai/conversations/{conversation_id}
PATCH  /api/v1/ai/conversations/{conversation_id}
DELETE /api/v1/ai/conversations/{conversation_id}
POST   /api/v1/ai/conversations/{conversation_id}/messages
```

The request and response shapes are defined by
[`services/contracts/ai-conversations.v1.schema.json`](../../../contracts/ai-conversations.v1.schema.json).
Messages form a tree through `parent_id`; `head_id` chooses the visible leaf.
Appending without `parent_id` attaches to the current head. Stable client
`message_id` values make a request retry safe after an uncertain network
response. A document-scoped conversation must reference an existing document.

The operation-capable AI path durably appends the user message before invoking
the runtime. That message id becomes the operation's `request_message_id`, so a
browser disconnect cannot leave a created operation attached only to transient
model state. The final assistant message is appended after the runtime returns;
write failure is surfaced through `persisted=false`.

## Public operation projection and actions

```text
GET  /api/v1/ai/conversations/{conversation_id}/operations?limit=50&offset=0
GET  /api/v1/ai/operations/{operation_id}
POST /api/v1/ai/operations/{operation_id}/run
POST /api/v1/ai/operations/{operation_id}/retry
POST /api/v1/ai/operations/{operation_id}/cancel
POST /api/v1/ai/operations/{operation_id}/commit
GET  /api/v1/ai/operations/{operation_id}/candidate.pdf
```

The list is conversation-scoped, clamps `limit` to `1..100`, defaults omitted
`offset` to zero, and sorts by `updated_at DESC, operation_id DESC` so equal
timestamps remain deterministic. Its response contains `operations`, `total`,
the effective `limit`, `offset`, and `has_more`. Existing callers that send only
`limit` remain compatible. Public operation items use schema
[`public_document_operation_v1`](../../../contracts/public-document-operation.v1.schema.json)
and expose only safe plan, status, attempt, candidate, failure, allowed-action,
and event projections. They do not expose workspace paths, internal manifests,
request bodies, capabilities, credentials, or signed provider URLs.

Each action request uses this concurrency envelope:

```json
{
  "schema": "document_operation_action_v1",
  "idempotency_key": "stable-client-action-id",
  "expected_status": "result_ready",
  "expected_attempt": 1,
  "expected_program_sha256": "64-character-program-sha256",
  "reason": "optional cancellation reason",
  "accept_duplicate_risk": false
}
```

The client must copy `expected_status`, `expected_attempt`, and
`expected_program_sha256` from the last authoritative operation view. A newer
status/attempt or changed program returns `409`; replaying the same successful
idempotency key is accepted only when it matches the recorded action/attempt.
`retry` is valid for `failed` or `ambiguous`; an ambiguous retry additionally
requires `accept_duplicate_risk=true`.

`allowed_actions` is the backend projection to render:

- `draft` / `awaiting_confirmation`: `run`, `cancel`;
- `queued` / `running` / `validating`: `cancel`;
- `result_ready`: `commit`, `cancel`;
- `failed` / `ambiguous`: `retry`;
- `committed` / `cancelled`: no further action.

Candidate download is available only from `result_ready` or `committed`. Rust
revalidates the version identity, active attempt path, regular-file boundary,
data-root containment, and SHA-256 before streaming the PDF.

These public routes never create a program or mint a capability. Program
creation and executor dispatch remain behind the backend-only routes described
in the [internal Agent execution contract](agent-document-operations.md).

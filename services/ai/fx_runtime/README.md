# fx agent runtime adapter

This directory is the backend-only integration boundary for experimenting with
[`vercel-labs/fx`](https://github.com/vercel-labs/fx) as RetainPDF's agent
harness. It is deliberately an adapter, not a new source of truth and not a PDF
executor.

## Decision

Use fx for:

- model turns, tool selection, streamed agent events, and cancellation;
- loading a small RetainPDF agent instruction set;
- invoking a narrow local `retainpdf-agent` CLI for RetainPDF lifecycle
  operations;
- retaining an fx session cursor that can be rebuilt from the canonical
  RetainPDF conversation when necessary.

Do not use fx for:

- document, conversation, operation, or candidate-version authority;
- direct access to the RetainPDF data root or backend source tree;
- executing model-generated Python or shell commands;
- deciding that an operation was committed;
- replacing the document-operation dispatch journal or recovery state machine;
- providing the production sandbox boundary.

The intended call path is:

```text
RetainPDF API
  -> fx runtime adapter (ACP client)
  -> one fx ACP session
  -> local retainpdf-agent CLI
  -> Rust document-operation control plane
  -> separately confined Executor
```

The frontend talks only to the existing RetainPDF API. It never embeds libfx,
holds a Vercel AI Gateway credential, or connects directly to the operation
store.

## Why ACP plus a local CLI

The first spike should launch the native `fx acp` process from a private,
nearly empty per-session workspace. ACP is only the host-to-agent session
protocol. RetainPDF operations are reached through one bundled local CLI, so
the product does not need an MCP server, MCP discovery, or another network
service lifecycle.

This gives the host control over:

- the active session and prompt lifecycle;
- permission requests and streamed events;
- the exact local command admitted to a conversation;
- cancellation and process supervision;
- the mapping between a RetainPDF conversation and an fx session cursor.

The CLI should initially expose only these coarse commands:

```text
retainpdf-agent document inspect
retainpdf-agent operation create --program-json '<compact-json>'
retainpdf-agent operation run --operation-id <id>
retainpdf-agent operation run --operation-id <id> --retry failed
retainpdf-agent operation run --operation-id <id> --retry ambiguous --accept-duplicate-risk yes
retainpdf-agent operation get --operation-id <id>
retainpdf-agent operation commit --operation-id <id>
retainpdf-agent operation cancel --operation-id <id> --reason-code <reason>
```

The agent composes PDF behavior from a versioned program or restricted IR.
Adding a new product operation should not normally require adding another model
tool.

## Trust boundary

fx is a coding-agent harness, so its built-in filesystem and command tools must
not be treated as RetainPDF capabilities.

For the spike:

1. Start fx with an empty, operation-independent primary workspace.
2. Do not add the repository, data root, document store, or credential
   directories as additional workspaces.
3. Use the headless permission flow and approve only a fully parsed
   `retainpdf-agent` command whose executable, subcommand, flags, and identifier
   arguments match the backend-owned grammar.
4. Deny other command execution, file mutation, skill installation, external
   tool-server configuration, and workspace expansion except for the exact
   RetainPDF CLI call and its designated request files.
5. Connect the CLI to Rust through backend-owned local IPC. Authenticate the
   IPC with OS peer checks or a short-lived capability scoped to one user,
   conversation, and document. Do not give fx the Rust service API key.
6. Require an idempotency key on every effectful CLI call.
7. Treat all model, document, CLI, and fx output as untrusted input at the Rust
   boundary.

The adapter must not use a wildcard permission such as
`retainpdf-agent *`. The model supplies a command string, so the host must
reject shell separators, substitutions, redirections, unknown flags, absolute
paths, parent traversal, and identifiers outside the contract before approving
the call. Free-form intent and generated programs should be written only to
fixed workspace-relative request files and ingested by the CLI with no-follow,
size, and hash checks.

There are two different classes of local CLI:

- fx may call the small control CLI above to create, inspect, run, and commit a
  durable operation;
- PDF transformation CLIs such as Python, Typst, Ghostscript, or future native
  utilities run only inside the separately confined Executor.

Local availability does not make the second class safe to run directly in the
fx host process. Keeping it behind the Executor preserves resource limits,
network denial, output validation, cancellation, and crash reconciliation.

fx permissions and the document-program sandbox solve different problems. The
former controls whether an agent tool call is admitted. The latter must contain
untrusted transformation code, filesystem access, network access, descendants,
resources, and output validation. The existing Rust `DocumentOperationExecutor`
boundary remains responsible for that second problem.

## Durable state and recovery

Rust remains authoritative for conversations and document operations. Persist
only an adapter cursor such as `fx_session_id` alongside the RetainPDF
conversation; never infer document state from an fx transcript.

Recovery rules:

- Browser or SSE disconnect: the backend turn and any accepted operation keep
  running; the client reconnects through RetainPDF event APIs.
- AI Gateway disconnect before a CLI effect: retry or rebuild the fx turn from
  the canonical conversation snapshot.
- Disconnect after a CLI effect: query the Rust operation by its idempotency
  key; do not ask the model to repeat the effect blindly.
- fx process crash: restart the adapter and load the fx session when available;
  otherwise create a new fx session from a bounded RetainPDF conversation
  snapshot.
- API or executor crash: reconcile through the durable dispatch intent,
  receipt, and operation event log. fx does not participate in this decision.
- Candidate ready while chat is offline: preserve `result_ready`; require the
  normal explicit commit/CAS path after reconnection.

This separation means losing an fx session can reduce conversational quality,
but it cannot lose, duplicate, or silently commit a document operation.

## Platform and maturity gate

fx currently describes itself as experimental. Its native binary and packaged
Node addons currently target macOS and Linux, not Windows. Its WebAssembly
fallback requires JSPI and omits subagents, skills, OS sandboxing, native
processes, and web search. Removing MCP simplifies our integration but does not
remove this platform gap.

Therefore fx is behind the `RETAIN_AI_RUNTIME=fx` backend feature flag and an
exact ACP version check. The first adapter is a macOS/Linux development spike,
not a required desktop runtime. Windows continues using the existing Python
runtime. Enabling fx is explicit: a missing binary, missing Gateway key, or
version mismatch fails closed and never weakens document execution isolation.

fx 0.0.5 admits endpoint overrides only for explicit loopback HTTP URLs with a
port. The backend maps `RETAIN_AI_FX_GATEWAY_BASE_URL` to both
`FX_GATEWAY_BASE_URL` and `<base>/v3/ai/language-model` via
`FX_GATEWAY_CHAT_URL`; setting only the former does not move model completion
traffic. Empty preserves the public Vercel Gateway. Remote HTTPS, LAN hosts,
embedded credentials, queries, and fragments fail before fx starts because fx
would otherwise ignore them and silently use its public default.

For a custom bridge, runtime capability probing and `/readyz` also require its
loopback TCP port to accept connections. This is deliberately not a model turn:
it sends no Gateway key, creates no billable request, and does not claim that a
provider/model is healthy. The real live test remains responsible for proving
that fx posts model traffic to `<base>/v3/ai/language-model`.

## Implemented P0 adapter

`retainpdf_ai.runtime.FxAcpRuntime` now launches one private `fx acp` process
for one active turn. It reserves stdout for bounded ACP JSON-RPC, suppresses
raw stderr, uses an empty private workspace and HOME, sends no MCP servers,
pins ACP protocol 1 and fx `0.0.5`, and explicitly changes the session to
`ask` through `session/set_config_option` before every prompt.

Rust stores the opaque `conversation -> fx sessionId` mapping through
`/api/v1/internal/agent/runtime-sessions/:conversation_id`. Updates use
revision CAS. If the cursor is missing, or fx lost its local session, the
adapter creates a new session and supplies a bounded snapshot of the canonical
RetainPDF conversation as untrusted recovery context.

The adapter rejects every ACP permission request except an exact command in the
backend-owned grammar above. For an admitted request it exposes a generated,
one-turn wrapper over a private Unix socket. The host reparses the argv, consumes
the approval once, injects document/message scope and idempotency keys, mints a
single-action 60-second capability, and runs the real CLI in a separate process.
Neither fx nor the wrapper receives the Rust capability or service API key, and
capability-shaped output is redacted before it returns to fx.

The current user message is persisted to the canonical Rust conversation before
fx starts, so operation creation can bind a durable `request_message_id` even if
the browser disconnects during the turn. `run` and `commit` are rejected unless
the inbound request independently carries explicit user confirmation. `ask`
mode remains only a permission policy—not an OS sandbox. The first executable
program is instead a closed `retainpdf_page_program_v1` JSON grammar interpreted
by a fixed backend worker; arbitrary generated code still requires a separately
confined Executor.

## First implementation slice

1. **Partial:** the adapter requires fx `0.0.5`; packaged releases must also
   pin the platform artifact digest instead of following latest.
2. **Implemented:** `AgentRuntime` wraps the existing Python agent and the fx
   ACP adapter.
3. **Implemented for P0:** one `fx acp` process is leased to one active turn;
   stdout is reserved for bounded ACP JSON-RPC and the process is always
   reaped. A process pool is intentionally deferred.
4. **Implemented:** bundle `retainpdf-agent` as a strict loopback HTTP client
   backed only by the Rust document-operation service. The CLI prefers a
   1..300-second Rust-signed capability scoped to conversation, document, and
   explicit actions; the full API key remains trusted-bootstrap-only.
5. **Implemented:** store the conversation-to-fx-session cursor in Rust with
   revision CAS and rebuild after cursor/local-session loss.
6. **Implemented:** host-owned, single-use command broker with exact argv
   grammar, request-scope injection, least-privilege capability minting, and
   explicit run/commit confirmation. Cooperative turn cancellation remains
   pending at the ACP turn level; operation worker cancellation is implemented.
7. **Implemented for restricted page programs:** fixed worker execution,
   resource limits, durable terminal results, Rust validation, candidate
   publication, restart recovery, and explicit commit. Arbitrary code remains
   disabled.
8. Evaluate the spike before packaging fx or removing the current Python agent
   loop.

// Pure model for Reader PDF agent operations: view types, polling status sets,
// and the ordering predicate used to reject stale/equal poll snapshots. No
// React and no I/O so it can be imported by both the poll engine and the
// operation panel tests.

import type { AgentOperationView } from "@retainpdf/api/document-operations";
import type { AgentConfirmationMode } from "@retainpdf/api/agent-runtime-settings";

export type ReaderAgentOperationSignal = {
  operationId: string;
  conversationId?: string;
  confirmationMode?: AgentConfirmationMode;
  nonce: number;
};

export type ReaderAgentOperationEntry = {
  operation: AgentOperationView;
  pendingAction?: "run" | "cancel" | "commit" | "retry";
  error?: string;
};

export type ReaderAgentOperationPerformOptions = {
  acceptDuplicateRisk?: boolean;
};

export const ACTION_KEY_PREFIX = "retainpdf.reader-agent-operation.action-key.v1:";
export const ACTIVE_STATUSES = new Set(["queued", "running", "validating"]);
export const GREEN_LIGHT_TRANSITION_STATUSES = new Set(["draft", "awaiting_confirmation", "result_ready"]);

export function shouldPoll(status: string, mode: AgentConfirmationMode): boolean {
  return ACTIVE_STATUSES.has(status)
    || (mode === "green_light" && GREEN_LIGHT_TRANSITION_STATUSES.has(status));
}

export function eventSeq(operation: AgentOperationView): number {
  return Number(operation.latest_event_seq)
    || Math.max(0, ...(operation.events || []).map((event) => Number(event.seq) || 0));
}

export function shouldReplaceAgentOperation(
  current: AgentOperationView | undefined,
  next: AgentOperationView,
): boolean {
  if (!current) return true;
  if (next.current_attempt !== current.current_attempt) {
    return next.current_attempt > current.current_attempt;
  }
  if (eventSeq(next) !== eventSeq(current)) return eventSeq(next) > eventSeq(current);
  // Equal snapshots are common while polling. Replacing them used to clear a
  // pending action or its error even though the server had not advanced.
  return `${next.updated_at || ""}` > `${current.updated_at || ""}`;
}

export function makeActionKey(operationId: string, action: string): string {
  const random = globalThis.crypto?.randomUUID?.()
    || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `reader-${action}-${operationId}-${random}`.slice(0, 128);
}

export function errorStatus(error: unknown): number {
  return Number((error as { status?: unknown })?.status) || 0;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error && error.message.trim()
    ? error.message.trim()
    : "操作请求失败，请重试。";
}

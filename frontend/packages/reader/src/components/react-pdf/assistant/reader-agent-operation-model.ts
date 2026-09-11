// Reader PDF agent-operation model facade. The decision logic lives in
// `@retainpdf/api/agent-operation-model` so the Reader and web surfaces share a
// single implementation. Export names, storage-key prefix, and the strict
// stale-snapshot ordering (`>` on equal timestamps) are preserved.

import {
  AGENT_OPERATION_ACTIVE_STATUSES,
  AGENT_OPERATION_GREEN_LIGHT_TRANSITION_STATUSES,
  agentOperationErrorMessage,
  agentOperationErrorStatus,
  agentOperationEventSeq,
  agentOperationShouldPoll,
  agentOperationShouldReplace,
  makeAgentOperationActionKey,
} from "@retainpdf/api/agent-operation-model";
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
export const READER_ACTION_KEY_ID_PREFIX = "reader-";
export const ACTIVE_STATUSES = AGENT_OPERATION_ACTIVE_STATUSES;
export const GREEN_LIGHT_TRANSITION_STATUSES = AGENT_OPERATION_GREEN_LIGHT_TRANSITION_STATUSES;

export function shouldPoll(status: string, mode: AgentConfirmationMode): boolean {
  return agentOperationShouldPoll(status, mode);
}

export function eventSeq(operation: AgentOperationView): number {
  return agentOperationEventSeq(operation);
}

export function shouldReplaceAgentOperation(
  current: AgentOperationView | undefined,
  next: AgentOperationView,
): boolean {
  return agentOperationShouldReplace(current, next);
}

export function makeActionKey(operationId: string, action: string): string {
  return makeAgentOperationActionKey(operationId, action, READER_ACTION_KEY_ID_PREFIX);
}

export function errorStatus(error: unknown): number {
  return agentOperationErrorStatus(error);
}

export function errorMessage(error: unknown): string {
  return agentOperationErrorMessage(error);
}

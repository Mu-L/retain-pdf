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
export declare const ACTION_KEY_PREFIX = "retainpdf.reader-agent-operation.action-key.v1:";
export declare const READER_ACTION_KEY_ID_PREFIX = "reader-";
export declare const ACTIVE_STATUSES: ReadonlySet<string>;
export declare const GREEN_LIGHT_TRANSITION_STATUSES: ReadonlySet<string>;
export declare function shouldPoll(status: string, mode: AgentConfirmationMode): boolean;
export declare function eventSeq(operation: AgentOperationView): number;
export declare function shouldReplaceAgentOperation(current: AgentOperationView | undefined, next: AgentOperationView): boolean;
export declare function makeActionKey(operationId: string, action: string): string;
export declare function errorStatus(error: unknown): number;
export declare function errorMessage(error: unknown): string;
//# sourceMappingURL=reader-agent-operation-model.d.ts.map
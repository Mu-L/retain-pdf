import { type AgentOperationView } from "@retainpdf/api/document-operations";
import { type AgentConfirmationMode } from "@retainpdf/api/agent-runtime-settings";
import { type ReaderAgentOperationEntry, type ReaderAgentOperationSignal } from "./reader-agent-operation-model.js";
export declare function useReaderAgentOperationPoll({ conversationId, enabled, discovering, signal, confirmationModeHint, onDocumentCommitted, }: {
    conversationId: string;
    enabled: boolean;
    discovering: boolean;
    signal: ReaderAgentOperationSignal | null;
    confirmationModeHint?: AgentConfirmationMode;
    onDocumentCommitted?: (input: {
        documentId: string;
        revision: string;
    }) => void;
}): {
    entries: ReaderAgentOperationEntry[];
    confirmationMode: AgentConfirmationMode;
    runtimeRestarting: boolean;
    runtimeCredentialConfigured: boolean;
    setEntriesById: import("react").Dispatch<import("react").SetStateAction<Record<string, ReaderAgentOperationEntry>>>;
    inFlightRef: import("react").RefObject<Set<string>>;
    upsert: (operation: AgentOperationView, settlePending?: boolean) => void;
    refresh: (operationId: string, settlePending?: boolean) => Promise<void>;
};
//# sourceMappingURL=use-reader-agent-operation-poll.d.ts.map
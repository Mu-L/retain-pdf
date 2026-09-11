import { type AgentOperationView } from "@retainpdf/api/document-operations";
import type { AgentConfirmationMode } from "@retainpdf/api/agent-runtime-settings";
import { type ReaderAgentOperationSignal } from "./reader-agent-operation-model.js";
export type { ReaderAgentOperationSignal, ReaderAgentOperationEntry, ReaderAgentOperationPerformOptions, } from "./reader-agent-operation-model.js";
export { shouldReplaceAgentOperation } from "./reader-agent-operation-model.js";
export declare function useReaderAgentOperations({ conversationId, enabled, discovering, signal, confirmationModeHint, onDocumentCommitted, }: {
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
    entries: import("./reader-agent-operation-model.js").ReaderAgentOperationEntry[];
    confirmationMode: AgentConfirmationMode;
    runtimeRestarting: boolean;
    runtimeCredentialConfigured: boolean;
    perform: (action: "run" | "cancel" | "commit" | "retry", operation: AgentOperationView, options?: import("./reader-agent-operation-model.js").ReaderAgentOperationPerformOptions) => Promise<void>;
    loadCandidate: (operation: AgentOperationView) => Promise<Blob>;
};
//# sourceMappingURL=use-reader-agent-operations.d.ts.map
import { type AiCitationLike } from "../../../external.js";
import { type ReaderAskStoreMessage } from "./reader-ask-tree.js";
import type { AgentConfirmationMode } from "@retainpdf/api/agent-runtime-settings";
import type { ReaderAssistantMode } from "../../../shared/ai/ask-answerer.js";
export type { ReaderAskStoreMessage } from "./reader-ask-tree.js";
export type ReaderAskSessionSummary = {
    id: string;
    title: string;
    updatedAt: string;
    messageCount: number;
    active: boolean;
};
export declare function useReaderAskRuntime(options: {
    jobId: string;
    enabled: boolean;
    onDocumentCommitted?: (input: {
        documentId: string;
        revision: string;
    }) => void;
}): {
    citationsByMessageId: Record<string, AiCitationLike[]>;
    progressByMessageId: Record<string, string>;
    contentByMessageId: Record<string, string>;
    streamingAssistantId: string;
    isRunning: boolean;
    messages: ReaderAskStoreMessage[];
    sessions: ReaderAskSessionSummary[];
    activeConversationId: any;
    sessionBusy: boolean;
    sessionError: string;
    submitQuestion: (questionInput: string) => Promise<void>;
    retryAnswer: (assistantMessageId: string) => Promise<void>;
    cancelAnswer: () => Promise<void>;
    newSession: () => Promise<void>;
    switchSession: (conversationId: string) => Promise<void>;
    removeSession: (conversationId: string) => Promise<void>;
    renameSession: (conversationId: string, title: string) => Promise<void>;
    branchFromAnswer: (assistantMessageId: string) => Promise<boolean>;
    agentOperations: {
        entries: import("./use-reader-agent-operations.js").ReaderAgentOperationEntry[];
        confirmationMode: AgentConfirmationMode;
        runtimeRestarting: boolean;
        runtimeCredentialConfigured: boolean;
        perform: (action: "run" | "cancel" | "commit" | "retry", operation: import("@retainpdf/api/document-operations").AgentOperationView, options?: import("./use-reader-agent-operations.js").ReaderAgentOperationPerformOptions) => Promise<void>;
        loadCandidate: (operation: import("@retainpdf/api/document-operations").AgentOperationView) => Promise<Blob>;
    };
    assistantMode: ReaderAssistantMode;
    setAssistantMode: import("react").Dispatch<import("react").SetStateAction<ReaderAssistantMode>>;
};
//# sourceMappingURL=use-reader-ask-runtime.d.ts.map
import { type AiCitationLike } from "../../../external.js";
import { type ReaderAskStoreMessage } from "./reader-ask-tree.js";
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
};
//# sourceMappingURL=use-reader-ask-runtime.d.ts.map
export type ReaderAssistantMode = "auto" | "reading" | "operations";
export type ReaderChatRequest = {
    assistantMode?: ReaderAssistantMode;
    assistantMessageId?: string;
    parentId?: string;
    question?: string;
    regenerate?: boolean;
    userMessageId?: string;
    scope?: "document" | "selection" | "page";
    context?: Record<string, unknown> | null;
};
export type ReaderAnswerResult = {
    answer?: string;
    citations?: unknown[];
    persisted?: boolean;
    conversationId?: string;
    confirmationMode?: "explicit" | "green_light" | "";
    operationRefs?: Array<string | {
        operation_id?: string;
    }>;
    confirmationRequests?: Array<{
        operation_id?: string;
    }>;
};
export type ReaderAnswerer = {
    ensureLoaded?: (jobId?: string) => Promise<unknown>;
    answer: (options: Record<string, unknown>) => Promise<ReaderAnswerResult>;
};
export type ReaderAskPort = {
    createRemoteAnswerer: (input: {
        jobId: string;
        documentId?: string;
    }) => ReaderAnswerer | null;
    createLocalAnswerer: (input: {
        jobId: string;
    }) => ReaderAnswerer | null;
};
export declare function createReaderMessageId(prefix: string): string;
//# sourceMappingURL=ai-chat.d.ts.map
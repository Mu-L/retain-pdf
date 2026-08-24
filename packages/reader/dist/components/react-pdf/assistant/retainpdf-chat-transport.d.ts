import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";
import type { AiCitationLike } from "../../../shared/ai/answer-enhance.js";
export type ReaderChatMetadata = {
    citations?: AiCitationLike[];
    progress?: string;
    persisted?: boolean;
    status?: "running" | "complete" | "cancelled" | "error";
};
export type ReaderChatMessage = UIMessage<ReaderChatMetadata>;
type ReaderAnswerer = {
    ensureLoaded?: (jobId?: string) => Promise<unknown>;
    answer: (options: Record<string, unknown>) => Promise<{
        answer?: string;
        citations?: unknown[];
        persisted?: boolean;
    }>;
};
export type ReaderChatRequest = {
    assistantMessageId?: string;
    parentId?: string;
    question?: string;
    regenerate?: boolean;
    userMessageId?: string;
};
/**
 * Translate RetainPDF's small SSE contract into AI SDK UI message chunks.
 *
 * The backend remains framework-agnostic. It only needs to emit answer deltas,
 * optional tool progress, and a final answer/citation payload.
 */
export declare class RetainPdfChatTransport implements ChatTransport<ReaderChatMessage> {
    private readonly options;
    constructor(options: {
        jobId: string;
        getRemoteAnswerer: () => ReaderAnswerer | null;
        getLocalAnswerer?: () => ReaderAnswerer | null;
    });
    sendMessages({ abortSignal, body, messages, trigger, }: Parameters<ChatTransport<ReaderChatMessage>["sendMessages"]>[0]): Promise<ReadableStream<UIMessageChunk>>;
    reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null>;
}
export declare function readerChatMessageText(message: ReaderChatMessage): string;
export {};
//# sourceMappingURL=retainpdf-chat-transport.d.ts.map
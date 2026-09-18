import type { ChatTransport, UIMessage, UIMessageChunk } from "ai";
import type { AiCitationLike } from "../../../shared/ai/answer-enhance.js";
import type { ReaderAgentRuntimeConfig } from "../../../contracts/ai-operations.js";
import type { ReaderAnswerer, ReaderAssistantMode } from "../../../contracts/ai-chat.js";
import type { ReaderAgentOperationSignal } from "./use-reader-agent-operations.js";
export type ReaderChatMetadata = {
    citations?: AiCitationLike[];
    progress?: string;
    persisted?: boolean;
    status?: "running" | "complete" | "cancelled" | "error";
    /** 终态文案。流还没开始就失败时（例如 409），消息里一个文本片段都没有，
     *  错误只存在于 error chunk 里，最终渲染成一个空气泡。 */
    statusText?: string;
};
export type ReaderChatMessage = UIMessage<ReaderChatMetadata>;
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
        getAssistantMode?: () => ReaderAssistantMode;
        onAgentOperationSignal?: (signal: Omit<ReaderAgentOperationSignal, "nonce">) => void;
        onConfirmationMode?: (mode: ReaderAgentRuntimeConfig["agent_confirmation_mode"]) => void;
    });
    sendMessages({ abortSignal, body, messages, trigger, }: Parameters<ChatTransport<ReaderChatMessage>["sendMessages"]>[0]): Promise<ReadableStream<UIMessageChunk>>;
    reconnectToStream(): Promise<ReadableStream<UIMessageChunk> | null>;
}
export declare function readerChatMessageText(message: ReaderChatMessage): string;
//# sourceMappingURL=retainpdf-chat-transport.d.ts.map
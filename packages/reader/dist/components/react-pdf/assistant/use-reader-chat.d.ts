import type { UIMessage } from "ai";
import type { ReaderAskStoreMessage } from "./reader-ask-tree.js";
import { RetainPdfChatTransport, type ReaderChatMessage } from "./retainpdf-chat-transport.js";
type ReaderAnswerer = ConstructorParameters<typeof RetainPdfChatTransport>[0] extends {
    getRemoteAnswerer: () => infer ANSWERER;
} ? ANSWERER : never;
export declare function storeMessagesToChat(messages: readonly ReaderAskStoreMessage[]): ReaderChatMessage[];
export declare function chatMessageToStore(message: ReaderChatMessage): ReaderAskStoreMessage;
export declare function useReaderChat(options: {
    jobId: string;
    remoteAnswerer: ReaderAnswerer;
    localAnswerer: ReaderAnswerer;
}): import("@ai-sdk/react").UseChatHelpers<ReaderChatMessage>;
export declare function lastAssistantMessage(messages: readonly UIMessage[]): UIMessage | undefined;
export {};
//# sourceMappingURL=use-reader-chat.d.ts.map
import { useMemo, useRef } from "react";
import { Chat, useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import type { ReaderAskStoreMessage } from "./reader-ask-tree.js";
import {
  readerChatMessageText,
  RetainPdfChatTransport,
  type ReaderChatMessage,
  type ReaderChatMetadata,
} from "./retainpdf-chat-transport.js";

type ReaderAnswerer = ConstructorParameters<typeof RetainPdfChatTransport>[0] extends {
  getRemoteAnswerer: () => infer ANSWERER;
} ? ANSWERER : never;

export function storeMessagesToChat(
  messages: readonly ReaderAskStoreMessage[],
): ReaderChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role,
    metadata: message.role === "assistant"
      ? {
        citations: message.citations || [],
        progress: message.progress || "",
        status: message.status?.type === "running"
          ? "running"
          : message.status?.type === "incomplete"
            ? message.status.reason === "cancelled" ? "cancelled" : "error"
            : "complete",
      }
      : undefined,
    parts: [{ type: "text", text: message.content || "" }],
  }));
}

export function chatMessageToStore(message: ReaderChatMessage): ReaderAskStoreMessage {
  const metadata = (message.metadata || {}) as ReaderChatMetadata;
  const running = metadata.status === "running";
  const incomplete = metadata.status === "cancelled" || metadata.status === "error";
  return {
    id: message.id,
    role: message.role as "user" | "assistant",
    content: readerChatMessageText(message),
    ...(message.role === "assistant" ? {
      citations: metadata.citations || [],
      progress: metadata.progress || "",
      status: running
        ? { type: "running" as const }
        : incomplete
          ? {
            type: "incomplete" as const,
            reason: metadata.status === "cancelled" ? "cancelled" as const : "error" as const,
          }
          : { type: "complete" as const, reason: "stop" as const },
    } : {}),
  };
}

export function useReaderChat(options: {
  jobId: string;
  remoteAnswerer: ReaderAnswerer;
  localAnswerer: ReaderAnswerer;
}) {
  const remoteRef = useRef(options.remoteAnswerer);
  const localRef = useRef(options.localAnswerer);
  remoteRef.current = options.remoteAnswerer;
  localRef.current = options.localAnswerer;

  const chat = useMemo(() => new Chat<ReaderChatMessage>({
    id: `reader-${options.jobId || "idle"}`,
    transport: new RetainPdfChatTransport({
      jobId: options.jobId,
      getRemoteAnswerer: () => remoteRef.current,
      getLocalAnswerer: () => localRef.current,
    }),
  }), [options.jobId]);

  // A job switch creates a fresh Chat instance whose initial message list is
  // already empty. Do not call setMessages from an effect here: useChat owns an
  // external store, and effect-driven resets can create a getSnapshot/update
  // cycle under React 19.
  return useChat<ReaderChatMessage>({ chat, experimental_throttle: 16 });
}

export function lastAssistantMessage(messages: readonly UIMessage[]): UIMessage | undefined {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].role === "assistant") return messages[index];
  }
  return undefined;
}

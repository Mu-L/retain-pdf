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
import type { AgentConfirmationMode } from "@retainpdf/api/agent-runtime-settings";
import type { ReaderAgentOperationSignal } from "./use-reader-agent-operations.js";
import type { ReaderAssistantMode } from "../../../shared/ai/ask-answerer.js";

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
  assistantMode: ReaderAssistantMode;
  onAgentOperationSignal?: (signal: Omit<ReaderAgentOperationSignal, "nonce">) => void;
  onConfirmationMode?: (mode: AgentConfirmationMode) => void;
}) {
  const remoteRef = useRef(options.remoteAnswerer);
  const localRef = useRef(options.localAnswerer);
  const operationSignalRef = useRef(options.onAgentOperationSignal);
  const confirmationModeRef = useRef(options.onConfirmationMode);
  const assistantModeRef = useRef(options.assistantMode);
  remoteRef.current = options.remoteAnswerer;
  localRef.current = options.localAnswerer;
  operationSignalRef.current = options.onAgentOperationSignal;
  confirmationModeRef.current = options.onConfirmationMode;
  assistantModeRef.current = options.assistantMode;

  const chat = useMemo(() => new Chat<ReaderChatMessage>({
    id: `reader-${options.jobId || "idle"}`,
    transport: new RetainPdfChatTransport({
      jobId: options.jobId,
      getRemoteAnswerer: () => remoteRef.current,
      getLocalAnswerer: () => localRef.current,
      getAssistantMode: () => assistantModeRef.current,
      onAgentOperationSignal: (signal) => operationSignalRef.current?.(signal),
      onConfirmationMode: (mode) => confirmationModeRef.current?.(mode),
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

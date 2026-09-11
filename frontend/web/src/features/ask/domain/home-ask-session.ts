// 会话列表项：服务端 ConversationRecord → 侧栏 HomeAskSession

import type { ConversationRecord } from "@/platform/api/index.js";

export type HomeAskSession = {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  documentId?: string;
};

export function recordToSession(c: ConversationRecord): HomeAskSession {
  const title = `${c.title || ""}`.trim() || "未命名对话";
  return {
    id: `${c.conversation_id || ""}`.trim(),
    title,
    updatedAt: `${c.updated_at || c.created_at || ""}`,
    messageCount: Number(c.message_count) || 0,
    documentId: `${c.document_id || ""}`.trim() || undefined,
  };
}

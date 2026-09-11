// 服务端消息/工具事件 → 主页 AI 消息模型（纯映射）

import type { HomeAskCitation, HomeAskMessage } from "./types.js";
import { makeId } from "./home-ask-ids.js";

export const TOOL_EVENT_LABELS: Record<string, string> = {
  search_markdown: "检索 Markdown",
  read_markdown_chunk: "阅读 Markdown 片段",
  list_documents: "确认文档信息",
  read_blocks: "阅读相关段落",
  search_favorites: "查找收藏",
  search_fulltext: "检索文档内容",
};

export function describeToolEvent(
  event: { tool?: string; event?: string; type?: string } | string | null | undefined,
): string {
  const key = typeof event === "string"
    ? event
    : (event?.tool || event?.event || event?.type || "");
  return TOOL_EVENT_LABELS[key] || (key ? `执行 ${key}` : "处理中");
}

export function parseCitations(raw: unknown): HomeAskCitation[] {
  if (Array.isArray(raw)) return raw as HomeAskCitation[];
  if (typeof raw === "string" && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export function messagesFromDetail(detail: {
  messages?: Array<{
    message_id?: string;
    role?: string;
    content?: string;
    citations_json?: string;
  }>;
}): HomeAskMessage[] {
  const list = Array.isArray(detail?.messages) ? detail.messages : [];
  return list
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      id: `${m.message_id || makeId("m")}`,
      role: m.role === "user" ? "user" as const : "assistant" as const,
      content: `${m.content || ""}`,
      citations: parseCitations(m.citations_json),
      status: "complete" as const,
    }));
}

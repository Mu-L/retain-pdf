// 服务端消息/工具事件 → 主页 AI 消息模型（纯映射）

import type { HomeAskCitation, HomeAskMessage } from "./types.js";
import { makeId } from "./home-ask-ids.js";

export function describeToolEvent(event: unknown): string {
  const e = event as { tool?: string; name?: string } | null;
  const tool = `${e?.tool || e?.name || ""}`.trim();
  if (!tool) return "正在检索…";
  if (tool.includes("search")) return "正在全文检索…";
  if (tool.includes("read")) return "正在阅读相关段落…";
  if (tool.includes("list")) return "正在浏览文档库…";
  if (tool.includes("favorite")) return "正在查阅收藏…";
  return `正在调用 ${tool}…`;
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

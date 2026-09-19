// 服务端消息/工具事件 → 主页 AI 消息模型（纯映射）

import { messagesToBranchItems, type MessageRecord } from "@/platform/api/index.js";
import type { HomeAskCitation, HomeAskMessage } from "./types.js";
import { makeId } from "./home-ask-ids.js";

export { TOOL_EVENT_LABELS, describeToolEvent } from "@retainpdf/domain/ai";

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

type BranchItem = ReturnType<typeof messagesToBranchItems>[number];

/**
 * 从 head 沿父链回溯出当前可见的那一条路径。
 *
 * 服务端 `GET /conversations/{id}` 返回的是**全量**消息（它自己的注释写着「全量消息建
 * 树」），而不是当前分支。重新生成会在同一个 user 节点下挂出兄弟 assistant 节点，照单
 * 全收就会把被丢弃的旧答案和新答案一起铺在线程里。
 *
 * 旧数据没有 parent_id（每条的 parentId 都是 null，于是有多个「根」），也可能没有
 * head_id。这两种情况下树是不成立的，退回按 seq 的平铺顺序——这是唯一能让历史会话
 * 继续正常显示的读法。
 */
function visiblePath(items: BranchItem[], headId: string): BranchItem[] {
  const byId = new Map(items.map((item) => [item.message.id, item]));
  const rootCount = items.filter((item) => !item.parentId).length;
  if (!headId || !byId.has(headId) || rootCount !== 1) return items;

  const path: BranchItem[] = [];
  const seen = new Set<string>();
  let cursor: string = headId;
  while (cursor && byId.has(cursor) && !seen.has(cursor)) {
    seen.add(cursor);
    const item = byId.get(cursor)!;
    path.push(item);
    cursor = `${item.parentId || ""}`;
  }
  return path.reverse();
}

export function messagesFromDetail(detail: {
  head_id?: string;
  messages?: Array<{
    message_id?: string;
    role?: string;
    content?: string;
    citations_json?: string;
    parent_id?: string;
    model?: string;
  }>;
}): HomeAskMessage[] {
  const list = Array.isArray(detail?.messages) ? detail.messages : [];
  // 先补齐 id：messagesToBranchItems 直接拿 message_id 当节点键，服务端漏给 id 的消息
  // 会退化成同一个 undefined 键，整棵树塌成一条。
  const records = list.map((m) => ({
    ...m,
    message_id: `${m?.message_id || makeId("m")}`,
  })) as MessageRecord[];

  // 记忆压缩的摘要以 role="assistant" 落库，但它不是回答——messagesToBranchItems 会按
  // model="memory/…" 把它藏掉并把子节点重新接到它父节点上。主页此前没有这一步，压缩一
  // 发生，线程里就会冒出一条用户没问过的「【对话摘要】…」。
  const items = messagesToBranchItems(records);

  return visiblePath(items, `${detail?.head_id || ""}`.trim()).map((item) => ({
    id: item.message.id,
    role: item.message.role,
    content: `${item.message.content || ""}`,
    citations: (item.message.citations || []) as HomeAskCitation[],
    status: "complete" as const,
    ...(item.parentId ? { parentId: item.parentId } : {}),
  }));
}

/**
 * 某条回答对应的提问。
 *
 * 优先走消息树上的 parentId；本轮刚发出、或旧会话父链缺失时，退回「它前面最近的
 * 那条 user」。重新生成靠它定位要挂的 parent——挂错了新答案就会接到别的轮次下面。
 */
export function findTurnUserMessage(
  messages: HomeAskMessage[],
  assistantId: string,
): HomeAskMessage | null {
  const index = messages.findIndex((m) => m.id === assistantId);
  if (index < 0) return null;
  const parentId = `${messages[index].parentId || ""}`;
  if (parentId) {
    const parent = messages.find((m) => m.id === parentId);
    if (parent?.role === "user") return parent;
  }
  for (let i = index - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") return messages[i];
  }
  return null;
}

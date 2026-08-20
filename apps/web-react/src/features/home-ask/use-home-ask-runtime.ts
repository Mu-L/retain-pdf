import { useCallback, useEffect, useRef, useState } from "react";
import { askLibraryAi, AiAskError } from "@retainpdf/api/ai";
import {
  deleteConversation,
  getConversation,
  listConversations,
  patchConversation,
  type ConversationRecord,
} from "@retainpdf/api/conversations";
import { resolveCollectionDocuments } from "./document-picker.ts";
import type { HomeAskCitation, HomeAskDocScope, HomeAskMessage, HomeAskScope } from "./types.ts";

const CONV_STORAGE_KEY = "retainpdf.home.ai.conversation.v1";
const BROWSER_CONFIG_STORAGE_KEY = "retainpdf.browser.config.v1";

export const CREDENTIALS_CHANGED_EVENT = "retainpdf:credentials-changed";
export const MISSING_MODEL_API_KEY_MESSAGE =
  "缺少模型 API Key：请到设置 → API 设置填写 DeepSeek 等模型 Key（不是后端 X-API-Key）。";

export type HomeAskSession = {
  id: string;
  title: string;
  updatedAt: string;
  messageCount: number;
  documentId?: string;
};

function loadConversationId(): string {
  try {
    return `${globalThis.localStorage?.getItem(CONV_STORAGE_KEY) || ""}`.trim();
  } catch {
    return "";
  }
}

function saveConversationId(id: string) {
  const next = `${id || ""}`.trim();
  try {
    if (!next) {
      globalThis.localStorage?.removeItem(CONV_STORAGE_KEY);
      return;
    }
    globalThis.localStorage?.setItem(CONV_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function describeToolEvent(event: unknown): string {
  const e = event as { tool?: string; name?: string } | null;
  const tool = `${e?.tool || e?.name || ""}`.trim();
  if (!tool) return "正在检索…";
  if (tool.includes("search")) return "正在全文检索…";
  if (tool.includes("read")) return "正在阅读相关段落…";
  if (tool.includes("list")) return "正在浏览文档库…";
  if (tool.includes("favorite")) return "正在查阅收藏…";
  return `正在调用 ${tool}…`;
}

function labelScope(s: HomeAskScope): string {
  if (s.kind === "collection") {
    const n = s.document_count != null ? `（${s.document_count} 篇）` : "";
    return `合集「${s.title}」${n}`;
  }
  return `文档「${s.title}」`;
}

function buildScopedQuestion(question: string, scopes: HomeAskScope[], resolvedDocs: HomeAskDocScope[] = []): string {
  const q = `${question || ""}`.trim();
  if (!q) return "";
  if (!scopes.length) return q;
  const hasCollection = scopes.some((s) => s.kind === "collection");
  if (!hasCollection && scopes.length === 1 && scopes[0].kind === "document") {
    return `（范围：文档「${scopes[0].title}」）${q}`;
  }
  const scopeLines = scopes.map((s, i) => `${i + 1}. ${labelScope(s)}`).join("\n");
  if (resolvedDocs.length > 0) {
    const docLines = resolvedDocs
      .slice(0, 40)
      .map((d, i) => `  ${i + 1}. ${d.title} (document_id=${d.id})`)
      .join("\n");
    const more = resolvedDocs.length > 40 ? `\n  …共 ${resolvedDocs.length} 篇` : "";
    return (
      `请仅在下列范围内检索与回答（不要使用范围外的文献）：\n` +
      `范围选择：\n${scopeLines}\n` +
      `包含文档：\n${docLines}${more}\n\n` +
      `问题：${q}`
    );
  }
  return `请在以下范围内检索并回答：\n${scopeLines}\n\n问题：${q}`;
}

async function resolveScopesForAsk(scopes: HomeAskScope[]): Promise<{
  primaryDoc: HomeAskDocScope | null;
  resolvedDocs: HomeAskDocScope[];
}> {
  if (!scopes.length) return { primaryDoc: null, resolvedDocs: [] };
  const docs: HomeAskDocScope[] = [];
  const seen = new Set<string>();
  for (const s of scopes) {
    if (s.kind === "document") {
      if (!seen.has(s.id)) {
        seen.add(s.id);
        docs.push(s);
      }
      continue;
    }
    try {
      const list = await resolveCollectionDocuments(s.id, 100);
      for (const d of list) {
        if (!seen.has(d.id)) {
          seen.add(d.id);
          docs.push(d);
        }
      }
    } catch {
      /* ignore */
    }
  }
  const primaryDoc = docs.length === 1 ? docs[0] : null;
  return { primaryDoc, resolvedDocs: docs };
}

function recordToSession(c: ConversationRecord): HomeAskSession {
  const title = `${c.title || ""}`.trim() || "未命名对话";
  return {
    id: `${c.conversation_id || ""}`.trim(),
    title,
    updatedAt: `${c.updated_at || c.created_at || ""}`,
    messageCount: Number(c.message_count) || 0,
    documentId: `${c.document_id || ""}`.trim() || undefined,
  };
}

function parseCitations(raw: unknown): HomeAskCitation[] {
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

function messagesFromDetail(detail: {
  messages?: Array<{ message_id?: string; role?: string; content?: string; citations_json?: string }>;
}): HomeAskMessage[] {
  const list = Array.isArray(detail?.messages) ? detail.messages : [];
  return list
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({
      id: `${m.message_id || makeId("m")}`,
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: `${m.content || ""}`,
      citations: parseCitations(m.citations_json),
      status: "complete" as const,
    }));
}

function readStoredModelApiKey(): string {
  try {
    const raw = globalThis.localStorage?.getItem(BROWSER_CONFIG_STORAGE_KEY) || "";
    if (raw) {
      const parsed = JSON.parse(raw);
      const v = `${(parsed as Record<string, unknown>)?.modelApiKey || ""}`.trim();
      if (v) return v;
    }
  } catch {
    /* ignore */
  }
  try {
    const cfg = (globalThis as unknown as { __FRONT_RUNTIME_CONFIG__?: Record<string, unknown> })
      .__FRONT_RUNTIME_CONFIG__;
    const v = `${cfg?.modelApiKey || ""}`.trim();
    if (v) return v;
  } catch {
    /* ignore */
  }
  return "";
}

export function hasModelApiKey(): boolean {
  return Boolean(readStoredModelApiKey());
}

function resolveReaderAiConfig(): { apiKey: string; baseUrl: string; model: string } {
  let baseUrl = "";
  let model = "";
  try {
    const cfg = (globalThis as unknown as { __FRONT_RUNTIME_CONFIG__?: Record<string, unknown> })
      .__FRONT_RUNTIME_CONFIG__;
    baseUrl = `${cfg?.baseUrl || cfg?.modelBaseUrl || ""}`.trim();
    model = `${cfg?.model || cfg?.modelName || ""}`.trim();
    // legacy keys
    if (!baseUrl) baseUrl = `${(cfg as Record<string, unknown>)?.base_url || ""}`.trim();
    if (!model) model = `${(cfg as Record<string, unknown>)?.model_name || ""}`.trim();
  } catch {
    /* ignore */
  }
  // try developer config storage
  try {
    const devRaw = globalThis.localStorage?.getItem("retainpdf.developer.config.v1") || "";
    if (devRaw) {
      const dev = JSON.parse(devRaw) as Record<string, unknown>;
      if (!baseUrl) baseUrl = `${dev.baseUrl || dev.base_url || ""}`.trim();
      if (!model) model = `${dev.model || ""}`.trim();
    }
  } catch {
    /* ignore */
  }
  return { apiKey: readStoredModelApiKey(), baseUrl, model };
}

// — sanitize — copied from @retainpdf/reader shared
const BLOCK_BRACKET_RE = /\[\s*(p\d+[-_]b\d+)\s*\]/gi;
const BLOCK_BARE_RE = /(?<![\w/])(p\d+[-_]b\d+)(?![\w/])/gi;
function normBlockId(id: string): string {
  return `${id || ""}`.trim().toLowerCase().replace(/_/g, "-");
}
const CODE_SEGMENT_RE = /```[\s\S]*?(?:```|$)|`[^`\n]+`/g;
const CODE_SLOT_PREFIX = "CODE_";
const CODE_SLOT_SUFFIX = "";
export function sanitizeAssistantAnswer(text: string, citations: HomeAskCitation[] = []): string {
  let out = `${text || ""}`;
  if (!out) return "";
  const codeSlots: string[] = [];
  out = out.replace(CODE_SEGMENT_RE, (segment) => {
    const token = `${CODE_SLOT_PREFIX}${codeSlots.length}${CODE_SLOT_SUFFIX}`;
    codeSlots.push(segment);
    return token;
  });
  const byBlock = new Map<string, string>();
  for (const c of citations) {
    const id = normBlockId(`${(c as HomeAskCitation).block_id || ""}`);
    if (!id) continue;
    const ref = `${(c as HomeAskCitation).ref ?? ""}`.trim();
    if (ref) byBlock.set(id, ref);
  }
  out = out.replace(BLOCK_BRACKET_RE, (_m, id: string) => {
    const ref = byBlock.get(normBlockId(id));
    return ref ? `[${ref}]` : "";
  });
  out = out.replace(BLOCK_BARE_RE, (_m, id: string) => {
    const ref = byBlock.get(normBlockId(id));
    return ref ? `[${ref}]` : "";
  });
  out = out.replace(/\bblock_id\s*[=:：]\s*\S+/gi, "");
  out = out.replace(/\bpage_idx\s*[=:：]\s*\d+/gi, "");
  out = out.replace(/[ \t]{2,}/g, " ");
  out = out.replace(/ *\n/g, "\n");
  out = out.trim();
  if (codeSlots.length) {
    out = out.replace(
      new RegExp(`${CODE_SLOT_PREFIX}(\\d+)${CODE_SLOT_SUFFIX}`, "g"),
      (_m, idx: string) => codeSlots[Number(idx)] ?? "",
    );
  }
  return out;
}

export function useHomeAskRuntime() {
  const [messages, setMessages] = useState<HomeAskMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [conversationId, setConversationId] = useState(loadConversationId);
  const [sessions, setSessions] = useState<HomeAskSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionBusy, setSessionBusy] = useState(false);
  const runningRef = useRef(false);
  const conversationIdRef = useRef(conversationId);
  const abortRef = useRef<AbortController | null>(null);
  const streamingAssistantIdRef = useRef("");
  conversationIdRef.current = conversationId;

  const patchMessage = useCallback((id: string, patch: Partial<HomeAskMessage>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }, []);

  const refreshSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const res = await listConversations({ limit: 80 });
      const list = (res.conversations || []).map(recordToSession).filter((s) => s.id);
      setSessions(list);
    } catch {
      /* ignore */
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    const id = loadConversationId();
    if (!id) return;
    let cancelled = false;
    void (async () => {
      try {
        const detail = await getConversation(id);
        if (cancelled) return;
        setConversationId(id);
        conversationIdRef.current = id;
        setMessages(messagesFromDetail(detail));
      } catch {
        if (!cancelled) {
          saveConversationId("");
          setConversationId("");
          conversationIdRef.current = "";
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stop = useCallback(() => {
    const ctrl = abortRef.current;
    if (!ctrl) return;
    try {
      ctrl.abort();
    } catch {
      /* ignore */
    }
  }, []);

  const newSession = useCallback(() => {
    if (runningRef.current) {
      try {
        abortRef.current?.abort();
      } catch {
        /* ignore */
      }
    }
    setMessages([]);
    setConversationId("");
    conversationIdRef.current = "";
    saveConversationId("");
  }, []);

  const switchSession = useCallback(
    async (id: string) => {
      const next = `${id || ""}`.trim();
      if (!next || runningRef.current || sessionBusy) return;
      if (next === conversationIdRef.current && messages.length > 0) return;
      setSessionBusy(true);
      try {
        const detail = await getConversation(next);
        setConversationId(next);
        conversationIdRef.current = next;
        saveConversationId(next);
        setMessages(messagesFromDetail(detail));
      } catch {
        /* ignore */
      } finally {
        setSessionBusy(false);
      }
    },
    [messages.length, sessionBusy],
  );

  const removeSession = useCallback(
    async (id: string) => {
      const next = `${id || ""}`.trim();
      if (!next || runningRef.current || sessionBusy) return;
      setSessionBusy(true);
      try {
        await deleteConversation(next);
        setSessions((prev) => prev.filter((s) => s.id !== next));
        if (conversationIdRef.current === next) {
          setMessages([]);
          setConversationId("");
          conversationIdRef.current = "";
          saveConversationId("");
        }
      } catch {
        /* ignore */
      } finally {
        setSessionBusy(false);
        void refreshSessions();
      }
    },
    [refreshSessions, sessionBusy],
  );

  const renameSession = useCallback(
    async (id: string, title: string) => {
      const next = `${id || ""}`.trim();
      const nextTitle = `${title || ""}`.trim();
      if (!next || !nextTitle || runningRef.current || sessionBusy) return false;
      setSessionBusy(true);
      try {
        const updated = await patchConversation(next, { title: nextTitle });
        const finalTitle = `${updated?.title || nextTitle}`.trim() || nextTitle;
        setSessions((prev) =>
          prev.map((s) => (s.id === next ? { ...s, title: finalTitle, updatedAt: `${updated?.updated_at || s.updatedAt}` } : s)),
        );
        return true;
      } catch {
        return false;
      } finally {
        setSessionBusy(false);
      }
    },
    [sessionBusy],
  );

  const send = useCallback(
    async (rawQuestion: string, scopes: HomeAskScope[] = []) => {
      const question = `${rawQuestion || ""}`.trim();
      if (!question || runningRef.current) return;
      const config = resolveReaderAiConfig();
      const apiKey = `${config.apiKey || ""}`.trim();
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          { id: makeId("a"), role: "assistant", content: MISSING_MODEL_API_KEY_MESSAGE, status: "error" },
        ]);
        return;
      }
      const userId = makeId("u");
      const assistantId = makeId("a");
      const displayUser = scopes.length
        ? `${question}\n\n${scopes.map((s) => (s.kind === "collection" ? `@合集:${s.title}` : `@${s.title}`)).join(" ")}`
        : question;
      try {
        abortRef.current?.abort();
      } catch {
        /* ignore */
      }
      const abort = new AbortController();
      abortRef.current = abort;
      streamingAssistantIdRef.current = assistantId;
      runningRef.current = true;
      setIsRunning(true);
      setMessages((prev) => [
        ...prev,
        { id: userId, role: "user", content: displayUser, status: "complete" },
        {
          id: assistantId,
          role: "assistant",
          content: "",
          progress: scopes.some((s) => s.kind === "collection") ? "正在解析合集…" : "正在准备…",
          status: "streaming",
        },
      ]);
      try {
        const { primaryDoc, resolvedDocs } = await resolveScopesForAsk(scopes);
        if (abort.signal.aborted) throw new DOMException("Aborted", "AbortError");
        if (scopes.some((s) => s.kind === "collection") && resolvedDocs.length === 0) {
          const emptyCol = scopes.find((s) => s.kind === "collection");
          patchMessage(assistantId, {
            content: `合集「${emptyCol?.title || ""}」里还没有文档，请先往合集加入文献后再问。`,
            progress: "",
            status: "error",
            citations: [],
          });
          return;
        }
        const scopedQuestion = buildScopedQuestion(question, scopes, resolvedDocs);
        let answerStarted = false;
        const result = await askLibraryAi({
          question: scopedQuestion,
          documentId: primaryDoc?.id || "",
          jobId: primaryDoc?.job_id || "",
          conversationId: conversationIdRef.current,
          userMessageId: userId,
          assistantMessageId: assistantId,
          llmApiKey: apiKey,
          llmBaseUrl: config.baseUrl,
          llmModel: config.model,
          signal: abort.signal,
          onToolEvent: (event: unknown) => {
            if (abort.signal.aborted || answerStarted) return;
            patchMessage(assistantId, { progress: describeToolEvent(event), status: "streaming" });
          },
          onAnswerDelta: (fullText: string) => {
            if (abort.signal.aborted) return;
            answerStarted = true;
            const cleaned = sanitizeAssistantAnswer(fullText || "", []);
            const show = cleaned.trim() ? cleaned : `${fullText || ""}`;
            patchMessage(assistantId, { content: show, progress: "", status: "streaming" });
          },
        });
        if (abort.signal.aborted) throw new DOMException("Aborted", "AbortError");
        const citations = (Array.isArray((result as { citations?: unknown })?.citations)
          ? (result as { citations: HomeAskCitation[] }).citations
          : []) as HomeAskCitation[];
        const answer = sanitizeAssistantAnswer(`${(result as { answer?: string })?.answer || ""}`.trim() || "没有找到可用回答。", citations);
        const nextConv = `${(result as { conversationId?: string })?.conversationId || ""}`.trim();
        if (nextConv) {
          setConversationId(nextConv);
          conversationIdRef.current = nextConv;
          saveConversationId(nextConv);
        }
        patchMessage(assistantId, { content: answer, citations, progress: "", status: "complete" });
        void refreshSessions();
      } catch (error) {
        const aborted =
          (error instanceof DOMException && error.name === "AbortError") ||
          (error instanceof Error && (error.name === "AbortError" || /abort/i.test(error.message))) ||
          abort.signal.aborted;
        if (aborted) {
          setMessages((prev) =>
            prev.map((m) => {
              if (m.id !== assistantId) return m;
              const partial = `${m.content || ""}`.trim();
              return {
                ...m,
                content: partial ? `${partial}\n\n_（已停止生成）_` : "_（已停止生成）_",
                progress: "",
                status: "complete" as const,
              };
            }),
          );
        } else {
          const msg =
            error instanceof AiAskError
              ? error.message
              : error instanceof Error
                ? error.message
                : "生成回答失败，请重试。";
          patchMessage(assistantId, { content: msg, progress: "", status: "error", citations: [] });
        }
      } finally {
        if (abortRef.current === abort) abortRef.current = null;
        streamingAssistantIdRef.current = "";
        runningRef.current = false;
        setIsRunning(false);
      }
    },
    [patchMessage, refreshSessions],
  );

  return {
    messages,
    isRunning,
    conversationId,
    sessions,
    sessionsLoading,
    sessionBusy,
    hasLlmKey: hasModelApiKey,
    send,
    stop,
    newSession,
    switchSession,
    removeSession,
    renameSession,
    refreshSessions,
    clearChat: newSession,
  };
}

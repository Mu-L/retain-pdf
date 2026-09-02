import { r as F } from "./config-CgaWliJ_.js";
const p = "retainpdf.reader.ai.conversation.v1:";
function g(e = {}) {
  const n = `${e.jobId || ""}`.trim(), r = `${e.documentId || ""}`.trim();
  return n ? `${p}job:${n}` : r ? `${p}doc:${r}` : `${p}anonymous`;
}
function w() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function E(e = {}) {
  const n = w();
  if (!n)
    return "";
  try {
    return `${n.getItem(g(e)) || ""}`.trim();
  } catch {
    return "";
  }
}
function N(e, n) {
  const r = `${n || ""}`.trim(), o = w();
  if (!(!o || !r))
    try {
      o.setItem(g(e), r);
    } catch {
    }
}
function y(e = {}) {
  const n = w();
  if (n)
    try {
      n.removeItem(g(e));
    } catch {
    }
}
const Q = "/api/v1";
function X() {
  throw new Error("ask not injected (provide ask impl via createReaderAskAnswerer)");
}
function q() {
  return Promise.resolve(null);
}
const G = 240;
function L(e = "", n = G) {
  const r = `${e}`.replace(/\s+/g, " ").trim();
  return r.length <= n ? r : `${r.slice(0, n).trim()}…`;
}
function O({ question: e = "", scope: n = "document", context: r = null, resolveQuote: o = null } = {}) {
  const i = `${e}`.trim();
  if (!i)
    return "";
  if (n === "selection") {
    const a = typeof o == "function" && r ? o(r) : null, u = L((a == null ? void 0 : a.quoteText) || "");
    if (u)
      return `（针对选中的原文片段：「${u}」）${i}`;
    if (r != null && r.page)
      return `（针对第 ${Number(r.page)} 页的选区内容）${i}`;
  }
  return n === "page" && (r != null && r.page) ? `（当前第 ${Number(r.page)} 页）${i}` : i;
}
function H({
  jobId: e = "",
  apiPrefix: n = Q,
  ask: r = X,
  documentByJobId: o = q,
  resolveQuote: i = null,
  // 前端凭据设置里的模型 API Key(与翻译流程同源),按请求随问答一起传给后端
  llmConfig: a = F
} = {}) {
  let u = null, s = E({ jobId: e });
  function $() {
    return u || (u = (async () => {
      try {
        const t = await o(n, e);
        return `${(t == null ? void 0 : t.document_id) || ""}`.trim();
      } catch {
        return "";
      }
    })()), u;
  }
  function A(t, c = "") {
    const l = `${t || ""}`.trim();
    l && (s = l, N({ jobId: e, documentId: c }, l));
  }
  async function T({
    question: t = "",
    scope: c = "document",
    context: l = null,
    onToolEvent: S = null,
    onAgentOperationEvent: b = null,
    onAgentConfirmationRequiredEvent: C = null,
    onAgentSessionEvent: _ = null,
    onAnswerDelta: R = null,
    onCompress: k = null,
    parentId: P = "",
    regenerate: B = !1,
    userMessageId: D = "",
    assistantMessageId: K = "",
    assistantMode: M = "reading",
    /** 取消信号：中止 SSE；aborted 后不回写会话粘性（防旧流污染新会话） */
    signal: d = null
  } = {}) {
    const h = O({ context: l, question: t, resolveQuote: i, scope: c });
    if (!h)
      throw new Error("请输入问题。");
    const I = typeof a == "function" ? a() : a || {}, U = `${I.apiKey || ""}`.trim(), m = await $();
    if (!m && `${e || ""}`.trim())
      throw new Error("无法关联当前文档，暂不能做整本问答。请确认任务已绑定文档后重试。");
    s || (s = E({ jobId: e, documentId: m }));
    const f = await r({
      question: h,
      documentId: m,
      jobId: `${e || ""}`.trim(),
      conversationId: s,
      parentId: `${P || ""}`.trim(),
      regenerate: !!B,
      userMessageId: `${D || ""}`.trim(),
      assistantMessageId: `${K || ""}`.trim(),
      assistantMode: M,
      onToolEvent: S,
      onAgentOperationEvent: b,
      onAgentConfirmationRequiredEvent: C,
      onAgentSessionEvent: _,
      onAnswerDelta: R,
      onCompress: k,
      llmApiKey: U,
      llmBaseUrl: `${I.baseUrl || ""}`.trim(),
      llmModel: `${I.model || ""}`.trim(),
      signal: d
    }), v = `${(f == null ? void 0 : f.conversationId) || ""}`.trim();
    return v && !(d != null && d.aborted) && A(v, m), {
      ...f,
      conversationId: v || s,
      scope: c
    };
  }
  return {
    answer: T,
    getConversationId: () => s,
    setConversationId: (t, c = "") => {
      A(t, c);
    },
    clearConversationId: (t = "") => {
      s = "", y({ jobId: e, documentId: t }), t && y({ documentId: t }), y({ jobId: e });
    },
    getDocumentId: () => $(),
    ensureLoaded: async () => !!await $()
  };
}
export {
  g as a,
  O as b,
  y as c,
  H as d,
  E as l,
  N as s
};
//# sourceMappingURL=ask-answerer-CG3B68VS.js.map

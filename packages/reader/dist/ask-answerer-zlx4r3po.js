import { r as D, M as K } from "./config-CgaWliJ_.js";
const p = "retainpdf.reader.ai.conversation.v1:";
function w(e = {}) {
  const t = `${e.jobId || ""}`.trim(), r = `${e.documentId || ""}`.trim();
  return t ? `${p}job:${t}` : r ? `${p}doc:${r}` : `${p}anonymous`;
}
function E() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function h(e = {}) {
  const t = E();
  if (!t)
    return "";
  try {
    return `${t.getItem(w(e)) || ""}`.trim();
  } catch {
    return "";
  }
}
function B(e, t) {
  const r = `${t || ""}`.trim(), o = E();
  if (!(!o || !r))
    try {
      o.setItem(w(e), r);
    } catch {
    }
}
function y(e = {}) {
  const t = E();
  if (t)
    try {
      t.removeItem(w(e));
    } catch {
    }
}
const G = "/api/v1";
function N() {
  throw new Error("ask not injected (provide ask impl via createReaderAskAnswerer)");
}
function U() {
  return Promise.resolve(null);
}
const F = 240;
function L(e = "", t = F) {
  const r = `${e}`.replace(/\s+/g, " ").trim();
  return r.length <= t ? r : `${r.slice(0, t).trim()}…`;
}
function O({ question: e = "", scope: t = "document", context: r = null, resolveQuote: o = null } = {}) {
  const i = `${e}`.trim();
  if (!i)
    return "";
  if (t === "selection") {
    const a = typeof o == "function" && r ? o(r) : null, u = L((a == null ? void 0 : a.quoteText) || "");
    if (u)
      return `（针对选中的原文片段：「${u}」）${i}`;
    if (r != null && r.page)
      return `（针对第 ${Number(r.page)} 页的选区内容）${i}`;
  }
  return t === "page" && (r != null && r.page) ? `（当前第 ${Number(r.page)} 页）${i}` : i;
}
function X({
  jobId: e = "",
  apiPrefix: t = G,
  ask: r = N,
  documentByJobId: o = U,
  resolveQuote: i = null,
  // 前端凭据设置里的模型 API Key(与翻译流程同源),按请求随问答一起传给后端
  llmConfig: a = D
} = {}) {
  let u = null, s = h({ jobId: e });
  function $() {
    return u || (u = (async () => {
      try {
        const n = await o(t, e);
        return `${(n == null ? void 0 : n.document_id) || ""}`.trim();
      } catch {
        return "";
      }
    })()), u;
  }
  function g(n, c = "") {
    const l = `${n || ""}`.trim();
    l && (s = l, B({ jobId: e, documentId: c }, l));
  }
  async function _({
    question: n = "",
    scope: c = "document",
    context: l = null,
    onToolEvent: T = null,
    onAnswerDelta: M = null,
    onCompress: b = null,
    parentId: C = "",
    regenerate: P = !1,
    userMessageId: R = "",
    assistantMessageId: k = "",
    /** 取消信号：中止 SSE；aborted 后不回写会话粘性（防旧流污染新会话） */
    signal: d = null
  } = {}) {
    const A = O({ context: l, question: n, resolveQuote: i, scope: c });
    if (!A)
      throw new Error("请输入问题。");
    const I = typeof a == "function" ? a() : a || {}, S = `${I.apiKey || ""}`.trim();
    if (!S)
      throw new Error(K);
    const m = await $();
    if (!m && `${e || ""}`.trim())
      throw new Error("无法关联当前文档，暂不能做整本问答。请确认任务已绑定文档后重试。");
    s || (s = h({ jobId: e, documentId: m }));
    const f = await r({
      question: A,
      documentId: m,
      jobId: `${e || ""}`.trim(),
      conversationId: s,
      parentId: `${C || ""}`.trim(),
      regenerate: !!P,
      userMessageId: `${R || ""}`.trim(),
      assistantMessageId: `${k || ""}`.trim(),
      onToolEvent: T,
      onAnswerDelta: M,
      onCompress: b,
      llmApiKey: S,
      llmBaseUrl: `${I.baseUrl || ""}`.trim(),
      llmModel: `${I.model || ""}`.trim(),
      signal: d
    }), v = `${(f == null ? void 0 : f.conversationId) || ""}`.trim();
    return v && !(d != null && d.aborted) && g(v, m), {
      ...f,
      conversationId: v || s,
      scope: c
    };
  }
  return {
    answer: _,
    getConversationId: () => s,
    setConversationId: (n, c = "") => {
      g(n, c);
    },
    clearConversationId: (n = "") => {
      s = "", y({ jobId: e, documentId: n }), n && y({ documentId: n }), y({ jobId: e });
    },
    getDocumentId: () => $(),
    ensureLoaded: async () => !!await $()
  };
}
export {
  w as a,
  O as b,
  y as c,
  X as d,
  h as l,
  B as s
};
//# sourceMappingURL=ask-answerer-zlx4r3po.js.map

import { n as b } from "./markdown-payload-BLt0pYzy.js";
import { l as v } from "./ask-answerer-zlx4r3po.js";
function A(e = null) {
  return b(e).content.trim();
}
function g(e = "") {
  return `${e}`.replace(/```[\s\S]*?```/g, " ").replace(/!\[[^\]]*]\([^)]+\)/g, " ").replace(/\[[^\]]+]\([^)]+\)/g, " ").replace(/[#>*_`~|[\]()]/g, " ").replace(/\s+/g, " ").trim();
}
function C(e = "") {
  const n = g(e).toLowerCase(), t = n.match(/[a-z0-9][a-z0-9-]{1,}/g) || [], r = n.match(/[\u4e00-\u9fff]{2,}/g) || [];
  return [.../* @__PURE__ */ new Set([...t, ...r])].slice(0, 40);
}
function O(e = "") {
  const n = [];
  let t = "文档开头", r = [];
  for (const o of `${e}`.split(/\r?\n/)) {
    const s = o.match(/^(#{1,4})\s+(.+?)\s*$/);
    s && r.join(`
`).trim() && (n.push({
      title: t,
      text: r.join(`
`).trim()
    }), r = []), s && (t = s[2].trim()), r.push(o);
  }
  return r.join(`
`).trim() && n.push({
    title: t,
    text: r.join(`
`).trim()
  }), n;
}
function R(e, n) {
  const t = g(`${e.title}
${e.text}`).toLowerCase();
  return n.reduce((r, o) => r + (t.includes(o) ? 1 : 0), 0);
}
function T(e = "", n = 420) {
  const t = g(e);
  return t.length <= n ? t : `${t.slice(0, n).trim()}...`;
}
function z(e, n) {
  return n.length ? [
    "我先基于当前 Markdown 找到这些相关片段：",
    ...n.map((r, o) => `${o + 1}. ${r.title}：${T(r.text)}`),
    "",
    `问题：${e}`
  ].join(`
`) : "我没有在当前 Markdown 里找到足够相关的片段。可以换一个更具体的问题，或确认这个任务已经生成 Markdown。";
}
function D({
  loadMarkdownPayload: e,
  maxSections: n = 3
} = {}) {
  let t = null, r = "";
  async function o(i) {
    return r || (t = await (e == null ? void 0 : e(i)), r = A(t), r);
  }
  async function s({ jobId: i = "", question: c = "", scope: a = "document", context: u = null } = {}) {
    const $ = await o(i);
    if (!$)
      throw new Error("当前任务还没有可用于问答的 Markdown。");
    const I = C(`${c} ${u != null && u.page ? `第 ${u.page} 页` : ""}`), y = O($).map((l) => ({
      ...l,
      score: R(l, I)
    })).sort((l, d) => d.score - l.score).filter((l, d) => l.score > 0 || d < n).slice(0, n);
    return {
      answer: z(c, y),
      citations: y.map((l) => l.title),
      scope: a
    };
  }
  return {
    answer: s,
    ensureLoaded: o
  };
}
const B = /\[\s*(p\d+[-_]b\d+)\s*\]/gi, w = new RegExp("(?<![\\w/])(p\\d+[-_]b\\d+)(?![\\w/])", "gi");
function p(e) {
  return `${e || ""}`.trim().toLowerCase().replace(/_/g, "-");
}
const L = /```[\s\S]*?(?:```|$)|`[^`\n]+`/g, S = "CODE_", _ = "";
function K(e, n = []) {
  let t = `${e || ""}`;
  if (!t) return "";
  const r = [];
  t = t.replace(L, (s) => {
    const i = `${S}${r.length}${_}`;
    return r.push(s), i;
  });
  const o = /* @__PURE__ */ new Map();
  for (const s of n) {
    const i = p(`${s.block_id || ""}`);
    if (!i) continue;
    const c = `${s.ref ?? ""}`.trim();
    c && o.set(i, c);
  }
  return t = t.replace(B, (s, i) => {
    const c = o.get(p(i));
    return c ? `[${c}]` : "";
  }), t = t.replace(w, (s, i) => {
    const c = o.get(p(i));
    return c ? `[${c}]` : "";
  }), t = t.replace(/\bblock_id\s*[=:：]\s*\S+/gi, ""), t = t.replace(/\bpage_idx\s*[=:：]\s*\d+/gi, ""), t = t.replace(/[ \t]{2,}/g, " "), t = t.replace(/ *\n/g, `
`), t = t.trim(), r.length && (t = t.replace(
    new RegExp(`${S}(\\d+)${_}`, "g"),
    (s, i) => r[Number(i)] ?? ""
  )), t;
}
const k = "retainpdf.reader.ai.thread-branch.v1:";
function f(e, n = "") {
  const t = `${e || ""}`.trim(), r = `${n || ""}`.trim();
  return r ? `${k}job:${t || "anonymous"}:conv:${r}` : `${k}job:${t || "anonymous"}`;
}
function h() {
  try {
    return typeof globalThis.localStorage > "u" ? null : globalThis.localStorage;
  } catch {
    return null;
  }
}
function m(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function M(e) {
  if (!m(e) || typeof e.type != "string") return;
  const n = typeof e.reason == "string" ? e.reason : void 0;
  return n ? { type: e.type, reason: n } : { type: e.type };
}
function j(e) {
  if (!m(e)) return null;
  const n = `${e.id || ""}`.trim(), t = e.role === "user" || e.role === "assistant" ? e.role : null;
  if (!n || !t) return null;
  const r = Array.isArray(e.citations) ? e.citations : void 0, o = typeof e.progress == "string" ? e.progress : void 0;
  let s = M(e.status);
  return (s == null ? void 0 : s.type) === "running" && (s = { type: "incomplete", reason: "cancelled" }), {
    id: n,
    role: t,
    content: typeof e.content == "string" ? e.content : "",
    ...o ? { progress: o } : {},
    ...r != null && r.length ? { citations: r } : {},
    ...s ? { status: s } : {}
  };
}
function E(e) {
  var s;
  if (!m(e) || e.version !== 1 || !Array.isArray(e.items))
    return null;
  const n = [];
  for (const i of e.items) {
    if (!m(i)) continue;
    const c = j(i.message);
    if (!c) continue;
    const a = i.parentId === null || i.parentId === void 0 ? null : `${i.parentId}`.trim() || null;
    n.push({ parentId: a, message: c });
  }
  if (!n.length) return null;
  const t = e.headId, r = t == null ? ((s = n[n.length - 1]) == null ? void 0 : s.message.id) ?? null : `${t}`.trim() || null, o = `${e.conversationId || ""}`.trim();
  return { version: 1, headId: r, items: n, ...o ? { conversationId: o } : {} };
}
function J(e, n = "") {
  const t = h();
  if (!t) return null;
  try {
    const r = t.getItem(f(e, n));
    if (!r && n) {
      const i = t.getItem(f(e));
      if (!i) return null;
      const c = E(JSON.parse(i));
      if (!c) return null;
      const a = `${c.conversationId || ""}`.trim();
      if (a)
        return a === n ? c : null;
      const u = v({ jobId: e });
      return u && u === n ? c : null;
    }
    if (!r) return null;
    const o = E(JSON.parse(r));
    if (!o) return null;
    const s = `${o.conversationId || ""}`.trim();
    return s && n && s !== n ? null : o;
  } catch {
    return null;
  }
}
function X(e, n, t = "") {
  const r = h();
  if (!r) return;
  const o = `${e || ""}`.trim();
  if (!(!o || !n.items.length))
    try {
      const s = {
        version: 1,
        headId: n.headId,
        items: n.items,
        ...t ? { conversationId: t } : {}
      };
      r.setItem(
        f(o, t),
        JSON.stringify(s)
      );
    } catch {
    }
}
function x(e, n = "") {
  const t = h();
  if (t)
    try {
      t.removeItem(f(e, n)), n || t.removeItem(f(e));
    } catch {
    }
}
function G(e) {
  const n = new Map(e.items.map((i) => [i.message.id, i])), t = e.headId && n.get(e.headId) || e.items[e.items.length - 1];
  if (!t) return [];
  const r = [];
  let o = t;
  const s = /* @__PURE__ */ new Set();
  for (; o && !s.has(o.message.id); )
    s.add(o.message.id), r.push(o.message), o = o.parentId ? n.get(o.parentId) : void 0;
  return r.reverse();
}
export {
  D as a,
  X as b,
  x as c,
  J as l,
  K as s,
  f as t,
  G as v
};
//# sourceMappingURL=thread-branch-store-BGGAKERc.js.map

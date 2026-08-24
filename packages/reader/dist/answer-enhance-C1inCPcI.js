let v = 0, m = null, k = null, A = !1;
function E(t = Date.now()) {
  return t < v;
}
function M(t = 700) {
  const c = Date.now() + Math.max(0, t);
  c > v && (v = c);
}
function U() {
  v = 0, m == null || m(), m = null, I();
}
function j() {
  if (typeof document > "u") return null;
  if (k && k.isConnected) return k;
  const t = document.createElement("div");
  t.setAttribute("data-reader-ai-pointer-shield", "1"), t.setAttribute("aria-hidden", "true"), Object.assign(t.style, {
    position: "fixed",
    inset: "0",
    zIndex: "2147483000",
    cursor: "progress",
    background: "transparent",
    // 只作为切会话期间的状态标记，不再成为全屏命中目标。
    // 真正需要阻止的是引用/链接导航；编辑器、按钮和文本选择必须可用。
    pointerEvents: "none"
  });
  const c = (e) => {
    var o;
    e.preventDefault(), e.stopPropagation(), (o = e.stopImmediatePropagation) == null || o.call(e);
  };
  for (const e of [
    "pointerdown",
    "pointerup",
    "mousedown",
    "mouseup",
    "click",
    "auxclick",
    "dblclick",
    "contextmenu",
    "touchstart",
    "touchend"
  ])
    t.addEventListener(e, c, { capture: !0, passive: !1 });
  return document.documentElement.appendChild(t), k = t, t;
}
function I() {
  if (k) {
    try {
      k.remove();
    } catch {
    }
    k = null;
  }
}
function S(t = 700, c = {}) {
  if (M(t), typeof document > "u") return;
  m == null || m(), m = null;
  const e = Date.now() + Math.max(0, t), o = Math.max(0, Number(c.overlayDelayMs) || 0);
  let n = null;
  o === 0 ? j() : n = setTimeout(() => {
    n = null, Date.now() < e && j();
  }, o);
  const i = (r) => {
    var f;
    if (Date.now() >= e) {
      l();
      return;
    }
    const s = r.target;
    s instanceof Element && s.closest(
      "[data-reader-ai-sessions], [data-reader-ai-actions], [data-reader-ai-composer], .aui-composer, input, textarea, select, [contenteditable='true']"
    ) || (r.preventDefault(), r.stopPropagation(), (f = r.stopImmediatePropagation) == null || f.call(r));
  }, a = { capture: !0, passive: !1 }, u = ["click", "auxclick", "dblclick", "pointerup", "mouseup"], l = () => {
    n != null && (clearTimeout(n), n = null);
    for (const r of u)
      document.removeEventListener(r, i, a);
    I(), m === l && (m = null);
  };
  for (const r of u)
    document.addEventListener(r, i, a);
  m = l, window.setTimeout(l, Math.max(0, t) + 48);
}
function x(t) {
  return E() ? !0 : t ? typeof MouseEvent < "u" && t instanceof MouseEvent && t.isTrusted === !1 : !1;
}
function z() {
  if (typeof window > "u" || typeof window.open != "function")
    return () => {
    };
  if (A) return () => {
  };
  A = !0, U();
  const t = window.open.bind(window);
  window.open = ((e, o, n) => E() ? null : t(e, o, n));
  const c = (e) => {
    if (!E()) return;
    const o = e.target;
    if (!(o instanceof Element) || o.closest("[data-reader-ai-sessions]")) return;
    o.closest("a[href]") && (e.preventDefault(), e.stopPropagation());
  };
  return document.addEventListener("click", c, !0), () => {
    window.open = t, document.removeEventListener("click", c, !0), A = !1, U();
  };
}
let N = (t) => `${t ?? ""}`.trim(), L = globalThis.fetch ?? (async () => {
  throw new Error("fetch not available");
});
function q(t = {}) {
  t.resolveResourceUrl && (N = t.resolveResourceUrl), t.fetchProtected && (L = t.fetchProtected);
}
function O() {
  N = (t) => `${t ?? ""}`.trim(), L = globalThis.fetch ?? (async () => {
    throw new Error("fetch not available");
  });
}
function D(t) {
  try {
    return N(t) || `${t ?? ""}`.trim();
  } catch {
    return `${t ?? ""}`.trim();
  }
}
function R(t) {
  return !!t && typeof t == "object" && `${t.block_id || ""}`.trim() !== "";
}
function $(t) {
  if (!t || typeof t != "object") return null;
  const c = t.page_idx;
  if (c != null && `${c}`.trim() !== "") {
    const n = Number(c);
    if (Number.isFinite(n) && n >= 0) return Math.floor(n);
  }
  const e = t.page;
  if (e != null && `${e}`.trim() !== "") {
    const n = Number(e);
    if (Number.isFinite(n) && n >= 1) return Math.floor(n) - 1;
  }
  const o = `${t.block_id || ""}`.match(/(?:^|[^0-9])p0*([1-9]\d*)(?:-|_|\b)/i);
  if (o) {
    const n = Number(o[1]);
    if (Number.isFinite(n) && n >= 1) return n - 1;
  }
  return null;
}
function T(t) {
  const c = $(t);
  return c === null ? null : c + 1;
}
function F(t) {
  if (!Array.isArray(t)) return [];
  const c = [];
  for (const e of t) {
    if (!e || typeof e != "object") continue;
    const o = e, n = `${o.block_id || ""}`.trim();
    if (!n) continue;
    const i = $(o);
    c.push({
      ...o,
      block_id: n,
      ref: o.ref,
      page_idx: i === null ? void 0 : i,
      job_id: `${o.job_id || ""}`.trim(),
      document_id: `${o.document_id || ""}`.trim(),
      snippet: `${o.snippet || ""}`.trim()
    });
  }
  return c;
}
function C(t = "", c = 72) {
  const e = `${t}`.replace(/\s+/g, " ").trim();
  return e.length <= c ? e : `${e.slice(0, c).trim()}…`;
}
function _(t, c, { max: e = 5 } = {}) {
  const o = c.filter(R).map((r) => ({
    ...r,
    page_idx: $(r) ?? r.page_idx
  }));
  if (!o.length) return [];
  const n = /* @__PURE__ */ new Map();
  for (const r of o)
    n.set(`${r.ref}`, r);
  const i = [], a = /* @__PURE__ */ new Set();
  for (const r of `${t || ""}`.matchAll(/\[(\d+)\]/g)) {
    const s = r[1];
    a.has(s) || n.has(s) && (a.add(s), i.push(s));
  }
  if (i.length)
    return i.slice(0, e).map((r) => n.get(r));
  const u = [], l = /* @__PURE__ */ new Set();
  for (const r of o) {
    const s = $(r);
    if (s !== null) {
      if (l.has(s)) continue;
      l.add(s);
    }
    if (u.push(r), u.length >= Math.min(3, e)) break;
  }
  return u;
}
function G(t, c, e = "translated", o = {}) {
  const n = o.resolveResourceUrl ?? D, i = `${t || ""}`.trim(), a = Math.max(1, Math.floor(Number(c) || 0) + 1);
  if (!i) return "";
  const u = `/api/v1/jobs/${encodeURIComponent(i)}/preview/pages/${a}?kind=${e}&width=240`;
  try {
    return n(u) || u;
  } catch {
    return u;
  }
}
function P(t, c, e = {}) {
  const o = e.resolveResourceUrl ?? D, n = `${t || ""}`.trim();
  let i = `${c || ""}`.trim().replace(/\\/g, "/").replace(/^\.\//, "");
  if (!n || !i || i.startsWith("/") || i.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(i))
    return "";
  for (; i.startsWith("images/"); )
    i = i.slice(7);
  const a = [];
  for (const l of i.split("/")) {
    if (!l) continue;
    let r = l;
    try {
      r = decodeURIComponent(l);
    } catch {
      return "";
    }
    if (!r || r === "." || r === ".." || /[\\/]/.test(r)) return "";
    a.push(encodeURIComponent(r));
  }
  if (!a.length || !/^page-\d+$/i.test(decodeURIComponent(a[0]))) return "";
  const u = `/api/v1/jobs/${encodeURIComponent(n)}/markdown/images/${a.join("/")}`;
  try {
    return o(u) || u;
  } catch {
    return u;
  }
}
function W(t, c, e = {}) {
  var l;
  const o = `${t || ""}`.trim(), n = `${c || ""}`.trim();
  if (!o || !n || o.startsWith("//")) return "";
  if (/^(?:\.\/)?(?:images\/)?page-\d+\//i.test(o))
    return P(n, o, e);
  let i;
  try {
    i = new URL(o, ((l = globalThis.location) == null ? void 0 : l.href) || "http://localhost/");
  } catch {
    return "";
  }
  const a = i.pathname.match(/^\/api\/v1\/jobs\/([^/]+)\/markdown\/images\/(.+)$/i);
  if (!a) return "";
  let u = "";
  try {
    u = decodeURIComponent(a[1]);
  } catch {
    return "";
  }
  return u !== n ? "" : P(n, a[2], e);
}
function H(t, c, { jobId: e, documentRef: o = t.ownerDocument }) {
  const n = o.createElement("template");
  n.innerHTML = `${c || ""}`;
  let i = 0;
  return n.content.querySelectorAll("img").forEach((a) => {
    var r;
    const u = a.getAttribute("data-ai-src") || a.getAttribute("src") || "", l = W(u, e);
    if (a.removeAttribute("src"), a.removeAttribute("srcset"), !l) {
      const s = o.createElement("span");
      s.className = "aui-image-blocked", s.textContent = (r = a.getAttribute("alt")) != null && r.trim() ? `[图片不可用：${a.getAttribute("alt").trim()}]` : "[图片不可用]", a.replaceWith(s);
      return;
    }
    a.setAttribute("data-ai-src", l), a.setAttribute("loading", "lazy"), a.setAttribute("decoding", "async"), i += 1;
  }), t.replaceChildren(n.content), i;
}
function B(t, {
  onOpen: c,
  documentRef: e = globalThis.document
} = {}) {
  var i, a;
  if (!t || !e) return;
  const o = [...((i = t.querySelectorAll) == null ? void 0 : i.call(t, "a[href]")) || []];
  for (const u of o) {
    const l = u, r = `${l.getAttribute("href") || ""}`.trim(), s = e.createElement("span");
    for (s.className = `aui-md-extlink${l.className ? ` ${l.className}` : ""}`.trim(); l.firstChild; )
      s.appendChild(l.firstChild);
    if (!((a = s.textContent) != null && a.trim()) && r && (s.textContent = r), r && !r.startsWith("#") && !/^\s*javascript:/i.test(r)) {
      s.dataset.href = r, s.setAttribute("role", "link"), s.tabIndex = 0, s.title = `打开链接：${r}`;
      const f = (d) => {
        d.preventDefault(), d.stopPropagation(), !x(d) && (E() || d instanceof MouseEvent && (d.button !== 0 || d.detail === 0) || c == null || c(r, d));
      };
      s.addEventListener("click", f), s.addEventListener("auxclick", (d) => {
        d.preventDefault(), d.stopPropagation();
      }), s.addEventListener("keydown", (d) => {
        d.key !== "Enter" && d.key !== " " || (d.preventDefault(), f(d));
      });
    } else
      s.removeAttribute("role");
    l.replaceWith(s);
  }
  const n = t;
  n instanceof Element && !n.dataset.auiLinkGuard && (n.dataset.auiLinkGuard = "1", n.addEventListener(
    "click",
    (u) => {
      const l = u.target;
      if (!(l instanceof Element)) return;
      const r = l.closest("a[href]");
      !r || !n.contains(r) || (u.preventDefault(), u.stopPropagation());
    },
    !0
  ));
}
function K(t, c, e, o = globalThis.document) {
  var a, u, l, r;
  if (!c.size || !t) return;
  (a = t.querySelectorAll) == null || a.call(t, "button.reader-ai-citation-ref").forEach((s) => {
    var d;
    const f = s.parentNode;
    f && (f.replaceChild(o.createTextNode(s.textContent || ""), s), (d = f.normalize) == null || d.call(f));
  });
  const n = ((u = o.createTreeWalker) == null ? void 0 : u.call(o, t, 4)) || null, i = [];
  if (n) {
    let s = n.nextNode();
    for (; s; )
      (r = (l = s.parentElement) == null ? void 0 : l.closest) != null && r.call(l, "code, pre, .reader-ai-citation-ref, button, a, .aui-msg-actions") || i.push(s), s = n.nextNode();
  }
  for (const s of i) {
    const f = `${s.textContent || ""}`;
    if (!/\[\d+\]/.test(f)) continue;
    const d = o.createDocumentFragment();
    for (const w of f.split(/(\[\d+\])/)) {
      if (!w) continue;
      const h = w.match(/^\[(\d+)\]$/), b = h ? c.get(h[1]) : null;
      if (b) {
        const p = o.createElement("button");
        p.type = "button", p.className = "reader-ai-citation-ref", p.textContent = w;
        const g = T(b);
        p.title = g ? `跳到第 ${g} 页 · ${C(b.snippet || "", 60)}` : C(b.snippet || "相关片段", 60), g != null && (p.dataset.page = `${g}`), p.addEventListener("click", (y) => {
          y.preventDefault(), y.stopPropagation(), !x(y) && (e == null || e(b));
        }), d.appendChild(p);
      } else
        d.appendChild(o.createTextNode(w));
    }
    s.replaceWith(d);
  }
}
function Q(t) {
  var e;
  if (!t) return;
  const c = [...((e = t.querySelectorAll) == null ? void 0 : e.call(t, "img.is-hydrated")) || []];
  for (const o of c) {
    const n = o, i = n.src || "";
    if (i.startsWith("blob:"))
      try {
        URL.revokeObjectURL(i);
      } catch {
      }
    n.classList.remove("is-hydrated"), i.startsWith("blob:") && n.removeAttribute("src");
  }
}
async function V(t, { fetchImpl: c = L, signal: e } = {}) {
  var n;
  const o = [...((n = t.querySelectorAll) == null ? void 0 : n.call(t, "img[data-ai-src]")) || []];
  await Promise.allSettled(o.map(async (i) => {
    var l;
    const a = i;
    if (e != null && e.aborted || !a.isConnected) return;
    const u = a.getAttribute("data-ai-src") || "";
    if (u)
      try {
        const r = await c(u, e ? { signal: e } : void 0);
        if (e != null && e.aborted || !a.isConnected) {
          try {
            const d = await ((l = r == null ? void 0 : r.blob) == null ? void 0 : l.call(r));
            if (d) {
              const w = URL.createObjectURL(d);
              URL.revokeObjectURL(w);
            }
          } catch {
          }
          return;
        }
        if (!(r != null && r.ok)) throw new Error(`HTTP ${(r == null ? void 0 : r.status) || 0}`);
        const s = URL.createObjectURL(await r.blob());
        if (e != null && e.aborted || !a.isConnected) {
          try {
            URL.revokeObjectURL(s);
          } catch {
          }
          return;
        }
        const f = a.src || "";
        if (f.startsWith("blob:"))
          try {
            URL.revokeObjectURL(f);
          } catch {
          }
        a.src = s, a.classList.add("is-hydrated"), a.classList.remove("is-missing");
      } catch {
        if (e != null && e.aborted || !a.isConnected) return;
        a.classList.add("is-missing"), a.alt = a.alt || "图片暂不可用";
      }
  }));
}
function X(t, c, {
  onJump: e = null,
  answerText: o = "",
  max: n = 5,
  documentRef: i = globalThis.document
} = {}) {
  var s;
  (s = t.querySelector(".reader-ai-citations")) == null || s.remove();
  const a = _(o, c, { max: n });
  if (!a.length) return;
  const u = i.createElement("div");
  u.className = "reader-ai-citations", u.setAttribute("aria-label", "引用来源");
  const l = i.createElement("div");
  l.className = "reader-ai-citations-head", l.textContent = "来源", u.appendChild(l);
  const r = i.createElement("div");
  r.className = "reader-ai-citations-list";
  for (const f of a) {
    const d = T(f), w = d != null ? `p.${d}` : "", h = i.createElement("button");
    h.type = "button", h.className = "reader-ai-citation-item", d != null && (h.dataset.page = `${d}`), h.title = d != null ? `跳到第 ${d} 页` : "定位来源", h.addEventListener("click", (y) => {
      y.preventDefault(), y.stopPropagation(), !x(y) && (e == null || e(f));
    });
    const b = i.createElement("span");
    b.className = "reader-ai-citation-refno", b.textContent = `[${f.ref ?? "?"}]`;
    const p = i.createElement("span");
    p.className = "reader-ai-citation-meta", p.textContent = w || "—";
    const g = i.createElement("span");
    g.className = "reader-ai-citation-copy", g.textContent = C(f.snippet || "相关片段", 64), h.append(b, p, g), r.appendChild(h);
  }
  u.appendChild(r), t.appendChild(u);
}
export {
  W as a,
  Q as b,
  K as c,
  X as d,
  x as e,
  z as f,
  U as g,
  V as h,
  R as i,
  S as j,
  P as k,
  G as l,
  C as m,
  B as n,
  E as o,
  M as p,
  H as q,
  O as r,
  q as s,
  F as t,
  _ as u,
  $ as v,
  T as w
};
//# sourceMappingURL=answer-enhance-C1inCPcI.js.map

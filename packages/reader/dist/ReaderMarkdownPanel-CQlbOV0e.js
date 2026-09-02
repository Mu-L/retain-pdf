import { jsxs as z, jsx as h } from "react/jsx-runtime";
import { useRef as E, useState as S, useEffect as V } from "react";
import { Search as ne, ChevronUp as ae, ChevronDown as ce, ListTree as oe, FileCode2 as se } from "lucide-react";
import { d as le, b as ie, r as de } from "./ReaderApp-CQBUP2oj.js";
import { e as ue, m as he, a as fe } from "./markdown-math-Cb17EyYs.js";
import { n as me } from "./markdown-payload-BLt0pYzy.js";
import { R as we } from "./ReaderFloatShell-BnwuViy6.js";
let O = null;
function ke() {
  return O || (O = import("marked").catch((t) => {
    throw O = null, t;
  })), O;
}
function be(t) {
  t.querySelectorAll("script, iframe, object, embed, style, link, meta, base, form, input, button, textarea, select").forEach((r) => r.remove()), t.querySelectorAll("*").forEach((r) => {
    for (const n of [...r.attributes])
      /^on/i.test(n.name) && r.removeAttribute(n.name);
  }), t.querySelectorAll("a[href]").forEach((r) => {
    const n = r;
    /^\s*javascript:/i.test(n.getAttribute("href") || "") && n.removeAttribute("href"), n.setAttribute("target", "_blank"), n.setAttribute("rel", "noopener noreferrer");
  });
}
function Q(t, r, n) {
  const i = t.ownerDocument.createElement("template");
  return i.innerHTML = r, be(i.content), i.content.querySelectorAll("img[src]").forEach((o) => {
    const e = o.getAttribute("src") || "", d = de(n, e) || e;
    o.setAttribute("data-reader-md-src", d), o.setAttribute("loading", "lazy"), o.setAttribute("decoding", "async"), o.removeAttribute("src");
  }), t.replaceChildren(i.content), t.classList.remove("hidden"), [...t.querySelectorAll("img[data-reader-md-src]")];
}
function pe(t, r = "http://localhost/") {
  var n;
  if (/^mock:\/\//i.test(t)) return !0;
  try {
    const i = ((n = globalThis.location) == null ? void 0 : n.href) || "http://localhost/", o = new URL(r, i), e = new URL(t, o);
    if (!/\/api\/v1\/jobs\/[^/]+\/markdown\/images\//.test(e.pathname)) return !1;
    if (!/^[a-z][a-z\d+.-]*:/i.test(t)) return !0;
    const d = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(e.hostname);
    return e.origin === o.origin || d;
  } catch {
    return !1;
  }
}
function ge(t) {
  return t.normalize("NFKC").trim().toLocaleLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";
}
function _(t) {
  const r = /* @__PURE__ */ new Map();
  return [...t.querySelectorAll("h1, h2, h3, h4, h5, h6")].flatMap((n) => {
    const i = (n.textContent || "").replace(/\s+/g, " ").trim();
    if (!i) return [];
    const o = ge(i), e = (r.get(o) || 0) + 1;
    r.set(o, e);
    const d = e === 1 ? `reader-md-${o}` : `reader-md-${o}-${e}`;
    return n.id = d, [{ id: d, level: Number(n.tagName.slice(1)), text: i }];
  });
}
const G = "h1, h2, h3, h4, h5, h6, p, li, td, th, blockquote, pre";
function ye(t) {
  t.querySelectorAll(".reader-markdown-search-hit, .reader-markdown-search-hit-active").forEach((r) => {
    r.classList.remove("reader-markdown-search-hit", "reader-markdown-search-hit-active");
  });
}
function Me(t, r) {
  ye(t);
  const n = r.trim().toLocaleLowerCase();
  if (!n) return [];
  const o = [...t.querySelectorAll(G)].filter((e) => [...e.children].some((d) => d.matches(G)) ? !1 : (e.textContent || "").toLocaleLowerCase().includes(n));
  return o.forEach((e) => e.classList.add("reader-markdown-search-hit")), o;
}
function ve(t, r) {
  let n = !1, i = 0, o = 0, e = 0;
  const d = [], f = [], M = /* @__PURE__ */ new Set(), l = (a, w) => {
    const s = a.ownerDocument.createElement("span");
    s.className = "reader-markdown-image-missing", s.textContent = w, s.title = a.getAttribute("data-reader-md-src") || "", a.replaceWith(s);
  };
  for (const a of t) {
    const w = a.getAttribute("data-reader-md-src") || "", s = a.ownerDocument.baseURI || "http://localhost/";
    pe(w, r.protectedBaseUrl || s) ? f.push(a) : Ae(w, s) ? a.src = w : l(a, "[图片地址不可用]");
  }
  const L = () => {
    var a;
    return (a = r.onProgress) == null ? void 0 : a.call(r, { failed: e, loaded: o, total: f.length });
  }, v = () => {
    if (!n)
      for (; i < 4 && d.length > 0; ) {
        const a = d.shift();
        if (!(a != null && a.isConnected)) continue;
        i += 1;
        const w = a.getAttribute("data-reader-md-src") || "";
        r.fetchImage(w).then(async (s) => {
          if (!(s != null && s.ok)) throw new Error(`HTTP ${(s == null ? void 0 : s.status) || 0}`);
          const b = URL.createObjectURL(await s.blob());
          if (n || !a.isConnected) {
            try {
              URL.revokeObjectURL(b);
            } catch {
            }
            return;
          }
          r.onObjectUrl(b), a.src = b, o += 1;
        }).catch(() => {
          n || !a.isConnected || (e += 1, l(a, "[图片暂不可用]"));
        }).finally(() => {
          i -= 1, n || (L(), v());
        });
      }
  }, p = (a) => {
    n || M.has(a) || (M.add(a), d.push(a), v());
  }, A = globalThis.IntersectionObserver;
  let m = null;
  return A && f.length > 0 ? (m = new A((a) => {
    a.forEach((w) => {
      if (!w.isIntersecting) return;
      const s = w.target;
      m == null || m.unobserve(s), p(s);
    });
  }, { root: r.root || null, rootMargin: "600px 0px" }), f.forEach((a) => m == null ? void 0 : m.observe(a))) : f.forEach(p), L(), () => {
    n = !0, d.length = 0, m == null || m.disconnect();
  };
}
function Ae(t, r) {
  if (/^data:image\//i.test(t) || /^blob:/i.test(t)) return !0;
  try {
    const n = new URL(t, r);
    return n.protocol === "http:" || n.protocol === "https:";
  } catch {
    return !1;
  }
}
function Ne({
  open: t,
  jobId: r,
  sourceOnly: n,
  layout: i = "floating",
  onClose: o
}) {
  var j, T;
  const e = E(null), [d, f] = S("尚未加载"), M = E([]), l = E(null), L = E([]), v = E(""), [p, A] = S([]), [m, a] = S(!1), [w, s] = S(""), [b, J] = S(0), [R, H] = S(-1), I = () => {
    for (const c of M.current)
      try {
        URL.revokeObjectURL(c);
      } catch {
      }
    M.current = [];
  }, x = (c, k = !0) => {
    const u = L.current;
    if (u.forEach((N) => N.classList.remove("reader-markdown-search-hit-active")), u.length === 0) {
      H(-1);
      return;
    }
    const y = (c + u.length) % u.length, g = u[y];
    g.classList.add("reader-markdown-search-hit-active"), H(y), k && typeof g.scrollIntoView == "function" && g.scrollIntoView({ block: "center", behavior: "smooth" });
  }, D = (c, k = !1) => {
    if (!e.current) return;
    const u = Me(e.current, c);
    L.current = u, J(u.length), x(u.length > 0 ? 0 : -1, k);
  };
  return V(() => () => {
    var c;
    (c = l.current) == null || c.call(l), I();
  }, []), V(() => {
    var u, y;
    if (!t) {
      (u = l.current) == null || u.call(l), l.current = null, I(), A([]);
      return;
    }
    let c = !1;
    I(), (y = l.current) == null || y.call(l), l.current = null;
    async function k() {
      var N, B, F, K;
      const g = r.startsWith("doc:");
      if (!r || g) {
        f(!r && n ? "源文档阅读不提供 Markdown 产物" : "该任务暂无 Markdown 产物"), e.current && (e.current.replaceChildren(), e.current.classList.add("hidden"));
        return;
      }
      f("正在加载 Markdown…"), (N = e.current) == null || N.replaceChildren(), (B = e.current) == null || B.classList.add("hidden");
      try {
        const U = await le.loadMarkdownPayload(r);
        if (c) return;
        const { content: W, imagesBaseUrl: P } = me(U);
        if (!W.trim()) {
          f("该任务暂无 Markdown 产物"), (F = e.current) == null || F.replaceChildren(), (K = e.current) == null || K.classList.add("hidden");
          return;
        }
        const { marked: X } = await ke();
        if (c || !e.current) return;
        const { text: Y, slots: C } = ue(W), $ = String(X.parse(Y, { async: !1 })), Z = he($, C);
        Q(e.current, Z, P), A(_(e.current)), D(v.current), f(C.length > 0 ? `正文已显示 · 正在渲染 ${C.length} 个公式…` : "");
        const ee = C.length > 0 ? await fe($, C) : $;
        if (c || !e.current) return;
        const te = Q(e.current, ee, P);
        A(_(e.current)), D(v.current), f("");
        const re = e.current.closest(".reader-notes-panel-body");
        l.current = ve(te, {
          root: re,
          protectedBaseUrl: P || e.current.ownerDocument.baseURI,
          fetchImage: ie,
          onObjectUrl: (q) => M.current.push(q),
          onProgress: ({ failed: q }) => {
            !c && q > 0 && f(`正文已加载 · ${q} 张图片不可用`);
          }
        });
      } catch (U) {
        if (c) return;
        f(U instanceof Error ? U.message : "Markdown 加载失败");
      }
    }
    return k(), () => {
      var g;
      c = !0, (g = l.current) == null || g.call(l), l.current = null;
    };
  }, [t, r, n]), /* @__PURE__ */ z(
    we,
    {
      id: "reader-markdown-panel",
      open: t,
      title: "Markdown",
      subtitle: i === "docked" ? "识别与翻译产出 · PDF / Markdown 分栏" : "识别与翻译产出 · 拖动可移动",
      titleIcon: /* @__PURE__ */ h(se, { size: 14, strokeWidth: 2.25, "aria-hidden": !0 }),
      storageKey: "retainpdf.reader.markdown-float.pos.v1",
      ariaLabel: "Markdown 预览",
      width: 420,
      placement: i === "docked" ? "dock-right" : "floating",
      onClose: o,
      toolbar: /* @__PURE__ */ h("span", { className: "reader-notes-count", children: d || "已加载" }),
      children: [
        /* @__PURE__ */ z("div", { className: "reader-markdown-nav", "aria-label": "Markdown 导航与搜索", children: [
          /* @__PURE__ */ z("label", { className: "reader-markdown-search", children: [
            /* @__PURE__ */ h(ne, { size: 13, "aria-hidden": !0 }),
            /* @__PURE__ */ h(
              "input",
              {
                type: "search",
                value: w,
                placeholder: "搜索正文",
                "aria-label": "搜索 Markdown 正文",
                onChange: (c) => {
                  const k = c.target.value;
                  v.current = k, s(k), D(k, !1);
                },
                onKeyDown: (c) => {
                  c.key !== "Enter" || b === 0 || (c.preventDefault(), x(R + (c.shiftKey ? -1 : 1)));
                }
              }
            ),
            w ? /* @__PURE__ */ h("span", { className: "reader-markdown-search-count", "aria-live": "polite", children: b > 0 ? `${R + 1}/${b}` : "0/0" }) : null,
            /* @__PURE__ */ h(
              "button",
              {
                type: "button",
                "aria-label": "上一个搜索结果",
                disabled: b === 0,
                onClick: () => x(R - 1),
                children: /* @__PURE__ */ h(ae, { size: 13, "aria-hidden": !0 })
              }
            ),
            /* @__PURE__ */ h(
              "button",
              {
                type: "button",
                "aria-label": "下一个搜索结果",
                disabled: b === 0,
                onClick: () => x(R + 1),
                children: /* @__PURE__ */ h(ce, { size: 13, "aria-hidden": !0 })
              }
            )
          ] }),
          /* @__PURE__ */ z(
            "button",
            {
              type: "button",
              className: "reader-markdown-outline-toggle",
              "aria-expanded": m,
              disabled: p.length === 0,
              onClick: () => a((c) => !c),
              children: [
                /* @__PURE__ */ h(oe, { size: 13, "aria-hidden": !0 }),
                "目录",
                p.length > 0 ? ` ${p.length}` : ""
              ]
            }
          )
        ] }),
        m && p.length > 0 ? /* @__PURE__ */ h("nav", { className: "reader-markdown-outline", "aria-label": "Markdown 目录", children: p.map((c) => /* @__PURE__ */ h(
          "button",
          {
            type: "button",
            style: { "--reader-md-outline-level": c.level - 1 },
            onClick: () => {
              var u;
              const k = [...((u = e.current) == null ? void 0 : u.querySelectorAll("h1, h2, h3, h4, h5, h6")) || []].find((y) => y.id === c.id);
              k && typeof k.scrollIntoView == "function" && k.scrollIntoView({ block: "start", behavior: "smooth" });
            },
            children: c.text
          },
          c.id
        )) }) : null,
        d && !((T = (j = e.current) == null ? void 0 : j.childNodes) != null && T.length) ? /* @__PURE__ */ h("p", { className: "reader-notes-empty", children: d }) : null,
        /* @__PURE__ */ h(
          "article",
          {
            ref: e,
            id: "reader-markdown-content",
            className: "reader-markdown-content reader-float-markdown-content"
          }
        )
      ]
    }
  );
}
export {
  Ne as ReaderMarkdownPanel,
  _ as buildMarkdownOutline,
  ye as clearMarkdownSearchHighlights,
  Me as findMarkdownSearchTargets,
  pe as isProtectedMarkdownAssetUrl,
  ve as startMarkdownImageLoading
};
//# sourceMappingURL=ReaderMarkdownPanel-CQlbOV0e.js.map

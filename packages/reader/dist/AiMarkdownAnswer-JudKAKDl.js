import { jsx as n } from "react/jsx-runtime";
import { createContext as w, useContext as x, useRef as M, useId as y, useMemo as C, useEffect as b } from "react";
import { a as j, i as E, b as g, n as P, c as T, h as _, d as D, e as L } from "./answer-enhance-C1inCPcI.js";
import S, { setCustomComponents as U, MathInlineNode as z } from "markstream-react";
const k = "retainpdf-ai-answer", I = w({ final: !1, jobId: "" });
function B({ node: e }) {
  const { final: r, jobId: s } = x(I), a = `${e.alt || ""}`.trim();
  if (!r)
    return /* @__PURE__ */ n("span", { className: "aui-image-pending", "aria-label": a || "图片加载中", children: a ? `[图片：${a}]` : "[图片加载中]" });
  const i = j(e.src, s);
  return i ? /* @__PURE__ */ n(
    "img",
    {
      alt: a,
      "data-ai-src": i,
      decoding: "async",
      loading: "lazy",
      title: e.title || void 0
    }
  ) : /* @__PURE__ */ n("span", { className: "aui-image-blocked", children: a ? `[图片不可用：${a}]` : "[图片不可用]" });
}
function H({ node: e }) {
  const r = `${e.text || e.href || ""}`.trim();
  return /* @__PURE__ */ n(
    "span",
    {
      className: "aui-md-extlink",
      "data-href": `${e.href || ""}`.trim() || void 0,
      title: r || void 0,
      children: r
    }
  );
}
function K({ node: e }) {
  return /* @__PURE__ */ n(
    z,
    {
      node: e.markup === "$$" ? { ...e, markup: "$" } : e
    }
  );
}
U(k, {
  image: B,
  link: H,
  math_inline: K
});
function q({
  content: e,
  final: r,
  indexKey: s,
  jobId: a,
  onClickCapture: i
}) {
  return /* @__PURE__ */ n(I.Provider, { value: { final: r, jobId: a }, children: /* @__PURE__ */ n(
    "div",
    {
      className: "retain-markstream-shell",
      "data-markdown-renderer": "markstream-react",
      onClickCapture: i,
      children: /* @__PURE__ */ n(
        S,
        {
          batchRendering: !r,
          content: e,
          customId: k,
          fade: !1,
          final: r,
          htmlPolicy: "escape",
          indexKey: s,
          maxLiveNodes: 0,
          renderCodeBlocksAsPre: !0,
          showTooltips: !1,
          smoothStreaming: r ? !1 : "auto",
          typewriter: !r
        }
      )
    }
  ) });
}
function W({
  content: e,
  streaming: r = !1,
  citations: s = [],
  jobId: a = "",
  className: i = "",
  streamingClassName: N = "",
  pendingClassName: $ = "",
  finalClassName: v = "",
  citationFooterMax: m = 5,
  onJumpCitation: l
}) {
  var h;
  const d = M(null), A = y(), c = r ? `${e || ""}` : `${e || ""}`.trim(), f = `${a || ((h = s.find((t) => t.job_id)) == null ? void 0 : h.job_id) || ""}`.trim(), u = C(() => {
    const t = /* @__PURE__ */ new Map();
    for (const o of s)
      E(o) && t.set(`${o.ref}`, o);
    return t;
  }, [s]);
  return b(() => {
    const t = d.current;
    if (!t || r || !c) return;
    g(t), P(t, { onOpen: () => !0 }), T(t, u, l || null);
    const o = new AbortController();
    t.querySelector("img[data-ai-src]") && _(t, { signal: o.signal });
    const p = t.parentElement;
    return p instanceof HTMLElement && D(p, s, {
      onJump: (R) => {
        L(null) || l == null || l(R);
      },
      answerText: c,
      max: m
    }), () => o.abort();
  }, [r, f, u, s, l, c, m]), b(() => () => g(d.current), []), c.trim() ? /* @__PURE__ */ n("div", { ref: d, className: `${i} ${r ? N : v || $}`.trim(), children: /* @__PURE__ */ n(
    q,
    {
      content: c,
      final: !r,
      indexKey: A,
      jobId: f,
      onClickCapture: (t) => {
        const o = t.target;
        o instanceof Element && o.closest("a[href]") && (t.preventDefault(), t.stopPropagation());
      }
    }
  ) }) : null;
}
export {
  W as A
};
//# sourceMappingURL=AiMarkdownAnswer-JudKAKDl.js.map

import { jsx as u, jsxs as P } from "react/jsx-runtime";
import { createContext as x, useContext as M, useRef as I, useCallback as j, useEffect as $, useId as E, useMemo as A } from "react";
import { a as L, b as D, c as S, f as W, d as k, h as O, i as U, e as B, g as F } from "./answer-enhance-Cm_PuAj9.js";
import H, { setCustomComponents as z, MathInlineNode as K } from "markstream-react";
const T = "retainpdf-ai-answer", C = 320, q = 2, v = x({
  final: !1,
  jobId: "",
  citations: []
});
function G(e) {
  const r = Number(e.naturalWidth) || 0, t = e.closest(".reader-ai-image-jump"), n = t || e, i = r > 0 && r < C;
  if (e.classList.toggle("is-low-resolution", i), t == null || t.classList.toggle("is-low-resolution", i), i) {
    const l = Math.min(
      C,
      Math.max(r, r * q)
    );
    n.style.setProperty("--reader-ai-image-width", `${l}px`);
  } else
    n.style.removeProperty("--reader-ai-image-width");
}
function X({ node: e }) {
  const { final: r, jobId: t, citations: n, onJumpCitation: i } = M(v), l = I(null), s = I(null), d = `${e.alt || ""}`.trim(), g = D(e.src, t, {}, S(n)), f = W(e.src, n, t), m = L(f), w = j((o) => {
    var N;
    const h = l.current;
    if (h === o || ((N = s.current) == null || N.abort(), s.current = null, h && k(h), l.current = o, !o || !g)) return;
    const b = new AbortController();
    s.current = b, (async () => {
      for (const y of [0, 250, 750, 1500]) {
        if (y && await new Promise((c) => globalThis.setTimeout(c, y)), b.signal.aborted) return;
        const a = l.current;
        if (!a || a !== o || a.classList.contains("is-hydrated") && a.src.startsWith("blob:")) return;
        await O(a, { signal: b.signal });
      }
    })();
  }, [g]);
  if ($(() => () => {
    var o;
    (o = s.current) == null || o.abort(), s.current = null, k(l.current), l.current = null;
  }, []), !g)
    return r ? /* @__PURE__ */ u("span", { className: "aui-image-blocked", children: d ? `[图片不可用：${d}]` : "[图片不可用]" }) : /* @__PURE__ */ u("span", { className: "aui-image-pending", "aria-label": d || "图片加载中", children: d ? `[图片：${d}]` : "[图片加载中]" });
  const p = /* @__PURE__ */ u(
    "img",
    {
      ref: w,
      alt: d,
      "data-ai-src": g,
      decoding: "async",
      loading: "lazy",
      onLoad: (o) => G(o.currentTarget),
      title: e.title || void 0
    }
  );
  return !f || !i ? p : /* @__PURE__ */ P(
    "button",
    {
      type: "button",
      className: "reader-ai-image-jump",
      "data-page": m ?? void 0,
      title: m ? `定位到 PDF 第 ${m} 页` : "定位到图片来源",
      onClick: (o) => {
        o.preventDefault(), o.stopPropagation(), i({ ...f, image_url: g });
      },
      children: [
        p,
        /* @__PURE__ */ u("span", { className: "reader-ai-image-jump-label", "aria-hidden": "true", children: m ? `定位 p.${m}` : "定位来源" })
      ]
    }
  );
}
function Q({ node: e }) {
  const { citations: r, onJumpCitation: t } = M(v), n = `${e.href || ""}`.match(/^#retainpdf-citation-(\d+)$/), i = n ? r.find((s) => `${s.ref}` === n[1]) : null;
  if (i) {
    const s = L(i);
    return /* @__PURE__ */ P(
      "button",
      {
        type: "button",
        className: "reader-ai-citation-ref",
        "data-page": s ?? void 0,
        title: s ? `跳到第 ${s} 页` : "定位来源",
        onClick: (d) => {
          d.preventDefault(), d.stopPropagation(), t == null || t(i);
        },
        children: [
          "[",
          n == null ? void 0 : n[1],
          "]"
        ]
      }
    );
  }
  const l = `${e.text || e.href || ""}`.trim();
  return /* @__PURE__ */ u(
    "span",
    {
      className: "aui-md-extlink",
      "data-href": `${e.href || ""}`.trim() || void 0,
      title: l || void 0,
      children: l
    }
  );
}
function V({ node: e }) {
  return /* @__PURE__ */ u(
    K,
    {
      node: e.markup === "$$" ? { ...e, markup: "$" } : e
    }
  );
}
z(T, {
  image: X,
  link: Q,
  math_inline: V
});
function Y({
  content: e,
  final: r,
  indexKey: t,
  jobId: n,
  citations: i = [],
  onJumpCitation: l,
  onClickCapture: s
}) {
  return /* @__PURE__ */ u(v.Provider, { value: { final: r, jobId: n, citations: i, onJumpCitation: l }, children: /* @__PURE__ */ u(
    "div",
    {
      className: "retain-markstream-shell",
      "data-markdown-renderer": "markstream-react",
      onClickCapture: s,
      children: /* @__PURE__ */ u(
        H,
        {
          batchRendering: !r,
          content: e,
          customId: T,
          fade: !1,
          final: r,
          htmlPolicy: "escape",
          indexKey: t,
          maxLiveNodes: 0,
          renderCodeBlocksAsPre: !0,
          showTooltips: !1,
          smoothStreaming: !1,
          typewriter: !1
        }
      )
    }
  ) });
}
function re({
  content: e,
  streaming: r = !1,
  citations: t = [],
  jobId: n = "",
  className: i = "",
  streamingClassName: l = "",
  pendingClassName: s = "",
  finalClassName: d = "",
  citationFooterMax: g = 5,
  onJumpCitation: f
}) {
  var y;
  const m = I(null), w = E(), p = r ? `${e || ""}` : `${e || ""}`.trim(), o = `${n || ((y = t.find((a) => a.job_id)) == null ? void 0 : y.job_id) || ""}`.trim(), h = A(() => {
    const a = /* @__PURE__ */ new Map();
    for (const c of t)
      U(c) && a.set(`${c.ref}`, c);
    return a;
  }, [t]), b = A(
    () => B(p, h),
    [p, h]
  );
  return $(() => {
    var R;
    const a = m.current;
    if (!a || !p) return;
    const c = a.parentElement;
    if (c instanceof HTMLElement) {
      if (r) {
        (R = c.querySelector(".reader-ai-citations")) == null || R.remove();
        return;
      }
      F(c, t, {
        onJump: (_) => f == null ? void 0 : f(_),
        answerText: p,
        max: g
      });
    }
  }, [r, o, h, t, f, p, g]), $(() => () => k(m.current), []), p.trim() ? /* @__PURE__ */ u("div", { ref: m, className: `${i} ${r ? l : d || s}`.trim(), children: /* @__PURE__ */ u(
    Y,
    {
      content: b,
      final: !r,
      indexKey: w,
      jobId: o,
      citations: t,
      onJumpCitation: f,
      onClickCapture: (a) => {
        const c = a.target;
        c instanceof Element && c.closest("a[href]") && (a.preventDefault(), a.stopPropagation());
      }
    }
  ) }) : null;
}
export {
  re as A
};
//# sourceMappingURL=AiMarkdownAnswer-Dt0lNQUc.js.map

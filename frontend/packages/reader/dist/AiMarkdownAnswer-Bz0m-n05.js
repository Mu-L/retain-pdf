import { jsxs as x, jsx as l, Fragment as R } from "react/jsx-runtime";
import { useId as O, createContext as Y, useContext as F, useRef as v, useCallback as z, useEffect as I, useMemo as E } from "react";
import { x as W, v as G, a as X, h as K, y as C, j as Z, l as q, g as Q, u as V } from "./answer-enhance-D8zK9znw.js";
import J, { setCustomComponents as tt, CodeBlockNode as et, MathInlineNode as rt } from "markstream-react";
const nt = "retainpdf-chart", at = 6, st = 40, it = /* @__PURE__ */ new Set(["bar", "line", "pie"]);
function ot(t) {
  if (typeof t == "number") return Number.isFinite(t) ? t : null;
  if (typeof t == "string" && t.trim()) {
    const e = Number(t);
    return Number.isFinite(e) ? e : null;
  }
  return null;
}
function A(t, e = "") {
  return `${t ?? ""}`.trim() || e;
}
function lt(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const n = r, a = ot(n.value ?? n.y);
    if (a !== null && (e.push({ label: A(n.label ?? n.x, `${e.length + 1}`), value: a }), e.length >= st))
      break;
  }
  return e;
}
function ct(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const n = r, a = lt(n.points ?? n.data);
    if (a.length && (e.push({ name: A(n.name, `系列 ${e.length + 1}`), points: a }), e.length >= at))
      break;
  }
  return e;
}
function ut(t) {
  const e = `${t || ""}`.trim();
  if (!e) return null;
  let r;
  try {
    r = JSON.parse(e);
  } catch {
    return null;
  }
  if (!r || typeof r != "object" || Array.isArray(r)) return null;
  const n = r, a = `${n.kind ?? n.type ?? ""}`.trim().toLowerCase();
  if (!it.has(a)) return null;
  const i = ct(n.series);
  if (!i.length) return null;
  const o = a === "pie" ? i.slice(0, 1) : i;
  return {
    kind: a,
    title: A(n.title),
    xLabel: A(n.xLabel ?? n.x_label),
    yLabel: A(n.yLabel ?? n.y_label),
    series: o
  };
}
function dt(t) {
  const e = t.series.flatMap((o) => o.points.map((s) => s.value)), r = Math.min(...e), n = Math.max(...e), a = Math.min(0, r), i = Math.max(0, n);
  return a === i ? { min: a, max: i + 1 } : { min: a, max: i };
}
function _(t) {
  let e = [];
  for (const r of t.series)
    r.points.length > e.length && (e = r.points);
  return e.map((r) => r.label);
}
const B = 640, P = 300, g = { top: 16, right: 16, bottom: 44, left: 52 }, w = B - g.left - g.right, y = P - g.top - g.bottom, j = [
  "var(--chart-1, #4c6ef5)",
  "var(--chart-2, #f08c00)",
  "var(--chart-3, #2f9e44)",
  "var(--chart-4, #e03131)",
  "var(--chart-5, #ae3ec9)",
  "var(--chart-6, #0c8599)"
], L = (t) => j[t % j.length];
function ft(t, e) {
  return Array.from({ length: 5 }, (n, a) => t + (e - t) * a / 4);
}
function ht(t) {
  const e = Math.abs(t);
  return e >= 1e4 ? `${(t / 1e3).toFixed(0)}k` : Number.isInteger(t) ? `${t}` : t.toFixed(e < 1 ? 2 : 1);
}
function mt(t) {
  return t <= 8 ? 1 : Math.ceil(t / 8);
}
function gt({
  spec: t,
  min: e,
  max: r,
  labels: n
}) {
  const a = (s) => g.top + y - (s - e) / (r - e) * y, i = mt(n.length), o = w / Math.max(1, n.length);
  return /* @__PURE__ */ x("g", { className: "reader-answer-chart-axes", children: [
    ft(e, r).map((s) => /* @__PURE__ */ x("g", { children: [
      /* @__PURE__ */ l(
        "line",
        {
          className: "reader-answer-chart-grid",
          x1: g.left,
          x2: g.left + w,
          y1: a(s),
          y2: a(s)
        }
      ),
      /* @__PURE__ */ l("text", { className: "reader-answer-chart-tick", x: g.left - 8, y: a(s), textAnchor: "end", dominantBaseline: "middle", children: ht(s) })
    ] }, s)),
    n.map((s, d) => d % i === 0 ? /* @__PURE__ */ l(
      "text",
      {
        className: "reader-answer-chart-tick",
        x: g.left + o * (d + 0.5),
        y: g.top + y + 18,
        textAnchor: "middle",
        children: s.length > 10 ? `${s.slice(0, 9)}…` : s
      },
      `${s}-${d}`
    ) : null),
    t.yLabel ? /* @__PURE__ */ l("text", { className: "reader-answer-chart-axis-label", x: g.left, y: g.top - 4, textAnchor: "start", children: t.yLabel }) : null,
    t.xLabel ? /* @__PURE__ */ l(
      "text",
      {
        className: "reader-answer-chart-axis-label",
        x: g.left + w,
        y: P - 6,
        textAnchor: "end",
        children: t.xLabel
      }
    ) : null
  ] });
}
function pt({ spec: t, min: e, max: r }) {
  const n = _(t), a = w / Math.max(1, n.length), i = a * 0.7, o = i / t.series.length, s = (c) => g.top + y - (c - e) / (r - e) * y, d = s(0);
  return /* @__PURE__ */ l(R, { children: t.series.map((c, u) => /* @__PURE__ */ l("g", { fill: L(u), children: c.points.map((h, p) => {
    const f = s(h.value), $ = g.left + a * p + (a - i) / 2 + o * u;
    return /* @__PURE__ */ l(
      "rect",
      {
        x: $,
        y: Math.min(f, d),
        width: Math.max(1, o - 1),
        height: Math.max(1, Math.abs(d - f)),
        rx: 2,
        children: /* @__PURE__ */ l("title", { children: `${c.name} · ${h.label}: ${h.value}` })
      },
      `${h.label}-${p}`
    );
  }) }, c.name)) });
}
function bt({ spec: t, min: e, max: r }) {
  const n = _(t), a = w / Math.max(1, n.length), i = (s) => g.top + y - (s - e) / (r - e) * y, o = (s) => g.left + a * (s + 0.5);
  return /* @__PURE__ */ l(R, { children: t.series.map((s, d) => {
    const c = s.points.map((u, h) => `${h === 0 ? "M" : "L"} ${o(h)} ${i(u.value)}`).join(" ");
    return /* @__PURE__ */ x("g", { stroke: L(d), fill: L(d), children: [
      /* @__PURE__ */ l("path", { className: "reader-answer-chart-line", d: c, fill: "none" }),
      s.points.map((u, h) => /* @__PURE__ */ l(
        "circle",
        {
          cx: o(h),
          cy: i(u.value),
          r: 3,
          stroke: "none",
          children: /* @__PURE__ */ l("title", { children: `${s.name} · ${u.label}: ${u.value}` })
        },
        `${u.label}-${h}`
      ))
    ] }, s.name);
  }) });
}
function $t({ spec: t }) {
  var d;
  const e = ((d = t.series[0]) == null ? void 0 : d.points) ?? [], r = e.map((c) => Math.max(0, c.value)), n = r.reduce((c, u) => c + u, 0);
  if (n <= 0) return null;
  const a = g.left + w / 2, i = g.top + y / 2, o = Math.min(w, y) / 2 - 8;
  let s = -Math.PI / 2;
  return /* @__PURE__ */ l(R, { children: e.map((c, u) => {
    const h = r[u] / n, p = s + h * Math.PI * 2, f = a + o * Math.cos(s), $ = i + o * Math.sin(s), N = a + o * Math.cos(p), k = i + o * Math.sin(p), M = h > 0.5 ? 1 : 0, m = h >= 1 ? `M ${a} ${i - o} A ${o} ${o} 0 1 1 ${a - 0.01} ${i - o} Z` : `M ${a} ${i} L ${f} ${$} A ${o} ${o} 0 ${M} 1 ${N} ${k} Z`;
    return s = p, /* @__PURE__ */ l("path", { d: m, fill: L(u), children: /* @__PURE__ */ l("title", { children: `${c.label}: ${c.value}（${(h * 100).toFixed(1)}%）` }) }, `${c.label}-${u}`);
  }) });
}
function yt({ spec: t }) {
  var r;
  const e = t.kind === "pie" ? (((r = t.series[0]) == null ? void 0 : r.points) ?? []).map((n) => n.label) : t.series.map((n) => n.name);
  return e.length < 2 ? null : /* @__PURE__ */ l("ul", { className: "reader-answer-chart-legend", children: e.map((n, a) => /* @__PURE__ */ x("li", { children: [
    /* @__PURE__ */ l("span", { className: "reader-answer-chart-swatch", style: { background: L(a) }, "aria-hidden": !0 }),
    n
  ] }, `${n}-${a}`)) });
}
function xt({ spec: t }) {
  const e = O(), { min: r, max: n } = dt(t), a = _(t), i = t.title || `${t.series.length} 个系列的${t.kind === "pie" ? "占比" : "对比"}图`;
  return /* @__PURE__ */ x("figure", { className: "reader-answer-chart", children: [
    /* @__PURE__ */ x(
      "svg",
      {
        className: `reader-answer-chart-svg is-${t.kind}`,
        viewBox: `0 0 ${B} ${P}`,
        role: "img",
        "aria-labelledby": e,
        preserveAspectRatio: "xMidYMid meet",
        children: [
          /* @__PURE__ */ l("title", { id: e, children: i }),
          t.kind !== "pie" ? /* @__PURE__ */ l(gt, { spec: t, min: r, max: n, labels: a }) : null,
          t.kind === "bar" ? /* @__PURE__ */ l(pt, { spec: t, min: r, max: n }) : null,
          t.kind === "line" ? /* @__PURE__ */ l(bt, { spec: t, min: r, max: n }) : null,
          t.kind === "pie" ? /* @__PURE__ */ l($t, { spec: t }) : null
        ]
      }
    ),
    /* @__PURE__ */ l(yt, { spec: t }),
    t.title ? /* @__PURE__ */ l("figcaption", { className: "reader-answer-chart-caption", children: t.title }) : null
  ] });
}
const H = "retainpdf-ai-answer", D = 320, Nt = 2, T = Y({
  final: !1,
  jobId: "",
  citations: []
});
function Mt(t) {
  const e = Number(t.naturalWidth) || 0, r = t.closest(".reader-ai-image-jump"), n = r || t, a = e > 0 && e < D;
  if (t.classList.toggle("is-low-resolution", a), r == null || r.classList.toggle("is-low-resolution", a), a) {
    const i = Math.min(
      D,
      Math.max(e, e * Nt)
    );
    n.style.setProperty("--reader-ai-image-width", `${i}px`);
  } else
    n.style.removeProperty("--reader-ai-image-width");
}
function wt({ node: t }) {
  const { final: e, jobId: r, citations: n, onJumpCitation: a } = F(T), i = v(null), o = v(null), s = `${t.alt || ""}`.trim(), d = G(t.src, r, {}, X(n)), c = K(t.src, n, r), u = W(c), h = z((f) => {
    var k;
    const $ = i.current;
    if ($ === f || ((k = o.current) == null || k.abort(), o.current = null, $ && C($), i.current = f, !f || !d)) return;
    const N = new AbortController();
    o.current = N, (async () => {
      for (const M of [0, 250, 750, 1500]) {
        if (M && await new Promise((b) => globalThis.setTimeout(b, M)), N.signal.aborted) return;
        const m = i.current;
        if (!m || m !== f || m.classList.contains("is-hydrated") && m.src.startsWith("blob:")) return;
        await Z(m, { signal: N.signal });
      }
    })();
  }, [d]);
  if (I(() => () => {
    var f;
    (f = o.current) == null || f.abort(), o.current = null, C(i.current), i.current = null;
  }, []), !d)
    return e ? /* @__PURE__ */ l("span", { className: "aui-image-blocked", children: s ? `[图片不可用：${s}]` : "[图片不可用]" }) : /* @__PURE__ */ l("span", { className: "aui-image-pending", "aria-label": s || "图片加载中", children: s ? `[图片：${s}]` : "[图片加载中]" });
  const p = /* @__PURE__ */ l(
    "img",
    {
      ref: h,
      alt: s,
      "data-ai-src": d,
      decoding: "async",
      loading: "lazy",
      onLoad: (f) => Mt(f.currentTarget),
      title: t.title || void 0
    }
  );
  return !c || !a ? p : /* @__PURE__ */ x(
    "button",
    {
      type: "button",
      className: "reader-ai-image-jump",
      "data-page": u ?? void 0,
      title: u ? `定位到 PDF 第 ${u} 页` : "定位到图片来源",
      onClick: (f) => {
        f.preventDefault(), f.stopPropagation(), a({ ...c, image_url: d });
      },
      children: [
        p,
        /* @__PURE__ */ l("span", { className: "reader-ai-image-jump-label", "aria-hidden": "true", children: u ? `定位 p.${u}` : "定位来源" })
      ]
    }
  );
}
function kt({ node: t }) {
  const { citations: e, onJumpCitation: r } = F(T), n = `${t.href || ""}`.match(/^#retainpdf-citation-(\d+)$/), a = n ? e.find((o) => `${o.ref}` === n[1]) : null;
  if (a) {
    const o = W(a);
    return /* @__PURE__ */ x(
      "button",
      {
        type: "button",
        className: "reader-ai-citation-ref",
        "data-page": o ?? void 0,
        title: o ? `跳到第 ${o} 页` : "定位来源",
        onClick: (s) => {
          s.preventDefault(), s.stopPropagation(), r == null || r(a);
        },
        children: [
          "[",
          n == null ? void 0 : n[1],
          "]"
        ]
      }
    );
  }
  const i = `${t.text || t.href || ""}`.trim();
  return /* @__PURE__ */ l(
    "span",
    {
      className: "aui-md-extlink",
      "data-href": `${t.href || ""}`.trim() || void 0,
      title: i || void 0,
      children: i
    }
  );
}
function At(t) {
  const e = t.node;
  if (`${(e == null ? void 0 : e.language) || ""}`.trim().toLowerCase() === nt) {
    const r = ut(`${(e == null ? void 0 : e.code) || ""}`);
    if (r) return /* @__PURE__ */ l(xt, { spec: r });
  }
  return /* @__PURE__ */ l(et, { ...t });
}
function Lt({ node: t }) {
  return /* @__PURE__ */ l(
    rt,
    {
      node: t.markup === "$$" ? { ...t, markup: "$" } : t
    }
  );
}
tt(H, {
  image: wt,
  link: kt,
  math_inline: Lt,
  code_block: At
});
function vt({
  content: t,
  final: e,
  indexKey: r,
  jobId: n,
  citations: a = [],
  onJumpCitation: i,
  onClickCapture: o
}) {
  return /* @__PURE__ */ l(T.Provider, { value: { final: e, jobId: n, citations: a, onJumpCitation: i }, children: /* @__PURE__ */ l(
    "div",
    {
      className: "retain-markstream-shell",
      "data-markdown-renderer": "markstream-react",
      onClickCapture: o,
      children: /* @__PURE__ */ l(
        J,
        {
          batchRendering: !e,
          content: t,
          customId: H,
          fade: !1,
          final: e,
          htmlPolicy: "escape",
          indexKey: r,
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
function Pt({
  content: t,
  streaming: e = !1,
  citations: r = [],
  jobId: n = "",
  className: a = "",
  streamingClassName: i = "",
  pendingClassName: o = "",
  finalClassName: s = "",
  citationFooterMax: d = 5,
  onJumpCitation: c
}) {
  var M;
  const u = v(null), h = O(), p = e ? `${t || ""}` : `${t || ""}`.trim(), f = `${n || ((M = r.find((m) => m.job_id)) == null ? void 0 : M.job_id) || ""}`.trim(), $ = E(() => {
    const m = /* @__PURE__ */ new Map();
    for (const b of r)
      q(b) && m.set(`${b.ref}`, b);
    return m;
  }, [r]), N = E(
    () => Q(p, $),
    [p, $]
  );
  return I(() => {
    var S;
    const m = u.current;
    if (!m || !p) return;
    const b = m.parentElement;
    if (b instanceof HTMLElement) {
      if (e) {
        (S = b.querySelector(".reader-ai-citations")) == null || S.remove();
        return;
      }
      V(b, r, {
        onJump: (U) => c == null ? void 0 : c(U),
        answerText: p,
        max: d
      });
    }
  }, [e, f, $, r, c, p, d]), I(() => () => C(u.current), []), p.trim() ? /* @__PURE__ */ l("div", { ref: u, className: `${a} ${e ? i : s || o}`.trim(), children: /* @__PURE__ */ l(
    vt,
    {
      content: N,
      final: !e,
      indexKey: h,
      jobId: f,
      citations: r,
      onJumpCitation: c,
      onClickCapture: (m) => {
        const b = m.target;
        b instanceof Element && b.closest("a[href]") && (m.preventDefault(), m.stopPropagation());
      }
    }
  ) }) : null;
}
export {
  Pt as A
};
//# sourceMappingURL=AiMarkdownAnswer-Bz0m-n05.js.map

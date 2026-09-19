import { jsxs as y, jsx as o, Fragment as I } from "react/jsx-runtime";
import { useId as O, useState as X, useCallback as F, createContext as z, useContext as W, useRef as S, useEffect as v, useMemo as E } from "react";
import { x as H, v as G, a as K, h as q, y as C, j as Z, l as Q, g as J, u as V } from "./answer-enhance-D8zK9znw.js";
import tt, { setCustomComponents as et, PreCodeNode as rt, MathInlineNode as nt } from "markstream-react";
const at = "retainpdf-chart", st = 6, ot = 40, it = /* @__PURE__ */ new Set(["bar", "line", "pie"]);
function lt(t) {
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
function ct(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const n = r, a = lt(n.value ?? n.y);
    if (a !== null && (e.push({ label: A(n.label ?? n.x, `${e.length + 1}`), value: a }), e.length >= ot))
      break;
  }
  return e;
}
function ut(t) {
  if (!Array.isArray(t)) return [];
  const e = [];
  for (const r of t) {
    if (!r || typeof r != "object") continue;
    const n = r, a = ct(n.points ?? n.data);
    if (a.length && (e.push({ name: A(n.name, `系列 ${e.length + 1}`), points: a }), e.length >= st))
      break;
  }
  return e;
}
function dt(t) {
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
  const i = ut(n.series);
  if (!i.length) return null;
  const l = a === "pie" ? i.slice(0, 1) : i;
  return {
    kind: a,
    title: A(n.title),
    xLabel: A(n.xLabel ?? n.x_label),
    yLabel: A(n.yLabel ?? n.y_label),
    series: l
  };
}
function ht(t) {
  const e = t.series.flatMap((l) => l.points.map((s) => s.value)), r = Math.min(...e), n = Math.max(...e), a = Math.min(0, r), i = Math.max(0, n);
  return a === i ? { min: a, max: i + 1 } : { min: a, max: i };
}
function P(t) {
  let e = [];
  for (const r of t.series)
    r.points.length > e.length && (e = r.points);
  return e.map((r) => r.label);
}
const B = 640, T = 300, g = { top: 16, right: 16, bottom: 44, left: 52 }, M = B - g.left - g.right, x = T - g.top - g.bottom, j = [
  "var(--chart-1, #4c6ef5)",
  "var(--chart-2, #f08c00)",
  "var(--chart-3, #2f9e44)",
  "var(--chart-4, #e03131)",
  "var(--chart-5, #ae3ec9)",
  "var(--chart-6, #0c8599)"
], L = (t) => j[t % j.length];
function mt(t, e) {
  return Array.from({ length: 5 }, (n, a) => t + (e - t) * a / 4);
}
function ft(t) {
  const e = Math.abs(t);
  return e >= 1e4 ? `${(t / 1e3).toFixed(0)}k` : Number.isInteger(t) ? `${t}` : t.toFixed(e < 1 ? 2 : 1);
}
function gt(t) {
  return t <= 8 ? 1 : Math.ceil(t / 8);
}
function pt({
  spec: t,
  min: e,
  max: r,
  labels: n
}) {
  const a = (s) => g.top + x - (s - e) / (r - e) * x, i = gt(n.length), l = M / Math.max(1, n.length);
  return /* @__PURE__ */ y("g", { className: "reader-answer-chart-axes", children: [
    mt(e, r).map((s) => /* @__PURE__ */ y("g", { children: [
      /* @__PURE__ */ o(
        "line",
        {
          className: "reader-answer-chart-grid",
          x1: g.left,
          x2: g.left + M,
          y1: a(s),
          y2: a(s)
        }
      ),
      /* @__PURE__ */ o("text", { className: "reader-answer-chart-tick", x: g.left - 8, y: a(s), textAnchor: "end", dominantBaseline: "middle", children: ft(s) })
    ] }, s)),
    n.map((s, d) => d % i === 0 ? /* @__PURE__ */ o(
      "text",
      {
        className: "reader-answer-chart-tick",
        x: g.left + l * (d + 0.5),
        y: g.top + x + 18,
        textAnchor: "middle",
        children: s.length > 10 ? `${s.slice(0, 9)}…` : s
      },
      `${s}-${d}`
    ) : null),
    t.yLabel ? /* @__PURE__ */ o("text", { className: "reader-answer-chart-axis-label", x: g.left, y: g.top - 4, textAnchor: "start", children: t.yLabel }) : null,
    t.xLabel ? /* @__PURE__ */ o(
      "text",
      {
        className: "reader-answer-chart-axis-label",
        x: g.left + M,
        y: T - 6,
        textAnchor: "end",
        children: t.xLabel
      }
    ) : null
  ] });
}
function bt({ spec: t, min: e, max: r }) {
  const n = P(t), a = M / Math.max(1, n.length), i = a * 0.7, l = i / t.series.length, s = (c) => g.top + x - (c - e) / (r - e) * x, d = s(0);
  return /* @__PURE__ */ o(I, { children: t.series.map((c, u) => /* @__PURE__ */ o("g", { fill: L(u), children: c.points.map((m, p) => {
    const h = s(m.value), $ = g.left + a * p + (a - i) / 2 + l * u;
    return /* @__PURE__ */ o(
      "rect",
      {
        x: $,
        y: Math.min(h, d),
        width: Math.max(1, l - 1),
        height: Math.max(1, Math.abs(d - h)),
        rx: 2,
        children: /* @__PURE__ */ o("title", { children: `${c.name} · ${m.label}: ${m.value}` })
      },
      `${m.label}-${p}`
    );
  }) }, c.name)) });
}
function $t({ spec: t, min: e, max: r }) {
  const n = P(t), a = M / Math.max(1, n.length), i = (s) => g.top + x - (s - e) / (r - e) * x, l = (s) => g.left + a * (s + 0.5);
  return /* @__PURE__ */ o(I, { children: t.series.map((s, d) => {
    const c = s.points.map((u, m) => `${m === 0 ? "M" : "L"} ${l(m)} ${i(u.value)}`).join(" ");
    return /* @__PURE__ */ y("g", { stroke: L(d), fill: L(d), children: [
      /* @__PURE__ */ o("path", { className: "reader-answer-chart-line", d: c, fill: "none" }),
      s.points.map((u, m) => /* @__PURE__ */ o(
        "circle",
        {
          cx: l(m),
          cy: i(u.value),
          r: 3,
          stroke: "none",
          children: /* @__PURE__ */ o("title", { children: `${s.name} · ${u.label}: ${u.value}` })
        },
        `${u.label}-${m}`
      ))
    ] }, s.name);
  }) });
}
function yt({ spec: t }) {
  var d;
  const e = ((d = t.series[0]) == null ? void 0 : d.points) ?? [], r = e.map((c) => Math.max(0, c.value)), n = r.reduce((c, u) => c + u, 0);
  if (n <= 0) return null;
  const a = g.left + M / 2, i = g.top + x / 2, l = Math.min(M, x) / 2 - 8;
  let s = -Math.PI / 2;
  return /* @__PURE__ */ o(I, { children: e.map((c, u) => {
    const m = r[u] / n, p = s + m * Math.PI * 2, h = a + l * Math.cos(s), $ = i + l * Math.sin(s), N = a + l * Math.cos(p), k = i + l * Math.sin(p), w = m > 0.5 ? 1 : 0, f = m >= 1 ? `M ${a} ${i - l} A ${l} ${l} 0 1 1 ${a - 0.01} ${i - l} Z` : `M ${a} ${i} L ${h} ${$} A ${l} ${l} 0 ${w} 1 ${N} ${k} Z`;
    return s = p, /* @__PURE__ */ o("path", { d: f, fill: L(u), children: /* @__PURE__ */ o("title", { children: `${c.label}: ${c.value}（${(m * 100).toFixed(1)}%）` }) }, `${c.label}-${u}`);
  }) });
}
function xt({ spec: t }) {
  var r;
  const e = t.kind === "pie" ? (((r = t.series[0]) == null ? void 0 : r.points) ?? []).map((n) => n.label) : t.series.map((n) => n.name);
  return e.length < 2 ? null : /* @__PURE__ */ o("ul", { className: "reader-answer-chart-legend", children: e.map((n, a) => /* @__PURE__ */ y("li", { children: [
    /* @__PURE__ */ o("span", { className: "reader-answer-chart-swatch", style: { background: L(a) }, "aria-hidden": !0 }),
    n
  ] }, `${n}-${a}`)) });
}
function Nt({ spec: t }) {
  const e = O(), { min: r, max: n } = ht(t), a = P(t), i = t.title || `${t.series.length} 个系列的${t.kind === "pie" ? "占比" : "对比"}图`;
  return /* @__PURE__ */ y("figure", { className: "reader-answer-chart", children: [
    /* @__PURE__ */ y(
      "svg",
      {
        className: `reader-answer-chart-svg is-${t.kind}`,
        viewBox: `0 0 ${B} ${T}`,
        role: "img",
        "aria-labelledby": e,
        preserveAspectRatio: "xMidYMid meet",
        children: [
          /* @__PURE__ */ o("title", { id: e, children: i }),
          t.kind !== "pie" ? /* @__PURE__ */ o(pt, { spec: t, min: r, max: n, labels: a }) : null,
          t.kind === "bar" ? /* @__PURE__ */ o(bt, { spec: t, min: r, max: n }) : null,
          t.kind === "line" ? /* @__PURE__ */ o($t, { spec: t, min: r, max: n }) : null,
          t.kind === "pie" ? /* @__PURE__ */ o(yt, { spec: t }) : null
        ]
      }
    ),
    /* @__PURE__ */ o(xt, { spec: t }),
    t.title ? /* @__PURE__ */ o("figcaption", { className: "reader-answer-chart-caption", children: t.title }) : null
  ] });
}
const wt = 1600;
function Mt(t) {
  const e = `${t || ""}`.trim().toLowerCase();
  return !e || e === "text" || e === "plain" ? "" : {
    js: "JavaScript",
    jsx: "JSX",
    ts: "TypeScript",
    tsx: "TSX",
    py: "Python",
    python: "Python",
    rs: "Rust",
    rust: "Rust",
    sh: "Shell",
    bash: "Shell",
    zsh: "Shell",
    json: "JSON",
    yaml: "YAML",
    yml: "YAML",
    sql: "SQL",
    html: "HTML",
    css: "CSS",
    md: "Markdown",
    markdown: "Markdown"
  }[e] || e;
}
function kt({
  language: t,
  code: e,
  children: r
}) {
  const [n, a] = X(!1), i = Mt(t), l = F(() => {
    var d;
    const s = `${e || ""}`;
    s.trim() && ((d = navigator.clipboard) == null || d.writeText(s).then(
      () => {
        var c;
        a(!0), (c = globalThis.setTimeout) == null || c.call(globalThis, () => a(!1), wt);
      },
      () => {
      }
    ));
  }, [e]);
  return /* @__PURE__ */ y("div", { className: "reader-answer-code", children: [
    /* @__PURE__ */ y("div", { className: "reader-answer-code-bar", children: [
      /* @__PURE__ */ o("span", { className: "reader-answer-code-lang", children: i }),
      /* @__PURE__ */ o(
        "button",
        {
          type: "button",
          className: "reader-answer-code-copy",
          onClick: l,
          title: "复制代码",
          children: n ? "已复制" : "复制"
        }
      )
    ] }),
    r
  ] });
}
const U = "retainpdf-ai-answer", D = 320, At = 2, R = z({
  final: !1,
  jobId: "",
  citations: []
});
function Lt(t) {
  const e = Number(t.naturalWidth) || 0, r = t.closest(".reader-ai-image-jump"), n = r || t, a = e > 0 && e < D;
  if (t.classList.toggle("is-low-resolution", a), r == null || r.classList.toggle("is-low-resolution", a), a) {
    const i = Math.min(
      D,
      Math.max(e, e * At)
    );
    n.style.setProperty("--reader-ai-image-width", `${i}px`);
  } else
    n.style.removeProperty("--reader-ai-image-width");
}
function St({ node: t }) {
  const { final: e, jobId: r, citations: n, onJumpCitation: a } = W(R), i = S(null), l = S(null), s = `${t.alt || ""}`.trim(), d = G(t.src, r, {}, K(n)), c = q(t.src, n, r), u = H(c), m = F((h) => {
    var k;
    const $ = i.current;
    if ($ === h || ((k = l.current) == null || k.abort(), l.current = null, $ && C($), i.current = h, !h || !d)) return;
    const N = new AbortController();
    l.current = N, (async () => {
      for (const w of [0, 250, 750, 1500]) {
        if (w && await new Promise((b) => globalThis.setTimeout(b, w)), N.signal.aborted) return;
        const f = i.current;
        if (!f || f !== h || f.classList.contains("is-hydrated") && f.src.startsWith("blob:")) return;
        await Z(f, { signal: N.signal });
      }
    })();
  }, [d]);
  if (v(() => () => {
    var h;
    (h = l.current) == null || h.abort(), l.current = null, C(i.current), i.current = null;
  }, []), !d)
    return e ? /* @__PURE__ */ o("span", { className: "aui-image-blocked", children: s ? `[图片不可用：${s}]` : "[图片不可用]" }) : /* @__PURE__ */ o("span", { className: "aui-image-pending", "aria-label": s || "图片加载中", children: s ? `[图片：${s}]` : "[图片加载中]" });
  const p = /* @__PURE__ */ o(
    "img",
    {
      ref: m,
      alt: s,
      "data-ai-src": d,
      decoding: "async",
      loading: "lazy",
      onLoad: (h) => Lt(h.currentTarget),
      title: t.title || void 0
    }
  );
  return !c || !a ? p : /* @__PURE__ */ y(
    "button",
    {
      type: "button",
      className: "reader-ai-image-jump",
      "data-page": u ?? void 0,
      title: u ? `定位到 PDF 第 ${u} 页` : "定位到图片来源",
      onClick: (h) => {
        h.preventDefault(), h.stopPropagation(), a({ ...c, image_url: d });
      },
      children: [
        p,
        /* @__PURE__ */ o("span", { className: "reader-ai-image-jump-label", "aria-hidden": "true", children: u ? `定位 p.${u}` : "定位来源" })
      ]
    }
  );
}
function vt({ node: t }) {
  const { citations: e, onJumpCitation: r } = W(R), n = `${t.href || ""}`.match(/^#retainpdf-citation-(\d+)$/), a = n ? e.find((l) => `${l.ref}` === n[1]) : null;
  if (a) {
    const l = H(a);
    return /* @__PURE__ */ y(
      "button",
      {
        type: "button",
        className: "reader-ai-citation-ref",
        "data-page": l ?? void 0,
        title: l ? `跳到第 ${l} 页` : "定位来源",
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
  return /* @__PURE__ */ o(
    "span",
    {
      className: "aui-md-extlink",
      "data-href": `${t.href || ""}`.trim() || void 0,
      title: i || void 0,
      children: i
    }
  );
}
function Ct(t) {
  const e = t.node;
  if (`${(e == null ? void 0 : e.language) || ""}`.trim().toLowerCase() === at) {
    const r = dt(`${(e == null ? void 0 : e.code) || ""}`);
    if (r) return /* @__PURE__ */ o(Nt, { spec: r });
  }
  return /* @__PURE__ */ o(kt, { language: `${(e == null ? void 0 : e.language) || ""}`, code: `${(e == null ? void 0 : e.code) || ""}`, children: /* @__PURE__ */ o(rt, { node: t.node }) });
}
function It({ node: t }) {
  return /* @__PURE__ */ o(
    nt,
    {
      node: t.markup === "$$" ? { ...t, markup: "$" } : t
    }
  );
}
et(U, {
  image: St,
  link: vt,
  math_inline: It,
  code_block: Ct
});
function Pt({
  content: t,
  final: e,
  indexKey: r,
  jobId: n,
  citations: a = [],
  onJumpCitation: i,
  onClickCapture: l
}) {
  return /* @__PURE__ */ o(R.Provider, { value: { final: e, jobId: n, citations: a, onJumpCitation: i }, children: /* @__PURE__ */ o(
    "div",
    {
      className: "retain-markstream-shell",
      "data-markdown-renderer": "markstream-react",
      onClickCapture: l,
      children: /* @__PURE__ */ o(
        tt,
        {
          batchRendering: !e,
          content: t,
          customId: U,
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
function jt({
  content: t,
  streaming: e = !1,
  citations: r = [],
  jobId: n = "",
  className: a = "",
  streamingClassName: i = "",
  pendingClassName: l = "",
  finalClassName: s = "",
  citationFooterMax: d = 5,
  onJumpCitation: c
}) {
  var w;
  const u = S(null), m = O(), p = e ? `${t || ""}` : `${t || ""}`.trim(), h = `${n || ((w = r.find((f) => f.job_id)) == null ? void 0 : w.job_id) || ""}`.trim(), $ = E(() => {
    const f = /* @__PURE__ */ new Map();
    for (const b of r)
      Q(b) && f.set(`${b.ref}`, b);
    return f;
  }, [r]), N = E(
    () => J(p, $),
    [p, $]
  );
  return v(() => {
    var _;
    const f = u.current;
    if (!f || !p) return;
    const b = f.parentElement;
    if (b instanceof HTMLElement) {
      if (e) {
        (_ = b.querySelector(".reader-ai-citations")) == null || _.remove();
        return;
      }
      V(b, r, {
        onJump: (Y) => c == null ? void 0 : c(Y),
        answerText: p,
        max: d
      });
    }
  }, [e, h, $, r, c, p, d]), v(() => () => C(u.current), []), p.trim() ? /* @__PURE__ */ o("div", { ref: u, className: `${a} ${e ? i : s || l}`.trim(), children: /* @__PURE__ */ o(
    Pt,
    {
      content: N,
      final: !e,
      indexKey: m,
      jobId: h,
      citations: r,
      onJumpCitation: c,
      onClickCapture: (f) => {
        const b = f.target;
        b instanceof Element && b.closest("a[href]") && (f.preventDefault(), f.stopPropagation());
      }
    }
  ) }) : null;
}
export {
  jt as A
};
//# sourceMappingURL=AiMarkdownAnswer-6TVFe9T9.js.map

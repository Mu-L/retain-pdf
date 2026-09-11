import { e as $, m as k, a as I, n as b, p as w, r as N, b as T, s as y, w as B } from "../markdown-math-DjYQuQQe.js";
const l = /^p0*(\d+)-b0*(\d+)$/i;
function h(e) {
  const t = l.exec(`${e || ""}`.trim());
  return t ? `p${Number(t[1])}-b${Number(t[2])}` : `${e || ""}`.trim();
}
const f = Object.freeze({
  sentence: { label: "句子" },
  data: { label: "数据" },
  figure: { label: "图表" }
});
function a(e, t) {
  return Array.isArray(e) ? [...e].sort((s, n) => {
    const u = t(s) - t(n);
    if (u !== 0)
      return u;
    const o = `${(s == null ? void 0 : s.createdAt) || ""}`, r = `${(n == null ? void 0 : n.createdAt) || ""}`;
    return o < r ? -1 : o > r ? 1 : 0;
  }) : [];
}
function p(e, t) {
  const s = [];
  for (const n of a(e, t)) {
    const u = t(n), o = s[s.length - 1];
    o && o.pageIdx === u ? o.items.push(n) : s.push({ pageIdx: u, items: [n] });
  }
  return s;
}
const d = (e) => Number((e == null ? void 0 : e.pageIdx) ?? 0);
function g(e) {
  return a(e, d);
}
function i(e) {
  return p(e, d);
}
function c(e) {
  return `${e || ""}`.split(`
`).map((t) => `> ${t}`);
}
function m({
  title: e = "",
  annotations: t = []
} = {}) {
  const s = e ? `# ${e} 批注` : "# 批注", n = i(t);
  if (n.length === 0)
    return `${s}

(暂无批注)
`;
  const u = [s, ""];
  for (const o of n) {
    u.push(`## 第 ${o.pageIdx + 1} 页`, "");
    for (const r of o.items)
      u.push(...c(r == null ? void 0 : r.quoteText)), r != null && r.translatedQuoteText && u.push(...c(`—— ${r.translatedQuoteText}`)), r != null && r.note && u.push("", `笔记:${r.note}`), u.push("");
  }
  return u.join(`
`);
}
function M(e) {
  return {
    pageIdx: e == null ? void 0 : e.pageIdx,
    blockId: e == null ? void 0 : e.blockId
  };
}
export {
  f as ANNOTATION_KIND_META,
  M as annotationAnchor,
  m as buildAnnotationsMarkdown,
  $ as extractMarkdownMath,
  i as groupAnnotationsByPage,
  p as groupByPageAndCreatedAt,
  k as materializeMarkdownMathFallbackHtml,
  I as materializeMarkdownMathHtml,
  h as normalizeBlockKey,
  b as normalizeMathTex,
  w as parseMarkdownWithMath,
  N as renderMathFallbackHtml,
  T as resetMarkdownMathEngineLoader,
  y as setMarkdownMathEngineLoader,
  g as sortAnnotations,
  a as sortByPageAndCreatedAt,
  B as wrapMathSvgHtml
};
//# sourceMappingURL=content.js.map

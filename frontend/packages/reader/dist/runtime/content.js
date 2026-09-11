import { e as $, m as k, a as I, p as b, r as w, b as N, s as y, w as B } from "../markdown-math-Cb17EyYs.js";
const l = /^p0*(\d+)-b0*(\d+)$/i;
function f(e) {
  const t = l.exec(`${e || ""}`.trim());
  return t ? `p${Number(t[1])}-b${Number(t[2])}` : `${e || ""}`.trim();
}
const g = Object.freeze({
  sentence: { label: "句子" },
  data: { label: "数据" },
  figure: { label: "图表" }
});
function a(e, t) {
  return Array.isArray(e) ? [...e].sort((s, c) => {
    const u = t(s) - t(c);
    if (u !== 0)
      return u;
    const o = `${(s == null ? void 0 : s.createdAt) || ""}`, r = `${(c == null ? void 0 : c.createdAt) || ""}`;
    return o < r ? -1 : o > r ? 1 : 0;
  }) : [];
}
function p(e, t) {
  const s = [];
  for (const c of a(e, t)) {
    const u = t(c), o = s[s.length - 1];
    o && o.pageIdx === u ? o.items.push(c) : s.push({ pageIdx: u, items: [c] });
  }
  return s;
}
const d = (e) => Number((e == null ? void 0 : e.pageIdx) ?? 0);
function h(e) {
  return a(e, d);
}
function i(e) {
  return p(e, d);
}
function n(e) {
  return `${e || ""}`.split(`
`).map((t) => `> ${t}`);
}
function m({
  title: e = "",
  annotations: t = []
} = {}) {
  const s = e ? `# ${e} 批注` : "# 批注", c = i(t);
  if (c.length === 0)
    return `${s}

(暂无批注)
`;
  const u = [s, ""];
  for (const o of c) {
    u.push(`## 第 ${o.pageIdx + 1} 页`, "");
    for (const r of o.items)
      u.push(...n(r == null ? void 0 : r.quoteText)), r != null && r.translatedQuoteText && u.push(...n(`—— ${r.translatedQuoteText}`)), r != null && r.note && u.push("", `笔记:${r.note}`), u.push("");
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
  g as ANNOTATION_KIND_META,
  M as annotationAnchor,
  m as buildAnnotationsMarkdown,
  $ as extractMarkdownMath,
  i as groupAnnotationsByPage,
  p as groupByPageAndCreatedAt,
  k as materializeMarkdownMathFallbackHtml,
  I as materializeMarkdownMathHtml,
  f as normalizeBlockKey,
  b as parseMarkdownWithMath,
  w as renderMathFallbackHtml,
  N as resetMarkdownMathEngineLoader,
  y as setMarkdownMathEngineLoader,
  h as sortAnnotations,
  a as sortByPageAndCreatedAt,
  B as wrapMathSvgHtml
};
//# sourceMappingURL=content.js.map

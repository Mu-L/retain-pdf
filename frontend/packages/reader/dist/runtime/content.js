import { e as x, m as A, a as k, n as I, p as w, r as $, b as T, s as b, w as y } from "../markdown-math-DjYQuQQe.js";
import { n as B } from "../block-key-BTxcG28S.js";
const f = Object.freeze({
  sentence: { label: "句子" },
  data: { label: "数据" },
  figure: { label: "图表" }
});
function c(e, u) {
  return Array.isArray(e) ? [...e].sort((t, o) => {
    const s = u(t) - u(o);
    if (s !== 0)
      return s;
    const a = `${(t == null ? void 0 : t.createdAt) || ""}`, r = `${(o == null ? void 0 : o.createdAt) || ""}`;
    return a < r ? -1 : a > r ? 1 : 0;
  }) : [];
}
function d(e, u) {
  const t = [];
  for (const o of c(e, u)) {
    const s = u(o), a = t[t.length - 1];
    a && a.pageIdx === s ? a.items.push(o) : t.push({ pageIdx: s, items: [o] });
  }
  return t;
}
const l = (e) => Number((e == null ? void 0 : e.pageIdx) ?? 0);
function g(e) {
  return c(e, l);
}
function p(e) {
  return d(e, l);
}
function n(e) {
  return `${e || ""}`.split(`
`).map((u) => `> ${u}`);
}
function h({
  title: e = "",
  annotations: u = []
} = {}) {
  const t = e ? `# ${e} 批注` : "# 批注", o = p(u);
  if (o.length === 0)
    return `${t}

(暂无批注)
`;
  const s = [t, ""];
  for (const a of o) {
    s.push(`## 第 ${a.pageIdx + 1} 页`, "");
    for (const r of a.items)
      s.push(...n(r == null ? void 0 : r.quoteText)), r != null && r.translatedQuoteText && s.push(...n(`—— ${r.translatedQuoteText}`)), r != null && r.note && s.push("", `笔记:${r.note}`), s.push("");
  }
  return s.join(`
`);
}
function i(e) {
  return {
    pageIdx: e == null ? void 0 : e.pageIdx,
    blockId: e == null ? void 0 : e.blockId
  };
}
export {
  f as ANNOTATION_KIND_META,
  i as annotationAnchor,
  h as buildAnnotationsMarkdown,
  x as extractMarkdownMath,
  p as groupAnnotationsByPage,
  d as groupByPageAndCreatedAt,
  A as materializeMarkdownMathFallbackHtml,
  k as materializeMarkdownMathHtml,
  B as normalizeBlockKey,
  I as normalizeMathTex,
  w as parseMarkdownWithMath,
  $ as renderMathFallbackHtml,
  T as resetMarkdownMathEngineLoader,
  b as setMarkdownMathEngineLoader,
  g as sortAnnotations,
  c as sortByPageAndCreatedAt,
  y as wrapMathSvgHtml
};
//# sourceMappingURL=content.js.map

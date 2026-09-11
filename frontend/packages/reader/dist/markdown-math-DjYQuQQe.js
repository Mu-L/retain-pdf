const f = "RP_MATH_";
let g = null, d = null;
function P(e) {
  d = e, g = null;
}
function j() {
  d = null, g = null;
}
function x(e) {
  return `${e}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function M(e) {
  return `${f}${e}`;
}
const k = /[0-9A-Za-z\\{}_^()\[\]|+\-=,.:;'~*/<>!\u00b0\u00b1\u00d7\u00f7\u2212\u2202\u03b1-\u03c9\u0391-\u03a9]+/g, _ = /\\[A-Za-z]+|[_^]\{/;
function A(e, n) {
  const a = new RegExp(`${f}\\d+`, "g"), t = (c) => c.replace(
    k,
    (o) => _.test(o) ? n(o, !1) : o
  );
  let r = "", l = 0, i;
  for (; (i = a.exec(e)) !== null; )
    r += t(e.slice(l, i.index)) + i[0], l = i.index + i[0].length;
  return r += t(e.slice(l)), r;
}
function E(e, n = {}) {
  const a = [];
  let t = `${e ?? ""}`;
  const r = (l, i) => {
    const c = `${l ?? ""}`.trim();
    if (!c)
      return i ? `$$${l}$$` : `$${l}$`;
    const o = M(a.length);
    return a.push({ token: o, tex: c, display: i }), o;
  };
  return t = t.replace(/\$\$([\s\S]+?)\$\$/g, (l, i) => r(i, !0)), t = t.replace(/\\\[([\s\S]+?)\\\]/g, (l, i) => r(i, !0)), t = t.replace(/\\\(([\s\S]+?)\\\)/g, (l, i) => r(i, !1)), t = t.replace(new RegExp("(?<![\\\\$])\\$(?!\\$)((?:\\\\.|[^$\\n])+?)\\$(?!\\$)", "g"), (l, i) => `${i}`.trim() ? r(i, !1) : l), n.bareLatex && (t = A(t, r)), { text: t, slots: a };
}
async function T() {
  const [
    { mathjax: e },
    { TeX: n },
    { SVG: a },
    { liteAdaptor: t },
    { RegisterHTMLHandler: r },
    { AllPackages: l }
  ] = await Promise.all([
    import("mathjax-full/js/mathjax.js"),
    import("mathjax-full/js/input/tex.js"),
    import("mathjax-full/js/output/svg.js"),
    import("mathjax-full/js/adaptors/liteAdaptor.js"),
    import("mathjax-full/js/handlers/html.js"),
    import("mathjax-full/js/input/tex/AllPackages.js")
  ]), i = t();
  r(i);
  const c = e.document("", {
    InputJax: new n({
      // 方案 C：宽容渲染。`unicode` 包让 Unicode 数学符号（⟨⟩、希腊字母、
      // 运算符等）尽量直接渲染，减少严格 TeX 的报错面。
      packages: Array.from(/* @__PURE__ */ new Set([...l, "unicode"]))
    }),
    OutputJax: new a({ fontCache: "none" })
  });
  return {
    convert(o, s) {
      const w = c.convert(o, { display: s }), p = i.outerHTML(w);
      if (!/<svg[\s>]/i.test(p))
        throw new Error("mathjax produced no svg");
      if (/data-mjx-error|merror/i.test(p))
        throw new Error("mathjax error node");
      return p;
    }
  };
}
function R() {
  return g || (g = (d ?? T)().catch((n) => {
    throw g = null, n;
  })), g;
}
function m(e, n) {
  const a = `<code class="reader-md-math-error" title="公式渲染失败">${x(e)}</code>`;
  return n ? `<div class="reader-md-math reader-md-math-display reader-md-math-failed">${a}</div>` : `<span class="reader-md-math reader-md-math-inline reader-md-math-failed">${a}</span>`;
}
function b(e, n) {
  const a = n ? "reader-md-math reader-md-math-display" : "reader-md-math reader-md-math-inline", t = n ? "div" : "span";
  return `<${t} class="${a}">${e}</${t}>`;
}
const y = [
  [/[⟨〈]/g, "\\langle "],
  [/[⟩〉]/g, "\\rangle "],
  [/∣/g, "\\mid "],
  [/‖/g, "\\| "],
  [/[≤⩽]/g, "\\le "],
  [/[≥⩾]/g, "\\ge "],
  [/≠/g, "\\ne "],
  [/≈/g, "\\approx "],
  [/≡/g, "\\equiv "],
  [/×/g, "\\times "],
  [/÷/g, "\\div "],
  [/[·⋅]/g, "\\cdot "],
  [/±/g, "\\pm "],
  [/∓/g, "\\mp "],
  [/[−–]/g, "-"],
  [/∞/g, "\\infty "],
  [/∑/g, "\\sum "],
  [/∏/g, "\\prod "],
  [/∫/g, "\\int "],
  [/√/g, "\\surd "],
  [/∂/g, "\\partial "],
  [/∇/g, "\\nabla "],
  [/→/g, "\\to "],
  [/←/g, "\\leftarrow "],
  [/⇒/g, "\\Rightarrow "],
  [/⇔/g, "\\Leftrightarrow "],
  [/∈/g, "\\in "],
  [/∉/g, "\\notin "],
  [/∀/g, "\\forall "],
  [/∃/g, "\\exists "],
  [/∅/g, "\\emptyset "],
  [/∝/g, "\\propto "],
  [/≃/g, "\\simeq "],
  [/≅/g, "\\cong "],
  [/⊥/g, "\\perp "],
  [/∥/g, "\\parallel "],
  [/[′ʹ]/g, "'"],
  [/[″ʺ]/g, "''"],
  [/Δ/g, "\\Delta "],
  [/Ω/g, "\\Omega "],
  [/μ/g, "\\mu "],
  [/λ/g, "\\lambda "],
  [/σ/g, "\\sigma "],
  [/π/g, "\\pi "],
  [/θ/g, "\\theta "],
  [/φ/g, "\\varphi "],
  [/α/g, "\\alpha "],
  [/β/g, "\\beta "],
  [/γ/g, "\\gamma "],
  [/ω/g, "\\omega "]
];
function S(e) {
  let n = `${e ?? ""}`;
  for (const [a, t] of y)
    n = n.replace(a, t);
  return v(n) ? H(n) : n;
}
function v(e) {
  const n = "(?:\\{[^{}]*\\}|\\\\[A-Za-z]+|[A-Za-z0-9*])", a = new RegExp(`[_^]${n}\\s*(?=[_^])`), t = new RegExp(`[_^]${n}\\s*'`);
  return a.test(e) || t.test(e) || /\^\s*\^/.test(e) || /__/.test(e);
}
function u(e, n) {
  let a = 0, t = n;
  for (; t < e.length; t += 1)
    if (e[t] === "{") a += 1;
    else if (e[t] === "}" && (a -= 1, a === 0)) {
      t += 1;
      break;
    }
  return { arg: e.slice(n, t), next: t };
}
function h(e, n) {
  let a = n;
  for (; a < e.length && e[a] === " "; ) a += 1;
  if (e[a] === "{") return u(e, a);
  if (e[a] === "\\") {
    let t = a + 1;
    for (; t < e.length && /[A-Za-z]/.test(e[t]); ) t += 1;
    let r = t > a + 1 ? t : t + 1;
    for (; ; ) {
      let l = r;
      for (; l < e.length && e[l] === " "; ) l += 1;
      if (e[l] !== "{") break;
      r = u(e, l).next;
    }
    return { arg: e.slice(a, r), next: r };
  }
  return { arg: e[a] ?? "", next: a + 1 };
}
function H(e) {
  const n = e.replace(/\^\s*\^/g, "^").replace(/''/g, "^{\\prime\\prime}").replace(/'/g, "^{\\prime}");
  let a = "", t = 0;
  for (; t < n.length; ) {
    const r = n[t];
    if (r !== "_" && r !== "^") {
      a += r, t += 1;
      continue;
    }
    const l = h(n, t + 1);
    let i = l.arg, c = l.next;
    for (; c < n.length; ) {
      let o = c;
      for (; o < n.length && n[o] === " "; ) o += 1;
      if (n[o] !== r) break;
      const s = h(n, o + 1);
      i = `${i}${n.slice(c, o)}${r}${s.arg}`, c = s.next;
    }
    a += `${r}{${i}}`, t = c;
  }
  return a;
}
async function F(e, n) {
  if (!n.length)
    return e;
  let a = null;
  try {
    a = await R();
  } catch {
    a = null;
  }
  const t = /* @__PURE__ */ new Map();
  let r = 0;
  for (const l of n) {
    let i;
    if (a)
      try {
        i = b(a.convert(S(l.tex), l.display), l.display);
      } catch {
        i = m(l.tex, l.display);
      }
    else
      i = m(l.tex, l.display);
    t.set(l.token, i), r += 1, r % 24 === 0 && await new Promise((c) => setTimeout(c, 0));
  }
  return $(`${e ?? ""}`, n, t);
}
function $(e, n, a) {
  if (!n.length) return e;
  const t = new RegExp(
    n.map((r) => r.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "g"
  );
  return e.replace(t, (r) => a.get(r) || r);
}
function z(e, n) {
  const a = new Map(
    n.map((t) => [t.token, m(t.tex, t.display)])
  );
  return $(`${e ?? ""}`, n, a);
}
async function I(e, n) {
  const { text: a, slots: t } = E(e), r = n(a);
  return F(r, t);
}
export {
  F as a,
  j as b,
  E as e,
  z as m,
  S as n,
  I as p,
  m as r,
  P as s,
  b as w
};
//# sourceMappingURL=markdown-math-DjYQuQQe.js.map

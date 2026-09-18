const x = "RP_MATH_";
let d = null, h = null;
function Z(t) {
  h = t, d = null;
}
function B() {
  h = null, d = null;
}
function S(t) {
  return `${t}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function b(t) {
  return `${x}${t}`;
}
const y = /[0-9A-Za-z\\{}_^()\[\]|+\-=,.:;'~*/<>!\u00b0\u00b1\u00d7\u00f7\u2212\u2202\u03b1-\u03c9\u0391-\u03a9]+/g, F = /\\[A-Za-z]+|[_^]\{/;
function H(t, n) {
  const a = new RegExp(`${x}\\d+`, "g"), e = (i) => i.replace(
    y,
    (s) => F.test(s) ? n(s, !1) : s
  );
  let l = "", r = 0, o;
  for (; (o = a.exec(t)) !== null; )
    l += e(t.slice(r, o.index)) + o[0], r = o.index + o[0].length;
  return l += e(t.slice(r)), l;
}
function N(t, n = {}) {
  const a = [];
  let e = `${t ?? ""}`;
  const l = (r, o) => {
    const i = `${r ?? ""}`.trim();
    if (!i)
      return o ? `$$${r}$$` : `$${r}$`;
    const s = b(a.length);
    return a.push({ token: s, tex: i, display: o }), s;
  };
  return e = e.replace(/\$\$([\s\S]+?)\$\$/g, (r, o) => l(o, !0)), e = e.replace(/\\\[([\s\S]+?)\\\]/g, (r, o) => l(o, !0)), e = e.replace(/\\\(([\s\S]+?)\\\)/g, (r, o) => l(o, !1)), e = e.replace(new RegExp("(?<![\\\\$])\\$(?!\\$)((?:\\\\.|[^$\\n])+?)\\$(?!\\$)", "g"), (r, o) => `${o}`.trim() ? l(o, !1) : r), n.bareLatex && (e = H(e, l)), { text: e, slots: a };
}
const L = 20, j = /data-mml-node="mtext"[^>]*fill="red"/;
function g(t, n) {
  var r;
  const a = t, e = a == null ? void 0 : a[n];
  if (e !== void 0)
    return e;
  const l = (r = a == null ? void 0 : a.default) == null ? void 0 : r[n];
  if (l !== void 0)
    return l;
  throw new Error(`mathjax-full 未导出 ${n}（CJS/ESM 互操作问题）`);
}
async function P() {
  const [t, n, a, e, l, r] = await Promise.all([
    import("mathjax-full/js/mathjax.js"),
    import("mathjax-full/js/input/tex.js"),
    import("mathjax-full/js/output/svg.js"),
    import("mathjax-full/js/adaptors/liteAdaptor.js"),
    import("mathjax-full/js/handlers/html.js"),
    import("mathjax-full/js/input/tex/AllPackages.js")
  ]), o = g(t, "mathjax"), i = g(n, "TeX"), s = g(a, "SVG"), m = g(e, "liteAdaptor"), k = g(l, "RegisterHTMLHandler"), A = g(r, "AllPackages"), f = m();
  k(f);
  const E = o.document("", {
    InputJax: new i({
      // 方案 C：宽容渲染。`unicode` 包让 Unicode 数学符号（⟨⟩、希腊字母、
      // 运算符等）尽量直接渲染，减少严格 TeX 的报错面。
      packages: Array.from(/* @__PURE__ */ new Set([...A, "unicode"]))
    }),
    OutputJax: new s({ fontCache: "none" })
  });
  return {
    convert(T, v) {
      const R = E.convert(T, { display: v }), p = f.outerHTML(R);
      if (!/<svg[\s>]/i.test(p))
        throw new Error("mathjax produced no svg");
      if (/data-mjx-error|merror/i.test(p))
        throw new Error("mathjax error node");
      if (j.test(p))
        throw new Error("mathjax undefined command");
      return p;
    }
  };
}
const c = {
  engineLoad: 0,
  convert: 0,
  lastReason: "",
  /** 最近若干条失败的公式原文，用来判断是哪一类写法出了问题。 */
  samples: []
};
try {
  globalThis.__retainMathFailures = c;
} catch {
}
function $(t, n, a = "") {
  const e = `${(n == null ? void 0 : n.message) || n}`;
  if (c.lastReason = e, t === "engine-load") {
    c.engineLoad += 1, console.warn("[markdown-math] MathJax 引擎加载失败，公式将退回纯文本：", e);
    return;
  }
  c.convert += 1, c.samples.length < L && c.samples.push(a), c.convert <= 5 && console.warn(`[markdown-math] 公式渲染失败（第 ${c.convert} 条）：`, a, e);
}
function I() {
  return d || (d = (h ?? P)().catch((n) => {
    throw d = null, n;
  })), d;
}
function u(t, n) {
  const a = `<code class="reader-md-math-error" title="公式渲染失败">${S(t)}</code>`;
  return n ? `<div class="reader-md-math reader-md-math-display reader-md-math-failed">${a}</div>` : `<span class="reader-md-math reader-md-math-inline reader-md-math-failed">${a}</span>`;
}
function z(t, n) {
  const a = n ? "reader-md-math reader-md-math-display" : "reader-md-math reader-md-math-inline", e = n ? "div" : "span";
  return `<${e} class="${a}">${t}</${e}>`;
}
const O = [
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
function U(t) {
  let n = `${t ?? ""}`;
  for (const [a, e] of O)
    n = n.replace(a, e);
  return D(n) ? J(n) : n;
}
function D(t) {
  const n = "(?:\\{[^{}]*\\}|\\\\[A-Za-z]+|[A-Za-z0-9*])", a = new RegExp(`[_^]${n}\\s*(?=[_^])`), e = new RegExp(`[_^]${n}\\s*'`);
  return a.test(t) || e.test(t) || /\^\s*\^/.test(t) || /__/.test(t);
}
function w(t, n) {
  let a = 0, e = n;
  for (; e < t.length; e += 1)
    if (t[e] === "{") a += 1;
    else if (t[e] === "}" && (a -= 1, a === 0)) {
      e += 1;
      break;
    }
  return { arg: t.slice(n, e), next: e };
}
function M(t, n) {
  let a = n;
  for (; a < t.length && t[a] === " "; ) a += 1;
  if (t[a] === "{") return w(t, a);
  if (t[a] === "\\") {
    let e = a + 1;
    for (; e < t.length && /[A-Za-z]/.test(t[e]); ) e += 1;
    let l = e > a + 1 ? e : e + 1;
    for (; ; ) {
      let r = l;
      for (; r < t.length && t[r] === " "; ) r += 1;
      if (t[r] !== "{") break;
      l = w(t, r).next;
    }
    return { arg: t.slice(a, l), next: l };
  }
  return { arg: t[a] ?? "", next: a + 1 };
}
function J(t) {
  const n = t.replace(/\^\s*\^/g, "^").replace(/''/g, "^{\\prime\\prime}").replace(/'/g, "^{\\prime}");
  let a = "", e = 0;
  for (; e < n.length; ) {
    const l = n[e];
    if (l !== "_" && l !== "^") {
      a += l, e += 1;
      continue;
    }
    const r = M(n, e + 1);
    let o = r.arg, i = r.next;
    for (; i < n.length; ) {
      let s = i;
      for (; s < n.length && n[s] === " "; ) s += 1;
      if (n[s] !== l) break;
      const m = M(n, s + 1);
      o = `${o}${n.slice(i, s)}${l}${m.arg}`, i = m.next;
    }
    a += `${l}{${o}}`, e = i;
  }
  return a;
}
async function X(t, n) {
  if (!n.length)
    return t;
  let a = null;
  try {
    a = await I();
  } catch (r) {
    a = null, $("engine-load", r);
  }
  const e = /* @__PURE__ */ new Map();
  let l = 0;
  for (const r of n) {
    let o;
    if (a)
      try {
        o = z(a.convert(U(r.tex), r.display), r.display);
      } catch (i) {
        o = u(r.tex, r.display), $("convert", i, r.tex);
      }
    else
      o = u(r.tex, r.display);
    e.set(r.token, o), l += 1, l % 24 === 0 && await new Promise((i) => setTimeout(i, 0));
  }
  return _(`${t ?? ""}`, n, e);
}
function _(t, n, a) {
  if (!n.length) return t;
  const e = new RegExp(
    n.map((l) => l.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "g"
  );
  return t.replace(e, (l) => a.get(l) || l);
}
function C(t, n) {
  const a = new Map(
    n.map((e) => [e.token, u(e.tex, e.display)])
  );
  return _(`${t ?? ""}`, n, a);
}
async function G(t, n) {
  const { text: a, slots: e } = N(t), l = n(a);
  return X(l, e);
}
export {
  X as a,
  c as b,
  B as c,
  N as e,
  C as m,
  U as n,
  G as p,
  u as r,
  Z as s,
  z as w
};
//# sourceMappingURL=markdown-math-DUStTa8Y.js.map

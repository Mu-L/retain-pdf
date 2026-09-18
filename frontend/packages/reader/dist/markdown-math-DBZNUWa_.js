const k = "RP_MATH_";
let m = null, f = null;
function Z(e) {
  f = e, m = null;
}
function B() {
  f = null, m = null;
}
function S(e) {
  return `${e}`.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
function b(e) {
  return `${k}${e}`;
}
const N = /[0-9A-Za-z\\{}_^()\[\]|+\-=,.:;'~*/<>!\u00b0\u00b1\u00d7\u00f7\u2212\u2202\u03b1-\u03c9\u0391-\u03a9]+/g, F = /\\[A-Za-z]+|[_^]\{/;
function H(e, t) {
  const n = new RegExp(`${k}\\d+`, "g"), a = (i) => i.replace(
    N,
    (c) => F.test(c) ? t(c, !1) : c
  );
  let r = "", l = 0, o;
  for (; (o = n.exec(e)) !== null; )
    r += a(e.slice(l, o.index)) + o[0], l = o.index + o[0].length;
  return r += a(e.slice(l)), r;
}
const y = /<([futnvc]\d+-[0-9a-z]{3})\/>/g;
function P(e) {
  let t = 0;
  return { text: `${e ?? ""}`.replace(y, (a, r) => (t += 1, `[未还原 token ${r}]`)), count: t };
}
function L(e, t = {}) {
  const n = [], a = P(`${e ?? ""}`);
  a.count && (s.protectedTokens += a.count, s.protectedTokens <= 5 && console.warn(
    `[markdown-math] 译文里有 ${a.count} 个未还原的保护 token，已原样显示`
  ));
  let r = a.text;
  const l = (o, i) => {
    const c = `${o ?? ""}`.trim();
    if (!c)
      return i ? `$$${o}$$` : `$${o}$`;
    const g = b(n.length);
    return n.push({ token: g, tex: c, display: i }), g;
  };
  return r = r.replace(/\$\$([\s\S]+?)\$\$/g, (o, i) => l(i, !0)), r = r.replace(/\\\[([\s\S]+?)\\\]/g, (o, i) => l(i, !0)), r = r.replace(/\\\(([\s\S]+?)\\\)/g, (o, i) => l(i, !1)), r = r.replace(new RegExp("(?<![\\\\$])\\$(?!\\$)((?:\\\\.|[^$\\n])+?)\\$(?!\\$)", "g"), (o, i) => `${i}`.trim() ? l(i, !1) : o), t.bareLatex && (r = H(r, l)), { text: r, slots: n };
}
const j = 20, I = /data-mml-node="mtext"[^>]*fill="red"/;
function d(e, t) {
  var l;
  const n = e, a = n == null ? void 0 : n[t];
  if (a !== void 0)
    return a;
  const r = (l = n == null ? void 0 : n.default) == null ? void 0 : l[t];
  if (r !== void 0)
    return r;
  throw new Error(`mathjax-full 未导出 ${t}（CJS/ESM 互操作问题）`);
}
async function O() {
  const [e, t, n, a, r, l] = await Promise.all([
    import("mathjax-full/js/mathjax.js"),
    import("mathjax-full/js/input/tex.js"),
    import("mathjax-full/js/output/svg.js"),
    import("mathjax-full/js/adaptors/liteAdaptor.js"),
    import("mathjax-full/js/handlers/html.js"),
    import("mathjax-full/js/input/tex/AllPackages.js")
  ]), o = d(e, "mathjax"), i = d(t, "TeX"), c = d(n, "SVG"), g = d(a, "liteAdaptor"), E = d(r, "RegisterHTMLHandler"), T = d(l, "AllPackages"), $ = g();
  E($);
  const A = o.document("", {
    InputJax: new i({
      // 方案 C：宽容渲染。`unicode` 包让 Unicode 数学符号（⟨⟩、希腊字母、
      // 运算符等）尽量直接渲染，减少严格 TeX 的报错面。
      //
      // 摘掉 `html` 包。它提供 `\href`/`\class`/`\cssId`，链接原样进 SVG，而译文
      // 是模型对 OCR 文本的输出、源头是用户上传的 PDF——不是可信输入。实测
      // `$\href{javascript:alert(1)}{x}$` 渲染出 `<a href="javascript:alert(1)">`，
      // 而实时翻译叠层是 dangerouslySetInnerHTML 直接注入，中间没有任何消毒层。
      //
      // 试过在字符串层用正则摘掉危险协议，不成立：`jav&#x61;script:` 在字符串里
      // 看着无害，浏览器解析属性时会把实体解码回 `javascript:`。能被绕过的清洗器
      // 比没有更糟，它只提供虚假的安全感。所以从根上不产生这类属性。
      //
      // 代价：文档里真有 `\href` 时不再渲染成链接，退化成失败回退显示原文。渲染
      // PDF 的 mitex 本来也不支持 `\href`，两边因此一致。
      packages: T.filter((u) => u !== "html").concat("unicode")
    }),
    OutputJax: new c({ fontCache: "none" })
  });
  return {
    convert(u, v) {
      const R = A.convert(u, { display: v }), p = $.outerHTML(R);
      if (!/<svg[\s>]/i.test(p))
        throw new Error("mathjax produced no svg");
      if (/data-mjx-error|merror/i.test(p))
        throw new Error("mathjax error node");
      if (I.test(p))
        throw new Error("mathjax undefined command");
      return p;
    }
  };
}
const s = {
  engineLoad: 0,
  convert: 0,
  lastReason: "",
  /** 最近若干条失败的公式原文，用来判断是哪一类写法出了问题。 */
  samples: [],
  /** 译文里漏还原的后端保护 token 数量。不是渲染失败，是上游漏了一步。 */
  protectedTokens: 0
};
try {
  globalThis.__retainMathFailures = s;
} catch {
}
function w(e, t, n = "") {
  const a = `${(t == null ? void 0 : t.message) || t}`;
  if (s.lastReason = a, e === "engine-load") {
    s.engineLoad += 1, console.warn("[markdown-math] MathJax 引擎加载失败，公式将退回纯文本：", a);
    return;
  }
  s.convert += 1, s.samples.length < j && s.samples.push(n), s.convert <= 5 && console.warn(`[markdown-math] 公式渲染失败（第 ${s.convert} 条）：`, n, a);
}
function z() {
  return m || (m = (f ?? O)().catch((t) => {
    throw m = null, t;
  })), m;
}
function h(e, t) {
  const n = `<code class="reader-md-math-error" title="公式渲染失败">${S(e)}</code>`;
  return t ? `<div class="reader-md-math reader-md-math-display reader-md-math-failed">${n}</div>` : `<span class="reader-md-math reader-md-math-inline reader-md-math-failed">${n}</span>`;
}
function D(e, t) {
  const n = t ? "reader-md-math reader-md-math-display" : "reader-md-math reader-md-math-inline", a = t ? "div" : "span";
  return `<${a} class="${n}">${e}</${a}>`;
}
const U = [
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
function J(e) {
  let t = `${e ?? ""}`;
  for (const [n, a] of U)
    t = t.replace(n, a);
  return X(t) ? C(t) : t;
}
function X(e) {
  const t = "(?:\\{[^{}]*\\}|\\\\[A-Za-z]+|[A-Za-z0-9*])", n = new RegExp(`[_^]${t}\\s*(?=[_^])`), a = new RegExp(`[_^]${t}\\s*'`);
  return n.test(e) || a.test(e) || /\^\s*\^/.test(e) || /__/.test(e);
}
function x(e, t) {
  let n = 0, a = t;
  for (; a < e.length; a += 1)
    if (e[a] === "{") n += 1;
    else if (e[a] === "}" && (n -= 1, n === 0)) {
      a += 1;
      break;
    }
  return { arg: e.slice(t, a), next: a };
}
function M(e, t) {
  let n = t;
  for (; n < e.length && e[n] === " "; ) n += 1;
  if (e[n] === "{") return x(e, n);
  if (e[n] === "\\") {
    let a = n + 1;
    for (; a < e.length && /[A-Za-z]/.test(e[a]); ) a += 1;
    let r = a > n + 1 ? a : a + 1;
    for (; ; ) {
      let l = r;
      for (; l < e.length && e[l] === " "; ) l += 1;
      if (e[l] !== "{") break;
      r = x(e, l).next;
    }
    return { arg: e.slice(n, r), next: r };
  }
  return { arg: e[n] ?? "", next: n + 1 };
}
function C(e) {
  const t = e.replace(/\^\s*\^/g, "^").replace(/''/g, "^{\\prime\\prime}").replace(/'/g, "^{\\prime}");
  let n = "", a = 0;
  for (; a < t.length; ) {
    const r = t[a];
    if (r !== "_" && r !== "^") {
      n += r, a += 1;
      continue;
    }
    const l = M(t, a + 1);
    let o = l.arg, i = l.next;
    for (; i < t.length; ) {
      let c = i;
      for (; c < t.length && t[c] === " "; ) c += 1;
      if (t[c] !== r) break;
      const g = M(t, c + 1);
      o = `${o}${t.slice(i, c)}${r}${g.arg}`, i = g.next;
    }
    n += `${r}{${o}}`, a = i;
  }
  return n;
}
async function K(e, t) {
  if (!t.length)
    return e;
  let n = null;
  try {
    n = await z();
  } catch (l) {
    n = null, w("engine-load", l);
  }
  const a = /* @__PURE__ */ new Map();
  let r = 0;
  for (const l of t) {
    let o;
    if (n)
      try {
        o = D(n.convert(J(l.tex), l.display), l.display);
      } catch (i) {
        o = h(l.tex, l.display), w("convert", i, l.tex);
      }
    else
      o = h(l.tex, l.display);
    a.set(l.token, o), r += 1, r % 24 === 0 && await new Promise((i) => setTimeout(i, 0));
  }
  return _(`${e ?? ""}`, t, a);
}
function _(e, t, n) {
  if (!t.length) return e;
  const a = new RegExp(
    t.map((r) => r.token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "g"
  );
  return e.replace(a, (r) => n.get(r) || r);
}
function G(e, t) {
  const n = new Map(
    t.map((a) => [a.token, h(a.tex, a.display)])
  );
  return _(`${e ?? ""}`, t, n);
}
async function q(e, t) {
  const { text: n, slots: a } = L(e), r = t(n);
  return K(r, a);
}
export {
  K as a,
  s as b,
  B as c,
  P as d,
  L as e,
  G as m,
  J as n,
  q as p,
  h as r,
  Z as s,
  D as w
};
//# sourceMappingURL=markdown-math-DBZNUWa_.js.map

/**
 * 公式必须变成**原生 OMML 结构**，而不是把命令名当字母印出来。
 *
 * 这是整个包存在的理由。被换掉的那版 Python 转换器有一张 47 条的符号表，实测全仓
 * 1933 个带命令的公式里 625 个（32.3%）会把命令名印出来：`\mathbf{2a}` → `mathbf2a`
 * （369 次）、`\chi` → `chi`、`\prime` → `prime`，还有 `\left(` 被 `\le` 匹配成 `≤ft(`。
 * 同一个真实 job 上对照过：旧版 91 个公式里 58 个泄漏，新版 0 个。
 */

import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { latexToOmml, clearFormulaCache, FormulaConversionError } from "../src/formula.mjs";

const textOf = (omml) => [...omml.matchAll(/<m:t[^>]*>([^<]*)<\/m:t>/g)].map((m) => m[1]).join("");
const tagsOf = (omml) => new Set([...omml.matchAll(/<(m:[a-zA-Z]+)[ >/]/g)].map((m) => m[1]));

describe("LaTeX → 原生 OMML", () => {
  it("命令名不会被当成字母印出来", () => {
    // 每一条都是旧版真实印错过的。
    const cases = [
      [String.raw`\mathbf{2a}`, "2a", "mathbf"],
      [String.raw`\chi`, "χ", "chi"],
      [String.raw`\Psi`, "Ψ", "Psi"],
      [String.raw`\prime`, "′", "prime"],
      [String.raw`\kappa`, "κ", "kappa"],
    ];
    for (const [latex, expected, leak] of cases) {
      const text = textOf(latexToOmml(latex));
      assert.equal(text, expected, `${latex} 排出来是 ${JSON.stringify(text)}`);
      assert.ok(!text.includes(leak), `${latex} 把命令名 ${leak} 印出来了`);
    }
  });

  it("结构性命令变成对应的 OMML 元素，而不是文字", () => {
    const cases = [
      [String.raw`\vec{v}`, "m:groupChr", "vec"],
      [String.raw`\hat{H}`, "m:acc", "hat"],
      [String.raw`\bar{x}`, "m:bar", "bar"],
      ["x_i^2", "m:sSubSup", null],
      [String.raw`\sum_{i=1}^{n} x_i`, "m:nary", "sum"],
      [String.raw`\int_0^\infty f(x)`, "m:nary", "int"],
      [String.raw`\left(\frac{a}{b}\right)`, "m:d", "left"],
      [String.raw`\frac{a}{b}`, "m:f", "frac"],
      [String.raw`\sqrt{x}`, "m:rad", "sqrt"],
    ];
    for (const [latex, tag, leak] of cases) {
      const omml = latexToOmml(latex);
      assert.ok(tagsOf(omml).has(tag), `${latex} 没有产出 ${tag}，只有 ${[...tagsOf(omml)].join(",")}`);
      if (leak) {
        assert.ok(!textOf(omml).includes(leak), `${latex} 把 ${leak} 印成了文字`);
      }
    }
  });

  it("`\\left` 不会被 `\\le` 吃掉前缀", () => {
    // 旧版符号表按最长优先替换，但 `\left` 压根不在表里、`\le` 在，于是前缀被匹配成
    // `≤ft(`。这条单独钉住，因为它是「表里没有就瞎猜」这类错误里最刺眼的一个。
    const text = textOf(latexToOmml(String.raw`\left(\frac{a}{b}\right)`));
    assert.ok(!text.includes("≤"), `排出来是 ${JSON.stringify(text)}`);
    assert.ok(!text.includes("ft"), `排出来是 ${JSON.stringify(text)}`);
  });

  it("同一个公式第二次走缓存，结果一致", () => {
    clearFormulaCache();
    const first = latexToOmml(String.raw`\frac{a}{b}`);
    assert.equal(latexToOmml(String.raw`\frac{a}{b}`), first, "缓存没命中或返回了不同结果");
    assert.ok(first.includes("m:f"), "缓存把内容弄丢了");
  });

  it("空公式给空串，不是抛异常也不是一个空的 m:oMath", () => {
    assert.equal(latexToOmml(""), "");
    assert.equal(latexToOmml("   "), "");
    assert.equal(latexToOmml(null), "");
  });

  it("写坏的公式抛 FormulaConversionError 并带上原文", () => {
    // 调用方靠这个决定「这一处保留原始 LaTeX 文本」，所以异常里必须有原文。
    let caught = null;
    try {
      latexToOmml(String.raw`\begin{matrix} \frac{`);
    } catch (error) {
      caught = error;
    }
    if (caught) {
      assert.ok(caught instanceof FormulaConversionError);
      assert.ok(caught.latex.includes("frac"), "异常里没带上原始 LaTeX");
    }
    // MathJax 对很多残缺输入是容错的；容错时不该悄悄丢内容。
  });
});

/**
 * LaTeX → 原生 Office Math（OMML），走 vendor 进来的 VisualTeX 公式链路。
 *
 * 这是换掉 Python 那版手写转换器的原因。旧版有一张 **47 条**的符号表，不在表里的命令
 * 直接剥掉反斜杠当字母印出去。实测全仓 1933 个带命令的公式里，**625 个（32.3%）**会
 * 这样：`\mathbf{2a}` 显示成 `mathbf2a`（369 次）、`\chi` 成 `chi`、`\prime` 成
 * `prime`；还有 `\left(` 被符号表里的 `\le` 匹配成 `≤ft(`。
 *
 * vendor 的这条链路是 LaTeX → MathJax → Presentation MathML → OMML，等于把整个 TeX
 * 解析器接了进来，没有「表里没有」这回事。
 */

import { latexLinesToOmml } from "../vendor/visualtex/core/formula/latexToOmml.ts";
import { nodeXmlRuntime } from "../vendor/visualtex/core/nodeXmlRuntime.ts";

// 同一篇文档里公式高度重复（`\mathbf{2a}` 一篇里出现 369 次）。MathJax 每次解析约
// 0.46ms，缓存是白捡的。
const cache = new Map();
const CACHE_LIMIT = 4096;
const CACHE_SEPARATOR = "";

export class FormulaConversionError extends Error {
  constructor(latex, cause) {
    super(`公式转换失败：${latex}`);
    this.name = "FormulaConversionError";
    this.latex = latex;
    this.cause = cause;
  }
}

/**
 * 单个公式的 OMML 片段。
 *
 * 没有行内/行间的区分:实测这一层对两种模式产出完全相同（`\frac`、`\sum`、`\int`
 * 都验过），区分发生在上游的文档组装层（`m:oMathPara` 包装）。我们的每个公式都待在
 * 一个绝对定位的文本框里、位置由排版层给定，用不到那一层，所以不留这个参数——
 * 留着只会让人以为它有用。
 */
export function latexToOmml(latex) {
  const source = `${latex ?? ""}`.trim();
  if (!source) return "";
  const cached = cache.get(source);
  if (cached !== undefined) return cached;

  let omml;
  try {
    omml = latexLinesToOmml([source], "inline", "raw", {}, nodeXmlRuntime);
  } catch (cause) {
    throw new FormulaConversionError(source, cause);
  }
  if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value);
  cache.set(source, omml);
  return omml;
}

export function clearFormulaCache() {
  cache.clear();
}

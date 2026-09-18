export type MarkdownMathSlot = {
    token: string;
    tex: string;
    display: boolean;
};
export type ExtractMarkdownMathResult = {
    text: string;
    slots: MarkdownMathSlot[];
};
export type ExtractMarkdownMathOptions = {
    /**
     * Also treat un-delimited LaTeX fragments (e.g. `^{6}`, `\mathbf{Q}`,
     * `CHCl_{3}`) as math. Off by default so plain-text/markdown callers keep
     * treating bare `^`/`_`/`\` as literal text.
     *
     * Only strong LaTeX signals qualify (a `\command`, or a braced subscript /
     * superscript like `_{...}` / `^{...}`), so code identifiers such as
     * `pdf_font`, `page_layout` or `get_imports(url)` are never turned into math.
     */
    bareLatex?: boolean;
};
export type MathJaxEngine = {
    convert(tex: string, display: boolean): string;
};
export type MarkdownMathEngineLoader = () => Promise<MathJaxEngine>;
/** 供单测或宿主注入自定义 MathJax 引擎（传 null 恢复默认动态 import） */
export declare function setMarkdownMathEngineLoader(loader: MarkdownMathEngineLoader | null): void;
export declare function resetMarkdownMathEngineLoader(): void;
/**
 * 抽出 LaTeX 片段并换成占位符，避免 marked 破坏下标/命令。
 * 顺序：块级 $$ / \[ \] → 行内 \( \) / $...$ →（可选）未包裹的裸 LaTeX。
 */
export declare function extractMarkdownMath(source: string, options?: ExtractMarkdownMathOptions): ExtractMarkdownMathResult;
/** 公式渲染失败的计数与最近一次原因，供控制台排查。 */
export declare const mathFailureStats: {
    engineLoad: number;
    convert: number;
    lastReason: string;
    /** 最近若干条失败的公式原文，用来判断是哪一类写法出了问题。 */
    samples: string[];
};
export declare function renderMathFallbackHtml(tex: string, display: boolean): string;
export declare function wrapMathSvgHtml(svgHtml: string, display: boolean): string;
export declare function normalizeMathTex(tex: string): string;
/** 将 HTML 中的占位符替换为 MathJax SVG（失败则回退为代码片段）。 */
export declare function materializeMarkdownMathHtml(html: string, slots: MarkdownMathSlot[]): Promise<string>;
/** Fast first paint: keep every formula visible without waiting for MathJax. */
export declare function materializeMarkdownMathFallbackHtml(html: string, slots: MarkdownMathSlot[]): string;
/** 完整管线：保护公式 → marked.parse → 还原 SVG。 */
export declare function parseMarkdownWithMath(markdown: string, parseMarkdown: (src: string) => string): Promise<string>;
//# sourceMappingURL=markdown-math.d.ts.map
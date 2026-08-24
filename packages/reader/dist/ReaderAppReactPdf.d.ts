type ReaderAiLayout = "floating" | "docked";
/**
 * 单文档阅读时让 AI 成为稳定右栏；对照阅读已经有两栏，AI 改为悬浮，
 * 避免把原文和译文同时压成三条窄栏。
 */
export declare function resolveReaderAiLayout(mode: string): ReaderAiLayout;
export declare function ReaderAppReactPdf(): import("react").JSX.Element;
export {};
//# sourceMappingURL=ReaderAppReactPdf.d.ts.map
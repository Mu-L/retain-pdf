// @retainpdf/reader — Phase4 薄壳：仅导出契约，真实实现仍在 apps/web/src/pages/reader
//
// 下一步再将 hooks/pdf/annotations/components/react-pdf 逐批移入本包 src/，
// 并把 external.ts 的 20+ 符号收敛为 adapters 注入。当前阶段不做物理搬运，
// 仅验证包可独立构建与发布。

export type { ReaderAdapters, ReaderDocumentSource, ReaderMode } from "./adapters.js";
export { DEFAULT_READER_ADAPTERS } from "./adapters.js";

// 占位：真实组件迁移后将在此 re-export
// export { ReaderAppReactPdf } from "./components/ReaderAppReactPdf.js";

export const READER_PACKAGE_VERSION = "0.1.0";

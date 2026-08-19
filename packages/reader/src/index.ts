// @retainpdf/reader — Phase4-deep：hooks/pdf/annotations 已物理迁入，仍通过 external 兼容层代理 apps/web

export type { ReaderAdapters, ReaderDocumentSource, ReaderMode } from "./adapters.js";
export { DEFAULT_READER_ADAPTERS } from "./adapters.js";
export * from "./external.js"; // 兼容 re-export，便于 apps/web 适配层复用

// 核心 hooks/pdf 能力（已迁入）
export * from "./hooks/use-reader-session.js";
export * from "./hooks/use-reader-react-controller.js";
export * from "./hooks/use-reader-tools.js";
export * from "./hooks/use-reader-shell.js";
export * from "./hooks/use-reader-zoom.js";
export * from "./pdf/useProtectedPdfFile.js";
export * from "./pdf/useReadingAnchor.js";

export const READER_PACKAGE_VERSION = "0.1.0-deep1";

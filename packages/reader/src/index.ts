// @retainpdf/reader — Phase4-deep2：hooks/pdf/annotations/components 已迁入

export type { ReaderAdapters, ReaderDocumentSource, ReaderMode } from "./adapters.js";
export { DEFAULT_READER_ADAPTERS } from "./adapters.js";
export * from "./external.js";

export * from "./hooks/use-reader-session.js";
export * from "./hooks/use-reader-react-controller.js";
export * from "./hooks/use-reader-tools.js";
export * from "./hooks/use-reader-shell.js";
export * from "./hooks/use-reader-zoom.js";
export * from "./pdf/useProtectedPdfFile.js";
export * from "./pdf/useReadingAnchor.js";
export * from "./components/react-pdf/index.js";

export const READER_PACKAGE_VERSION = "0.1.0-deep2";

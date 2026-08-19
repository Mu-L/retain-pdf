// RetainPDF 宿主对 @retainpdf/reader 的适配实现
// 将 apps/web 的 external 符号映射为 ReaderAdapters，供 packages/reader 注入

import * as external from "../external.js";
import type { ReaderAdapters } from "../../../../packages/reader/src/adapters.js";

export const retainPdfReaderAdapters: ReaderAdapters = {
  resolveSession: () => ({
    jobId: external.resolveReaderJobId?.() || "",
    documentId: external.resolveReaderDocumentId?.() || "",
    sourceOnly: false,
    mode: "compare" as const,
  }),
  // 其他能力按需透出，当前薄壳阶段保留 external 直连，逐步迁移
};

export { external as retainPdfExternal };

// RetainPDF 宿主对 @retainpdf/reader 的适配实现 — 将 apps/web 的 external 真值注入 packages/reader 的 adapters
import * as ext from "../external.js";
import { setReaderAdapters } from "../../../../../../packages/reader/src/adapters.js";
import type { ReaderAdapters } from "../../../../../../packages/reader/src/adapters.js";

const adapters: ReaderAdapters = {
  isMockMode: ext.isMockMode as any,
  resolveResourceUrl: ext.resolveResourceUrl as any,
  fetchProtected: ext.fetchProtected as any,
  resolvePdfjsVendorUrl: ext.resolvePdfjsVendorUrl as any,
  resolveMarkedVendorUrl: ext.resolveMarkedVendorUrl as any,
  defaultReaderDataPort: ext.defaultReaderDataPort as any,
  defaultReaderPageConfigPort: ext.defaultReaderPageConfigPort as any,
  resolveReaderAnchor: ext.resolveReaderAnchor as any,
  resolveReaderDocumentId: ext.resolveReaderDocumentId as any,
  resolveReaderJobId: ext.resolveReaderJobId as any,
  resolveReaderArtifactUrl: ext.resolveReaderArtifactUrl as any,
  resolveReaderSourcePdf: ext.resolveReaderSourcePdf as any,
  resolveReaderTranslatedPdfUrl: ext.resolveReaderTranslatedPdfUrl as any,
};
setReaderAdapters(adapters);
export { adapters as retainPdfReaderAdapters };
export { ext as retainPdfExternal };

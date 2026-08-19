// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { resolveResourceUrl } from "../../js/job/artifacts.js";
import { resolvePdfjsVendorUrl } from "../../js/runtime/vendor-url.js";
import { defaultReaderPdfDocumentConfigPort } from "../config/pdf-document-config.js";
import * as shared from "../../../../../packages/reader/src/shared/data/pdf-document.js";

export const resolveReaderArtifactUrl = (item: any, opts: any = {}) =>
  shared.resolveReaderArtifactUrl(item, { resolveResourceUrl, ...opts });

export const buildPdfDocumentOptions = (opts: any = {}) =>
  shared.buildPdfDocumentOptions({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolvePdfjsVendorUrl,
    ...opts,
  });

export const loadPdfDocument = (opts: any = {}) =>
  shared.loadPdfDocument({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolveResourceUrl,
    resolvePdfjsVendorUrl,
    ...opts,
  });

export const __resetPdfjsForTests = shared.__resetPdfjsForTests;

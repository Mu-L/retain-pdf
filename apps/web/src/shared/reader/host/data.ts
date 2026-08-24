/** RetainPDF API and artifact bindings for the package-owned Reader data runtime. */
import { fetchJobPayload as fetchApiJobPayload } from "@retainpdf/api/jobs";
import {
  findReadyManifestArtifact,
  resolveJobActions,
  resolveManifestArtifactUrl,
  resolveResourceUrl,
} from "@retainpdf/domain/job";
import * as readerData from "@retainpdf/reader/runtime/data";
import { fetchProtected } from "../../../js/api/http.js";
import {
  fetchJobArtifactsManifest,
  fetchJobMarkdown,
  fetchJobMarkdownDocument,
} from "../../../js/api/jobs-artifacts.js";
import {
  fetchReaderAiChat,
  fetchReaderMetadata,
  fetchReaderRegions,
} from "../../../js/api/reader.js";
import { fetchTranslationItem } from "../../../js/api/translation-debug.js";
import { API_PREFIX } from "../../../js/config/api-constants.js";
import { isMockMode } from "../../../js/config/runtime.js";
import { getMockJobPayload } from "../../../js/mock/index.js";
import { resolvePdfjsVendorUrl } from "../../../js/runtime/vendor-url.js";
import { defaultReaderPdfDocumentConfigPort } from "./config.js";

async function fetchJobPayload(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void apiPrefix;
    return getMockJobPayload(jobId);
  }
  return (fetchApiJobPayload as any)(jobId, apiPrefix);
}

export const createReaderDataPort = (options: any = {}) =>
  readerData.createReaderDataPort({
    apiPrefix: API_PREFIX,
    loadJob: fetchJobPayload,
    loadManifest: fetchJobArtifactsManifest,
    loadMarkdown: fetchJobMarkdown,
    loadMarkdownDocument: fetchJobMarkdownDocument,
    loadAiChat: fetchReaderAiChat,
    loadRegions: fetchReaderRegions,
    loadMetadata: fetchReaderMetadata,
    loadTranslationItem: fetchTranslationItem,
    fetchProtectedResource: fetchProtected,
    ...options,
  });
export const defaultReaderDataPort = createReaderDataPort();

export const resolveReaderArtifactUrl = (item: any, options: any = {}) =>
  readerData.resolveReaderArtifactUrl(item, { resolveResourceUrl, ...options });
export const buildPdfDocumentOptions = (options: any = {}) =>
  readerData.buildPdfDocumentOptions({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolvePdfjsVendorUrl,
    ...options,
  });
export const loadPdfDocument = (options: any = {}) =>
  readerData.loadPdfDocument({
    configPort: defaultReaderPdfDocumentConfigPort,
    resolveResourceUrl,
    resolvePdfjsVendorUrl,
    ...options,
  });
export const __resetPdfjsForTests = readerData.__resetPdfjsForTests;

export const resolveReaderJobId = readerData.resolveReaderJobId;
export const resolveReaderSourcePdf = (manifestPayload: any, options: any = {}) =>
  readerData.resolveReaderSourcePdf(manifestPayload, {
    findReadyManifestArtifact,
    resolveManifestArtifactUrl: (payload: any, key: string) =>
      resolveManifestArtifactUrl(payload, key),
    ...options,
  });
export const resolveReaderTranslatedPdfUrl = (
  jobPayload: any,
  manifestPayload: any,
  options: any = {},
) => readerData.resolveReaderTranslatedPdfUrl(jobPayload, manifestPayload, {
  resolveJobActions,
  findReadyManifestArtifact,
  resolveReaderArtifactUrl,
  resolveResourceUrl,
  ...options,
});

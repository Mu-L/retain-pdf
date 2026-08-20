// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { API_PREFIX } from "../../../js/config/api-constants.js";
// Pilot: migrated from src/js/api/jobs-query.ts to @retainpdf/api
import { isMockMode } from "../../../js/config/runtime.js";
import { getMockJobPayload } from "../../../js/mock/index.js";
import { fetchJobPayload as _fetchJobPayload } from "@retainpdf/api/jobs";
async function fetchJobPayload(jobId: string, apiPrefix?: string): Promise<any> {
  if (isMockMode()) {
    void apiPrefix;
    return getMockJobPayload(jobId);
  }
  return (_fetchJobPayload as any)(jobId, apiPrefix);
}
import {
  fetchJobArtifactsManifest,
  fetchJobMarkdown,
  fetchJobMarkdownDocument,
} from "../../../js/api/jobs-artifacts.js";
import { fetchProtected } from "../../../js/api/http.js";
import {
  fetchReaderAiChat,
  fetchReaderMetadata,
  fetchReaderRegions,
} from "../../../js/api/reader.js";
import { fetchTranslationItem } from "../../../js/api/translation-debug.js";
import * as shared from "../../../../../../packages/reader/src/shared/data/data-port.js";

export const createReaderDataPort = (opts: any = {}) =>
  shared.createReaderDataPort({
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
    ...opts,
  });

export const defaultReaderDataPort = createReaderDataPort();

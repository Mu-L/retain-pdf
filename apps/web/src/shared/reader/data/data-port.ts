// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { API_PREFIX } from "../../../js/config/api-constants.js";
import { fetchJobPayload } from "../../../js/api/jobs-query.js";
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

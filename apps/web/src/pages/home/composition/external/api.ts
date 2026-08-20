// composition/external/api — api barrel (http, jobs-*, library, ai, glossaries)
// Source of truth for jobs/library-books is now @retainpdf/api; this barrel keeps
// the public import surface (pages/home/* stays `from "./external/api.js"`), but
// delegates to @retainpdf/api with mock + header adapters so behaviors (mock, X-API-Key) stay identical.

export {
  buildApiEndpoint,
  buildJobDetailEndpoint,
  fetchProtected,
  submitJson,
  submitUploadRequest as submitUploadRequestHttp,
} from "../../../../js/api/http.js";

// jobs + library-books — migrated to @retainpdf/api (pilot: source of truth)
import { isMockMode } from "../../../../js/config/runtime.js";
import { getMockJobList, getMockJobPayload } from "../../../../js/mock/index.js";
import { countMockFavoritesByJob } from "../../../../js/mock/documents.js";
import {
  fetchJobList as _fetchJobList,
  fetchJobPayload as _fetchJobPayload,
} from "@retainpdf/api/jobs";
import {
  fetchLibraryBookList as _fetchLibraryBookList,
  deleteLibraryBook as _deleteLibraryBook,
} from "@retainpdf/api/library-books";
import { stripOcrSuffix } from "@retainpdf/api/utils/strip-ocr";

// Canonical: (jobId, { apiPrefix }). Legacy string / swapped forms kept with deprecation warning.
export const fetchJobPayload = async (
  jobId: string,
  options?: { apiPrefix?: string } | string,
): Promise<any> => {
  let normalizedJobId = jobId;
  let apiPrefix: string | undefined;
  if (
    typeof jobId === "string" &&
    jobId.startsWith("/") &&
    typeof options === "string" &&
    options != null &&
    !options.startsWith("/")
  ) {
    console.warn("[deprecated] fetchJobPayload(apiPrefix, jobId) is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = jobId;
    normalizedJobId = options;
  } else if (typeof options === "string") {
    console.warn("[deprecated] fetchJobPayload(jobId, apiPrefix) string form is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = options;
  } else if (options && typeof options === "object") {
    apiPrefix = (options as { apiPrefix?: string }).apiPrefix;
  }
  if (isMockMode()) {
    void apiPrefix;
    return getMockJobPayload(normalizedJobId);
  }
  return (_fetchJobPayload as any)(normalizedJobId, apiPrefix ? { apiPrefix } : undefined);
};

export const fetchJobList = async (apiPrefix: string, opts: any = {}): Promise<any> => {
  if (isMockMode()) {
    void apiPrefix;
    void opts;
    return getMockJobList();
  }
  return (_fetchJobList as any)(apiPrefix, opts);
};

export const fetchLibraryBookList = async (apiPrefix: string, opts: any = {}): Promise<any> => {
  if (isMockMode()) {
    const jobIds = Array.isArray(opts?.jobIds) ? opts.jobIds : [];
    return getMockJobList({ jobIds });
  }
  return (_fetchLibraryBookList as any)(apiPrefix, opts);
};

export const deleteLibraryBook = async (apiPrefix: string, jobId: string, opts: any = {}): Promise<any> => {
  const normalizedJobId = stripOcrSuffix(`${jobId || ""}`);
  if (!normalizedJobId) throw new Error("删除失败: 缺少 job_id");
  if (isMockMode()) {
    const referenced = countMockFavoritesByJob(normalizedJobId);
    if (referenced > 0 && !opts?.force) {
      const conflict = new Error(`该 job 被 ${referenced} 条收藏引用(409)`) as Error & { status?: number };
      (conflict as any).status = 409;
      throw conflict;
    }
    return { job_id: normalizedJobId };
  }
  return (_deleteLibraryBook as any)(apiPrefix, jobId, opts);
};

export { fetchJobEvents } from "../../../../js/api/jobs-events.js";
export { fetchJobArtifactsManifest } from "../../../../js/api/jobs-artifacts.js";
export {
  fetchJobDiagnostics,
  fetchJobStageActions,
  fetchResumePlan,
  rerunJob,
  retryJobStage,
} from "../../../../js/api/jobs-actions.js";
export { submitJobRequest } from "../../../../js/api/jobs-submit.js";
export {
  fetchDocumentList,
  fetchDocument,
  translateDocument,
  deleteDocument,
  patchDocument,
} from "../../../../js/api/documents.js";
export {
  listCollections,
  createCollection,
  patchCollection,
  deleteCollection,
  addDocumentsToCollection,
  removeDocumentFromCollection,
} from "../../../../js/api/collections.js";
export {
  fetchFavorites,
  createFavorite,
  deleteFavorite,
} from "../../../../js/api/favorites.js";
export {
  validateDeepSeekToken,
  queryDeepSeekBalance,
  validatePaddleToken,
} from "../../../../js/api/providers.js";
export {
  fetchGlossaries as fetchGlossariesApi,
  fetchGlossary as fetchGlossaryApi,
  createGlossary as createGlossaryApi,
  updateGlossary as updateGlossaryApi,
  deleteGlossary as deleteGlossaryApi,
  exportGlossaryCsv as exportGlossaryCsvApi,
  parseGlossaryCsv as parseGlossaryCsvApi,
} from "../../../../js/api/glossaries.js";
export {
  fetchTranslationDiagnostics,
  fetchTranslationItems,
  fetchTranslationItem,
  replayTranslationItem,
} from "../../../../js/api/translation-debug.js";
export { askLibraryAi, AiAskError } from "../../../../js/api/ai.js";
export {
  deleteConversation,
  getConversation,
  listConversations,
  patchConversation,
  type ConversationRecord,
} from "../../../../js/api/conversations.js";
export type { DocumentRecord } from "../../../../js/api/documents.js";

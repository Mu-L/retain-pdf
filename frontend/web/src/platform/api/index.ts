// composition/external/api — canonical barrel, re-exports from @retainpdf/api
// Source of truth for ALL API clients is now @retainpdf/api; this barrel keeps
// the public import surface (pages/home/* stays `from "@/platform/api/index.js"`), but
// delegates to @retainpdf/api. Mock adapters live in ./mocks so mock mode stays identical;

// http primitives — canonical (no mock branching)
export {
  buildApiEndpoint,
  buildJobDetailEndpoint,
} from "@retainpdf/api/http";
export {
  fetchAgentRuntimeConfig,
  updateAgentRuntimeConfig,
} from "@retainpdf/api/agent-runtime-settings";
export type {
  AgentRuntimeConfigUpdate,
  AgentRuntimeConfigView,
  AgentRuntimeMode,
} from "@retainpdf/api/agent-runtime-settings";
export {
  createCredential,
  deleteCredential,
  listCredentials,
  updateCredential,
} from "@retainpdf/api/credentials";
export type {
  CredentialListView,
  CredentialMetadata,
  CredentialMutationView,
} from "@retainpdf/api/credentials";
import { isMockMode } from "@/platform/config/runtime.js";
import { fetchMockProtected } from "@/platform/mock/index.js";
import { fetchProtected as _canonFetchProtected, submitJson as _canonSubmitJson, submitUploadRequest as _canonSubmitUploadRequest } from "@retainpdf/api/http";
import { submitJson as _mockSubmitJson, submitUploadRequest as _mockSubmitUploadRequest } from "./mocks/http.js";

/**
 * mock 模式走 mockImpl，否则直接调 canonical 实现。
 *
 * 取代逐个函数手写两路分发。那种写法要求包装签名退化成 `(...args: any[])`，
 * 于是每个调用点都得 `as any` 才能把 any[] 展开进有类型的 canonical 签名——
 * 本文件曾因此累积 116 处 as any（占当时全前端 332 处的三分之一）。
 * 这里把强转收敛到一处，对外可见的参数类型仍取自 canonical 签名，
 * 返回类型沿用既有的 Promise<any>，不改变任何调用方的类型契约。
 */
type AnyApiFn = (...args: any[]) => any;
function mockable<F extends AnyApiFn>(
  canonical: F,
  mockImpl: AnyApiFn,
): (...args: Parameters<F>) => Promise<any> {
  return async (...args: Parameters<F>) => (
    isMockMode() ? mockImpl(...args) : canonical(...args)
  );
}

// Wrap mock-aware http helpers so mock:// and mock job submissions still work in tests
export const fetchProtected = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (isMockMode() && `${url || ""}`.startsWith("mock://")) return fetchMockProtected(url);
  return _canonFetchProtected(url, options);
};
export const submitJson = async (url: string, payload: unknown): Promise<any> => {
  if (isMockMode()) return _mockSubmitJson(url, payload);
  return _canonSubmitJson(url, payload);
};
export const submitUploadRequest = (url: string, form: FormData, onProgress?: (a:number,b:number)=>void): Promise<any> => {
  if (isMockMode()) return _mockSubmitUploadRequest(url, form, onProgress);
  return _canonSubmitUploadRequest(url, form, onProgress);
};
export const submitUploadRequestHttp = submitUploadRequest;

// jobs + library-books — with mock adapters
import { getMockJobList, getMockJobPayload } from "@/platform/mock/index.js";
import { countMockFavoritesByJob } from "@/platform/mock/documents.js";
import { fetchJobList as _fetchJobList, fetchJobPayload as _fetchJobPayload } from "@retainpdf/api/jobs";
import { fetchLibraryBookList as _fetchLibraryBookList, deleteLibraryBook as _deleteLibraryBook } from "@retainpdf/api/library-books";
import { stripOcrSuffix } from "@retainpdf/api/utils/strip-ocr";

export const fetchJobPayload = async (jobId: string, options?: { apiPrefix?: string } | string): Promise<any> => {
  let normalizedJobId = jobId;
  let apiPrefix: string | undefined;
  if (typeof jobId === "string" && jobId.startsWith("/") && typeof options === "string" && options != null && !options.startsWith("/")) {
    console.warn("[deprecated] fetchJobPayload(apiPrefix, jobId) is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = jobId;
    normalizedJobId = options;
  } else if (typeof options === "string") {
    console.warn("[deprecated] fetchJobPayload(jobId, apiPrefix) string form is deprecated, use fetchJobPayload(jobId, { apiPrefix })");
    apiPrefix = options;
  } else if (options && typeof options === "object") {
    apiPrefix = (options as { apiPrefix?: string }).apiPrefix;
  }
  if (isMockMode()) { void apiPrefix; return getMockJobPayload(normalizedJobId); }
  return (_fetchJobPayload as any)(normalizedJobId, apiPrefix ? { apiPrefix } : undefined);
};

export const fetchJobList = async (apiPrefix: string, opts: any = {}): Promise<any> => {
  if (isMockMode()) {
    const { limit = 20, offset = 0, q = "" } = opts || {};
    return getMockJobList({ limit, offset, q });
  }
  return (_fetchJobList as any)(apiPrefix, opts);
};

export const fetchLibraryBookList = async (apiPrefix: string, opts: any = {}): Promise<any> => {
  if (isMockMode()) { const jobIds = Array.isArray(opts?.jobIds) ? opts.jobIds : []; return getMockJobList({ jobIds }); }
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

// --- Remaining API groups: mock-aware wrappers delegating to @retainpdf/api for real network ---
// Import mock adapters (./mocks) and canonical (pure) side-by-side; wrapper picks based on isMockMode.
import * as MockJobsEvents from "./mocks/jobs-events.js";
import { fetchJobEvents as _canonFetchJobEvents } from "@retainpdf/api/jobs-events";
export const fetchJobEvents = mockable(_canonFetchJobEvents, MockJobsEvents.fetchJobEvents);

import * as MockJobsArtifacts from "./mocks/jobs-artifacts.js";
import { fetchJobArtifacts as _canonFetchJobArtifacts, fetchJobArtifactsManifest as _canonFetchJobArtifactsManifest, fetchJobMarkdown as _canonFetchJobMarkdown } from "@retainpdf/api/jobs-artifacts";
export type { JobArtifactLinks } from "@retainpdf/api/jobs-artifacts";
// Mock manifests already carry the complete artifact set; avoid a second
// network-shaped projection that the mock backend does not expose.
export const fetchJobArtifacts = mockable(_canonFetchJobArtifacts, () => null);
export const fetchJobArtifactsManifest = mockable(_canonFetchJobArtifactsManifest, MockJobsArtifacts.fetchJobArtifactsManifest);
export const fetchJobMarkdown = mockable(_canonFetchJobMarkdown, MockJobsArtifacts.fetchJobMarkdown);

import * as MockJobsActions from "./mocks/jobs-actions.js";
import { cancelJob as _canonCancelJob, cancelOcrJob as _canonCancelOcrJob, fetchJobDiagnostics as _canonFetchJobDiagnostics, fetchJobStageActions as _canonFetchJobStageActions, fetchResumePlan as _canonFetchResumePlan, resolveOcrAmbiguity as _canonResolveOcrAmbiguity, resumeJob as _canonResumeJob, rerunJob as _canonRerunJob, retryJobStage as _canonRetryJobStage } from "@retainpdf/api/jobs-actions";
export type {
  JobRetryStage,
  JobStageActionsView,
  JobStageRetryActionView,
  JobDiagnosticsView,
  OcrAmbiguityReceiptField,
  OcrAmbiguityResolutionKind,
  OcrAmbiguityResolutionRequest,
  OcrAmbiguityResolutionView,
  OcrAmbiguityView,
} from "@retainpdf/api/jobs-actions";
export const fetchJobDiagnostics = mockable(_canonFetchJobDiagnostics, MockJobsActions.fetchJobDiagnostics);
export const fetchJobStageActions = mockable(_canonFetchJobStageActions, MockJobsActions.fetchJobStageActions);
export const fetchResumePlan = mockable(_canonFetchResumePlan, MockJobsActions.fetchResumePlan);
export const resumeJob = mockable(_canonResumeJob, MockJobsActions.resumeJob);
export const cancelJob = mockable(_canonCancelJob, MockJobsActions.cancelJob);
export const cancelOcrJob = mockable(_canonCancelOcrJob, MockJobsActions.cancelOcrJob);
export const resolveOcrAmbiguity = mockable(_canonResolveOcrAmbiguity, MockJobsActions.resolveOcrAmbiguity);
export const rerunJob = mockable(_canonRerunJob, MockJobsActions.rerunJob);
export const retryJobStage = mockable(_canonRetryJobStage, MockJobsActions.retryJobStage);

import * as MockJobsSubmit from "./mocks/jobs-submit.js";
import { submitJobRequest as _canonSubmitJobRequest } from "@retainpdf/api/jobs-submit";
export const submitJobRequest = mockable(_canonSubmitJobRequest, MockJobsSubmit.submitJobRequest);

import * as MockDocuments from "./mocks/documents.js";
import { fetchDocumentList as _canonFetchDocumentList, fetchDocument as _canonFetchDocument, fetchDocumentByJobId as _canonFetchDocumentByJobId, fetchDocumentJobs as _canonFetchDocumentJobs, ocrDocument as _canonOcrDocument, translateDocument as _canonTranslateDocument, deleteDocument as _canonDeleteDocument, clearFavorites as _canonClearFavorites, patchDocument as _canonPatchDocument, createDocumentMetadataSuggestion as _canonCreateDocumentMetadataSuggestion, fetchDocumentMetadataSuggestions as _canonFetchDocumentMetadataSuggestions } from "@retainpdf/api/documents";
export const fetchDocumentList = mockable(_canonFetchDocumentList, MockDocuments.fetchDocumentList);
export const fetchDocumentByJobId = mockable(_canonFetchDocumentByJobId, MockDocuments.fetchDocumentByJobId);
export const fetchDocument = mockable(_canonFetchDocument, MockDocuments.fetchDocument);
export const translateDocument = mockable(_canonTranslateDocument, MockDocuments.translateDocument);
export const ocrDocument = mockable(_canonOcrDocument, MockDocuments.ocrDocument);
export const fetchDocumentJobs = mockable(_canonFetchDocumentJobs, MockDocuments.fetchDocumentJobs);
export const deleteDocument = mockable(_canonDeleteDocument, MockDocuments.deleteDocument);
export const clearFavorites = mockable(_canonClearFavorites, MockDocuments.clearFavorites);
export const patchDocument = mockable(_canonPatchDocument, MockDocuments.patchDocument);
export const createDocumentMetadataSuggestion = mockable(_canonCreateDocumentMetadataSuggestion, () => null);
export const fetchDocumentMetadataSuggestions = mockable(_canonFetchDocumentMetadataSuggestions, () => []);

import * as MockCollections from "./mocks/collections.js";
import { listCollections as _canonListCollections, createCollection as _canonCreateCollection, patchCollection as _canonPatchCollection, deleteCollection as _canonDeleteCollection, addDocumentsToCollection as _canonAddDocumentsToCollection, removeDocumentFromCollection as _canonRemoveDocumentFromCollection } from "@retainpdf/api/collections";
export const listCollections = mockable(_canonListCollections, MockCollections.listCollections);
export const createCollection = mockable(_canonCreateCollection, MockCollections.createCollection);
export const patchCollection = mockable(_canonPatchCollection, MockCollections.patchCollection);
export const deleteCollection = mockable(_canonDeleteCollection, MockCollections.deleteCollection);
export const addDocumentsToCollection = mockable(_canonAddDocumentsToCollection, MockCollections.addDocumentsToCollection);
export const removeDocumentFromCollection = mockable(_canonRemoveDocumentFromCollection, MockCollections.removeDocumentFromCollection);

import * as MockFavorites from "./mocks/favorites.js";
import { fetchFavorites as _canonFetchFavorites, createFavorite as _canonCreateFavorite, deleteFavorite as _canonDeleteFavorite } from "@retainpdf/api/favorites";
export const fetchFavorites = mockable(_canonFetchFavorites, MockFavorites.fetchFavorites);
export const createFavorite = mockable(_canonCreateFavorite, MockFavorites.createFavorite);
export const deleteFavorite = mockable(_canonDeleteFavorite, MockFavorites.deleteFavorite);

import * as MockProviders from "./mocks/providers.js";
import { validateDeepSeekToken as _canonValidateDeepSeekToken, queryDeepSeekBalance as _canonQueryDeepSeekBalance, validatePaddleToken as _canonValidatePaddleToken } from "@retainpdf/api/providers";
export const validateDeepSeekToken = mockable(_canonValidateDeepSeekToken, MockProviders.validateDeepSeekToken);
export const queryDeepSeekBalance = mockable(_canonQueryDeepSeekBalance, MockProviders.queryDeepSeekBalance);
export const validatePaddleToken = mockable(_canonValidatePaddleToken, MockProviders.validatePaddleToken);

import * as MockGlossaries from "./mocks/glossaries.js";
import { fetchGlossaries as _canonFetchGlossaries, fetchGlossary as _canonFetchGlossary, createGlossary as _canonCreateGlossary, updateGlossary as _canonUpdateGlossary, deleteGlossary as _canonDeleteGlossary, exportGlossaryCsv as _canonExportGlossaryCsv, parseGlossaryCsv as _canonParseGlossaryCsv } from "@retainpdf/api/glossaries";
export const fetchGlossariesApi = mockable(_canonFetchGlossaries, MockGlossaries.fetchGlossaries);
export const fetchGlossaryApi = mockable(_canonFetchGlossary, MockGlossaries.fetchGlossary);
export const createGlossaryApi = mockable(_canonCreateGlossary, MockGlossaries.createGlossary);
export const updateGlossaryApi = mockable(_canonUpdateGlossary, MockGlossaries.updateGlossary);
export const deleteGlossaryApi = mockable(_canonDeleteGlossary, MockGlossaries.deleteGlossary);
export const exportGlossaryCsvApi = mockable(_canonExportGlossaryCsv, MockGlossaries.exportGlossaryCsv);
export const parseGlossaryCsvApi = mockable(_canonParseGlossaryCsv, MockGlossaries.parseGlossaryCsv);

import * as MockTranslationDebug from "./mocks/translation-debug.js";
import { fetchTranslationDiagnostics as _canonFetchTranslationDiagnostics, fetchTranslationItems as _canonFetchTranslationItems, fetchTranslationItem as _canonFetchTranslationItem, replayTranslationItem as _canonReplayTranslationItem } from "@retainpdf/api/translation-debug";
export const fetchTranslationDiagnostics = mockable(_canonFetchTranslationDiagnostics, MockTranslationDebug.fetchTranslationDiagnostics);
export const fetchTranslationItems = mockable(_canonFetchTranslationItems, MockTranslationDebug.fetchTranslationItems);
export const fetchTranslationItem = mockable(_canonFetchTranslationItem, MockTranslationDebug.fetchTranslationItem);
export const replayTranslationItem = mockable(_canonReplayTranslationItem, MockTranslationDebug.replayTranslationItem);

import * as MockAi from "./mocks/ai.js";
import { askLibraryAi as _canonAskLibraryAi, readAiAskStream as _canonReadAiAskStream, AiAskError as _CanonAiAskError } from "@retainpdf/api/ai";
export const askLibraryAi = mockable(_canonAskLibraryAi, MockAi.askLibraryAi);
export const readAiAskStream = _canonReadAiAskStream;
export const AiAskError = _CanonAiAskError;

import {
  buildAgentOperationCandidateUrl as _canonBuildAgentOperationCandidateUrl,
  cancelAgentOperation as _canonCancelAgentOperation,
  commitAgentOperation as _canonCommitAgentOperation,
  fetchAgentOperationCandidate as _canonFetchAgentOperationCandidate,
  getAgentOperation as _canonGetAgentOperation,
  listAgentOperations as _canonListAgentOperations,
  retryAgentOperation as _canonRetryAgentOperation,
  runAgentOperation as _canonRunAgentOperation,
} from "@retainpdf/api/document-operations";

export const listAgentOperations = mockable(_canonListAgentOperations, () => ({ operations: [] }));
export const getAgentOperation = async (...args: Parameters<typeof _canonGetAgentOperation>): Promise<any> => (
  _canonGetAgentOperation(...args)
);
export const runAgentOperation = async (...args: Parameters<typeof _canonRunAgentOperation>): Promise<any> => (
  _canonRunAgentOperation(...args)
);
export const cancelAgentOperation = async (...args: Parameters<typeof _canonCancelAgentOperation>): Promise<any> => (
  _canonCancelAgentOperation(...args)
);
export const commitAgentOperation = async (...args: Parameters<typeof _canonCommitAgentOperation>): Promise<any> => (
  _canonCommitAgentOperation(...args)
);
export const retryAgentOperation = async (...args: Parameters<typeof _canonRetryAgentOperation>): Promise<any> => (
  _canonRetryAgentOperation(...args)
);
export const fetchAgentOperationCandidate = async (
  ...args: Parameters<typeof _canonFetchAgentOperationCandidate>
): Promise<Blob> => _canonFetchAgentOperationCandidate(...args);
export const buildAgentOperationCandidateUrl = _canonBuildAgentOperationCandidateUrl;

import * as MockConversations from "./mocks/conversations.js";
import { deleteConversation as _canonDeleteConversation, getConversation as _canonGetConversation, listConversations as _canonListConversations, patchConversation as _canonPatchConversation, createConversation as _canonCreateConversation, appendConversationMessage as _canonAppendConversationMessage, forkConversationFromPath as _canonForkConversationFromPath } from "@retainpdf/api/conversations";
export const deleteConversation = mockable(_canonDeleteConversation, MockConversations.deleteConversation);
export const getConversation = mockable(_canonGetConversation, MockConversations.getConversation);
export const listConversations = mockable(_canonListConversations, MockConversations.listConversations);
export const patchConversation = mockable(_canonPatchConversation, MockConversations.patchConversation);
export const createConversation = mockable(_canonCreateConversation, MockConversations.createConversation);
export const appendConversationMessage = mockable(_canonAppendConversationMessage, MockConversations.appendConversationMessage);
export const forkConversationFromPath = mockable(_canonForkConversationFromPath, MockConversations.forkConversationFromPath);
export { baseConversationTitle, nextForkConversationTitle, messagesToBranchItems } from "@retainpdf/api/conversations";
export type { ConversationRecord, MessageRecord, ConversationDetail } from "@retainpdf/api/conversations";
export type { DocumentRecord } from "@retainpdf/api/documents";

import * as MockSearch from "./mocks/search.js";
import { searchLibrary as _canonSearchLibrary } from "@retainpdf/api/search";
export const searchLibrary = mockable(_canonSearchLibrary, MockSearch.searchLibrary);

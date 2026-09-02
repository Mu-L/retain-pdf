// composition/external/api — canonical barrel, re-exports from @retainpdf/api
// Source of truth for ALL API clients is now @retainpdf/api; this barrel keeps
// the public import surface (pages/home/* stays `from "./external/api.js"`), but
// delegates to @retainpdf/api. Mock adapters remain here so mock mode stays identical;

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
import { isMockMode } from "../../../../js/config/runtime.js";
import { fetchMockProtected } from "../../../../js/mock/index.js";
import { fetchProtected as _canonFetchProtected, submitJson as _canonSubmitJson, submitUploadRequest as _canonSubmitUploadRequest } from "@retainpdf/api/http";
import { fetchProtected as _legacyFetchProtected, submitJson as _legacySubmitJson, submitUploadRequest as _legacySubmitUploadRequest } from "../../../../js/api/http.js";

// Wrap mock-aware http helpers so mock:// and mock job submissions still work in tests
export const fetchProtected = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (isMockMode() && `${url || ""}`.startsWith("mock://")) return fetchMockProtected(url);
  // legacy and canonical are identical for non-mock; prefer canonical
  void _legacyFetchProtected;
  return _canonFetchProtected(url, options);
};
export const submitJson = async (url: string, payload: unknown): Promise<any> => {
  if (isMockMode()) return _legacySubmitJson(url, payload);
  return _canonSubmitJson(url, payload);
};
export const submitUploadRequest = (url: string, form: FormData, onProgress?: (a:number,b:number)=>void): Promise<any> => {
  if (isMockMode()) return _legacySubmitUploadRequest(url, form, onProgress);
  return _canonSubmitUploadRequest(url, form, onProgress);
};
export const submitUploadRequestHttp = submitUploadRequest;

// jobs + library-books — with mock adapters
import { getMockJobList, getMockJobPayload } from "../../../../js/mock/index.js";
import { countMockFavoritesByJob } from "../../../../js/mock/documents.js";
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
  if (isMockMode()) { void apiPrefix; void opts; return getMockJobList(); }
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
// Import legacy (mock-aware) and canonical (pure) side-by-side; wrapper picks based on isMockMode.
import * as LegacyJobsEvents from "../../../../js/api/jobs-events.js";
import { fetchJobEvents as _canonFetchJobEvents } from "@retainpdf/api/jobs-events";
export const fetchJobEvents = async (...args: Parameters<typeof _canonFetchJobEvents>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsEvents as any).fetchJobEvents(...args);
  return (_canonFetchJobEvents as any)(...args);
};

import * as LegacyJobsArtifacts from "../../../../js/api/jobs-artifacts.js";
import { fetchJobArtifacts as _canonFetchJobArtifacts, fetchJobArtifactsManifest as _canonFetchJobArtifactsManifest, fetchJobMarkdown as _canonFetchJobMarkdown, fetchJobMarkdownDocument as _canonFetchJobMarkdownDocument } from "@retainpdf/api/jobs-artifacts";
export type { JobArtifactLinks } from "@retainpdf/api/jobs-artifacts";
export const fetchJobArtifacts = async (...args: Parameters<typeof _canonFetchJobArtifacts>): Promise<any> => {
  // Mock manifests already carry the complete artifact set; avoid a second
  // network-shaped projection that the mock backend does not expose.
  if (isMockMode()) return null;
  return (_canonFetchJobArtifacts as any)(...args);
};
export const fetchJobArtifactsManifest = async (...args: Parameters<typeof _canonFetchJobArtifactsManifest>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsArtifacts as any).fetchJobArtifactsManifest(...args);
  return (_canonFetchJobArtifactsManifest as any)(...args);
};
export const fetchJobMarkdown = async (...args: Parameters<typeof _canonFetchJobMarkdown>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsArtifacts as any).fetchJobMarkdown(...args);
  return (_canonFetchJobMarkdown as any)(...args);
};
export const fetchJobMarkdownDocument = async (...args: Parameters<typeof _canonFetchJobMarkdownDocument>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsArtifacts as any).fetchJobMarkdownDocument(...args);
  return (_canonFetchJobMarkdownDocument as any)(...args);
};

import * as LegacyJobsActions from "../../../../js/api/jobs-actions.js";
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
export const fetchJobDiagnostics = async (...args: Parameters<typeof _canonFetchJobDiagnostics>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).fetchJobDiagnostics(...args);
  return (_canonFetchJobDiagnostics as any)(...args);
};
export const fetchJobStageActions = async (...args: Parameters<typeof _canonFetchJobStageActions>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).fetchJobStageActions(...args);
  return (_canonFetchJobStageActions as any)(...args);
};
export const fetchResumePlan = async (...args: Parameters<typeof _canonFetchResumePlan>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).fetchResumePlan(...args);
  return (_canonFetchResumePlan as any)(...args);
};
export const resumeJob = async (...args: Parameters<typeof _canonResumeJob>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).resumeJob(...args);
  return (_canonResumeJob as any)(...args);
};
export const cancelJob = async (...args: Parameters<typeof _canonCancelJob>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).cancelJob(...args);
  return (_canonCancelJob as any)(...args);
};
export const cancelOcrJob = async (...args: Parameters<typeof _canonCancelOcrJob>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).cancelOcrJob(...args);
  return (_canonCancelOcrJob as any)(...args);
};
export const resolveOcrAmbiguity = async (...args: Parameters<typeof _canonResolveOcrAmbiguity>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).resolveOcrAmbiguity(...args);
  return (_canonResolveOcrAmbiguity as any)(...args);
};
export const rerunJob = async (...args: Parameters<typeof _canonRerunJob>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).rerunJob(...args);
  return (_canonRerunJob as any)(...args);
};
export const retryJobStage = async (...args: Parameters<typeof _canonRetryJobStage>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsActions as any).retryJobStage(...args);
  return (_canonRetryJobStage as any)(...args);
};

import * as LegacyJobsSubmit from "../../../../js/api/jobs-submit.js";
import { submitJobRequest as _canonSubmitJobRequest } from "@retainpdf/api/jobs-submit";
export const submitJobRequest = async (...args: Parameters<typeof _canonSubmitJobRequest>): Promise<any> => {
  if (isMockMode()) return (LegacyJobsSubmit as any).submitJobRequest(...args);
  return (_canonSubmitJobRequest as any)(...args);
};

import * as LegacyDocuments from "../../../../js/api/documents.js";
import { fetchDocumentList as _canonFetchDocumentList, fetchDocument as _canonFetchDocument, fetchDocumentByJobId as _canonFetchDocumentByJobId, fetchDocumentJobs as _canonFetchDocumentJobs, ocrDocument as _canonOcrDocument, translateDocument as _canonTranslateDocument, deleteDocument as _canonDeleteDocument, patchDocument as _canonPatchDocument } from "@retainpdf/api/documents";
export const fetchDocumentList = async (...args: Parameters<typeof _canonFetchDocumentList>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).fetchDocumentList(...args);
  return (_canonFetchDocumentList as any)(...args);
};
export const fetchDocumentByJobId = async (...args: Parameters<typeof _canonFetchDocumentByJobId>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).fetchDocumentByJobId(...args);
  return (_canonFetchDocumentByJobId as any)(...args);
};
export const fetchDocument = async (...args: Parameters<typeof _canonFetchDocument>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).fetchDocument(...args);
  return (_canonFetchDocument as any)(...args);
};
export const translateDocument = async (...args: Parameters<typeof _canonTranslateDocument>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).translateDocument(...args);
  return (_canonTranslateDocument as any)(...args);
};
export const ocrDocument = async (...args: Parameters<typeof _canonOcrDocument>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).ocrDocument(...args);
  return (_canonOcrDocument as any)(...args);
};
export const fetchDocumentJobs = async (...args: Parameters<typeof _canonFetchDocumentJobs>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).fetchDocumentJobs(...args);
  return (_canonFetchDocumentJobs as any)(...args);
};
export const deleteDocument = async (...args: Parameters<typeof _canonDeleteDocument>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).deleteDocument(...args);
  return (_canonDeleteDocument as any)(...args);
};
export const patchDocument = async (...args: Parameters<typeof _canonPatchDocument>): Promise<any> => {
  if (isMockMode()) return (LegacyDocuments as any).patchDocument(...args);
  return (_canonPatchDocument as any)(...args);
};

import * as LegacyCollections from "../../../../js/api/collections.js";
import { listCollections as _canonListCollections, createCollection as _canonCreateCollection, patchCollection as _canonPatchCollection, deleteCollection as _canonDeleteCollection, addDocumentsToCollection as _canonAddDocumentsToCollection, removeDocumentFromCollection as _canonRemoveDocumentFromCollection } from "@retainpdf/api/collections";
export const listCollections = async (...args: Parameters<typeof _canonListCollections>): Promise<any> => {
  if (isMockMode()) return (LegacyCollections as any).listCollections(...args);
  return (_canonListCollections as any)(...args);
};
export const createCollection = async (...args: Parameters<typeof _canonCreateCollection>): Promise<any> => {
  if (isMockMode()) return (LegacyCollections as any).createCollection(...args);
  return (_canonCreateCollection as any)(...args);
};
export const patchCollection = async (...args: Parameters<typeof _canonPatchCollection>): Promise<any> => {
  if (isMockMode()) return (LegacyCollections as any).patchCollection(...args);
  return (_canonPatchCollection as any)(...args);
};
export const deleteCollection = async (...args: Parameters<typeof _canonDeleteCollection>): Promise<any> => {
  if (isMockMode()) return (LegacyCollections as any).deleteCollection(...args);
  return (_canonDeleteCollection as any)(...args);
};
export const addDocumentsToCollection = async (...args: Parameters<typeof _canonAddDocumentsToCollection>): Promise<any> => {
  if (isMockMode()) return (LegacyCollections as any).addDocumentsToCollection(...args);
  return (_canonAddDocumentsToCollection as any)(...args);
};
export const removeDocumentFromCollection = async (...args: Parameters<typeof _canonRemoveDocumentFromCollection>): Promise<any> => {
  if (isMockMode()) return (LegacyCollections as any).removeDocumentFromCollection(...args);
  return (_canonRemoveDocumentFromCollection as any)(...args);
};

import * as LegacyFavorites from "../../../../js/api/favorites.js";
import { fetchFavorites as _canonFetchFavorites, createFavorite as _canonCreateFavorite, deleteFavorite as _canonDeleteFavorite } from "@retainpdf/api/favorites";
export const fetchFavorites = async (...args: Parameters<typeof _canonFetchFavorites>): Promise<any> => {
  if (isMockMode()) return (LegacyFavorites as any).fetchFavorites(...args);
  return (_canonFetchFavorites as any)(...args);
};
export const createFavorite = async (...args: Parameters<typeof _canonCreateFavorite>): Promise<any> => {
  if (isMockMode()) return (LegacyFavorites as any).createFavorite(...args);
  return (_canonCreateFavorite as any)(...args);
};
export const deleteFavorite = async (...args: Parameters<typeof _canonDeleteFavorite>): Promise<any> => {
  if (isMockMode()) return (LegacyFavorites as any).deleteFavorite(...args);
  return (_canonDeleteFavorite as any)(...args);
};

import * as LegacyProviders from "../../../../js/api/providers.js";
import { validateDeepSeekToken as _canonValidateDeepSeekToken, queryDeepSeekBalance as _canonQueryDeepSeekBalance, validatePaddleToken as _canonValidatePaddleToken } from "@retainpdf/api/providers";
export const validateDeepSeekToken = async (...args: Parameters<typeof _canonValidateDeepSeekToken>): Promise<any> => {
  if (isMockMode()) return (LegacyProviders as any).validateDeepSeekToken(...args);
  return (_canonValidateDeepSeekToken as any)(...args);
};
export const queryDeepSeekBalance = async (...args: Parameters<typeof _canonQueryDeepSeekBalance>): Promise<any> => {
  if (isMockMode()) return (LegacyProviders as any).queryDeepSeekBalance(...args);
  return (_canonQueryDeepSeekBalance as any)(...args);
};
export const validatePaddleToken = async (...args: Parameters<typeof _canonValidatePaddleToken>): Promise<any> => {
  if (isMockMode()) return (LegacyProviders as any).validatePaddleToken(...args);
  return (_canonValidatePaddleToken as any)(...args);
};

import * as LegacyGlossaries from "../../../../js/api/glossaries.js";
import { fetchGlossaries as _canonFetchGlossaries, fetchGlossary as _canonFetchGlossary, createGlossary as _canonCreateGlossary, updateGlossary as _canonUpdateGlossary, deleteGlossary as _canonDeleteGlossary, exportGlossaryCsv as _canonExportGlossaryCsv, parseGlossaryCsv as _canonParseGlossaryCsv } from "@retainpdf/api/glossaries";
export const fetchGlossariesApi = async (...args: Parameters<typeof _canonFetchGlossaries>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).fetchGlossaries(...args);
  return (_canonFetchGlossaries as any)(...args);
};
export const fetchGlossaryApi = async (...args: Parameters<typeof _canonFetchGlossary>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).fetchGlossary(...args);
  return (_canonFetchGlossary as any)(...args);
};
export const createGlossaryApi = async (...args: Parameters<typeof _canonCreateGlossary>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).createGlossary(...args);
  return (_canonCreateGlossary as any)(...args);
};
export const updateGlossaryApi = async (...args: Parameters<typeof _canonUpdateGlossary>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).updateGlossary(...args);
  return (_canonUpdateGlossary as any)(...args);
};
export const deleteGlossaryApi = async (...args: Parameters<typeof _canonDeleteGlossary>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).deleteGlossary(...args);
  return (_canonDeleteGlossary as any)(...args);
};
export const exportGlossaryCsvApi = async (...args: Parameters<typeof _canonExportGlossaryCsv>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).exportGlossaryCsv(...args);
  return (_canonExportGlossaryCsv as any)(...args);
};
export const parseGlossaryCsvApi = async (...args: Parameters<typeof _canonParseGlossaryCsv>): Promise<any> => {
  if (isMockMode()) return (LegacyGlossaries as any).parseGlossaryCsv(...args);
  return (_canonParseGlossaryCsv as any)(...args);
};

import * as LegacyTranslationDebug from "../../../../js/api/translation-debug.js";
import { fetchTranslationDiagnostics as _canonFetchTranslationDiagnostics, fetchTranslationItems as _canonFetchTranslationItems, fetchTranslationItem as _canonFetchTranslationItem, replayTranslationItem as _canonReplayTranslationItem } from "@retainpdf/api/translation-debug";
export const fetchTranslationDiagnostics = async (...args: Parameters<typeof _canonFetchTranslationDiagnostics>): Promise<any> => {
  if (isMockMode()) return (LegacyTranslationDebug as any).fetchTranslationDiagnostics(...args);
  return (_canonFetchTranslationDiagnostics as any)(...args);
};
export const fetchTranslationItems = async (...args: Parameters<typeof _canonFetchTranslationItems>): Promise<any> => {
  if (isMockMode()) return (LegacyTranslationDebug as any).fetchTranslationItems(...args);
  return (_canonFetchTranslationItems as any)(...args);
};
export const fetchTranslationItem = async (...args: Parameters<typeof _canonFetchTranslationItem>): Promise<any> => {
  if (isMockMode()) return (LegacyTranslationDebug as any).fetchTranslationItem(...args);
  return (_canonFetchTranslationItem as any)(...args);
};
export const replayTranslationItem = async (...args: Parameters<typeof _canonReplayTranslationItem>): Promise<any> => {
  if (isMockMode()) return (LegacyTranslationDebug as any).replayTranslationItem(...args);
  return (_canonReplayTranslationItem as any)(...args);
};

import * as LegacyAi from "../../../../js/api/ai.js";
import { askLibraryAi as _canonAskLibraryAi, readAiAskStream as _canonReadAiAskStream, AiAskError as _CanonAiAskError } from "@retainpdf/api/ai";
export const askLibraryAi = async (...args: Parameters<typeof _canonAskLibraryAi>): Promise<any> => {
  if (isMockMode()) return (LegacyAi as any).askLibraryAi(...args);
  return (_canonAskLibraryAi as any)(...args);
};
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

export const listAgentOperations = async (...args: Parameters<typeof _canonListAgentOperations>): Promise<any> => {
  if (isMockMode()) return { operations: [] };
  return _canonListAgentOperations(...args);
};
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

import * as LegacyConversations from "../../../../js/api/conversations.js";
import { deleteConversation as _canonDeleteConversation, getConversation as _canonGetConversation, listConversations as _canonListConversations, patchConversation as _canonPatchConversation, createConversation as _canonCreateConversation, appendConversationMessage as _canonAppendConversationMessage, forkConversationFromPath as _canonForkConversationFromPath } from "@retainpdf/api/conversations";
export const deleteConversation = async (...args: Parameters<typeof _canonDeleteConversation>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).deleteConversation(...args);
  return (_canonDeleteConversation as any)(...args);
};
export const getConversation = async (...args: Parameters<typeof _canonGetConversation>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).getConversation(...args);
  return (_canonGetConversation as any)(...args);
};
export const listConversations = async (...args: Parameters<typeof _canonListConversations>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).listConversations(...args);
  return (_canonListConversations as any)(...args);
};
export const patchConversation = async (...args: Parameters<typeof _canonPatchConversation>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).patchConversation(...args);
  return (_canonPatchConversation as any)(...args);
};
export const createConversation = async (...args: Parameters<typeof _canonCreateConversation>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).createConversation(...args);
  return (_canonCreateConversation as any)(...args);
};
export const appendConversationMessage = async (...args: Parameters<typeof _canonAppendConversationMessage>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).appendConversationMessage(...args);
  return (_canonAppendConversationMessage as any)(...args);
};
export const forkConversationFromPath = async (...args: Parameters<typeof _canonForkConversationFromPath>): Promise<any> => {
  if (isMockMode()) return (LegacyConversations as any).forkConversationFromPath(...args);
  return (_canonForkConversationFromPath as any)(...args);
};
export { baseConversationTitle, nextForkConversationTitle, messagesToBranchItems } from "@retainpdf/api/conversations";
export type { ConversationRecord, MessageRecord, ConversationDetail } from "@retainpdf/api/conversations";
export type { DocumentRecord } from "@retainpdf/api/documents";

import * as LegacySearch from "../../../../js/api/search.js";
import { searchLibrary as _canonSearchLibrary } from "@retainpdf/api/search";
export const searchLibrary = async (...args: Parameters<typeof _canonSearchLibrary>): Promise<any> => {
  if (isMockMode()) return (LegacySearch as any).searchLibrary(...args);
  return (_canonSearchLibrary as any)(...args);
};

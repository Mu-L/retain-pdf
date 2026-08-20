// composition/external/api — api barrel (http, jobs-*, library, ai, glossaries)

// —— api ——
export {
  buildApiEndpoint,
  buildJobDetailEndpoint,
  fetchProtected,
  submitJson,
  submitUploadRequest as submitUploadRequestHttp,
} from "../../../../js/api/http.js";
export {
  fetchJobList,
  fetchJobPayload,
} from "../../../../js/api/jobs-query.js";
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
  fetchLibraryBookList,
  deleteLibraryBook,
} from "../../../../js/api/library-books.js";
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

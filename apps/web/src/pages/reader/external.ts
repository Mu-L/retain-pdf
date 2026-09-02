// @retainpdf/reader 对 RetainPDF Web 宿主能力的单一出口。
// Reader 实现通过公开 package exports 消费这里注入的 API、配置、下载、
// 收藏与 AI 能力；缺少宿主符号时只扩展本文件和 adapters/retainpdf.ts。

// —— config / mock / messaging ——
export { isMockMode } from "../../js/config/runtime.js";
export { MOCK_DOCUMENT_SOURCE_PDF_URL } from "../../js/mock/documents.js";
export { READER_DIALOG_MESSAGES } from "../../js/features/reader-dialog/contract.js";

// —— job / http / vendor ——
export { resolveResourceUrl } from "@retainpdf/domain/job";
export { fetchProtected } from "@/shared/reader/host/data.js";
export {
  resolvePdfjsVendorUrl,
  resolveMarkedVendorUrl,
} from "../../js/runtime/vendor-url.js";

// —— Reader 宿主 ports：直连 shared/*，不经历史中转层 ——
export { defaultReaderDataPort } from "@/shared/reader/host/data.js";
export {
  defaultReaderPageConfigPort,
  resolveReaderAnchor,
  resolveReaderDocumentId,
  resolveReaderJobId,
} from "@/shared/reader/host/config.js";
export { resolveReaderArtifactUrl } from "@/shared/reader/host/data.js";
export {
  resolveReaderSourcePdf,
  resolveReaderTranslatedPdfUrl,
} from "@/shared/reader/host/data.js";
export { READER_PROGRESS_COPY } from "@/shared/reader/host/state.js";

// —— 下载解析 / 受保护下载 ——
export {
  READER_DOWNLOAD_ACTIONS,
  disabledReason as readerDownloadDisabledReason,
  resolveReaderDownloadName,
  resolveReaderDownloadUrls,
  trimString as trimReaderDownloadString,
} from "@/shared/reader/host/state.js";
export { downloadProtectedResource } from "../../js/features/reader-dialog/downloads.js";
export { failDownloadToast } from "../../js/utils/download-feedback.js";

// —— markdown 面板 ——
export { resolveMarkdownAssetUrl } from "@retainpdf/domain/job";
export { parseMarkdownWithMath } from "@/shared/reader/host/content.js";

// —— AI 追问（react-pdf assistant）——
export { askLibraryAi } from "../../js/api/ai.js";
export { createReaderAskAnswerer } from "@/shared/reader/host/ai.js";
export { createReaderMarkdownAnswerer } from "@/shared/reader/host/ai.js";
export {
  hydrateProtectedImages,
  injectCitationMarkers,
  isAgenticCitation,
  neutralizeMarkdownAnchors,
  renderCitationFooter,
  revokeHydratedImageUrls,
} from "@/shared/reader/host/ai.js";
export type { AiCitationLike } from "@/shared/reader/host/ai.js";
export {
  armReaderAiClickShield,
  clearReaderAiNavigationLock,
  installReaderWindowOpenGuard,
  isReaderAiNavigationLocked,
  lockReaderAiNavigation,
  shouldIgnoreReaderAiNavEvent,
} from "@/shared/reader/host/ai.js";
export {
  peekFinalAnswerHtmlCache,
  renderFinalAnswerHtml,
  renderStreamingPreviewHtml,
} from "@/shared/reader/host/ai.js";
export { sanitizeAssistantAnswer } from "@/shared/reader/host/ai.js";
export {
  clearThreadBranchSnapshot,
  loadThreadBranchSnapshot,
  saveThreadBranchSnapshot,
  threadBranchStorageKey,
  visiblePathFromSnapshot,
} from "@/shared/reader/host/ai.js";
export type {
  ThreadBranchCitation,
  ThreadBranchItem,
  ThreadBranchMessage,
  ThreadBranchSnapshot,
} from "@/shared/reader/host/ai.js";
export {
  appendConversationMessage,
  baseConversationTitle,
  createConversation,
  deleteConversation,
  forkConversationFromPath,
  getConversation,
  listConversations,
  messagesToBranchItems,
  nextForkConversationTitle,
  patchConversation,
} from "../../js/api/conversations.js";
export type {
  ConversationDetail,
  ConversationRecord,
  MessageRecord,
} from "../../js/api/conversations.js";
export {
  loadStoredConversationId,
  saveStoredConversationId,
  clearStoredConversationId,
} from "@/shared/reader/host/ai.js";

// —— 服务端收藏面板 ——
export { API_PREFIX } from "../../js/config/api-constants.js";
export { fetchDocumentByJobId } from "../../js/api/documents.js";
export {
  createFavorite,
  deleteFavorite,
  fetchFavorites,
} from "../../js/api/favorites.js";
export {
  createReaderServerFavoritesPort,
  normalizeServerFavorite,
} from "@/shared/reader/host/state.js";
export type { ServerFavorite } from "@/shared/reader/host/state.js";

// —— 阅读器 AI 面板：模型 Key 门禁 ——
export { defaultCredentialsStatePort } from "../../js/features/credentials/default-state-port.js";
export {
  CREDENTIALS_CHANGED_EVENT,
  hasModelApiKey,
  MISSING_MODEL_API_KEY_MESSAGE,
} from "@/shared/reader/host/ai.js";

// composition/external/shared — shared / utils barrel (shared/reader/ai)

// —— utils ——
export {
  buildErrorDiagnostic,
  messageForErrorBox,
} from "../../../../js/utils/error-diagnostics.js";
export { copyText } from "../../../../js/utils/clipboard.js";
export {
  fileNameFromDisposition,
  prepareDownloadTarget,
  saveResponseDownload,
} from "../../../../js/utils/downloads.js";

// —— 主页 AI 问答（home-ask）——
export { AiMarkdownAnswer } from "@retainpdf/reader/ai";
export {
  injectCitationMarkers,
  isAgenticCitation,
  neutralizeMarkdownAnchors,
  renderCitationFooter,
  type AiCitationLike,
} from "@/features/reader/domain.js";
export {
  renderFinalAnswerHtml,
  renderStreamingPreviewHtml,
} from "@/features/reader/domain.js";
export {
  CREDENTIALS_CHANGED_EVENT,
  hasModelApiKey,
  MISSING_MODEL_API_KEY_MESSAGE,
  resolveReaderAiConfig,
} from "@/features/reader/domain.js";
export { sanitizeAssistantAnswer } from "@/features/reader/domain.js";

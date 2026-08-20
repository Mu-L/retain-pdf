// composition/external/shared — shared / utils barrel (shared/reader/ai)

// —— utils ——
export {
  buildErrorDiagnostic,
  messageForErrorBox,
} from "../../../../js/utils/error-diagnostics.js";
export { copyText } from "../../../../js/utils/clipboard.js";

// —— 主页 AI 问答（home-ask）——
export {
  injectCitationMarkers,
  isAgenticCitation,
  neutralizeMarkdownAnchors,
  renderCitationFooter,
  type AiCitationLike,
} from "@/shared/reader/ai/answer-enhance.js";
export {
  renderFinalAnswerHtml,
  renderStreamingPreviewHtml,
} from "@/shared/reader/ai/render-answer-html.js";
export {
  CREDENTIALS_CHANGED_EVENT,
  hasModelApiKey,
  MISSING_MODEL_API_KEY_MESSAGE,
  resolveReaderAiConfig,
} from "@/shared/reader/ai/config.js";
export { sanitizeAssistantAnswer } from "@/shared/reader/ai/sanitize-answer.js";

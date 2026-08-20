// composition/external/config — config / constants barrel
// Re-exports for: api-constants, runtime, upload-constants, persisted-config, providers, workflow-defaults, model-constants

// —— config / constants ——
export { API_PREFIX } from "../../../../js/config/api-constants.js";
export {
  apiBase,
  defaultModelApiKey,
  defaultModelBaseUrl,
  defaultModelName,
  defaultOcrProvider,
  defaultPaddleApiUrl,
  defaultPaddleToken,
  isMockMode,
  isTrustedWindowMessage,
  mockScenario,
  buildFrontendPageUrl,
} from "../../../../js/config/runtime.js";
export {
  DEFAULT_FILE_LABEL,
  FRONT_MAX_BYTES,
  FRONT_MAX_PAGE_COUNT,
} from "../../../../js/config/upload-constants.js";
export {
  loadBrowserStoredConfig,
  loadDeveloperStoredConfig,
  saveBrowserStoredConfig,
  savePersistedBrowserStoredConfig,
  savePersistedDeveloperStoredConfig,
} from "../../../../js/config/persisted-config.js";
export { openDesktopOutputDirectory } from "../../../../js/config/desktop-persistence.js";
export { DEFAULT_MODEL_VERSION } from "../../../../js/config/model-constants.js";
export {
  OCR_PROVIDER_DEFINITIONS,
  TRANSLATION_PROVIDER_DEFINITION,
} from "../../../../js/config/providers.js";
export {
  DEFAULT_BATCH_SIZE,
  DEFAULT_BODY_FONT_SIZE_FACTOR,
  DEFAULT_BODY_LEADING_FACTOR,
  DEFAULT_CLASSIFY_BATCH_SIZE,
  DEFAULT_COMPILE_WORKERS,
  DEFAULT_INNER_BBOX_DENSE_SHRINK_X,
  DEFAULT_INNER_BBOX_DENSE_SHRINK_Y,
  DEFAULT_INNER_BBOX_SHRINK_X,
  DEFAULT_INNER_BBOX_SHRINK_Y,
  DEFAULT_LANGUAGE,
  DEFAULT_MODE,
  DEFAULT_PDF_COMPRESS_DPI,
  DEFAULT_RENDER_MODE,
  DEFAULT_RULE_PROFILE,
  DEFAULT_TIMEOUT_SECONDS,
  DEFAULT_TRANSLATED_PDF_NAME,
  DEFAULT_TYPST_FONT_FAMILY,
  DEFAULT_WORKERS,
} from "../../../../js/config/workflow-defaults.js";

// —— runtime ——
export { resolveLottieVendorUrl } from "../../../../js/runtime/vendor-url.js";

/** RetainPDF host bindings for the package-owned Reader AI runtime. */
import { resolveResourceUrl } from "@retainpdf/domain/job";
import * as readerAi from "@retainpdf/reader/runtime/ai";
import { askLibraryAi } from "@/platform/api/index.js";
import { fetchDocumentByJobId } from "@/platform/api/index.js";
import { API_PREFIX } from "@/platform/config/api-constants.js";
import {
  defaultModelBaseUrl,
  defaultModelName,
} from "@/platform/config/runtime.js";
import {
  loadBrowserStoredConfig,
  loadDeveloperStoredConfig,
} from "@/platform/config/persisted-config.js";
import { defaultCredentialsStatePort } from "@/features/credentials/domain.js";
import { fetchProtected } from "./data.js";

// 注册点参数类型直接取自 reader 包公开工厂签名，避免 any 掩盖契约漂移。
type ReaderAiConfigAdapters = NonNullable<
  Parameters<typeof readerAi.setReaderAiConfigAdapters>[0]
>;
type AnswerEnhanceAdapters = NonNullable<
  Parameters<typeof readerAi.setAnswerEnhanceAdapters>[0]
>;
type ReaderAskAnswererOptions = NonNullable<
  Parameters<typeof readerAi.createReaderAskAnswerer>[0]
>;

readerAi.setReaderAiConfigAdapters({
  credentialsPort: defaultCredentialsStatePort,
  loadBrowserStoredConfig,
  loadDeveloperStoredConfig,
  defaultModelBaseUrl,
  defaultModelName,
} satisfies ReaderAiConfigAdapters);
readerAi.setAnswerEnhanceAdapters({
  fetchProtected,
  resolveResourceUrl,
} satisfies AnswerEnhanceAdapters);

export * from "@retainpdf/reader/runtime/ai";

export const createReaderAskAnswerer = (options: ReaderAskAnswererOptions = {}) =>
  readerAi.createReaderAskAnswerer({
    apiPrefix: API_PREFIX,
    ask: askLibraryAi,
    documentByJobId: fetchDocumentByJobId,
    llmConfig: readerAi.resolveReaderAiConfig,
    ...options,
  });

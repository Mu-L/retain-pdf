/** RetainPDF host bindings for the package-owned Reader AI runtime. */
import { resolveResourceUrl } from "@retainpdf/domain/job";
import * as readerAi from "@retainpdf/reader/runtime/ai";
import { askLibraryAi } from "../../../js/api/ai.js";
import { fetchDocumentByJobId } from "../../../js/api/documents.js";
import { API_PREFIX } from "../../../js/config/api-constants.js";
import {
  defaultModelBaseUrl,
  defaultModelName,
} from "../../../js/config/runtime.js";
import {
  loadBrowserStoredConfig,
  loadDeveloperStoredConfig,
} from "../../../js/config/persisted-config.js";
import { defaultCredentialsStatePort } from "../../../js/features/credentials/default-state-port.js";
import { fetchProtected } from "./data.js";

readerAi.setReaderAiConfigAdapters({
  credentialsPort: defaultCredentialsStatePort as any,
  loadBrowserStoredConfig: loadBrowserStoredConfig as any,
  loadDeveloperStoredConfig: loadDeveloperStoredConfig as any,
  defaultModelBaseUrl: defaultModelBaseUrl as any,
  defaultModelName: defaultModelName as any,
});
readerAi.setAnswerEnhanceAdapters({
  fetchProtected: fetchProtected as any,
  resolveResourceUrl: resolveResourceUrl as any,
});

export * from "@retainpdf/reader/runtime/ai";

export const createReaderAskAnswerer = (options: any = {}) =>
  readerAi.createReaderAskAnswerer({
    apiPrefix: API_PREFIX,
    ask: askLibraryAi as any,
    documentByJobId: fetchDocumentByJobId as any,
    llmConfig: readerAi.resolveReaderAiConfig as any,
    ...options,
  });

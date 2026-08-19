// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { defaultModelBaseUrl, defaultModelName } from "../../js/config/runtime.js";
import {
  loadBrowserStoredConfig,
  loadDeveloperStoredConfig,
} from "../../js/config/persisted-config.js";
import { defaultCredentialsStatePort } from "../../js/features/credentials/default-state-port.js";
import * as shared from "../../../../../packages/reader/src/shared/ai/config.js";

shared.setReaderAiConfigAdapters({
  credentialsPort: defaultCredentialsStatePort as any,
  loadBrowserStoredConfig: loadBrowserStoredConfig as any,
  loadDeveloperStoredConfig: loadDeveloperStoredConfig as any,
  defaultModelBaseUrl: defaultModelBaseUrl as any,
  defaultModelName: defaultModelName as any,
});

export * from "../../../../../packages/reader/src/shared/ai/config.js";

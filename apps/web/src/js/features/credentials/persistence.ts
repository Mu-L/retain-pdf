import {
  buildBrowserCredentialConfig,
  buildTaskOptionsFromDialogValues,
} from "./dialog-values.js";
import { createCredentialSetupModePort } from "./setup-mode-port.js";

export function persistBrowserCredentialsFromDialog({
  applyHiddenCredentialInputs,
  applyCredentialInputs = applyHiddenCredentialInputs,
  currentOcrProvider,
  defaultModelApiKey,
  defaultModelBaseUrl,
  readHiddenCredentialInputs: _readHiddenCredentialInputs,
  readCredentialInputs: _readCredentialInputs,
  saveTaskOptions,
  saveBrowserStoredConfig,
  values,
}: any) {
  // 直接持久化表单结果，避免再从 state/DOM 回读时拿到旧值
  const next = buildBrowserCredentialConfig({
    values,
    currentOcrProvider,
    defaultModelApiKey,
  });
  applyCredentialInputs(next);
  saveBrowserStoredConfig?.(next);
  saveTaskOptions?.(buildTaskOptionsFromDialogValues({
    values,
    defaultModelBaseUrl,
  }));
  return next;
}

export async function persistDesktopCredentialsFromDialog({
  currentOcrProvider,
  defaultModelApiKey,
  defaultModelBaseUrl,
  saveTaskOptions,
  saveDesktopConfig,
  checkApiConnectivity,
  values,
  setupModePort = createCredentialSetupModePort(),
}: any) {
  const provider = currentOcrProvider();
  const ocrCredentialRef = `${values.ocrCredentialRef || ""}`.trim();
  const translationCredentialRef = `${values.translationCredentialRef || ""}`.trim();
  const paddleToken = `${values.paddleToken || ""}`.trim();
  const modelApiKey = `${values.modelApiKey || defaultModelApiKey?.() || ""}`.trim();
  await saveDesktopConfig?.(
    {
      ocrProvider: provider,
      ocrCredentialRef,
      paddleToken,
      translationCredentialRef,
      modelApiKey,
      markConfigured: setupModePort.currentSetupMode(),
    },
    async () => {
      await checkApiConnectivity?.();
    },
  );
  saveTaskOptions?.(buildTaskOptionsFromDialogValues({
    values,
    defaultModelBaseUrl,
  }));
}

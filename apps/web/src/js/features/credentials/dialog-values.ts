import { createCredentialDialogElementsPort } from "./dialog-elements-port.js";

/** Values read from the browser credential dialog inputs. */
export interface CredentialDialogValues {
  paddleToken: string;
  modelApiKey: string;
  modelBaseUrl: string;
  modelName: string;
  translationWorkers: string;
  mathMode: string;
  translationCredentialRef?: string;
}

export interface CredentialDialogElementsLike {
  paddleInput?: { value?: string } | null;
  apiKeyInput?: { value?: string } | null;
  modelBaseUrlInput?: { value?: string } | null;
  modelNameInput?: { value?: string } | null;
  translationWorkersInput?: { value?: string } | null;
  mathModeSelect?: { value?: string } | null;
}

export interface ReadCredentialDialogValuesOptions {
  elementsPort?: {
    elements: () => CredentialDialogElementsLike;
  };
}

export interface BuildBrowserCredentialConfigOptions {
  values: Pick<CredentialDialogValues, "paddleToken" | "modelApiKey" | "translationCredentialRef">;
  currentOcrProvider: () => string;
  defaultModelApiKey?: () => string;
}

export interface BuildTaskOptionsFromDialogValuesOptions {
  values: Pick<CredentialDialogValues, "modelName" | "modelBaseUrl" | "translationWorkers" | "mathMode">;
  defaultModelBaseUrl?: () => string;
}

export function readCredentialDialogValues({
  elementsPort = createCredentialDialogElementsPort(),
}: ReadCredentialDialogValuesOptions = {}): CredentialDialogValues {
  const {
    paddleInput,
    apiKeyInput,
    modelBaseUrlInput,
    modelNameInput,
    translationWorkersInput,
    mathModeSelect,
  } = elementsPort.elements();
  return {
    paddleToken: paddleInput?.value?.trim() || "",
    modelApiKey: apiKeyInput?.value?.trim() || "",
    modelBaseUrl: modelBaseUrlInput?.value?.trim() || "",
    modelName: modelNameInput?.value?.trim() || "",
    translationWorkers: translationWorkersInput?.value?.trim() || "",
    mathMode: mathModeSelect?.value || "direct_typst",
  };
}

export function buildBrowserCredentialConfig({
  values,
  currentOcrProvider,
  defaultModelApiKey,
}: BuildBrowserCredentialConfigOptions) {
  return {
    ocrProvider: currentOcrProvider(),
    paddleToken: values.paddleToken,
    translationCredentialRef: `${values.translationCredentialRef || ""}`.trim(),
    modelApiKey: `${values.modelApiKey || defaultModelApiKey?.() || ""}`.trim(),
  };
}

export function buildTaskOptionsFromDialogValues({
  values,
  defaultModelBaseUrl,
}: BuildTaskOptionsFromDialogValuesOptions) {
  return {
    model: values.modelName,
    baseUrl: values.modelBaseUrl || defaultModelBaseUrl?.() || "",
    workers: Number(values.translationWorkers),
    mathMode: values.mathMode,
    translateTitles: true,
  };
}

export function ocrTokenFromDialogValues(
  values: Partial<Pick<CredentialDialogValues, "paddleToken">> = {},
) {
  return values.paddleToken;
}

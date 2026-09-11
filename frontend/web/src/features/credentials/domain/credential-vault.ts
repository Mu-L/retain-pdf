// 安全凭据保险箱操作：列出/解析引用、写入 OCR token 与翻译 API Key。
// 与挂载闭包解耦：状态（revision）内聚在本工厂，外部只注入读凭据/命名函数。

import {
  getOcrProviderDefinition,
  normalizeOcrProvider,
} from "@/platform/config/providers.js";
import { savePersistedBrowserStoredConfig } from "@/platform/config/persisted-config.js";
import type { CredentialsStatePort } from "./state.js";

type RuntimeEnvPort = { isDesktopMode?: () => boolean };

export function createCredentialVault({
  apiPrefix,
  credentialsStatePort,
  runtimeEnv,
  readCurrentCredentials,
  currentOcrProvider,
  translationProvider,
  listCredentials,
  createCredential,
  updateCredential,
  saveDesktopConfig,
}: {
  apiPrefix?: string;
  credentialsStatePort: CredentialsStatePort;
  runtimeEnv: RuntimeEnvPort;
  readCurrentCredentials: () => any;
  currentOcrProvider: () => string;
  translationProvider: (baseUrl?: string) => string;
  listCredentials?: (apiPrefix?: string) => Promise<any>;
  createCredential?: (apiPrefix: string | undefined, payload: Record<string, unknown>) => Promise<any>;
  updateCredential?: (
    apiPrefix: string | undefined,
    credentialRef: string,
    payload: Record<string, unknown>,
  ) => Promise<any>;
  saveDesktopConfig?: (
    browserConfig?: Record<string, unknown> | unknown,
    afterSave?: () => unknown,
  ) => Promise<unknown> | unknown;
}) {
  let credentialVaultRevision: number | undefined;
  let ocrCredentialRevision: number | undefined;
  let translationCredentialRevision: number | undefined;

  async function refreshCredentialReferences({ persist = true } = {}) {
    if (!listCredentials) return null;
    const result = await listCredentials(apiPrefix);
    credentialVaultRevision = Number.isFinite(Number(result?.revision))
      ? Number(result.revision)
      : undefined;
    const items = Array.isArray(result?.credentials) ? result.credentials : [];
    const translationCandidates = items.filter(
      (item) => item?.kind === "translation_api_key" && item?.configured !== false,
    );
    const currentCredentials = readCurrentCredentials();
    const existingTranslationRef = `${currentCredentials?.translationCredentialRef || ""}`.trim();
    const selectedTranslation = translationCandidates.find((item) => item?.credential_ref === existingTranslationRef)
      || translationCandidates.sort((a, b) => `${b?.updated_at || ""}`.localeCompare(`${a?.updated_at || ""}`))[0]
      || null;
    const translationCredentialRef = `${selectedTranslation?.credential_ref || ""}`.trim();
    translationCredentialRevision = Number.isFinite(Number(selectedTranslation?.revision))
      ? Number(selectedTranslation.revision)
      : undefined;

    const provider = currentOcrProvider();
    const ocrCandidates = items.filter((item) => (
      item?.kind === "ocr_provider_token"
      && item?.configured !== false
      && `${item?.provider || ""}`.trim().toLowerCase() === provider
    ));
    const existingOcrRef = `${currentCredentials?.ocrCredentialRef || ""}`.trim();
    const selectedOcr = ocrCandidates.find((item) => item?.credential_ref === existingOcrRef)
      || ocrCandidates.sort((a, b) => `${b?.updated_at || ""}`.localeCompare(`${a?.updated_at || ""}`))[0]
      || null;
    const ocrCredentialRef = `${selectedOcr?.credential_ref || ""}`.trim();
    ocrCredentialRevision = Number.isFinite(Number(selectedOcr?.revision))
      ? Number(selectedOcr.revision)
      : undefined;

    credentialsStatePort.patchCredentials?.({
      ocrCredentialRef,
      translationCredentialRef,
    });
    if (persist && (
      translationCredentialRef !== existingTranslationRef
      || ocrCredentialRef !== existingOcrRef
    )) {
      await savePersistedBrowserStoredConfig(readCurrentCredentials());
    }
    if (ocrCredentialRef && translationCredentialRef && runtimeEnv.isDesktopMode?.() && saveDesktopConfig) {
      const restoredCredentials = readCurrentCredentials();
      await saveDesktopConfig({
        ocrProvider: provider,
        ocrCredentialRef,
        paddleToken: restoredCredentials.paddleToken || "",
        translationCredentialRef,
        modelApiKey: restoredCredentials.modelApiKey || "",
        markConfigured: true,
      });
    }
    return { ocr: selectedOcr, translation: selectedTranslation };
  }

  async function storeOcrCredential({ secret, provider }: { secret: string; provider: string }) {
    const normalizedSecret = `${secret || ""}`.trim();
    let existingRef = `${readCurrentCredentials()?.ocrCredentialRef || ""}`.trim();
    if (!normalizedSecret) return existingRef;
    if (!createCredential || !updateCredential || !listCredentials) {
      throw new Error("当前前端未接入安全凭据服务，请刷新后重试");
    }
    if (credentialVaultRevision === undefined) {
      await refreshCredentialReferences({ persist: false });
    }
    existingRef = `${readCurrentCredentials()?.ocrCredentialRef || ""}`.trim();
    const normalizedProvider = normalizeOcrProvider(provider);
    const payload = {
      kind: "ocr_provider_token",
      provider: normalizedProvider,
      label: `${getOcrProviderDefinition(normalizedProvider).label} OCR`,
      secret: normalizedSecret,
      ...(credentialVaultRevision === undefined
        ? {}
        : { expected_revision: credentialVaultRevision }),
      ...(existingRef && ocrCredentialRevision !== undefined
        ? { expected_credential_revision: ocrCredentialRevision }
        : {}),
    };
    const result = existingRef
      ? await updateCredential(apiPrefix, existingRef, payload)
      : await createCredential(apiPrefix, payload);
    credentialVaultRevision = Number.isFinite(Number(result?.revision))
      ? Number(result.revision)
      : credentialVaultRevision;
    ocrCredentialRevision = Number.isFinite(Number(result?.credential?.revision))
      ? Number(result.credential.revision)
      : ocrCredentialRevision;
    return `${result?.credential?.credential_ref || existingRef}`.trim();
  }

  async function storeTranslationCredential({ secret, baseUrl }: { secret: string; baseUrl: string }) {
    const normalizedSecret = `${secret || ""}`.trim();
    let existingRef = `${readCurrentCredentials()?.translationCredentialRef || ""}`.trim();
    if (!normalizedSecret) return existingRef;
    if (!createCredential || !updateCredential || !listCredentials) {
      throw new Error("当前前端未接入安全凭据服务，请刷新后重试");
    }
    if (credentialVaultRevision === undefined) {
      await refreshCredentialReferences({ persist: false });
    }
    existingRef = `${readCurrentCredentials()?.translationCredentialRef || ""}`.trim();
    const payload = {
      kind: "translation_api_key",
      provider: translationProvider(baseUrl),
      label: "翻译 API",
      secret: normalizedSecret,
      ...(credentialVaultRevision === undefined
        ? {}
        : { expected_revision: credentialVaultRevision }),
      ...(existingRef && translationCredentialRevision !== undefined
        ? { expected_credential_revision: translationCredentialRevision }
        : {}),
    };
    const result = existingRef
      ? await updateCredential(apiPrefix, existingRef, payload)
      : await createCredential(apiPrefix, payload);
    credentialVaultRevision = Number.isFinite(Number(result?.revision))
      ? Number(result.revision)
      : credentialVaultRevision;
    translationCredentialRevision = Number.isFinite(Number(result?.credential?.revision))
      ? Number(result.credential.revision)
      : translationCredentialRevision;
    return `${result?.credential?.credential_ref || existingRef}`.trim();
  }

  return { refreshCredentialReferences, storeOcrCredential, storeTranslationCredential };
}

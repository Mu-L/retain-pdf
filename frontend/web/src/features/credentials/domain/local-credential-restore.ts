// Read-only compatibility for keys saved by earlier versions. New saves are local.
import type { CredentialsStatePort } from "./state.js";
import { savePersistedBrowserStoredConfig } from "@/platform/config/persisted-config.js";
import { inferTranslationProvider } from "@/platform/config/providers.js";

export async function restoreLocalCredentialValues({
  apiPrefix,
  credentialsStatePort,
  listCredentials,
  baseUrl = "",
}: {
  apiPrefix?: string;
  credentialsStatePort: CredentialsStatePort;
  listCredentials?: (apiPrefix?: string) => Promise<any>;
  baseUrl?: string;
}) {
  if (!listCredentials) return;
  const result = await listCredentials(apiPrefix);
  const items = (Array.isArray(result?.credentials) ? result.credentials : [])
    .filter((item) => item?.configured !== false && typeof item?.secret === "string" && item.secret.trim())
    .sort((a, b) => `${b.updated_at || ""}`.localeCompare(`${a.updated_at || ""}`));
  // Read after the request, so a key just saved locally always wins.
  const current = credentialsStatePort.getCredentials();
  const select = (kind: string, provider: string, ref = "") => {
    const candidates = items.filter((item) => item.kind === kind && item.provider === provider);
    return (candidates.find((item) => item.credential_ref === ref) || candidates[0])?.secret?.trim() || "";
  };
  const paddleToken = current.paddleToken || select("ocr_provider_token", "paddle", current.ocrCredentialRef);
  const mineruToken = current.mineruToken || select("ocr_provider_token", "mineru", current.ocrCredentialRef);
  const translationProvider = inferTranslationProvider(baseUrl);
  const modelApiKey = current.modelApiKey || select(
    "translation_api_key", translationProvider === "custom" ? "openai_compatible" : translationProvider,
    current.translationCredentialRef,
  );
  if (paddleToken === current.paddleToken && mineruToken === (current.mineruToken || "") && modelApiKey === current.modelApiKey) return;
  const next = credentialsStatePort.patchCredentials({
    paddleToken, mineruToken, modelApiKey,
    ocrCredentialRef: (current.ocrProvider === "mineru" ? mineruToken : paddleToken) ? "" : current.ocrCredentialRef,
    translationCredentialRef: modelApiKey ? "" : current.translationCredentialRef,
  });
  await savePersistedBrowserStoredConfig(next);
}

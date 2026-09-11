import type {
  CredentialsFields,
  OcrTokenOptions,
} from "./state-types.js";

export function ocrTokenFromCredentials(
  credentials: Partial<CredentialsFields> = {},
  { defaultPaddleToken }: OcrTokenOptions = {},
): string {
  const token = credentials.paddleToken;
  if (token) {
    return token;
  }
  return defaultPaddleToken?.() || "";
}

export function hasCompleteCredentials(
  credentials: Partial<CredentialsFields> = {},
  options: OcrTokenOptions = {},
): boolean {
  return Boolean(
    (credentials.ocrCredentialRef || ocrTokenFromCredentials(credentials, options))
    && credentials.translationCredentialRef,
  );
}

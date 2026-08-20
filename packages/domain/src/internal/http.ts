import { buildApiUrl } from "./runtime.js";

export function buildApiEndpoint(apiPrefix: string, relativePath = ""): string {
  return buildApiUrl(apiPrefix, relativePath);
}

// Pure subset of apps/web/src/js/config/runtime.ts — framework-agnostic, no window dependency in tests
export const DEFAULT_FALLBACK_BASE = "http://127.0.0.1:41000";
const API_V1_SUFFIX = "/api/v1";

let runtimeConfig: Record<string, unknown> = {};

export function apiBase(): string {
  const cfgBase = typeof runtimeConfig.apiBase === "string" ? (runtimeConfig.apiBase as string).trim() : "";
  if (cfgBase) {
    return cfgBase.replace(/\/+$/, "").replace(new RegExp(`${API_V1_SUFFIX}$`), "");
  }
  if (typeof window === "undefined") {
    return DEFAULT_FALLBACK_BASE;
  }
  // best-effort browser fallback (matches original)
  try {
    const loc = (window as unknown as { location?: { protocol?: string; hostname?: string; origin?: string } }).location;
    if (loc?.protocol === "https:" && loc.origin) return loc.origin;
    const host = loc?.hostname || "127.0.0.1";
    const protocol = loc?.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${host}:41000`;
  } catch {
    return DEFAULT_FALLBACK_BASE;
  }
}

export function buildApiUrl(apiPrefix = "", relativePath = ""): string {
  const normalizedPrefix = `${apiPrefix || ""}`.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  const normalizedPath = `${relativePath || ""}`.trim().replace(/^\/+/, "");
  const segments = [apiBase(), normalizedPrefix].filter(Boolean);
  if (normalizedPath) segments.push(normalizedPath);
  return segments.join("/");
}

export function setRuntimeConfig(nextConfig: Record<string, unknown> = {}) {
  runtimeConfig = { ...runtimeConfig, ...nextConfig };
}

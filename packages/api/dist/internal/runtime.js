// Shared runtime helpers — browser-aware (reads window.__FRONT_RUNTIME_CONFIG__ for apiBase / X-API-Key if present).
export const API_PREFIX = "/api/v1";
const API_V1_SUFFIX = "/api/v1";
const DEFAULT_FALLBACK_BASE = "http://127.0.0.1:41000";
const DEFAULT_FALLBACK_PORT = 41000;
export function getRuntimeConfig() {
    if (typeof window !== "undefined" && window.__FRONT_RUNTIME_CONFIG__)
        return window.__FRONT_RUNTIME_CONFIG__;
    return {};
}
function isFileProtocol() {
    if (typeof window === "undefined")
        return false;
    return window.location.protocol === "file:";
}
export function apiBase() {
    const cfg = getRuntimeConfig();
    if (typeof cfg.apiBase === "string" && cfg.apiBase.trim()) {
        return cfg.apiBase.trim().replace(/\/+$/, "").replace(new RegExp(`${API_V1_SUFFIX}$`), "");
    }
    if (typeof window === "undefined")
        return DEFAULT_FALLBACK_BASE;
    if (!isFileProtocol() && window.location.protocol === "https:")
        return window.location.origin;
    const host = window.location.hostname || "127.0.0.1";
    const protocol = window.location.protocol === "https:" ? "https:" : "http:";
    return `${protocol}//${host}:${DEFAULT_FALLBACK_PORT}`;
}
export function buildApiUrl(apiPrefix, relativePath) {
    const normalizedPrefix = `${apiPrefix || ""}`.trim().replace(/^\/+/, "").replace(/\/+$/, "");
    const normalizedPath = `${relativePath || ""}`.trim().replace(/^\/+/, "");
    const segments = [apiBase(), normalizedPrefix].filter(Boolean);
    if (normalizedPath)
        segments.push(normalizedPath);
    return segments.join("/");
}
export function frontendApiKey() {
    const cfg = getRuntimeConfig();
    const fromModule = typeof cfg.xApiKey === "string" ? cfg.xApiKey.trim() : "";
    if (fromModule)
        return fromModule;
    if (typeof window !== "undefined") {
        const live = window.__FRONT_RUNTIME_CONFIG__?.xApiKey;
        return typeof live === "string" ? live.trim() : "";
    }
    return "";
}
export function buildApiHeaders(headers = {}) {
    const out = { "Content-Type": "application/json", ...headers };
    const apiKey = frontendApiKey();
    if (apiKey)
        out["X-API-Key"] = apiKey;
    return out;
}
export function unwrapEnvelope(envelope) {
    if (envelope && typeof envelope === "object" && "data" in envelope)
        return envelope.data;
    return envelope;
}
// Re-export stripOcrSuffix so consumers can import from a single runtime barrel
// without needing a deep import. The source of truth lives in utils/strip-ocr.ts.
export { stripOcrSuffix } from "../utils/strip-ocr.js";

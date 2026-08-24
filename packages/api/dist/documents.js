// documents — pure
import { buildApiHeaders, unwrapEnvelope } from "./internal/runtime.js";
import { buildApiEndpoint } from "./http.js";
export async function fetchDocumentList(apiPrefix, { limit = 50, offset = 0, readingStatus = "", tag = "", collectionId = "" } = {}) {
    const params = new URLSearchParams();
    params.set("limit", `${limit}`);
    params.set("offset", `${offset}`);
    if (`${readingStatus || ""}`.trim())
        params.set("reading_status", `${readingStatus}`.trim());
    if (`${tag || ""}`.trim())
        params.set("tag", `${tag}`.trim());
    if (`${collectionId || ""}`.trim())
        params.set("collection_id", `${collectionId}`.trim());
    const resp = await fetch(`${buildApiEndpoint(apiPrefix, "documents")}?${params.toString()}`, { headers: buildApiHeaders() });
    if (!resp.ok)
        throw new Error(`读取文档库失败，请稍后重试。(${resp.status})`);
    return unwrapEnvelope(await resp.json());
}
export async function fetchDocumentByJobId(apiPrefix, jobId) {
    const normalized = `${jobId || ""}`.trim();
    if (!normalized)
        return null;
    const params = new URLSearchParams();
    params.set("job_id", normalized);
    const resp = await fetch(`${buildApiEndpoint(apiPrefix, "documents")}?${params.toString()}`, { headers: buildApiHeaders() });
    if (!resp.ok)
        throw new Error(`按 job 查文档失败，请稍后重试。(${resp.status})`);
    const payload = unwrapEnvelope(await resp.json()) || { documents: [], total: 0, limit: 0, offset: 0 };
    const { documents = [] } = payload;
    return Array.isArray(documents) && documents.length ? documents[0] : null;
}
export async function fetchDocument(apiPrefix, documentId) {
    const normalized = `${documentId || ""}`.trim();
    if (!normalized)
        throw new Error("缺少 document_id。");
    const resp = await fetch(buildApiEndpoint(apiPrefix, `documents/${encodeURIComponent(normalized)}`), { headers: buildApiHeaders() });
    if (!resp.ok)
        throw new Error(`读取文档详情失败，请稍后重试。(${resp.status})`);
    return unwrapEnvelope(await resp.json());
}
export async function patchDocument(apiPrefix, documentId, payload = {}) {
    const normalized = `${documentId || ""}`.trim();
    if (!normalized)
        throw new Error("缺少 document_id。");
    const resp = await fetch(buildApiEndpoint(apiPrefix, `documents/${encodeURIComponent(normalized)}`), {
        method: "PATCH",
        headers: { ...buildApiHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const envelope = await resp.json().catch(() => null);
        throw new Error(`${envelope?.message || "更新文档失败，请稍后重试。"}(${resp.status})`);
    }
    return unwrapEnvelope(await resp.json());
}
export async function deleteDocument(apiPrefix, documentId, { force = false } = {}) {
    const normalized = `${documentId || ""}`.trim();
    if (!normalized)
        throw new Error("缺少 document_id。");
    const params = force ? "?force=true" : "";
    const resp = await fetch(buildApiEndpoint(apiPrefix, `documents/${encodeURIComponent(normalized)}`) + params, { method: "DELETE", headers: buildApiHeaders() });
    if (!resp.ok) {
        const envelope = await resp.json().catch(() => null);
        const error = new Error(`${envelope?.message || "删除文档失败，请稍后重试。"}(${resp.status})`);
        error.status = resp.status;
        throw error;
    }
    return unwrapEnvelope(await resp.json());
}
export async function translateDocument(apiPrefix, documentId, payload = {}) {
    const normalized = `${documentId || ""}`.trim();
    if (!normalized)
        throw new Error("缺少 document_id。");
    const resp = await fetch(buildApiEndpoint(apiPrefix, `documents/${encodeURIComponent(normalized)}/translate`), {
        method: "POST",
        headers: { ...buildApiHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!resp.ok) {
        const envelope = await resp.json().catch(() => null);
        throw new Error(`${envelope?.message || "发起翻译失败，请稍后重试。"}(${resp.status})`);
    }
    return unwrapEnvelope(await resp.json());
}

// jobs-artifacts — pure (no mock)
import { buildApiHeaders, unwrapEnvelope } from "./internal/runtime.js";
import { buildJobDetailEndpoint } from "./http.js";
function buildOcrJobDetailEndpoint(jobId, apiPrefix) {
    return buildJobDetailEndpoint(jobId, apiPrefix).replace(/\/jobs\//, "/ocr/jobs/");
}
export async function fetchJobArtifactsManifest(jobId, apiPrefix) {
    const resp = await fetch(`${buildJobDetailEndpoint(jobId, apiPrefix)}/artifacts-manifest`, { headers: buildApiHeaders() });
    if (!resp.ok) {
        if (resp.status === 404) {
            const ocrResp = await fetch(`${buildOcrJobDetailEndpoint(jobId, apiPrefix)}/artifacts-manifest`, { headers: buildApiHeaders() });
            if (ocrResp.ok)
                return unwrapEnvelope(await ocrResp.json());
            if (ocrResp.status === 404)
                return { items: [] };
        }
        if (resp.status === 404)
            return { items: [] };
        throw new Error(`读取产物清单失败，请稍后重试。(${resp.status})`);
    }
    return unwrapEnvelope(await resp.json());
}
export async function fetchJobMarkdown(jobId, apiPrefix) {
    const resp = await fetch(`${buildJobDetailEndpoint(jobId, apiPrefix)}/markdown`, { headers: buildApiHeaders() });
    if (!resp.ok) {
        if (resp.status === 404)
            return null;
        throw new Error(`读取 Markdown 失败，请稍后重试。(${resp.status})`);
    }
    return unwrapEnvelope(await resp.json());
}
export async function fetchJobMarkdownDocument(jobId, apiPrefix) {
    const resp = await fetch(`${buildJobDetailEndpoint(jobId, apiPrefix)}/markdown/document`, { headers: buildApiHeaders() });
    if (!resp.ok) {
        if (resp.status === 404)
            return null;
        throw new Error(`读取结构化 Markdown 失败，请稍后重试。(${resp.status})`);
    }
    return unwrapEnvelope(await resp.json());
}

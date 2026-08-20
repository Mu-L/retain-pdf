// jobs-events — pure
import { buildApiHeaders, unwrapEnvelope } from "./internal/runtime.js";
import { buildJobDetailEndpoint } from "./http.js";

export async function fetchJobEvents(jobId: string, apiPrefix?: string, limit = 50, offset = 0): Promise<any> {
  const resp = await fetch(`${buildJobDetailEndpoint(jobId, apiPrefix)}/events?limit=${limit}&offset=${offset}`, { headers: buildApiHeaders() });
  if (!resp.ok) {
    if (resp.status === 404) return { items: [], limit, offset };
    throw new Error(`读取事件流失败，请稍后重试。(${resp.status})`);
  }
  return unwrapEnvelope(await resp.json()) as { items?: unknown[]; limit?: number; offset?: number; [key: string]: unknown };
}

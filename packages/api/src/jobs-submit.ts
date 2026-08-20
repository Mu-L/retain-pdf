// jobs-submit — pure
import { buildJobsEndpoint, submitJson } from "./http.js";

function isObject(value: unknown): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function assertGroupedJobPayload(payload: unknown): void {
  if (!isObject(payload)) throw new Error("提交失败: /api/v1/jobs 需要 JSON object 请求体。");
  const p = payload as Record<string, unknown>;
  if (!p.workflow || !isObject(p.source)) throw new Error("提交失败: /api/v1/jobs 必须使用 grouped JSON，至少包含 workflow 和 source。");
  const legacyTopLevelFields = ["upload_id","artifact_job_id","mode","model","base_url","api_key","mineru_token","paddle_token","model_version","language","render_mode","skip_title_translation","batch_size","workers","classify_batch_size","compile_workers","rule_profile_name","custom_rules_text","timeout_seconds"];
  const leaked = legacyTopLevelFields.filter((f) => f in p);
  if (leaked.length > 0) throw new Error(`提交失败: /api/v1/jobs 不再接受旧扁平字段，发现 ${leaked.join(", ")}。请改为 source/ocr/translation/render/runtime 分组结构。`);
}

export async function submitJobRequest(apiPrefix: string, payload: unknown): Promise<any> {
  assertGroupedJobPayload(payload);
  return submitJson(buildJobsEndpoint(apiPrefix, "jobs"), payload);
}

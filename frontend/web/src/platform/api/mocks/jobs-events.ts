import { getMockJobEvents } from "@/platform/mock/index.js";

// mock-only 适配器:index.ts 的 mockable() 只在 mock 模式调用本实现。
export async function fetchJobEvents(jobId, apiPrefix, limit = 50, offset = 0) {
  void apiPrefix;
  const payload = getMockJobEvents(jobId);
  return { ...payload, limit, offset };
}

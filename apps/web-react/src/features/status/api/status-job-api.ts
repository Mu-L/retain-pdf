/**
 * Status job API — thin wrapper over @retainpdf/api.
 * Replaces apps/web mountJobRuntimeFeature polling internals.
 * Pure fetch via TanStack Query, no store coupling.
 */
import { fetchJobPayload } from '@retainpdf/api'

export type StatusJobPayload = Awaited<ReturnType<typeof fetchJobPayload>>

export async function fetchStatusJob(jobId: string, apiPrefix?: string): Promise<StatusJobPayload> {
  const normalized = `${jobId || ''}`.trim()
  if (!normalized) throw new Error('missing jobId')
  return fetchJobPayload(normalized, apiPrefix ? { apiPrefix } : undefined)
}

export { fetchJobPayload }

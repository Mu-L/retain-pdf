/**
 * TanStack Query polling for job status.
 * Replaces mountJobRuntimeFeature + setInterval(1s) + currentJobStore.
 * Polling stops when job reaches terminal status (succeeded/failed/canceled).
 */
import { useQuery } from '@tanstack/react-query'
import { isJobTerminal } from '@retainpdf/domain/job'

import { fetchStatusJob } from '../api/status-job-api'

export const statusJobKeys = {
  all: ['status-job'] as const,
  byId: (jobId: string) => [...statusJobKeys.all, jobId] as const,
}

type UseStatusJobQueryOptions = {
  enabled?: boolean
  refetchInterval?: number | false
  apiPrefix?: string
}

export function useStatusJobQuery(jobId: string, options: UseStatusJobQueryOptions = {}) {
  const enabled = Boolean(`${jobId || ''}`.trim()) && (options.enabled ?? true)
  const interval = options.refetchInterval ?? 1000

  return useQuery({
    queryKey: statusJobKeys.byId(jobId),
    queryFn: () => fetchStatusJob(jobId, options.apiPrefix),
    enabled,
    // Poll only while not terminal — dynamic interval via function
    refetchInterval: (query) => {
      const data = query.state.data as { status?: string } | undefined
      if (data && isJobTerminal(data as never)) return false
      return interval as number
    },
    staleTime: 0,
  })
}

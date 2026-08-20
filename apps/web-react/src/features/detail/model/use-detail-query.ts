import { useQuery } from '@tanstack/react-query'
import { fetchDetailJob } from '../api/detail-api'
import { isJobTerminal } from '@retainpdf/domain/job'

export const detailKeys = {
  all: ['detail'] as const,
  byId: (jobId: string) => [...detailKeys.all, jobId] as const,
}

export function useDetailQuery(jobId: string) {
  const id = `${jobId || ''}`.trim()
  return useQuery({
    queryKey: detailKeys.byId(id),
    queryFn: () => fetchDetailJob(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const data: any = query.state.data
      if (data && isJobTerminal(data as any)) return false
      return 2000
    },
  })
}

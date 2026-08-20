/**
 * Elapsed ticker — port of apps/web/src/pages/home/features/status/useElapsedTicker.ts
 * but without HomeServices. Uses domain's resolveLiveDurations + 1s tick.
 */
import { useEffect, useState } from 'react'
import { isJobTerminal } from '@retainpdf/domain/job'
import { buildElapsedViewModel } from '@retainpdf/domain'

export function useElapsedTicker(job: unknown, { finishedAtFallback = '' } = {}) {
  const [tick, setTick] = useState(0)
  const status = `${(job as { status?: string })?.status || ''}`.trim()
  const terminal = isJobTerminal(status)

  useEffect(() => {
    if (terminal || !job) return undefined
    const timer = setInterval(() => setTick((v) => v + 1), 1000)
    return () => clearInterval(timer)
  }, [terminal, (job as { job_id?: string })?.job_id, status])

  // touch tick to force rerender
  void tick
  return buildElapsedViewModel(job as never, { finishedAtFallback })
}

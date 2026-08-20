/**
 * useStatusCard — React port of apps/web/src/pages/home/features/status/use-status-card-model.ts
 * but without HomeServices. Uses:
 *  - TanStack Query (useStatusJobQuery) for polling
 *  - Zustand (useStatusUiStore) for selectedStage UI state
 *  - @retainpdf/domain view-models for snapshot/display/elapsed
 *
 * Shared hook: could be imported by both apps/web (adapter over legacy store)
 * and apps/web-react (direct). StatusCard remains presentational via props.
 */
import { useEffect, useMemo } from 'react'
import {
  buildSelectedStageDisplay,
  statusStageLabel,
  buildProgressOptions,
} from '@retainpdf/domain'
import { buildJobStatusViewModel } from '@retainpdf/domain/job-status'
import { resolveLiveDurations } from '@retainpdf/domain/job'

import { useStatusJobQuery } from './use-status-job-query'
import { useElapsedTicker } from './use-elapsed-ticker'
import { useStatusUiStore } from './status-ui-store'

export type UseStatusCardOptions = {
  jobId: string
  apiPrefix?: string
  enabled?: boolean
  /** animation props — Lottie path via props, not HomeServices */
  animationProps?: {
    containerRef?: React.RefObject<HTMLDivElement | null>
    hasStageAnimation?: boolean
  }
}

export function useStatusCard({ jobId, apiPrefix, enabled = true }: UseStatusCardOptions) {
  const query = useStatusJobQuery(jobId, { apiPrefix, enabled })
  const job = query.data as Record<string, unknown> | null | undefined

  // Build domain snapshot — replaces buildRuntimeStatusCardSnapshot + createStatusCardPresenter
  const snapshot = useMemo(() => {
    if (!job) return null
    // Minimal snapshot via buildJobStatusViewModel (domain pure)
    return buildJobStatusViewModel({
      state: null,
      job,
      jobId,
      events: null,
      manifest: null,
      stageActions: null,
      publicErrorText: '',
      stagePresentation: null,
      finishedAtFallback: '',
    }) as unknown as Record<string, unknown> & {
      stageKey: string
      status: string
      jobId: string
      elapsed: string
    }
  }, [job, jobId])

  const flowStageKey = useMemo(() => {
    const status = `${(snapshot as { status?: string })?.status || ''}`.trim()
    if (status === 'succeeded') return 'done'
    return `${(snapshot as { stageKey?: string })?.stageKey || ''}`.trim()
  }, [snapshot])

  // Zustand sync — mirrors useStageSelection effect
  const { selectedStageKey, selectStage, sync } = useStatusUiStore()
  useEffect(() => {
    sync(jobId, flowStageKey || (snapshot as { stageKey?: string })?.stageKey || '')
  }, [jobId, flowStageKey, snapshot, sync])

  const displaySnapshot = useMemo(() => {
    if (!snapshot) return null
    if (flowStageKey === 'done' && (snapshot as { stageKey?: string }).stageKey !== 'done') {
      return { ...snapshot, stageKey: 'done' }
    }
    return snapshot
  }, [snapshot, flowStageKey])

  const display = useMemo(() => {
    if (!displaySnapshot) return null
    return buildSelectedStageDisplay({
      snapshot: displaySnapshot,
      selectedStageKey,
    }) as unknown as {
      selected: string
      selectedProgress: Record<string, unknown>
      selectedIsCurrent: boolean
      visualStageKey: string
      detailText: string
      showDetail: boolean
      errorState: { errorText: string; showError: boolean; bodyHasError: boolean }
      primaryActions: Record<string, unknown>
      retryAction: unknown
    }
  }, [displaySnapshot, selectedStageKey])

  const elapsed = useElapsedTicker(job as unknown, { finishedAtFallback: '' })
  // also compute via durations directly for Snapshot compatibility
  const durations = useMemo(() => resolveLiveDurations(job as never, { finishedAtFallback: '' }), [job, elapsed])

  const renderOptions = useMemo(() => {
    if (!display || !displaySnapshot) return null
    const p = display.selectedProgress as Record<string, unknown>
    return buildProgressOptions({
      selected: (display.selected as string) || flowStageKey,
      selectedIsCurrent: display.selectedIsCurrent,
      snapshot: displaySnapshot as never,
      selectedProgress: p as never,
    })
  }, [display, displaySnapshot, flowStageKey])

  const ringLabel = useMemo(() => {
    if (!display) return ''
    return display.selectedIsCurrent
      ? statusStageLabel(selectedStageKey || flowStageKey, (snapshot as { label?: string })?.label || '阶段')
      : statusStageLabel(selectedStageKey, '阶段')
  }, [display, selectedStageKey, flowStageKey, snapshot])

  return {
    query,
    snapshot: snapshot as unknown as {
      jobId: string
      status: string
      stageKey: string
      visualStageKey: string
      label: string
      value: string
      elapsed: string
      errorText: string
      stageProgressByKey: Record<string, unknown>
      pdfReady: boolean
      pdfUrl: string
      readerReady: boolean
      readerUrl: string
      stageRetryActions: Record<string, unknown>
      job: unknown
      summary: unknown
    } | null,
    display,
    elapsed,
    durations,
    renderOptions,
    ringLabel,
    flowStageKey,
    selection: {
      selectedStageKey: selectedStageKey || flowStageKey,
      currentStageKey: flowStageKey,
      selectStage,
    },
    // Lottie via props — caller passes containerRef if needed
    lottie: {
      visualStageKey: (display?.visualStageKey as string) || flowStageKey,
      hasStageAnimation: Boolean((display?.visualStageKey as string) || flowStageKey),
      isTranslationStage: (display?.visualStageKey as string) === 'translate' || flowStageKey === 'translate',
    },
  }
}

/**
 * Adapter for apps/web legacy: wraps useStatusCard but reads from
 * existing HomeServices store if provided. Keeping apps/web working
 * via composition while exposing new hook for reuse.
 */
export function useStatusCardFromSnapshot(legacySnapshot: unknown, selectedOverride?: string) {
  // Thin wrapper when caller already has snapshot (apps/web composition)
  const snapshot = legacySnapshot as Record<string, unknown> | null
  const flowStageKey = `${(snapshot as { status?: string })?.status === 'succeeded' ? 'done' : (snapshot as { stageKey?: string })?.stageKey || ''}`.trim()
  const { selectedStageKey, selectStage } = useStatusUiStore()
  const effectiveSelected = selectedOverride ?? selectedStageKey
  const display = useMemo(() => {
    if (!snapshot) return null
    return buildSelectedStageDisplay({ snapshot, selectedStageKey: effectiveSelected || flowStageKey })
  }, [snapshot, effectiveSelected, flowStageKey])
  return { snapshot, display, flowStageKey, selection: { selectedStageKey: effectiveSelected, selectStage } }
}

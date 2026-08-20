/**
 * StatusCardConnected — Phase2 slice demo.
 * Wires TanStack Query polling + Zustand selectedStage + domain view-models
 * into presentational StatusCard via props (no HomeServices).
 *
 * Usage:
 *   <StatusCardConnected jobId="..." />
 * Shows stage flow, progress, elapsed, lottie via props.
 */
import { useMemo } from 'react'

import { StatusCard } from '../status-card'
import { useStatusCard } from '../model/use-status-card'
import { useLottieStageAnimation } from '../model/use-lottie-stage-animation'
import type { StageKey } from '../types'
import { progressPercent } from '../status-progress'

export type StatusCardConnectedProps = {
  jobId: string
  apiPrefix?: string
  className?: string
}

function toStatusSnapshot(display: unknown, snapshot: unknown, elapsedText: string) {
  const s = snapshot as { stageKey?: string; errorText?: string; pdfReady?: boolean; readerReady?: boolean; stageProgressByKey?: Record<string, { current?: number; total?: number; progressText?: string; indeterminate?: boolean; substageKey?: string }> } | null
  const d = display as { selected?: string; selectedProgress?: { current?: number; total?: number; progressText?: string; indeterminate?: boolean; substageKey?: string } } | null
  if (!s) return null
  const activeStage = `${s.stageKey || 'ocr'}` as StageKey
  const selectedStage = `${d?.selected || s.stageKey || 'ocr'}` as StageKey
  const stageProgress: Record<string, { current?: number; total?: number; text?: string; indeterminate?: boolean; substageKey?: string }> = {}
  for (const [k, v] of Object.entries(s.stageProgressByKey || {})) {
    stageProgress[k] = {
      current: v.current as number,
      total: v.total as number,
      text: v.progressText as string,
      indeterminate: v.indeterminate as boolean,
      substageKey: v.substageKey as string,
    }
  }
  // ensure selected progress present
  const sel = d?.selectedProgress
  if (sel && !stageProgress[selectedStage]) {
    stageProgress[selectedStage] = {
      current: sel.current as number,
      total: sel.total as number,
      text: sel.progressText as string,
      indeterminate: sel.indeterminate as boolean,
      substageKey: sel.substageKey as string,
    }
  }
  return {
    selectedStage,
    activeStage,
    elapsedText,
    errorText: s.errorText,
    stageProgress,
    pdfReady: s.pdfReady,
    readerReady: s.readerReady,
  }
}

export function StatusCardConnected({ jobId, apiPrefix, className }: StatusCardConnectedProps) {
  const { snapshot, display, elapsed, selection, lottie: lottieMeta } = useStatusCard({ jobId, apiPrefix })
  const lottie = useLottieStageAnimation(lottieMeta.visualStageKey, {
    stageKey: lottieMeta.visualStageKey,
    current: display?.selectedProgress?.current as number,
    total: display?.selectedProgress?.total as number,
  })

  const statusSnapshot = useMemo(() => {
    if (!snapshot) return null
    return toStatusSnapshot(display, snapshot, elapsed.totalElapsedText || snapshot.elapsed || '-')
  }, [snapshot, display, elapsed])

  if (!statusSnapshot) {
    return (
      <section className="mx-auto grid h-[448px] w-full max-w-[580px] place-items-center rounded-[28px] border border-neutral-200 bg-white p-5">
        <span className="text-sm text-neutral-500">加载中…</span>
      </section>
    )
  }

  // keep progressPercent via status-progress.ts (pure)
  void progressPercent

  return (
    <StatusCard
      snapshot={statusSnapshot as never}
      className={className}
      selectedStage={selection.selectedStageKey as StageKey}
      onSelectStage={(stage) => selection.selectStage(stage)}
      lottie={{
        lottieRef: lottie.containerRef,
        hasStageAnimation: lottie.hasStageAnimation,
        isFallback: lottie.isFallback,
        visualStageKey: lottie.visualStageKey,
      }}
    />
  )
}

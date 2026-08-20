import { useState } from 'react'

import { StatusAnimationPanel } from './components/status-animation-panel'
import { StatusCardFooter } from './components/status-card-footer'
import { StatusCardHeader } from './components/status-card-header'
import { StatusProgressBlock } from './components/status-progress-block'
import { StatusResultActions } from './components/status-result-actions'
import { StatusStageFlow } from './components/status-stage-flow'
import { StatusSubstageFlow } from './components/status-substage-flow'
import { cn } from '@/lib/utils'
import type { StageKey, StatusSnapshot } from './types'

type StatusAnimationProps = {
  lottieRef?: React.RefObject<HTMLDivElement | null>
  hasStageAnimation?: boolean
  isFallback?: boolean
  visualStageKey?: string
}

type StatusCardProps = {
  snapshot: StatusSnapshot
  className?: string
  onSelectStage?: (stage: StageKey) => void
  lottie?: StatusAnimationProps
  /** Controlled selectedStage — when provided, Zustand store is the source of truth */
  selectedStage?: StageKey
}

export function StatusCard({ snapshot, className, onSelectStage, lottie, selectedStage: controlledSelected }: StatusCardProps) {
  const [localSelectedStage, setLocalSelectedStage] = useState<StageKey>()
  const selectedStage = controlledSelected ?? localSelectedStage ?? snapshot.selectedStage
  const selectedProgress = snapshot.stageProgress[selectedStage]

  function handleSelectStage(stage: StageKey) {
    // Keep local fallback for uncontrolled usage (composition still works)
    setLocalSelectedStage(stage === snapshot.selectedStage ? undefined : stage)
    onSelectStage?.(stage)
  }

  return (
    <section
      className={cn(
        'mx-auto grid h-[448px] w-full max-w-[580px] grid-rows-[auto_minmax(0,1fr)] rounded-[28px] border border-neutral-200 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <StatusCardHeader elapsedText={snapshot.elapsedText} />

      <div className="flex h-full flex-col items-center justify-center gap-2">
        <div className="grid h-[308px] w-full max-w-[520px] grid-rows-[auto_minmax(0,1fr)] items-center gap-2 rounded-[28px] border border-neutral-100 bg-white px-5 py-4 text-center">
          <StatusStageFlow activeStage={snapshot.activeStage} selectedStage={selectedStage} onSelectStage={handleSelectStage} />

          <div className="grid min-h-0 place-items-center gap-3">
            <StatusAnimationPanel
              errorText={snapshot.errorText}
              lottieRef={lottie?.lottieRef}
              hasStageAnimation={lottie?.hasStageAnimation}
              isFallback={lottie?.isFallback}
              visualStageKey={lottie?.visualStageKey}
            />

            {selectedStage === 'translate' ? <StatusSubstageFlow activeSubstage={selectedProgress?.substageKey} /> : null}

            {selectedStage !== 'done' ? (
              <StatusProgressBlock progress={selectedProgress} />
            ) : (
              <StatusResultActions pdfReady={snapshot.pdfReady} readerReady={snapshot.readerReady} />
            )}
          </div>
        </div>

        <StatusCardFooter />
      </div>
    </section>
  )
}

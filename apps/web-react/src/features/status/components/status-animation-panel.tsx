import { Loader2 } from 'lucide-react'

type StatusAnimationPanelProps = {
  errorText?: string
  /** Lottie via props — not HomeServices. Caller provides containerRef when stage has animation. */
  lottieRef?: React.RefObject<HTMLDivElement | null>
  hasStageAnimation?: boolean
  isFallback?: boolean
  visualStageKey?: string
}

export function StatusAnimationPanel({
  errorText,
  lottieRef,
  hasStageAnimation = false,
  isFallback = false,
  visualStageKey = '',
}: StatusAnimationPanelProps) {
  return (
    <>
      {errorText ? (
        <div className="line-clamp-2 w-full max-w-[360px] rounded-2xl bg-neutral-100 px-3 py-2 text-xs font-semibold leading-relaxed text-neutral-950">
          {errorText}
        </div>
      ) : null}

      <div className="grid h-32 place-items-center" data-visual-stage-key={visualStageKey}>
        {hasStageAnimation ? (
          <div
            ref={lottieRef}
            className={`grid size-24 place-items-center rounded-full border border-neutral-200 ${isFallback ? 'is-fallback' : ''}`}
            aria-label="任务阶段动画"
          />
        ) : (
          <div className="grid size-24 place-items-center rounded-full border border-neutral-200">
            <Loader2 className="size-9 animate-spin text-neutral-950" />
          </div>
        )}
      </div>
    </>
  )
}

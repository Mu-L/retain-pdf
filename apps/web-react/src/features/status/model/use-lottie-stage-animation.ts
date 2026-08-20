/**
 * Lottie stage animation — prop-driven, no HomeServices.
 * Animation paths come via props/config, not via HomeServices or js/components.
 * Mirrors apps/web/src/pages/home/features/status/useLottieStageAnimation.ts
 * but assets resolved via import.meta or props.
 */
import { useEffect, useMemo, useRef, useState } from 'react'

type StageAnimationMap = Record<string, string>

const DEFAULT_ANIMATIONS: StageAnimationMap = {
  queued: '/src/assets/animations/pdf_upload_Lottie.json',
  ocr: '/src/assets/animations/ocr_Lottie.json',
  translate: '/src/assets/animations/deepseek_lottie.json',
  render: '/src/assets/animations/typst_rendering.json',
  done: '/src/assets/animations/pdf_download_Lottie.json',
}

function resolveAnimationPath(map: StageAnimationMap, stageKey: string) {
  return map[`${stageKey || ''}`.trim()] || ''
}

function resolveLottieVendorUrl() {
  // web-react uses CDN or local build/player — fallback to unpkg if not resolving
  return (typeof window !== 'undefined' && (window as unknown as { __LOTTIE_URL__?: string }).__LOTTIE_URL__) || 'https://unpkg.com/lottie-web@5.12.2/build/player/lottie.min.js'
}

let lottieLoaderPromise: Promise<unknown> | null = null

function windowLottie(): { loadAnimation: (opts: unknown) => { destroy?: () => void; play?: () => void; setSpeed?: (v: number) => void } } | undefined {
  return (globalThis as unknown as { window?: { lottie?: unknown } }).window?.lottie as never
}

function loadLottieWeb(vendorUrl: string) {
  const existing = windowLottie()
  if (existing) return Promise.resolve(existing)
  if (lottieLoaderPromise) return lottieLoaderPromise
  lottieLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = vendorUrl
    script.async = true
    script.onload = () => {
      const lottie = windowLottie()
      return lottie ? resolve(lottie) : reject(new Error('lottie unavailable'))
    }
    script.onerror = () => reject(new Error('failed to load lottie-web'))
    document.head.appendChild(script)
  })
  return lottieLoaderPromise
}

export type UseLottieStageAnimationOptions = {
  animationMap?: StageAnimationMap
  vendorUrl?: string
}

export function useLottieStageAnimation(
  visualStageKey = '',
  progressSample: { stageKey?: string; current?: number; total?: number; progressUnit?: string } = {},
  options: UseLottieStageAnimationOptions = {},
) {
  const { animationMap = DEFAULT_ANIMATIONS, vendorUrl = resolveLottieVendorUrl() } = options
  const containerRef = useRef<HTMLDivElement | null>(null)
  const animationRef = useRef<{ destroy?: () => void; play?: () => void; setSpeed?: (n: number) => void } | null>(null)
  const desiredKeyRef = useRef('')
  const loadingKeyRef = useRef('')
  const [isFallback, setIsFallback] = useState(false)

  const normalized = `${visualStageKey || ''}`.trim()
  const animationPath = useMemo(() => resolveAnimationPath(animationMap, normalized), [animationMap, normalized])

  function clear() {
    animationRef.current?.destroy?.()
    animationRef.current = null
    if (containerRef.current) containerRef.current.innerHTML = ''
    setIsFallback(false)
  }

  useEffect(() => {
    desiredKeyRef.current = animationPath ? normalized : ''
    if (!animationPath) {
      clear()
      return
    }
    if (loadingKeyRef.current === normalized) return
    loadingKeyRef.current = normalized
    setIsFallback(false)
    if (animationRef.current) clear()
    loadLottieWeb(vendorUrl)
      .then((lottie: unknown) => {
        if (desiredKeyRef.current !== normalized) return
        const loader = lottie as { loadAnimation: (o: unknown) => unknown }
        animationRef.current = loader.loadAnimation({
          container: containerRef.current,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: animationPath,
        }) as never
      })
      .catch(() => {
        if (desiredKeyRef.current !== normalized) return
        setIsFallback(true)
      })
      .finally(() => {
        if (loadingKeyRef.current === normalized) loadingKeyRef.current = ''
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized, animationPath, vendorUrl])

  useEffect(() => () => clear(), [])

  // playback speed — keep minimal, avoid reading progressSample imperatively during render
  useEffect(() => {
    const { stageKey = '', current = NaN, total = NaN } = progressSample
    const normalizedStage = `${stageKey || ''}`.trim()
    if (!['ocr', 'translate', 'render'].includes(normalizedStage) || !Number.isFinite(Number(current)) || !Number.isFinite(Number(total))) return
    // speed logic kept simple; apps/web detailed speedForProgressDelta can be ported if needed
    animationRef.current?.setSpeed?.(1)
  }, [progressSample])

  return {
    containerRef,
    hasStageAnimation: Boolean(animationPath),
    isTranslationStage: normalized === 'translate',
    isFallback,
    visualStageKey: normalized,
  }
}

/**
 * Status UI state — Zustand store for selectedStage.
 * Port of apps/web/src/pages/home/features/status/useStageSelection.ts
 * but as global store so TanStack Query polling layer and StageFlow
 * can share without prop drilling. Replaces manualStageSelection in
 * mountStatusFeature's StatusCardStore.
 *
 * Shared hook — usable by both apps/web (via adapter) and apps/web-react.
 */
import { create } from 'zustand'
import { resolveSelectedStatusStage } from '@retainpdf/domain'

type StatusUiState = {
  currentJobId: string
  currentStageKey: string
  selectedStageKey: string
  manualSelection: boolean
  selectStage: (stageKey: string) => void
  sync: (jobId: string, currentStageKey: string) => void
  reset: () => void
}

const INITIAL = {
  currentJobId: '',
  currentStageKey: '',
  selectedStageKey: '',
  manualSelection: false,
}

export const useStatusUiStore = create<StatusUiState>((set) => ({
  ...INITIAL,
  selectStage: (stageKey: string) =>
    set((prev) => {
      const resolved = resolveSelectedStatusStage({
        currentStageKey: prev.currentStageKey,
        selectedStageKey: stageKey,
        manualStageSelection: true,
      })
      return {
        selectedStageKey: resolved.selectedStageKey,
        manualSelection: resolved.manualStageSelection,
      }
    }),
  sync: (jobId: string, currentStageKey: string) =>
    set((prev) => {
      const normalizedJobId = `${jobId || ''}`.trim()
      const normalizedStage = `${currentStageKey || ''}`.trim()
      const jobChanged = Boolean(normalizedJobId && normalizedJobId !== prev.currentJobId)
      const base = jobChanged
        ? { ...prev, currentJobId: normalizedJobId, selectedStageKey: '', manualSelection: false }
        : prev
      const stageAdvanced = Boolean(base.currentStageKey && base.currentStageKey !== normalizedStage)
      const nextManualSelection = stageAdvanced ? false : base.manualSelection
      const resolved = resolveSelectedStatusStage({
        currentStageKey: normalizedStage,
        selectedStageKey: base.selectedStageKey,
        manualStageSelection: nextManualSelection,
      })
      return {
        currentJobId: base.currentJobId,
        currentStageKey: normalizedStage,
        selectedStageKey: resolved.selectedStageKey,
        manualSelection: resolved.manualStageSelection,
      }
    }),
  reset: () => set({ ...INITIAL }),
}))

/**
 * Hook helper mirroring useStageSelection return shape
 * for drop-in replacement in StatusCard.
 */
export function useStatusStageSelection(_jobId: string, _currentStageKey: string) {
  const { selectedStageKey, manualSelection, selectStage, sync } = useStatusUiStore()
  // sync on jobId/currentStageKey change — effect lives in caller (useStatusCard)
  void _jobId
  void _currentStageKey
  return { selectedStageKey, manualSelection, selectStage, sync }
}

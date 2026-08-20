export { StatusCard } from './status-card'
export { statusStages, translationSubstages } from './status-config'
export { progressPercent } from './status-progress'
export type {
  StageKey,
  StageProgress,
  StatusSnapshot,
  SubstageKey,
} from './types'

// Phase2 slice: TanStack Query + Zustand hooks, replacing mountStatusFeature
export { useStatusUiStore, useStatusStageSelection } from './model/status-ui-store'
export { useStatusJobQuery, statusJobKeys } from './model/use-status-job-query'
export { useElapsedTicker } from './model/use-elapsed-ticker'
export { useStatusCard, useStatusCardFromSnapshot } from './model/use-status-card'
export { useLottieStageAnimation } from './model/use-lottie-stage-animation'
export { fetchStatusJob } from './api/status-job-api'

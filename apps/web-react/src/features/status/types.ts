/**
 * Status 阶段进度视图 — 轻量 UI 快照，底层 progress 形状以契约为准。
 * 真值: `packages/schemas/job-status.v1.schema.json` :: JobProgressView / JobStagesView / JobStageSnapshotView
 * TODO: 阶段进度类型改为从 job-status schema 生成，保持与 apps/web src/js/job-status/types.ts 一致。
 */
export type StageKey = 'ocr' | 'translate' | 'render' | 'done'

export type SubstageKey =
  | 'translation_batches'
  | 'continuation_review'
  | 'page_policies'
  | 'garbled'

export type StageProgress = {
  current?: number | null
  total?: number | null
  text?: string
  indeterminate?: boolean
  substageKey?: SubstageKey | ''
}

export type StatusSnapshot = {
  selectedStage: StageKey
  activeStage: StageKey
  elapsedText: string
  errorText?: string
  stageProgress: Partial<Record<StageKey, StageProgress>>
  pdfReady?: boolean
  readerReady?: boolean
}

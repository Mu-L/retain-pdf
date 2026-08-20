/**
 * Workflow constants — React-idiomatic port of
 *   apps/web/src/pages/home/features/workflow/workflow-config.ts
 *   apps/web/src/js/config/upload-constants.ts
 *   apps/web/src/js/config/workflow-defaults.ts
 *
 * Pure, framework agnostic. Could be promoted to packages/domain.
 * Import via @/features/workflow — no DOM coupling.
 */

export const WORKFLOW_BOOK = 'book' as const
export const WORKFLOW_TRANSLATE = 'translate' as const
export const WORKFLOW_RENDER = 'render' as const

export type WorkflowKind = typeof WORKFLOW_BOOK | typeof WORKFLOW_TRANSLATE | typeof WORKFLOW_RENDER | string

export const DEFAULT_FILE_LABEL = '点击选择文件或拖到这里'
export const FRONT_MAX_BYTES = 50 * 1024 * 1024
export const FRONT_MAX_PAGE_COUNT = 999

// Mirror workflow-defaults.ts — keep in sync with apps/web
export const WORKFLOW_DEFAULTS = {
  mode: 'sci',
  language: 'ch',
  ruleProfile: 'general_sci',
  renderMode: 'auto',
  typstFontFamily: 'Source Han Serif SC',
  pdfCompressDpi: 0,
  translatedPdfName: '',
  bodyFontSizeFactor: 0.95,
  bodyLeadingFactor: 1.08,
  innerBboxShrinkX: 0,
  innerBboxShrinkY: 0,
  innerBboxDenseShrinkX: 0,
  innerBboxDenseShrinkY: 0,
  fontUnifyMode: 'role_min',
  workers: 100,
  batchSize: 8,
  classifyBatchSize: 12,
  compileWorkers: 8,
  timeoutSeconds: 1800,
  modelVersion: '',
} as const

export function workflowConstants() {
  return {
    DEFAULT_WORKERS: WORKFLOW_DEFAULTS.workers,
    DEFAULT_BATCH_SIZE: WORKFLOW_DEFAULTS.batchSize,
    DEFAULT_CLASSIFY_BATCH_SIZE: WORKFLOW_DEFAULTS.classifyBatchSize,
    DEFAULT_COMPILE_WORKERS: WORKFLOW_DEFAULTS.compileWorkers,
    DEFAULT_TIMEOUT_SECONDS: WORKFLOW_DEFAULTS.timeoutSeconds,
    DEFAULT_MODEL_VERSION: WORKFLOW_DEFAULTS.modelVersion,
    DEFAULT_LANGUAGE: WORKFLOW_DEFAULTS.language,
    DEFAULT_MODE: WORKFLOW_DEFAULTS.mode,
    DEFAULT_RULE_PROFILE: WORKFLOW_DEFAULTS.ruleProfile,
    DEFAULT_RENDER_MODE: WORKFLOW_DEFAULTS.renderMode,
    DEFAULT_TYPST_FONT_FAMILY: WORKFLOW_DEFAULTS.typstFontFamily,
    DEFAULT_PDF_COMPRESS_DPI: WORKFLOW_DEFAULTS.pdfCompressDpi,
    DEFAULT_TRANSLATED_PDF_NAME: WORKFLOW_DEFAULTS.translatedPdfName,
    DEFAULT_BODY_FONT_SIZE_FACTOR: WORKFLOW_DEFAULTS.bodyFontSizeFactor,
    DEFAULT_BODY_LEADING_FACTOR: WORKFLOW_DEFAULTS.bodyLeadingFactor,
    DEFAULT_INNER_BBOX_SHRINK_X: WORKFLOW_DEFAULTS.innerBboxShrinkX,
    DEFAULT_INNER_BBOX_SHRINK_Y: WORKFLOW_DEFAULTS.innerBboxShrinkY,
    DEFAULT_INNER_BBOX_DENSE_SHRINK_X: WORKFLOW_DEFAULTS.innerBboxDenseShrinkX,
    DEFAULT_INNER_BBOX_DENSE_SHRINK_Y: WORKFLOW_DEFAULTS.innerBboxDenseShrinkY,
    DEFAULT_FONT_UNIFY_MODE: WORKFLOW_DEFAULTS.fontUnifyMode,
    WORKFLOW_BOOK,
    WORKFLOW_TRANSLATE,
    WORKFLOW_RENDER,
  }
}

export function normalizeWorkflow(
  value: unknown,
  opts: { book?: string; translate?: string; render?: string } = {},
): string {
  const book = opts.book ?? WORKFLOW_BOOK
  const translate = opts.translate ?? WORKFLOW_TRANSLATE
  const render = opts.render ?? WORKFLOW_RENDER
  const workflow = `${value ?? ''}`.trim()
  if (workflow === translate || workflow === render) return workflow
  return book
}

export function normalizeMathMode(value: unknown): string {
  return `${value ?? ''}`.trim() === 'placeholder' ? 'placeholder' : 'direct_typst'
}

export function workflowNeedsUpload(workflow: string, constants = workflowConstants()): boolean {
  return workflow !== constants.WORKFLOW_RENDER
}

export function workflowNeedsCredentials(workflow: string, constants = workflowConstants()): boolean {
  return workflow !== constants.WORKFLOW_RENDER
}

export function workflowUsesRenderStage(workflow: string, constants = workflowConstants()): boolean {
  return workflow === constants.WORKFLOW_BOOK || workflow === constants.WORKFLOW_RENDER
}

export function workflowSubmitLabel(workflow: string, constants = workflowConstants()): string {
  switch (workflow) {
    case constants.WORKFLOW_RENDER:
      return '开始渲染'
    case constants.WORKFLOW_TRANSLATE:
    case constants.WORKFLOW_BOOK:
    default:
      return '直接翻译'
  }
}

export function workflowHeadline(workflow: string, constants = workflowConstants()): string {
  switch (workflow) {
    case constants.WORKFLOW_RENDER:
      return '当前工作流会复用已有任务产物重新生成 PDF。'
    default:
      return '选择 PDF 后，可直接翻译或仅收藏到书架。'
  }
}

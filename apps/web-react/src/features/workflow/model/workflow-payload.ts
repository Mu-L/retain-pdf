/**
 * Workflow payload builders — React port of
 *   apps/web/src/js/features/workflow/payload.ts
 *
 * Pure. Shareable.
 */

export type WorkflowDeveloperConfig = {
  workflow?: string
  renderSourceJobId?: string
  mathMode?: string
  model?: string
  baseUrl?: string
  glossaryId?: string
  workers?: number
  batchSize?: number
  classifyBatchSize?: number
  compileWorkers?: number
  timeoutSeconds?: number
  translateTitles?: boolean
  typstFontFamily?: string
  typst_font_family?: string
  [key: string]: unknown
}

export type WorkflowPayloadConstants = {
  DEFAULT_MODEL_VERSION?: string
  DEFAULT_LANGUAGE?: string
  DEFAULT_MODE?: string
  DEFAULT_RULE_PROFILE?: string
  DEFAULT_RENDER_MODE?: string
  DEFAULT_TYPST_FONT_FAMILY?: string
  DEFAULT_PDF_COMPRESS_DPI?: number
  DEFAULT_TRANSLATED_PDF_NAME?: string
  DEFAULT_BODY_FONT_SIZE_FACTOR?: number
  DEFAULT_BODY_LEADING_FACTOR?: number
  DEFAULT_INNER_BBOX_SHRINK_X?: number
  DEFAULT_INNER_BBOX_SHRINK_Y?: number
  DEFAULT_INNER_BBOX_DENSE_SHRINK_X?: number
  DEFAULT_INNER_BBOX_DENSE_SHRINK_Y?: number
  DEFAULT_FONT_UNIFY_MODE?: string
  [key: string]: unknown
}

const OCR_PROVIDER_DEFINITIONS: Record<string, { tokenField: string }> = {
  paddle: { tokenField: 'paddle_token' },
}

function normalizeOcrProvider(value?: string): string {
  const v = `${value ?? ''}`.trim().toLowerCase()
  return v in OCR_PROVIDER_DEFINITIONS ? v : 'paddle'
}

function getOcrProviderDefinition(provider: string) {
  const id = normalizeOcrProvider(provider)
  return { id, tokenField: OCR_PROVIDER_DEFINITIONS[id].tokenField }
}

export function buildSourcePayload({
  workflow,
  developerConfig,
  uploadId,
  workflowNeedsUpload,
}: {
  workflow: string
  developerConfig: Pick<WorkflowDeveloperConfig, 'renderSourceJobId'>
  uploadId?: string
  workflowNeedsUpload: (workflow?: string) => boolean
}) {
  return workflowNeedsUpload(workflow) ? { upload_id: uploadId } : { artifact_job_id: developerConfig.renderSourceJobId }
}

export function buildOcrPayload({
  pageRanges,
  ocrProvider,
  ocrToken,
  defaultPaddleApiUrl,
  constants,
}: {
  pageRanges?: string
  ocrProvider?: string
  ocrToken?: string
  defaultPaddleApiUrl: () => string
  constants: WorkflowPayloadConstants
}) {
  const provider = normalizeOcrProvider(ocrProvider)
  const definition = getOcrProviderDefinition(provider)
  const payload: Record<string, unknown> = {
    provider,
    [definition.tokenField]: ocrToken || '',
    model_version: constants.DEFAULT_MODEL_VERSION,
    language: constants.DEFAULT_LANGUAGE,
    page_ranges: pageRanges,
  }
  if (definition.id === 'paddle') {
    payload.paddle_api_url = defaultPaddleApiUrl() || 'https://paddleocr.aistudio-app.com'
  }
  return payload
}

export function buildTranslationPayload({
  developerConfig,
  modelApiKey,
  selectedGlossaryId,
  constants,
}: {
  developerConfig: WorkflowDeveloperConfig
  modelApiKey?: string
  selectedGlossaryId?: string
  constants: WorkflowPayloadConstants
}) {
  return {
    mode: constants.DEFAULT_MODE,
    math_mode: developerConfig.mathMode,
    model: developerConfig.model,
    base_url: developerConfig.baseUrl,
    api_key: modelApiKey || '',
    workers: developerConfig.workers,
    batch_size: developerConfig.batchSize,
    classify_batch_size: developerConfig.classifyBatchSize,
    rule_profile_name: constants.DEFAULT_RULE_PROFILE,
    custom_rules_text: '',
    glossary_id: selectedGlossaryId || (developerConfig.glossaryId as string) || '',
    glossary_entries: [],
    skip_title_translation: !(developerConfig.translateTitles as boolean),
  }
}

function resolveStoredFontFamilyReact(fallback: unknown): string {
  const fb = `${fallback || ''}`.trim()
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = `${localStorage.getItem('retainpdf.render.typst_font_family') || ''}`.trim()
      if (stored) return stored
    }
  } catch {}
  return fb
}

export function buildRenderPayload({
  developerConfig,
  constants,
}: {
  developerConfig: Pick<WorkflowDeveloperConfig, 'compileWorkers' | 'typstFontFamily' | 'typst_font_family'>
  constants: WorkflowPayloadConstants
}) {
  const cfg = developerConfig as WorkflowDeveloperConfig
  const cfgFont = `${(cfg.typstFontFamily as string) || (cfg.typst_font_family as string) || ''}`.trim()
  const storedFont = resolveStoredFontFamilyReact(constants.DEFAULT_TYPST_FONT_FAMILY)
  const typstFont = cfgFont || storedFont || `${constants.DEFAULT_TYPST_FONT_FAMILY || ''}`.trim() || 'Source Han Serif SC'
  return {
    render_mode: constants.DEFAULT_RENDER_MODE,
    compile_workers: (developerConfig as WorkflowDeveloperConfig).compileWorkers,
    typst_font_family: typstFont,
    pdf_compress_dpi: constants.DEFAULT_PDF_COMPRESS_DPI,
    translated_pdf_name: constants.DEFAULT_TRANSLATED_PDF_NAME,
    body_font_size_factor: constants.DEFAULT_BODY_FONT_SIZE_FACTOR,
    body_leading_factor: constants.DEFAULT_BODY_LEADING_FACTOR,
    inner_bbox_shrink_x: constants.DEFAULT_INNER_BBOX_SHRINK_X,
    inner_bbox_shrink_y: constants.DEFAULT_INNER_BBOX_SHRINK_Y,
    inner_bbox_dense_shrink_x: constants.DEFAULT_INNER_BBOX_DENSE_SHRINK_X,
    inner_bbox_dense_shrink_y: constants.DEFAULT_INNER_BBOX_DENSE_SHRINK_Y,
    font_unify_mode: constants.DEFAULT_FONT_UNIFY_MODE,
  }
}

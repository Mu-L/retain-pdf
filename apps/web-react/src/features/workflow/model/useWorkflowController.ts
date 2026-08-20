/**
 * useWorkflowController — React-idiomatic port of
 *   apps/web/src/js/features/workflow/controller.ts  (mountWorkflowFeature)
 *
 * Composes:
 *  - workflow constants / normalization
 *  - budget resolution (resolveTranslationBudgetState)
 *  - submit readiness (TanStack-friendly derived state, no direct DOM)
 *  - glossary options via TanStack Query
 *  - developer config defaults
 *  - payload builders (ocr/translation/render/source)
 *
 * Keeps apps/web untouched; web-react consumes via hook + Zustand stores.
 */
import { useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { API_PREFIX } from '@retainpdf/api/internal/runtime'
import { fetchGlossaries } from '@retainpdf/api/glossaries'

import { resolveTranslationBudgetState } from './budget'
import {
  normalizeWorkflow,
  normalizeMathMode,
  workflowConstants,
  workflowHeadline,
  workflowNeedsCredentials as needsCredentialsPure,
  workflowNeedsUpload as needsUploadPure,
  workflowSubmitLabel as submitLabelPure,
  workflowUsesRenderStage,
  type WorkflowKind,
} from './workflow-constants'
import { getWorkflowStore, type WorkflowStore } from './workflow-store'
import { getUploadStore, type UploadStore } from './upload-store'

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
  [key: string]: unknown
}

export type UseWorkflowControllerOptions = {
  workflowStore?: WorkflowStore
  uploadStore?: UploadStore
  getDeveloperConfig?: () => WorkflowDeveloperConfig | null | undefined
  getDeepSeekBalanceState?: () => { balanceCny?: number | null; balanceChecked?: boolean }
  isDesktopMode?: () => boolean
  hasBrowserCredentials?: () => boolean
  defaultModelName?: () => string
  defaultModelBaseUrl?: () => string
  defaultPaddleApiUrl?: () => string
  defaultPaddleToken?: () => string
  defaultOcrProvider?: () => string
  defaultModelApiKey?: () => string
  apiPrefix?: string
  isMock?: boolean
  mockScenario?: string
}

function positiveInteger(value: unknown, fallback: number): number {
  const fallbackNumber = Number(fallback)
  const normalizedFallback = Number.isFinite(fallbackNumber) && fallbackNumber > 0 ? Math.floor(fallbackNumber) : 1
  const number = Number(value)
  if (!Number.isFinite(number) || number <= 0) return normalizedFallback
  return Math.floor(number)
}

export function buildDeveloperConfigWithDefaults({
  saved,
  defaults,
  defaultModelName,
  defaultModelBaseUrl,
}: {
  saved: WorkflowDeveloperConfig | null | undefined
  defaults: { workers: number; batchSize: number; classifyBatchSize: number; compileWorkers: number; timeoutSeconds: number }
  defaultModelName: () => string
  defaultModelBaseUrl: () => string
}): Required<WorkflowDeveloperConfig> & { glossaryId: string } {
  const source = (saved || {}) as WorkflowDeveloperConfig
  return {
    workflow: normalizeWorkflow(source.workflow),
    renderSourceJobId: `${source.renderSourceJobId || ''}`.trim(),
    mathMode: normalizeMathMode(source.mathMode),
    model: (source.model as string) || defaultModelName(),
    baseUrl: (source.baseUrl as string) || defaultModelBaseUrl(),
    glossaryId: `${(source as any).glossaryId || (source as any).glossary_id || ''}`.trim(),
    workers: positiveInteger(source.workers, defaults.workers),
    batchSize: positiveInteger(source.batchSize, defaults.batchSize),
    classifyBatchSize: positiveInteger(source.classifyBatchSize, defaults.classifyBatchSize),
    compileWorkers: positiveInteger(source.compileWorkers, defaults.compileWorkers),
    timeoutSeconds: positiveInteger(source.timeoutSeconds, defaults.timeoutSeconds),
    translateTitles: (source as any).translateTitles !== false,
  } as any
}

// Re-export pure payload builders for caller convenience (thin wrappers over domain-ish pure fns)
import {
  buildOcrPayload as buildOcrPayloadPure,
  buildTranslationPayload as buildTranslationPayloadPure,
  buildRenderPayload as buildRenderPayloadPure,
  buildSourcePayload as buildSourcePayloadPure,
} from './workflow-payload'

export { buildOcrPayloadPure, buildTranslationPayloadPure, buildRenderPayloadPure, buildSourcePayloadPure }

export function useWorkflowController(options: UseWorkflowControllerOptions = {}) {
  const {
    workflowStore = getWorkflowStore(),
    uploadStore = getUploadStore(),
    getDeveloperConfig,
    getDeepSeekBalanceState,
    isDesktopMode,
    hasBrowserCredentials,
    defaultModelName = () => '',
    defaultModelBaseUrl = () => '',
    defaultPaddleApiUrl = () => '',
    defaultPaddleToken = () => '',
    defaultOcrProvider = () => 'paddle',
    defaultModelApiKey = () => '',
    apiPrefix = API_PREFIX,
    isMock = false,
    mockScenario = 'running',
  } = options

  const constants = useMemo(() => workflowConstants(), [])

  const developerConfigWithDefaults = useCallback(() => {
    const saved = getDeveloperConfig?.() as WorkflowDeveloperConfig | null | undefined
    return buildDeveloperConfigWithDefaults({
      saved,
      defaults: {
        workers: constants.DEFAULT_WORKERS,
        batchSize: constants.DEFAULT_BATCH_SIZE,
        classifyBatchSize: constants.DEFAULT_CLASSIFY_BATCH_SIZE,
        compileWorkers: constants.DEFAULT_COMPILE_WORKERS,
        timeoutSeconds: constants.DEFAULT_TIMEOUT_SECONDS,
      },
      defaultModelName,
      defaultModelBaseUrl,
    })
  }, [getDeveloperConfig, constants, defaultModelName, defaultModelBaseUrl])

  const currentWorkflow = useCallback(() => developerConfigWithDefaults().workflow as WorkflowKind, [developerConfigWithDefaults])

  const workflowNeedsUpload = useCallback((w = currentWorkflow()) => needsUploadPure(w, constants), [currentWorkflow, constants])
  const workflowNeedsCredentials = useCallback((w = currentWorkflow()) => needsCredentialsPure(w, constants), [currentWorkflow, constants])
  const workflowSubmitLabel = useCallback((w = currentWorkflow()) => submitLabelPure(w, constants), [currentWorkflow, constants])

  const uploadSnap = uploadStore.getState()

  // Glossaries via TanStack Query (replaces glossary-options.js loader)
  const glossariesQuery = useQuery({
    queryKey: ['workflow', 'glossaries', apiPrefix],
    queryFn: () => fetchGlossaries(apiPrefix),
    staleTime: 30_000,
    select: (data: any) => {
      const items = Array.isArray((data as any)?.items) ? (data as any).items : Array.isArray(data) ? data : []
      return items as Array<Record<string, unknown>>
    },
  })

  // Sync glossaries into workflow store (parity with mountWorkflowFeature's loader)
  // Caller can call loadGlossaryOptions explicitly; here we auto-sync when query succeeds.
  const glossaries = (glossariesQuery.data as any[]) ?? []
  // Avoid effect-in-render; provide imperative sync function
  const applyGlossaryOptions = useCallback(
    (selectedId = developerConfigWithDefaults().glossaryId) => {
      workflowStore.getState().setDeveloperGlossaryOptions(glossaries as any, selectedId)
    },
    [glossaries, workflowStore, developerConfigWithDefaults],
  )

  const currentBudgetState = useCallback(
    (workflow = currentWorkflow()) => {
      const upload = uploadStore.getState()
      const balance = getDeepSeekBalanceState?.() ?? { balanceCny: null, balanceChecked: false }
      const needsTranslation =
        workflowNeedsUpload(workflow) &&
        (workflow === constants.WORKFLOW_BOOK || workflow === constants.WORKFLOW_TRANSLATE) &&
        Boolean(upload.uploadId)
      return resolveTranslationBudgetState({
        pageRanges: upload.appliedPageRange || `${upload.pageRangeStart || ''}${upload.pageRangeEnd ? `-${upload.pageRangeEnd}` : ''}`.replace(/^-$/, ''),
        uploadedPageCount: upload.uploadedPageCount,
        balanceCny: balance.balanceCny ?? null,
        balanceChecked: Boolean(balance.balanceChecked),
        needsTranslation,
      })
    },
    [currentWorkflow, workflowNeedsUpload, constants, uploadStore, getDeepSeekBalanceState],
  )

  // Derived submit readiness (pure, no DOM)
  const submitReadiness = useMemo(() => {
    const workflow = currentWorkflow()
    const upload = uploadStore.getState()
    const budget = currentBudgetState(workflow)
    const needsUpload = workflowNeedsUpload(workflow)
    const needsCredentials = workflowNeedsCredentials(workflow)
    const renderSourceJobId = developerConfigWithDefaults().renderSourceJobId
    // Minimal readiness mirror of submit-readiness-contract.ts
    const uploadReady = Boolean(upload.uploadId)
    const renderReady = Boolean(renderSourceJobId)
    const blocking = budget.blocking
    const hasCredentials = Boolean(hasBrowserCredentials?.())
    const desktopMode = Boolean(isDesktopMode?.())
    let reason = ''
    if (!isMock) {
      if (!desktopMode && needsCredentials && !hasCredentials) reason = 'missing_credentials'
      else if (needsUpload && !uploadReady) reason = 'missing_upload'
      else if (!needsUpload && !renderReady) reason = 'missing_render_source'
      else if (blocking) reason = 'budget_blocking'
    }
    const ready = isMock || reason === ''
    return {
      workflow,
      needsUpload,
      needsCredentials,
      uploadReady,
      renderReady,
      budgetBlocking: blocking,
      ready,
      reason,
      blocking,
      hasCredentials,
      desktopMode,
    }
  }, [currentWorkflow, currentBudgetState, workflowNeedsUpload, workflowNeedsCredentials, developerConfigWithDefaults, hasBrowserCredentials, isDesktopMode, isMock, uploadSnap.uploadId])

  const refreshSubmitControls = useCallback(() => {
    const workflow = currentWorkflow()
    const upload = uploadStore.getState()
    const budget = currentBudgetState(workflow)
    workflowStore.getState().renderBudgetNote(budget as any)
    const label = workflowSubmitLabel(workflow)
    const needsUpload = workflowNeedsUpload(workflow)
    // Apply actionVisible / pageRangeVisible parity with submit-controls.ts
    const actionVisible = submitReadiness.ready || (!submitReadiness.reason || submitReadiness.reason === 'budget_blocking')
    workflowStore.getState().setSubmitControls({
      disabled: !submitReadiness.ready,
      label,
      actionVisible: isMock ? true : actionVisible,
      pageRangeVisible: needsUpload,
    })
    // Also sync upload tile action slot visible (mirror original applyWorkflowMode wiring)
    uploadStore.getState().patch({ actionSlotVisible: isMock ? true : actionVisible } as any)
    return { budget, readiness: submitReadiness }
  }, [currentWorkflow, currentBudgetState, workflowSubmitLabel, workflowNeedsUpload, submitReadiness, isMock, workflowStore, uploadStore])

  const applyWorkflowMode = useCallback(() => {
    const workflow = currentWorkflow()
    const needsUpload = workflowNeedsUpload(workflow)
    if (isMock) {
      workflowStore.getState().applyMockUpload({
        mockScenario,
        submitLabel: workflowSubmitLabel(workflow),
        showPageRangeButton: needsUpload,
      })
      uploadStore.getState().setInlinePageRangeVisible(false)
      return
    }
    const upload = uploadStore.getState()
    const headline = workflowHeadline(workflow, constants)
    // upload tile headline is stored as help
    uploadStore.getState().patch({
      tileLocked: !needsUpload,
      tileEnabled: needsUpload,
      help: headline,
      label: !upload.uploadId ? (needsUpload ? '添加 PDF' : '复用已有任务产物') : upload.label,
    } as any)
    // Render source hint
    if (!needsUpload) {
      const renderSourceJobId = developerConfigWithDefaults().renderSourceJobId
      uploadStore.getState().patch({
        status: renderSourceJobId ? `当前将复用任务: ${renderSourceJobId}` : '请先在开发者设置里填写 Render 源任务 ID。',
        statusVisible: true,
      } as any)
    }
    uploadStore.getState().setInlinePageRangeVisible(needsUpload && Boolean(upload.uploadId))
    refreshSubmitControls()
  }, [currentWorkflow, workflowNeedsUpload, workflowSubmitLabel, constants, isMock, mockScenario, workflowStore, uploadStore, developerConfigWithDefaults, refreshSubmitControls])

  const buildOcrPayload = useCallback(
    (pageRanges: string, submitValues?: { ocrProvider?: string; ocrToken?: string }) => {
      const v = submitValues ?? {
        ocrProvider: defaultOcrProvider(),
        ocrToken: defaultPaddleToken(),
      }
      return buildOcrPayloadPure({
        pageRanges,
        ocrProvider: v.ocrProvider,
        ocrToken: v.ocrToken,
        defaultPaddleApiUrl,
        constants,
      })
    },
    [defaultOcrProvider, defaultPaddleToken, defaultPaddleApiUrl, constants],
  )

  const buildTranslationPayload = useCallback(
    (cfg: WorkflowDeveloperConfig, submitValues?: { modelApiKey?: string; selectedGlossaryId?: string }) => {
      const v = submitValues ?? {
        modelApiKey: defaultModelApiKey(),
        selectedGlossaryId: workflowStore.getState().selectedGlossaryIdValue(),
      }
      return buildTranslationPayloadPure({
        developerConfig: cfg as any,
        modelApiKey: v.modelApiKey,
        selectedGlossaryId: v.selectedGlossaryId,
        constants,
      })
    },
    [defaultModelApiKey, workflowStore, constants],
  )

  const collectRunPayload = useCallback(() => {
    const upload = uploadStore.getState()
    const pageRanges = upload.appliedPageRange || `${upload.pageRangeStart || ''}${upload.pageRangeEnd ? `-${upload.pageRangeEnd}` : ''}`.replace(/^-$/, '')
    const cfg = developerConfigWithDefaults()
    const workflow = cfg.workflow
    const payload: any = {
      workflow,
      source: buildSourcePayloadPure({
        workflow,
        developerConfig: cfg as any,
        uploadId: upload.uploadId,
        workflowNeedsUpload,
      }),
      runtime: { job_id: '', timeout_seconds: cfg.timeoutSeconds },
    }
    if (workflow === constants.WORKFLOW_BOOK || workflow === constants.WORKFLOW_TRANSLATE) {
      payload.ocr = buildOcrPayload(pageRanges)
      payload.translation = buildTranslationPayload(cfg)
    }
    if (workflowUsesRenderStage(workflow, constants)) {
      payload.render = buildRenderPayloadPure({ developerConfig: cfg as any, constants })
    }
    return payload
  }, [uploadStore, developerConfigWithDefaults, workflowNeedsUpload, constants, buildOcrPayload, buildTranslationPayload])

  const buildTranslateJobConfig = useCallback(
    (pageRanges = '') => {
      const cfg = developerConfigWithDefaults()
      return {
        ocr: buildOcrPayload(pageRanges),
        translation: buildTranslationPayload(cfg),
      }
    },
    [developerConfigWithDefaults, buildOcrPayload, buildTranslationPayload],
  )

  return {
    // stores for direct subscription in components
    workflowStore,
    uploadStore,
    constants,
    // parity surface with mountWorkflowFeature
    applyWorkflowMode,
    buildTranslateJobConfig,
    collectRunPayload,
    currentWorkflow,
    currentBudgetState,
    developerConfigWithDefaults,
    refreshSubmitControls,
    workflowNeedsCredentials,
    workflowNeedsUpload,
    workflowSubmitLabel,
    // TanStack wiring
    glossariesQuery,
    applyGlossaryOptions,
    submitReadiness,
    buildOcrPayload,
    buildTranslationPayload,
  }
}

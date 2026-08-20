/**
 * Workflow view store — Zustand port of
 *   apps/web/src/pages/home/features/workflow/workflow-view-store.ts
 *
 * View-only. Domain workflow decision (needsUpload etc.) stays in workflow-constants.
 * Budget rendering + submit controls are derived, not stored — but we cache the latest
 * budget note and submit label/disabled for render parity.
 */
import { create } from 'zustand'
import type { BudgetState } from './budget'

export type WorkflowGlossaryOption = {
  glossaryId: string
  name: string
  entryCount: number | null
}

export type WorkflowGlossarySource = {
  glossary_id?: string
  name?: string
  entry_count?: number | string | null
  [key: string]: unknown
}

export type WorkflowDeveloperDialog = {
  workflow?: string
  renderSourceJobId?: string
  model?: unknown
  baseUrl?: unknown
  glossaryId?: string
  workers?: unknown
  batchSize?: unknown
  classifyBatchSize?: unknown
  compileWorkers?: unknown
  timeoutSeconds?: unknown
  [key: string]: unknown
}

export type WorkflowViewState = {
  submitLabel: string
  submitDisabled: boolean
  submitBusy: boolean
  pageRangeButtonVisible: boolean
  budget: BudgetState
  jobWarningVisible: boolean
  glossaries: WorkflowGlossaryOption[]
  selectedGlossaryId: string
  developerDialog: WorkflowDeveloperDialog
  developerFormState: Record<string, unknown>
}

type WorkflowViewActions = {
  patch: (payload: Partial<WorkflowViewState>) => void
  setSubmitBusy: (busy: boolean) => void
  setSubmitDisabled: (disabled: boolean) => void
  selectedGlossaryIdValue: () => string
  setSelectedGlossaryId: (value: string) => void
  setJobWarningVisible: (visible: boolean) => void
  setSubmitControls: (state: {
    disabled?: boolean
    label?: string
    actionVisible?: boolean
    pageRangeVisible?: boolean
  }) => void
  renderBudgetNote: (budget?: Partial<BudgetState> | null) => void
  applyMockUpload: (opts: { mockScenario?: string; submitLabel?: string; showPageRangeButton?: boolean }) => void
  applyWorkflowUpload: (opts: {
    needsUpload?: boolean
    uploadReady?: boolean
    defaultFileLabel?: string
    headline?: string
    renderSourceJobId?: string
  }) => void
  setDeveloperGlossaryOptions: (glossaries?: WorkflowGlossarySource[], selectedId?: string) => void
  setDeveloperDialog: (config: WorkflowDeveloperDialog) => void
  readDeveloperDialog: (defaults?: Partial<WorkflowDeveloperDialog>) => WorkflowDeveloperDialog
  readDeveloperWorkflow: () => string | undefined
  setDeveloperWorkflowFormState: (payload: Record<string, unknown>) => void
}

export type WorkflowStore = ReturnType<typeof createWorkflowStore>

function emptyBudget(): BudgetState {
  return {
    visible: false,
    tone: '',
    message: '',
    blocking: false,
    pageCount: 0,
    estimatedCost: 0,
    balanceCny: null,
    balanceChecked: false,
    topUpUrl: '',
  }
}

export function createWorkflowStore() {
  return create<WorkflowViewState & WorkflowViewActions>((set, get) => ({
    submitLabel: '直接翻译',
    submitDisabled: true,
    submitBusy: false,
    pageRangeButtonVisible: true,
    budget: emptyBudget(),
    jobWarningVisible: false,
    glossaries: [],
    selectedGlossaryId: '',
    developerDialog: {},
    developerFormState: {},

    patch: (payload) => set((s) => ({ ...s, ...payload })),

    setSubmitBusy: (busy) => set((s) => ({ ...s, submitBusy: Boolean(busy) })),
    setSubmitDisabled: (disabled) => set((s) => ({ ...s, submitDisabled: Boolean(disabled) })),

    selectedGlossaryIdValue: () => `${get().selectedGlossaryId || ''}`.trim(),
    setSelectedGlossaryId: (value) => set((s) => ({ ...s, selectedGlossaryId: `${value || ''}`.trim() })),
    setJobWarningVisible: (visible) => set((s) => ({ ...s, jobWarningVisible: Boolean(visible) })),

    setSubmitControls: ({ disabled, label, pageRangeVisible }) =>
      set((s) => ({
        ...s,
        submitDisabled: Boolean(disabled),
        submitLabel: `${label ?? ''}` || s.submitLabel,
        pageRangeButtonVisible: Boolean(pageRangeVisible),
        // actionVisible is consumed by UploadTile via separate signal; kept for parity
      })),

    renderBudgetNote: (budget) =>
      set((s) => ({
        ...s,
        budget: {
          visible: Boolean(budget?.visible),
          tone: `${budget?.tone || ''}`,
          message: `${budget?.message || ''}`,
          blocking: Boolean(budget?.blocking),
          topUpUrl: `${budget?.topUpUrl || ''}`,
          pageCount: Number((budget as any)?.pageCount ?? s.budget.pageCount) || 0,
          estimatedCost: Number((budget as any)?.estimatedCost ?? s.budget.estimatedCost) || 0,
          balanceCny: (budget as any)?.balanceCny ?? s.budget.balanceCny,
          balanceChecked: Boolean((budget as any)?.balanceChecked ?? s.budget.balanceChecked),
        },
      })),

    applyMockUpload: ({ submitLabel, showPageRangeButton }) =>
      set((s) => ({
        ...s,
        submitDisabled: false,
        submitLabel: submitLabel || s.submitLabel,
        pageRangeButtonVisible: Boolean(showPageRangeButton),
      })),

    applyWorkflowUpload: ({}) => {
      // Headline / tile locking is owned by upload store; workflow only toggles pageRangeButton elsewhere.
      // Keep as no-op shell for controller parity — actual visibility is set via setSubmitControls by useWorkflowController.
    },

    setDeveloperGlossaryOptions: (glossaries = [], selectedId = '') =>
      set((s) => ({
        ...s,
        glossaries: (Array.isArray(glossaries) ? glossaries : [])
          .map((g) => ({
            glossaryId: `${(g as any)?.glossary_id || ''}`.trim(),
            name: `${(g as any)?.name || (g as any)?.glossary_id || ''}`.trim(),
            entryCount: Number.isFinite(Number((g as any)?.entry_count)) ? Number((g as any).entry_count) : null,
          }))
          .filter((g) => g.glossaryId),
        selectedGlossaryId: `${selectedId || ''}`.trim(),
      })),

    setDeveloperDialog: (config = {}) => set((s) => ({ ...s, developerDialog: { ...config } })),

    readDeveloperDialog: (defaults = {}) => {
      const saved = get().developerDialog || {}
      return {
        workflow: saved.workflow,
        renderSourceJobId: `${(saved as any).renderSourceJobId || ''}`.trim(),
        model: (saved as any).model || (defaults as any).model,
        baseUrl: (saved as any).baseUrl || (defaults as any).baseUrl,
        glossaryId: get().selectedGlossaryIdValue() || `${(saved as any).glossaryId || ''}`.trim(),
        workers: (saved as any).workers ?? (defaults as any).workers,
        batchSize: (saved as any).batchSize ?? (defaults as any).batchSize,
        classifyBatchSize: (saved as any).classifyBatchSize ?? (defaults as any).classifyBatchSize,
        compileWorkers: (saved as any).compileWorkers ?? (defaults as any).compileWorkers,
        timeoutSeconds: (saved as any).timeoutSeconds ?? (defaults as any).timeoutSeconds,
      }
    },

    readDeveloperWorkflow: () => get().developerDialog?.workflow as string | undefined,

    setDeveloperWorkflowFormState: (payload = {}) => set((s) => ({ ...s, developerFormState: { ...payload } })),
  }))
}

let defaultWorkflowStore: WorkflowStore | null = null
export function getWorkflowStore(): WorkflowStore {
  if (!defaultWorkflowStore) defaultWorkflowStore = createWorkflowStore()
  return defaultWorkflowStore
}

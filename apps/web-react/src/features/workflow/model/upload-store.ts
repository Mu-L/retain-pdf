/**
 * Upload store — Zustand equivalent of
 *   apps/web/src/pages/home/features/workflow/stores/upload-store.ts
 *   apps/web/src/js/features/upload/state.ts
 *
 * Single store merges domain state (uploadId … appliedPageRange, submitBusy)
 * with view state (tile/pageRange fields, progress). No structuredClone issue
 * because File lives in a ref, not the store (same constraint as apps/web).
 *
 * TanStack Query owns the async mutation; this store owns synchronous UI state.
 */
import { create } from 'zustand'

export type UploadState = {
  uploadId: string
  uploadedFileName: string
  uploadedPageCount: number
  uploadedBytes: number
  appliedPageRange: string
  submitBusy: boolean
}

export type UploadViewState = {
  tileLocked: boolean
  tileEnabled: boolean
  ready: boolean
  uploading: boolean
  label: string
  labelTitle: string
  labelVisible: boolean
  help: string
  helpVisible: boolean
  status: string
  statusVisible: boolean
  progressVisible: boolean
  progressPercent: number
  progressText: string
  actionSlotVisible: boolean
  inlinePageRangeVisible: boolean
  pageRangeStart: string
  pageRangeEnd: string
  pageRangeMax: number
  pageRangeDialogOpen: boolean
  credentialGateVisible: boolean
}

export type UploadStoreState = UploadState & UploadViewState & {
  // derived
  currentPageRanges: string
}

type UploadStoreActions = {
  patch: (payload: Partial<UploadStoreState>) => void
  setUpload: (payload: Partial<UploadState>) => void
  setAppliedPageRange: (value: string) => void
  clearAppliedPageRange: () => void
  reset: (opts?: { includePageRange?: boolean }) => void
  setSubmitBusy: (busy: boolean) => void

  // view conveniences
  setUploadProgress: (loaded: number, total: number) => void
  resetUploadProgress: () => void
  clearPageRanges: () => void
  openPageRangeDialog: (maxPage?: number) => void
  closePageRangeDialog: () => void
  writePageRanges: (parts: { start?: string; end?: string }) => void
  markUploadReady: (ready: boolean) => void
  setInlinePageRangeVisible: (visible: boolean) => void
  setFileLabel: (file: { name?: string } | null, defaultLabel: string) => void
  showUploadStatus: (message: string) => void
  setUploadTileLocked: (opts: { locked?: boolean; enabled?: boolean }) => void
  setUploadTileText: (opts: {
    label?: string
    labelTitle?: string
    help?: string
    status?: string
    statusVisible?: boolean | null
    labelVisible?: boolean
    helpVisible?: boolean
  }) => void
  resetUploadedFileView: () => void
}

export type UploadStore = ReturnType<typeof createUploadStore>

export const DEFAULT_FILE_LABEL = '添加 PDF'

function derivePageRanges(state: Pick<UploadStoreState, 'pageRangeStart' | 'pageRangeEnd'>): string {
  const s = `${state.pageRangeStart ?? ''}`.trim()
  const e = `${state.pageRangeEnd ?? ''}`.trim()
  if (!s && !e) return ''
  if (s && e) return s === e ? s : `${s}-${e}`
  return s || e
}

export function createUploadStore() {
  return create<UploadStoreState & UploadStoreActions>((set, get) => ({
    // domain
    uploadId: '',
    uploadedFileName: '',
    uploadedPageCount: 0,
    uploadedBytes: 0,
    appliedPageRange: '',
    submitBusy: false,

    // view
    tileLocked: false,
    tileEnabled: true,
    ready: false,
    uploading: false,
    label: DEFAULT_FILE_LABEL,
    labelTitle: '',
    labelVisible: true,
    help: '上传后会先完成文件校验，再进入任务处理。',
    helpVisible: true,
    status: '尚未选择文件',
    statusVisible: false,
    progressVisible: false,
    progressPercent: 0,
    progressText: '上传中',
    actionSlotVisible: false,
    inlinePageRangeVisible: false,
    pageRangeStart: '',
    pageRangeEnd: '',
    pageRangeMax: 0,
    pageRangeDialogOpen: false,
    credentialGateVisible: false,

    get currentPageRanges() {
      return derivePageRanges(get())
    },

    patch: (payload) => set((s) => ({ ...s, ...payload })),

    setUpload: (payload) =>
      set((s) => ({
        ...s,
        uploadId: payload.uploadId ?? s.uploadId ?? '',
        uploadedFileName: payload.uploadedFileName ?? s.uploadedFileName ?? '',
        uploadedPageCount: payload.uploadedPageCount ?? s.uploadedPageCount ?? 0,
        uploadedBytes: payload.uploadedBytes ?? s.uploadedBytes ?? 0,
      })),

    setAppliedPageRange: (value) => set((s) => ({ ...s, appliedPageRange: `${value ?? ''}`.trim() })),

    clearAppliedPageRange: () => set((s) => ({ ...s, appliedPageRange: '' })),

    reset: (opts = {}) =>
      set((s) => ({
        ...s,
        uploadId: '',
        uploadedFileName: '',
        uploadedPageCount: 0,
        uploadedBytes: 0,
        appliedPageRange: opts.includePageRange === false ? s.appliedPageRange : '',
        submitBusy: false,
        // also reset view portions tied to a session
        ready: false,
        uploading: false,
        progressVisible: false,
        progressPercent: 0,
        statusVisible: false,
        pageRangeStart: '',
        pageRangeEnd: '',
        inlinePageRangeVisible: false,
        pageRangeDialogOpen: false,
      })),

    setSubmitBusy: (busy) => set((s) => ({ ...s, submitBusy: Boolean(busy) })),

    setUploadProgress: (loaded, total) => {
      const hasNumbers = Number.isFinite(loaded) && Number.isFinite(total) && total > 0
      const percent = hasNumbers ? Math.max(0, Math.min(100, (loaded / total) * 100)) : 18
      set((s) => ({
        ...s,
        progressVisible: true,
        uploading: true,
        ready: false,
        actionSlotVisible: false,
        progressPercent: percent,
        progressText: hasNumbers ? `上传中 ${percent.toFixed(0)}%` : '上传中',
      }))
    },

    resetUploadProgress: () =>
      set((s) => ({
        ...s,
        progressVisible: false,
        uploading: false,
        progressPercent: 0,
        progressText: '上传中',
      })),

    clearPageRanges: () => set((s) => ({ ...s, pageRangeStart: '', pageRangeEnd: '' })),
    openPageRangeDialog: (maxPage = 0) =>
      set((s) => ({
        ...s,
        pageRangeDialogOpen: true,
        pageRangeMax: Number(maxPage) > 0 ? Math.floor(Number(maxPage)) : 0,
      })),
    closePageRangeDialog: () => set((s) => ({ ...s, pageRangeDialogOpen: false })),
    writePageRanges: (parts) =>
      set((s) => ({
        ...s,
        pageRangeStart: `${parts.start ?? ''}`,
        pageRangeEnd: `${parts.end ?? ''}`,
      })),
    markUploadReady: (ready) => set((s) => ({ ...s, ready: Boolean(ready), uploading: false })),
    setInlinePageRangeVisible: (visible) => set((s) => ({ ...s, inlinePageRangeVisible: Boolean(visible) })),
    setFileLabel: (file, defaultLabel) => {
      const name = file?.name ? `${file.name}` : ''
      const label = name || defaultLabel
      set((s) => ({ ...s, label, labelTitle: name }))
    },
    showUploadStatus: (message) => set((s) => ({ ...s, status: message, statusVisible: true })),
    setUploadTileLocked: ({ locked = false, enabled = !locked } = {}) =>
      set((s) => ({ ...s, tileLocked: Boolean(locked), tileEnabled: Boolean(enabled) })),
    setUploadTileText: ({ label = '', labelTitle = '', help = '', status = '', statusVisible = null, labelVisible = true, helpVisible = true } = {}) =>
      set((s) => {
        const next: Partial<UploadStoreState> = {
          labelVisible: Boolean(labelVisible),
          helpVisible: Boolean(helpVisible),
        }
        if (label) {
          next.label = label
          next.labelTitle = labelTitle
        }
        if (help) next.help = help
        if (status) next.status = status
        next.statusVisible = Boolean(statusVisible ?? Boolean(status))
        return { ...s, ...next }
      }),
    resetUploadedFileView: () =>
      set((s) => ({
        ...s,
        progressVisible: false,
        uploading: false,
        ready: false,
        progressPercent: 0,
        progressText: '上传中',
        actionSlotVisible: false,
        status: '未上传文件',
        statusVisible: false,
        label: DEFAULT_FILE_LABEL,
        labelTitle: '',
        labelVisible: true,
        helpVisible: true,
      })),
  }))
}

// Singleton for app-wide usage (mirrors getUploadStatePort singleton in apps/web)
let defaultUploadStore: UploadStore | null = null
export function getUploadStore(): UploadStore {
  if (!defaultUploadStore) defaultUploadStore = createUploadStore()
  return defaultUploadStore
}

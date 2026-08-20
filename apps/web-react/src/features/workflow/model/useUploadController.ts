/**
 * useUploadController — React-idiomatic port of
 *   apps/web/src/js/features/upload/controller.ts  (mountUploadFeature)
 *
 * React hook + TanStack Query mutation for file upload.
 * Pure helpers (page-range, budget) stay in model/*.ts — hook composes them.
 * Keeps apps/web (MPA) untouched; web-react consumes via hook.
 *
 * Responsibilities (parity with controller.ts):
 *  - frontMaxBytes / frontMaxPageCount guard (local countPdfPages + backend page_count)
 *  - upload mutation with progress (XHR)
 *  - page range constrain / validate / normalize
 *  - inline page-range visibility + dialog open
 *  - appliedPageRange bookkeeping
 *
 * Budget / submitBusy live in workflow store; this hook only writes upload store.
 */
import { useCallback, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { API_PREFIX } from '@retainpdf/api/internal/runtime'

import {
  buildUploadUrl,
  collectUploadFormData,
  countPdfPages as defaultCountPdfPages,
  formatByteLimit,
  type UploadResponsePayload,
} from '../api/upload-api'
import {
  constrainPageRanges as pureConstrain,
  normalizePageRangeValue,
  validatePageRanges as pureValidate,
  pageRangeMax as resolvePageRangeMax,
} from './page-range'
import { getUploadStore, type UploadStore } from './upload-store'
import { FRONT_MAX_BYTES, FRONT_MAX_PAGE_COUNT } from './workflow-constants'

export type UseUploadControllerOptions = {
  store?: UploadStore
  apiPrefix?: string
  frontMaxBytes?: number
  frontMaxPageCount?: number
  defaultFileLabel?: string
  countPdfPages?: (file: File) => Promise<number> | number
  submitUploadRequest?: (
    url: string,
    formData: FormData,
    onProgress?: (loaded: number, total: number) => void,
  ) => Promise<UploadResponsePayload>
  onUploadSuccess?: (payload: UploadResponsePayload, file: File) => void
  onError?: (message: string) => void
  onUploadReady?: (ready: boolean) => void
  workflowNeedsUpload?: () => boolean
}

export function useUploadController(options: UseUploadControllerOptions = {}) {
  const {
    store = getUploadStore(),
    apiPrefix = API_PREFIX,
    frontMaxBytes = FRONT_MAX_BYTES,
    frontMaxPageCount = FRONT_MAX_PAGE_COUNT,
    defaultFileLabel = '添加 PDF',
    countPdfPages = defaultCountPdfPages,
    submitUploadRequest,
    onError,
    workflowNeedsUpload,
  } = options

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const uploadMutation = useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (loaded: number, total: number) => void
    }) => {
      const url = buildUploadUrl(apiPrefix)
      const form = collectUploadFormData(file)
      const fetcher = submitUploadRequest
        ? (u: string, f: FormData, p?: (l: number, t: number) => void) => submitUploadRequest(u, f as FormData, p)
        : async (u: string, f: FormData, p?: (l: number, t: number) => void) => {
            const { submitUploadRequest: fallback } = await import('../api/upload-api')
            return fallback(u, f, p)
          }
      return fetcher(url, form, onProgress)
    },
  })

  const s = store.getState()

  const currentPageRanges = useCallback(() => {
    const snap = store.getState()
    return normalizePageRangeValue(snap.pageRangeStart, snap.pageRangeEnd)
  }, [store])

  const pageRangeLimit = useCallback(() => {
    const snap = store.getState()
    return resolvePageRangeMax(snap.uploadedPageCount, frontMaxPageCount)
  }, [store, frontMaxPageCount])

  const constrainPageRanges = useCallback(
    (opts: { source?: string } = {}) => {
      const snap = store.getState()
      const maxPage = resolvePageRangeMax(snap.uploadedPageCount, frontMaxPageCount)
      const result = pureConstrain({
        start: snap.pageRangeStart || '',
        end: snap.pageRangeEnd || '',
        maxPage,
        source: opts.source || '',
      })
      store.getState().writePageRanges({ start: result.start, end: result.end })
      store.getState().setAppliedPageRange(result.applied)
      return result
    },
    [store, frontMaxPageCount],
  )

  const validatePageRanges = useCallback(() => {
    const snap = store.getState()
    const maxPage = resolvePageRangeMax(snap.uploadedPageCount, frontMaxPageCount)
    const result = pureValidate({
      start: snap.pageRangeStart || '',
      end: snap.pageRangeEnd || '',
      maxPage,
    })
    if ((result as { ok: boolean; reason?: string }).ok === false) {
      onError?.((result as { ok: false; reason: string }).reason)
      return false
    }
    store.getState().setAppliedPageRange((result as { ok: true; applied: string }).applied)
    return true
  }, [store, frontMaxPageCount, onError])

  const renderPageRangeSummary = useCallback(() => {
    const snap = store.getState()
    const needsUpload = workflowNeedsUpload ? workflowNeedsUpload() : true
    store.getState().setInlinePageRangeVisible(needsUpload && Boolean(snap.uploadId))
  }, [store, workflowNeedsUpload])

  const openPageRangeDialog = useCallback(() => {
    const snap = store.getState()
    const maxPage = resolvePageRangeMax(snap.uploadedPageCount, frontMaxPageCount)
    store.getState().openPageRangeDialog(maxPage)
  }, [store, frontMaxPageCount])

  const applyPageRanges = useCallback(() => {
    store.getState().closePageRangeDialog()
  }, [store])

  const clearPageRanges = useCallback(() => {
    store.getState().clearPageRanges()
    store.getState().clearAppliedPageRange()
    renderPageRangeSummary()
    store.getState().closePageRangeDialog()
  }, [store, renderPageRangeSummary])

  const resetUploadSession = useCallback(() => {
    store.getState().reset()
    store.getState().resetUploadProgress()
    if (fileInputRef.current) fileInputRef.current.value = ''
    store.getState().clearPageRanges()
    store.getState().markUploadReady(false)
    renderPageRangeSummary()
    return store.getState()
  }, [store, renderPageRangeSummary])

  const handleFileSelected = useCallback(
    async (fileOverride?: File | null) => {
      const file = fileOverride ?? (fileInputRef.current?.files?.[0] as File | null) ?? null
      // Reset stale state (parity with controller's pre-select reset)
      store.getState().reset({ includePageRange: true })
      store.getState().resetUploadProgress()
      store.getState().clearPageRanges()
      renderPageRangeSummary()
      store.getState().setFileLabel(file, defaultFileLabel)

      if (!file) return

      if (file.size > frontMaxBytes) {
        const msg = `当前前端限制为 ${formatByteLimit(frontMaxBytes)} 以内 PDF`
        onError?.(msg)
        store.getState().showUploadStatus('文件超出大小限制')
        return
      }

      if (frontMaxPageCount && countPdfPages) {
        store.getState().showUploadStatus('正在校验页数…')
        try {
          const localPageCount = await countPdfPages(file)
          if (!Number.isFinite(localPageCount) || localPageCount <= 0) {
            onError?.('PDF 解析失败，请检查文件是否损坏或可访问性异常。')
            store.getState().showUploadStatus('文件校验失败')
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
          }
          if (localPageCount > frontMaxPageCount) {
            onError?.(`PDF 页数超过限制：最多 ${frontMaxPageCount} 页`)
            store.getState().showUploadStatus('文件超出页数限制')
            if (fileInputRef.current) fileInputRef.current.value = ''
            return
          }
        } catch (err) {
          onError?.((err as Error)?.message || 'PDF 解析失败')
          store.getState().showUploadStatus('文件校验失败')
          if (fileInputRef.current) fileInputRef.current.value = ''
          return
        }
      }

      store.getState().showUploadStatus('正在上传…')
      try {
        const payload = await uploadMutation.mutateAsync({
          file,
          onProgress: (loaded, total) => store.getState().setUploadProgress(loaded, total),
        })
        const uploadedPageCount = Number((payload as any)?.page_count || 0)
        if (frontMaxPageCount > 0 && uploadedPageCount > frontMaxPageCount) {
          onError?.(`PDF 页数超过限制：最多 ${frontMaxPageCount} 页`)
          store.getState().showUploadStatus('文件超出页数限制')
          if (fileInputRef.current) fileInputRef.current.value = ''
          store.getState().resetUploadedFileView()
          return
        }
        store.getState().setUpload({
          uploadId: (payload as any)?.upload_id || '',
          uploadedFileName: (payload as any)?.filename || file.name,
          uploadedPageCount,
          uploadedBytes: Number((payload as any)?.bytes || file.size || 0),
        })
        const nextRanges =
          uploadedPageCount > 0 ? { start: '1', end: `${uploadedPageCount}` } : { start: '', end: '' }
        store.getState().writePageRanges(nextRanges)
        store.getState().setAppliedPageRange(currentPageRanges() || normalizePageRangeValue(nextRanges.start, nextRanges.end))
        const snap = store.getState()
        store.getState().markUploadReady(Boolean(snap.uploadId))
        store.getState().showUploadStatus('上传完成：可直接翻译，或仅收藏。')
        if (fileInputRef.current) fileInputRef.current.value = ''
        renderPageRangeSummary()
        options.onUploadSuccess?.(payload, file)
        options.onUploadReady?.(Boolean(snap.uploadId))
      } catch (err) {
        store.getState().resetUploadedFileView()
        if (fileInputRef.current) fileInputRef.current.value = ''
        onError?.((err as Error)?.message || '上传 PDF 文件失败')
        store.getState().showUploadStatus('上传失败')
      }
    },
    [
      store,
      renderPageRangeSummary,
      defaultFileLabel,
      frontMaxBytes,
      frontMaxPageCount,
      countPdfPages,
      onError,
      uploadMutation,
      currentPageRanges,
      options,
    ],
  )

  return {
    // state access helpers (for components that prefer hook over direct store subscription)
    store,
    fileInputRef,
    uploadMutation,
    // parity surface with mountUploadFeature return
    applyPageRanges,
    clearPageRanges,
    constrainPageRanges,
    currentPageRanges,
    handleFileSelected,
    normalizePageRangeValue,
    openPageRangeDialog,
    renderPageRangeSummary,
    resetUploadSession,
    validatePageRanges,
    // helpers for controlled input handling
    setPageRangeStart: (value: string) => {
      store.getState().writePageRanges({ start: value, end: store.getState().pageRangeEnd })
    },
    setPageRangeEnd: (value: string) => {
      store.getState().writePageRanges({ start: store.getState().pageRangeStart, end: value })
    },
    // expose raw parts for budget / payload
    get uploadId() {
      return s.uploadId
    },
    get appliedPageRange() {
      return s.appliedPageRange
    },
  }
}

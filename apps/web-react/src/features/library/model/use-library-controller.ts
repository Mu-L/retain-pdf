import { useCallback, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { API_PREFIX } from '@retainpdf/api/internal/runtime'
import { deleteLibraryBook as apiDeleteLibraryBook } from '@retainpdf/api/library-books'
import { deleteDocument as apiDeleteDocument, patchDocument as apiPatchDocument, translateDocument as apiTranslateDocument } from '@retainpdf/api/documents'

import {
  deleteLibraryBook,
  downloadLibraryResource,
  libraryApiUrl,
  libraryCopy,
  libraryResourceUrl,
} from '../index'
import { libraryKeys } from '../api/library-queries'
import { filterLibraryBooksByQuery, filterLibraryBooksByStatus, sortLibraryBooks } from '../library-selectors'
import type { LibraryBook, LibrarySortKey, LibraryStatusFilterKey } from '../types'
import { useLibraryData } from './use-library-data'
import { useLibraryFeedback } from './use-library-feedback'
import {
  assembleTranslatePayload,
  friendlyDocumentDeleteError,
  friendlyTranslateError,
  shouldPreferTranslateTab,
  type TranslateDocumentPayload,
} from './library-domain'

const APP_EVENTS = {
  openReaderRequested: 'retain:openReaderRequested',
  closeTranslationWorkflow: 'retain:closeTranslationWorkflow',
} as const

type UseLibraryControllerOptions = {
  buildTranslateConfig?: (pageRanges?: string) => TranslateDocumentPayload | Record<string, unknown>
}

export function useLibraryController(options: UseLibraryControllerOptions = {}) {
  const { buildTranslateConfig } = options
  const feedback = useLibraryFeedback()
  const queryClient = useQueryClient()
  const handleLoadError = useCallback((message: string) => {
    feedback.setLoadError(message)
  }, [feedback])

  // Data layer now uses TanStack Query with server q param + client fallback
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilterKey, setStatusFilterKey] = useState<LibraryStatusFilterKey>('all')
  const [sortKey, setSortKey] = useState<LibrarySortKey>('recent')

  const libraryData = useLibraryData({
    query: searchQuery,
    statusFilter: undefined,
    sortKey: undefined,
    onLoadError: handleLoadError,
  })

  const [detailOpen, setDetailOpen] = useState(false)
  const [readerOpen, setReaderOpen] = useState(false)
  const [downloadingBookId, setDownloadingBookId] = useState<string>()
  const [deletingBookId, setDeletingBookId] = useState<string>()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedBookIds, setSelectedBookIds] = useState<Set<string>>(() => new Set())
  const [translatingBookId, setTranslatingBookId] = useState<string>()

  const translatingIds = useRef(new Set<string>())

  const visibleBooks = sortLibraryBooks(
    filterLibraryBooksByStatus(filterLibraryBooksByQuery(libraryData.books, searchQuery), statusFilterKey),
    sortKey,
  )

  function dispatchAppEvent(name: string, detail?: unknown) {
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent(name, detail === undefined ? undefined : { detail }))
    }
  }

  function openSourceReader(documentId?: string | null) {
    const normalizedId = `${documentId || ''}`.trim()
    if (!normalizedId) return
    dispatchAppEvent(APP_EVENTS.openReaderRequested, { documentId: normalizedId, pageIdx: null, blockId: '' })
  }

  function storeOnly() {
    dispatchAppEvent(APP_EVENTS.closeTranslationWorkflow)
  }

  function attachJobProgress(jobId?: string | null) {
    const id = `${jobId || ''}`.trim()
    if (!id || id.startsWith('doc:')) return
    // In SPA, silent polling is via query invalidation + refetch; dispatch hide if needed
    // No-op placeholder for domain parity — could trigger status polling query
    queryClient.invalidateQueries({ queryKey: libraryKeys.all })
  }

  function openBookDetail(item?: LibraryBook | null) {
    if (!item) return
    const documentId = `${(item as any).document_id || item.id || ''}`.trim()
    const jobId = `${(item as any).job_id || (item as any).active_job_id || item.id || ''}`.trim()
    if (!documentId && (!jobId || jobId.startsWith('doc:'))) return
    const prefer = shouldPreferTranslateTab(item as any)
    libraryData.setSelectedBookId(item.id)
    setDetailOpen(true)
    // prefer_translate_tab semantic kept for detail dialog
    if (prefer) {
      // detail dialog can read prefer_translate_tab via selectedBook extension if needed
      ;(item as any).prefer_translate_tab = true
    }
    libraryData.loadBookDetail(item.id)
    if (jobId && !jobId.startsWith('doc:')) attachJobProgress(jobId)
  }

  function selectBook(book: LibraryBook) {
    openBookDetail(book)
  }

  function openReader(bookOrId: LibraryBook | string) {
    const bookId = typeof bookOrId === 'string' ? bookOrId : bookOrId.id
    libraryData.setSelectedBookId(bookId)
    setReaderOpen(true)
    libraryData.loadBookDetail(bookId)
    // Also dispatch openSourceReader for parity with controller
    openSourceReader(bookId)
  }

  function toggleSelectedBook(book: LibraryBook) {
    setSelectedBookIds((current) => {
      const next = new Set(current)
      if (next.has(book.id)) next.delete(book.id)
      else next.add(book.id)
      return next
    })
  }

  // ── Mutations (TanStack Query) ───────────────────────────
  const translateMutation = useMutation({
    mutationFn: async ({ documentId, payload }: { documentId: string; payload?: TranslateDocumentPayload }) => {
      const normalizedId = `${documentId || ''}`.trim()
      if (!normalizedId) throw new Error('缺少 document_id')
      if (translatingIds.current.has(normalizedId)) throw new Error('正在翻译中，请稍候')
      translatingIds.current.add(normalizedId)
      setTranslatingBookId(normalizedId)
      try {
        const assembled = assembleTranslatePayload(payload, buildTranslateConfig)
        // Prefer document-level translate API; fallback to library job if needed
        return await apiTranslateDocument(API_PREFIX, normalizedId, assembled as Record<string, unknown>)
      } catch (error) {
        throw new Error(friendlyTranslateError(error as any))
      } finally {
        translatingIds.current.delete(normalizedId)
        setTranslatingBookId((cur) => (cur === normalizedId ? undefined : cur))
      }
    },
    onSuccess: (result: any, vars) => {
      const jobId = `${result?.job_id || result?.id || ''}`.trim()
      if (jobId) attachJobProgress(jobId)
      queryClient.invalidateQueries({ queryKey: libraryKeys.all })
      feedback.setToastText('已发起翻译')
    },
    onError: (error: unknown) => {
      feedback.setLoadError(error instanceof Error ? error.message : friendlyTranslateError(error as any))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ documentId, force }: { documentId: string; force?: boolean }) => {
      const normalizedId = `${documentId || ''}`.trim()
      if (!normalizedId) throw new Error('缺少 document_id')
      try {
        // Try document API first (document_id), fallback to library book API (job_id)
        return await apiDeleteDocument(API_PREFIX, normalizedId, { force })
      } catch (docError) {
        // If document API 404, try library book delete (job_id semantics)
        const msg = (docError as any)?.message || ''
        const status = (docError as any)?.status
        if (status === 404 || msg.includes('404')) {
          return await apiDeleteLibraryBook(API_PREFIX, normalizedId, { force: Boolean(force) })
        }
        throw docError
      }
    },
    onSuccess: (_data, vars) => {
      libraryData.removeBookFromLibrary(vars.documentId)
      setDetailOpen(false)
      setReaderOpen(false)
      queryClient.invalidateQueries({ queryKey: libraryKeys.all })
      feedback.setToastText('已删除')
    },
    onError: (error: unknown) => {
      feedback.setLoadError(friendlyDocumentDeleteError(error as any))
    },
  })

  const patchMutation = useMutation({
    mutationFn: async ({ documentId, payload }: { documentId: string; payload: Record<string, unknown> }) => {
      const normalizedId = `${documentId || ''}`.trim()
      if (!normalizedId) throw new Error('缺少 document_id')
      return apiPatchDocument(API_PREFIX, normalizedId, payload)
    },
    onSuccess: (updated: any, vars) => {
      const normalizedId = `${vars.documentId || ''}`.trim()
      const patch: Record<string, unknown> = {}
      if (vars.payload.title !== undefined) patch.title = `${(updated as any)?.title ?? vars.payload.title ?? ''}`
      if (vars.payload.reading_status !== undefined) patch.reading_status = `${(updated as any)?.reading_status ?? vars.payload.reading_status ?? ''}`
      if (vars.payload.tags !== undefined) patch.tags = Array.isArray((updated as any)?.tags) ? (updated as any).tags : vars.payload.tags

      if (Object.keys(patch).length) {
        // Patch all cached list queries
        const allQueries = queryClient.getQueriesData<LibraryBook[]>({ queryKey: libraryKeys.all })
        for (const [key, data] of allQueries) {
          if (Array.isArray(data)) {
            queryClient.setQueryData(key as readonly unknown[], data.map((b) => (b.id === normalizedId ? { ...b, ...patch } as LibraryBook : b)))
          }
        }
        // Also patch detail cache if present
        queryClient.setQueryData(libraryKeys.detail(normalizedId), (old: unknown) => (old && typeof old === 'object' ? { ...(old as any), ...patch } : old as never))
        // Keep selectedBook in sync
        if (libraryData.selectedBook?.id === normalizedId) {
          // Trigger re-render via setSelectedBookId no-op; actual book object comes from query cache on next render
        }
      }
      queryClient.invalidateQueries({ queryKey: libraryKeys.all })
      feedback.setToastText('已更新')
    },
    onError: (error: unknown) => {
      feedback.setLoadError(error instanceof Error ? error.message : '更新文档失败')
    },
  })

  // ── Imperative wrappers (compat with controller.ts) ──────
  async function translateLibraryDocument(documentId?: string | null, payload: TranslateDocumentPayload = {}) {
    const normalizedId = `${documentId || ''}`.trim()
    if (!normalizedId || translatingIds.current.has(normalizedId)) return null
    try {
      const result = await translateMutation.mutateAsync({ documentId: normalizedId, payload })
      return result as any
    } catch (error) {
      throw error instanceof Error ? error : new Error(friendlyTranslateError(error as any))
    }
  }

  async function deleteLibraryDocument(documentId?: string | null) {
    const normalizedId = `${documentId || ''}`.trim()
    if (!normalizedId) return
    setDeletingBookId(normalizedId)
    feedback.setLoadError(undefined)
    try {
      await deleteMutation.mutateAsync({ documentId: normalizedId })
    } catch (error) {
      // 409 force-delete flow
      const msg = error instanceof Error ? error.message : `${error || ''}`
      if (msg.includes('409') && typeof window !== 'undefined' && window.confirm(libraryCopy.detail.forceDeleteConfirm)) {
        try {
          await deleteMutation.mutateAsync({ documentId: normalizedId, force: true })
          return
        } catch (forceError) {
          feedback.setLoadError(forceError instanceof Error ? forceError.message : '强制删除失败')
          throw forceError
        }
      }
      throw error
    } finally {
      setDeletingBookId((cur) => (cur === normalizedId ? undefined : cur))
    }
  }

  async function deleteLibraryDocuments(documentIds: Array<string | null | undefined> = []) {
    const ids = [...new Set((documentIds || []).map((id) => `${id || ''}`.trim()).filter(Boolean))]
    if (!ids.length) return { confirmed: 0, failed: 0 }
    setDeletingBookId('batch')
    feedback.setLoadError(undefined)
    const results = await Promise.allSettled(ids.map((id) => apiDeleteDocument(API_PREFIX, id).catch(() => apiDeleteLibraryBook(API_PREFIX, id))))
    const confirmedIds = ids.filter((_, idx) => results[idx]?.status === 'fulfilled')
    const confirmed = confirmedIds.length
    if (confirmedIds.length) confirmedIds.forEach((id) => libraryData.removeBookFromLibrary(id))
    queryClient.invalidateQueries({ queryKey: libraryKeys.all })
    setDeletingBookId((cur) => (cur === 'batch' ? undefined : cur))
    if (confirmed) feedback.setToastText('已删除')
    return { confirmed, failed: results.length - confirmed }
  }

  function deleteCard(target: { documentId?: string; jobId?: string } = {}) {
    const documentId = `${target?.documentId || ''}`.trim()
    if (documentId) {
      void deleteLibraryDocument(documentId).catch(() => {})
      return
    }
    const jobId = `${target?.jobId || ''}`.trim()
    if (jobId) void deleteMutation.mutateAsync({ documentId: jobId }).catch(() => {})
  }

  async function updateLibraryDocument(documentId?: string | null, payload: Record<string, unknown> = {}) {
    const normalizedId = `${documentId || ''}`.trim()
    if (!normalizedId) return null
    return patchMutation.mutateAsync({ documentId: normalizedId, payload })
  }

  function selectJobForDetail(
    jobId?: string | null,
    options: { findItem?: (jobId: string) => LibraryBook | null | undefined; fallbackSelectJob?: (jobId: string) => void } = {},
  ) {
    const id = `${jobId || ''}`.trim()
    if (!id) return
    const item = options.findItem?.(id) ?? libraryData.books.find((b) => b.id === id) ?? null
    if (item) {
      openBookDetail({ ...item, prefer_translate_tab: true } as LibraryBook)
      return
    }
    openBookDetail({ id, prefer_translate_tab: true } as unknown as LibraryBook)
  }

  function selectJob(jobId: string) {
    const id = `${jobId || ''}`.trim()
    if (!id) return
    selectJobForDetail(id, {
      findItem: (targetId: string) => libraryData.books.find((b) => b.id === targetId) ?? null,
    })
  }

  // ── Legacy download/delete (keep compat) ─────────────────
  function downloadPdf(bookId: string) {
    const book = libraryData.books.find((item) => item.id === bookId)
    const artifactUrl = book?.detail?.artifacts.find((artifact) => artifact.state === 'ready' && artifact.downloadUrl)?.downloadUrl
    const downloadTarget = artifactUrl ? libraryResourceUrl(artifactUrl) : libraryApiUrl(`jobs/${encodeURIComponent(bookId)}/download`)

    setDownloadingBookId(bookId)
    feedback.setLoadError(undefined)
    feedback.setToastText('正在下载...')
    downloadLibraryResource(downloadTarget, `${book?.title || bookId}.pdf`)
      .then(() => {
        feedback.setToastText('已开始下载')
      })
      .catch((error: unknown) => {
        feedback.setLoadError(error instanceof Error ? error.message : '下载 PDF 失败')
      })
      .finally(() => {
        setDownloadingBookId((current) => (current === bookId ? undefined : current))
      })
  }

  function downloadArtifact(artifactKey: string) {
    const book = libraryData.selectedBook
    const artifact = book?.detail?.artifacts.find((item) => item.key === artifactKey)

    if (!artifact?.downloadUrl || !book) {
      return
    }

    const fallbackFileName = artifact.fileName || `${book.id}-${artifact.key}`
    setDownloadingBookId(book.id)
    feedback.setLoadError(undefined)
    feedback.setToastText(`正在下载 ${artifact.label}...`)
    downloadLibraryResource(artifact.downloadUrl, fallbackFileName)
      .then(() => {
        feedback.setToastText(`已开始下载 ${artifact.label}`)
      })
      .catch((error: unknown) => {
        feedback.setLoadError(error instanceof Error ? error.message : '下载文件失败')
      })
      .finally(() => {
        setDownloadingBookId((current) => (current === book.id ? undefined : current))
      })
  }

  function deleteBook(bookOrId: LibraryBook | string) {
    const bookId = typeof bookOrId === 'string' ? bookOrId : bookOrId.id
    if (typeof window !== 'undefined' && !window.confirm(libraryCopy.detail.deleteConfirm)) {
      return
    }
    setDeletingBookId(bookId)
    feedback.setLoadError(undefined)
    deleteLibraryBook(bookId)
      .then(() => {
        libraryData.removeBookFromLibrary(bookId)
        setDetailOpen(false)
        setReaderOpen(false)
        feedback.setToastText('已删除')
        queryClient.invalidateQueries({ queryKey: libraryKeys.all })
      })
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : '删除失败'
        if (message.includes('409') && typeof window !== 'undefined' && window.confirm(libraryCopy.detail.forceDeleteConfirm)) {
          return deleteLibraryBook(bookId, { force: true })
            .then(() => {
              libraryData.removeBookFromLibrary(bookId)
              setDetailOpen(false)
              setReaderOpen(false)
              feedback.setToastText('已删除')
              queryClient.invalidateQueries({ queryKey: libraryKeys.all })
            })
            .catch((forceError: unknown) => {
              feedback.setLoadError(forceError instanceof Error ? forceError.message : '强制删除失败')
            })
        }
        feedback.setLoadError(message)
      })
      .finally(() => {
        setDeletingBookId((current) => (current === bookId ? undefined : current))
      })
  }

  function toggleSelectionMode() {
    setSelectionMode((current) => {
      if (current) {
        setSelectedBookIds(new Set())
      }
      return !current
    })
  }

  function clearSelection() {
    setSelectedBookIds(new Set())
    setSelectionMode(false)
  }

  function deleteSelectedBooks() {
    const ids = Array.from(selectedBookIds)
    if (!ids.length || (typeof window !== 'undefined' && !window.confirm(libraryCopy.selection.deleteConfirm(ids.length)))) {
      return
    }
    setDeletingBookId('batch')
    feedback.setLoadError(undefined)
    Promise.all(ids.map((bookId) => deleteLibraryBook(bookId)))
      .then(() => {
        ids.forEach(libraryData.removeBookFromLibrary)
        setDetailOpen(false)
        setReaderOpen(false)
        setSelectedBookIds(new Set())
        setSelectionMode(false)
        feedback.setToastText('已删除')
        queryClient.invalidateQueries({ queryKey: libraryKeys.all })
      })
      .catch((error: unknown) => {
        feedback.setLoadError(error instanceof Error ? error.message : '批量删除失败')
      })
      .finally(() => {
        setDeletingBookId((current) => (current === 'batch' ? undefined : current))
      })
  }

  return {
    books: visibleBooks,
    selectedBook: libraryData.selectedBook,
    selectedBookId: libraryData.selectedBookId,
    searchQuery,
    sortKey,
    statusFilterKey,
    selectionMode,
    selectedBookIds,
    detailOpen,
    readerOpen,
    settingsOpen,
    detailLoadingBookId: libraryData.detailLoadingBookId,
    downloadingBookId,
    deletingBookId,
    translatingBookId,
    loadError: feedback.loadError,
    toastText: feedback.toastText,
    isLoading: (libraryData as any).isLoading,
    isFetching: (libraryData as any).isFetching,
    // Ported domain actions
    translateDocument: translateLibraryDocument,
    deleteDocument: deleteLibraryDocument,
    deleteDocuments: deleteLibraryDocuments,
    deleteCard,
    openSourceReader,
    storeOnly,
    openBookDetail,
    selectJobForDetail,
    selectJob,
    updateDocument: updateLibraryDocument,
    attachJobProgress,
    // Legacy UI actions
    actions: {
      selectBook,
      openReader,
      toggleSelectedBook,
      setSearchQuery,
      setSortKey,
      setStatusFilterKey,
      setSettingsOpen,
      setDetailOpen,
      setReaderOpen,
      toggleSelectionMode,
      clearSelection,
      deleteSelectedBooks,
      downloadPdf,
      downloadArtifact,
      deleteBook,
      // New domain actions exposed via actions as well for ergonomics
      translateDocument: translateLibraryDocument,
      deleteDocument: deleteLibraryDocument,
      deleteDocuments: deleteLibraryDocuments,
      updateDocument: updateLibraryDocument,
      openSourceReader,
      storeOnly,
      openBookDetail,
      selectJob,
      attachJobProgress,
    },
  }
}

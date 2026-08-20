import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchLibraryBookList } from '@retainpdf/api/library-books'
import { API_PREFIX } from '@retainpdf/api/internal/runtime'

import { getLibraryJob, jobDetailToLibraryBook, jobListToLibraryBooks } from '../api'
import { libraryKeys } from '../api/library-queries'
import { libraryBooks } from '../mock-data'
import type { LibraryBook } from '../types'
import { filterLibraryBooksByQuery, filterLibraryBooksByStatus, sortLibraryBooks } from '../library-selectors'
import type { LibrarySortKey, LibraryStatusFilterKey } from '../types'
import { mockLibraryEnabled, normalizedBookId } from './library-model-utils'

type UseLibraryDataOptions = {
  /** Server-side q param for fetchLibraryBookList; client-side fallback filters for mock */
  query?: string
  limit?: number
  statusFilter?: LibraryStatusFilterKey
  sortKey?: LibrarySortKey
  onLoadError?: (message: string) => void
}

export function useLibraryData({
  query: searchQuery = '',
  limit = 100,
  statusFilter,
  sortKey,
  onLoadError,
}: UseLibraryDataOptions = {}) {
  const normalizedQuery = `${searchQuery || ''}`.trim()
  const queryClient = useQueryClient()
  const [selectedBookId, setSelectedBookId] = useState<string | undefined>(() => mockLibraryEnabled() ? libraryBooks[0]?.id : undefined)
  const [detailLoadingBookId, setDetailLoadingBookId] = useState<string>()
  const [loadedDetailBookIds, setLoadedDetailBookIds] = useState<Set<string>>(() => new Set())
  const loadingDetailBookIds = useRef(new Set<string>())

  const isMock = mockLibraryEnabled()

  const listQuery = useQuery({
    queryKey: libraryKeys.list(normalizedQuery),
    queryFn: async () => {
      if (isMock) {
        // Mock path: return envelope shape expected by select-less raw
        return { items: [] as any[] }
      }
      return fetchLibraryBookList(API_PREFIX, { q: normalizedQuery, limit })
    },
    select: (data: any) => {
      if (isMock) {
        // Client-side filter mirrors server q param for storybook/mock
        const base = [...libraryBooks] as LibraryBook[]
        const filtered = normalizedQuery ? filterLibraryBooksByQuery(base, normalizedQuery) : base
        return filtered
      }
      const items = (data as any)?.items ?? []
      return jobListToLibraryBooks(items)
    },
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: true,
  })

  // Surface load errors via callback (keeps old onLoadError contract)
  useEffect(() => {
    if (listQuery.error) {
      const message = listQuery.error instanceof Error ? listQuery.error.message : '加载图书馆失败'
      onLoadError?.(message)
    }
  }, [listQuery.error, onLoadError])

  const rawBooks = useMemo(() => {
    if (isMock) {
      // When mock, listQuery.data already filtered; but on initial load before query settles, fallback
      return (listQuery.data as LibraryBook[] | undefined) ?? filterLibraryBooksByQuery(libraryBooks, normalizedQuery)
    }
    if (listQuery.data) return listQuery.data as LibraryBook[]
    // While loading and no mock, fallback to empty (no flash of mock)
    return [] as LibraryBook[]
  }, [isMock, listQuery.data, normalizedQuery])

  // Optional client-side status/sort derived view (kept here for "with search/filter" spec;
  // useLibraryController still does its own visibleBooks pass — idempotent).
  const books = useMemo(() => {
    let next = rawBooks
    if (statusFilter && statusFilter !== 'all') {
      next = filterLibraryBooksByStatus(next, statusFilter)
    }
    if (sortKey) {
      next = sortLibraryBooks(next, sortKey)
    }
    return next
  }, [rawBooks, statusFilter, sortKey])

  // Keep selectedBookId in sync when list changes (e.g., delete or fetch)
  useEffect(() => {
    setSelectedBookId((current) => {
      if (current && books.some((b) => b.id === current)) return current
      return books[0]?.id
    })
  }, [books])

  const selectedBook = useMemo(() => {
    return books.find((b) => b.id === selectedBookId) ?? books[0]
  }, [books, selectedBookId])

  const loadBookDetail = useCallback(
    async (bookId: string) => {
      const normalizedId = `${bookId || ''}`.trim()
      if (!normalizedId || loadedDetailBookIds.has(normalizedId) || loadingDetailBookIds.current.has(normalizedId)) {
        return
      }
      loadingDetailBookIds.current.add(normalizedId)
      setDetailLoadingBookId(normalizedId)
      try {
        const detail: any = await queryClient.fetchQuery({
          queryKey: libraryKeys.detail(normalizedId),
          queryFn: () => getLibraryJob(normalizedId),
          staleTime: 30_000,
        })
        const merged = jobDetailToLibraryBook(detail, rawBooks.find((b) => b.id === normalizedId))
        // Patch all list caches that contain this book
        queryClient.setQueriesData({ queryKey: libraryKeys.all }, (old: unknown) => {
          if (!old) return old
          // old may be LibraryBook[] via select — patch if array
          if (Array.isArray(old)) {
            return (old as LibraryBook[]).map((b) => (b.id === normalizedId ? merged : b))
          }
          // envelope shape { items } before select — not cached with select, so skip
          return old as never
        })
        // Fallback: also patch the current list query key directly if cached as array
        queryClient.setQueryData<LibraryBook[]>(libraryKeys.list(normalizedQuery), (old) => {
          if (!old) return old
          return old.map((b) => (b.id === normalizedId ? merged : b))
        })
        setLoadedDetailBookIds((cur) => new Set(cur).add(normalizedId))
      } catch {
        // silent — detail fetch failure is non-fatal; keep card
      } finally {
        loadingDetailBookIds.current.delete(normalizedId)
        setDetailLoadingBookId((cur) => (cur === normalizedId ? undefined : cur))
      }
    },
    [loadedDetailBookIds, normalizedQuery, queryClient, rawBooks],
  )

  const removeBookFromLibrary = useCallback(
    (bookId: string) => {
      const rootBookId = normalizedBookId(bookId)
      const suffix = `${rootBookId}-ocr`
      // Update every library list cache
      const allQueries = queryClient.getQueriesData<LibraryBook[]>({ queryKey: libraryKeys.all })
      for (const [key, data] of allQueries) {
        if (Array.isArray(data)) {
          queryClient.setQueryData(key as readonly unknown[], data.filter((b) => b.id !== rootBookId && b.id !== suffix))
        }
      }
      // Also ensure current normalized query cache updated if not covered
      queryClient.setQueryData<LibraryBook[]>(libraryKeys.list(normalizedQuery), (old) => {
        if (!old) return old
        return old.filter((b) => b.id !== rootBookId && b.id !== suffix)
      })
      setSelectedBookId((current) => (current === rootBookId || current === suffix ? undefined : current))
      setLoadedDetailBookIds((cur) => {
        const next = new Set(cur)
        next.delete(rootBookId)
        next.delete(suffix)
        return next
      })
    },
    [normalizedQuery, queryClient],
  )

  return {
    books,
    // rawBooks is the unfiltered source (before status/sort) — useful for detail merge
    rawBooks,
    selectedBook,
    selectedBookId: selectedBook?.id,
    detailLoadingBookId,
    isLoading: listQuery.isLoading,
    isFetching: listQuery.isFetching,
    error: listQuery.error as Error | null,
    setSelectedBookId,
    loadBookDetail,
    removeBookFromLibrary,
    // Expose query helpers for controller invalidation
    queryKey: libraryKeys.list(normalizedQuery),
    refetch: listQuery.refetch,
  }
}

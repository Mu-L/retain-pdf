/**
 * TanStack Query wrappers for library — Phase2 slice.
 * Mirrors docs/core/frontend/spa-architecture.md §2.2 : libraryKeys / libraryQuery
 * Uses @retainpdf/api fetchLibraryBookList (server q param) + local adapter.
 * Keeps apps/web (MPA) untouched; web-react consumes via query.
 */
import { queryOptions } from '@tanstack/react-query'
import { fetchLibraryBookList } from '@retainpdf/api/library-books'
import { API_PREFIX } from '@retainpdf/api/runtime'

import { jobDetailToLibraryBook, jobListToLibraryBooks } from './library-api-adapter'
import { getLibraryJob } from './library-api-client'
import type { LibraryBook } from '../types'

export const libraryKeys = {
  all: ['library'] as const,
  list: (q: string) => [...libraryKeys.all, 'list', q] as const,
  detail: (jobId: string) => [...libraryKeys.all, 'detail', jobId] as const,
}

export function libraryListQueryOptions(q = '', limit = 100) {
  const normalizedQ = `${q || ''}`.trim()
  return queryOptions({
    queryKey: libraryKeys.list(normalizedQ),
    queryFn: () => fetchLibraryBookList(API_PREFIX, { q: normalizedQ, limit }),
    select: (data) => jobListToLibraryBooks(data.items),
  })
}

export function libraryDetailQueryOptions(jobId: string, previous?: LibraryBook) {
  const normalizedId = `${jobId || ''}`.trim()
  return queryOptions({
    queryKey: libraryKeys.detail(normalizedId),
    queryFn: () => getLibraryJob(normalizedId),
    enabled: Boolean(normalizedId),
    select: (detail) => jobDetailToLibraryBook(detail, previous),
  })
}

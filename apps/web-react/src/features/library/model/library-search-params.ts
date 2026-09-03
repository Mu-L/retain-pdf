/**
 * Library search params (?q=&sort=&status=) — URL shareability single source.
 *
 * - validateSearch (routes/index.tsx) and useLibraryController both go through
 *   parseLibrarySearch, so pasted links / refresh / back restore the same shelf.
 * - Unknown sort/status values fall back to defaults ('recent' / 'all').
 * - buildLibrarySearch omits defaults so shared URLs stay short (/ when unfiltered).
 */
import type { LibrarySortKey, LibraryStatusFilterKey } from '../types'

export type LibrarySearch = {
  q: string
  sort: LibrarySortKey
  status: LibraryStatusFilterKey
}

export const LIBRARY_DEFAULT_SEARCH: LibrarySearch = { q: '', sort: 'recent', status: 'all' }

const SORT_KEYS: readonly LibrarySortKey[] = ['recent', 'title', 'authors', 'pages']
const STATUS_KEYS: readonly LibraryStatusFilterKey[] = ['all', 'ready', 'processing', 'queued']

export function isLibrarySortKey(value: unknown): value is LibrarySortKey {
  return typeof value === 'string' && (SORT_KEYS as readonly string[]).includes(value)
}

export function isLibraryStatusFilterKey(value: unknown): value is LibraryStatusFilterKey {
  return typeof value === 'string' && (STATUS_KEYS as readonly string[]).includes(value)
}

function firstString(value: unknown): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    const first = value.find((item): item is string => typeof item === 'string')
    return first ?? ''
  }
  return ''
}

function parseRecord(search: Record<string, unknown>): LibrarySearch {
  const sortRaw = search.sort
  const statusRaw = search.status
  return {
    q: firstString(search.q),
    sort: isLibrarySortKey(sortRaw) ? sortRaw : LIBRARY_DEFAULT_SEARCH.sort,
    status: isLibraryStatusFilterKey(statusRaw) ? statusRaw : LIBRARY_DEFAULT_SEARCH.status,
  }
}

/**
 * Parse ?q=&sort=&status= from a search string ("?q=xxx"), URLSearchParams,
 * or an already-parsed router search object. Never throws; falls back to defaults.
 */
export function parseLibrarySearch(input?: string | URLSearchParams | Record<string, unknown> | null): LibrarySearch {
  if (!input) return { ...LIBRARY_DEFAULT_SEARCH }
  if (typeof input === 'string') {
    const trimmed = input.trim().replace(/^[?#]/, '')
    if (!trimmed) return { ...LIBRARY_DEFAULT_SEARCH }
    try {
      const params = new URLSearchParams(trimmed)
      return parseRecord({
        q: params.get('q'),
        sort: params.get('sort'),
        status: params.get('status'),
      })
    } catch {
      return { ...LIBRARY_DEFAULT_SEARCH }
    }
  }
  if (typeof URLSearchParams !== 'undefined' && input instanceof URLSearchParams) {
    return parseRecord({ q: input.get('q'), sort: input.get('sort'), status: input.get('status') })
  }
  return parseRecord(input as Record<string, unknown>)
}

/**
 * Build a router `search` object with defaults omitted (undefined fields are
 * dropped by TanStack Router's stringifySearch, keeping URLs short).
 */
export function buildLibrarySearch(next: LibrarySearch): { q?: string; sort?: LibrarySortKey; status?: LibraryStatusFilterKey } {
  return {
    q: next.q ? next.q : undefined,
    sort: next.sort === LIBRARY_DEFAULT_SEARCH.sort ? undefined : next.sort,
    status: next.status === LIBRARY_DEFAULT_SEARCH.status ? undefined : next.status,
  }
}

export function isSameLibrarySearch(left: LibrarySearch, right: LibrarySearch): boolean {
  return left.q === right.q && left.sort === right.sort && left.status === right.status
}

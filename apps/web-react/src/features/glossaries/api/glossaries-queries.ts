/**
 * Glossaries TanStack Query — React port of
 *   apps/web/src/js/api/glossaries.ts + packages/api/src/glossaries.ts
 *
 * Mirrors docs/frontend-spa-architecture.md §2.2 : queryOptions factories.
 * Uses @retainpdf/api fetchers with server-side unwrapping + mock fallback.
 */
import { queryOptions } from '@tanstack/react-query'
import {
  createGlossary as apiCreateGlossary,
  deleteGlossary as apiDeleteGlossary,
  exportGlossaryCsv as apiExportGlossaryCsv,
  fetchGlossaries as apiFetchGlossaries,
  fetchGlossary as apiFetchGlossary,
  parseGlossaryCsv as apiParseGlossaryCsv,
  updateGlossary as apiUpdateGlossary,
} from '@retainpdf/api/glossaries'
import { API_PREFIX } from '@retainpdf/api/runtime'

export const glossariesKeys = {
  all: ['glossaries'] as const,
  list: () => [...glossariesKeys.all, 'list'] as const,
  detail: (glossaryId: string) => [...glossariesKeys.all, 'detail', glossaryId] as const,
}

export function glossariesListQueryOptions(apiPrefix: string = API_PREFIX) {
  return queryOptions({
    queryKey: glossariesKeys.list(),
    queryFn: () => apiFetchGlossaries(apiPrefix),
    select: (data: any) => {
      const items = Array.isArray((data as any)?.items) ? (data as any).items : Array.isArray(data) ? data : []
      return items
    },
  })
}

export function glossaryDetailQueryOptions(glossaryId: string, apiPrefix: string = API_PREFIX) {
  const normalizedId = `${glossaryId || ''}`.trim()
  return queryOptions({
    queryKey: glossariesKeys.detail(normalizedId),
    queryFn: () => apiFetchGlossary(normalizedId, apiPrefix),
    enabled: Boolean(normalizedId),
  })
}

// Re-export imperative API for mutations (TanStack useMutation fn)
export const glossariesApi = {
  fetchGlossaries: apiFetchGlossaries,
  fetchGlossary: apiFetchGlossary,
  createGlossary: apiCreateGlossary,
  updateGlossary: apiUpdateGlossary,
  deleteGlossary: apiDeleteGlossary,
  exportGlossaryCsv: apiExportGlossaryCsv,
  parseGlossaryCsv: apiParseGlossaryCsv,
}

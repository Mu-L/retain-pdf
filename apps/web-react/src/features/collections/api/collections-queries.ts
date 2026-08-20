import { queryOptions } from '@tanstack/react-query'
import { API_PREFIX } from '@retainpdf/api/http'
import { listCollections, fetchDocumentList } from '@retainpdf/api'
import { fetchFavorites } from '@retainpdf/api/favorites'

export const collectionsKeys = {
  all: ['collections'] as const,
  list: () => [...collectionsKeys.all, 'list'] as const,
  folder: (collectionId: string) => [...collectionsKeys.all, 'folder', collectionId] as const,
}

export const favoritesKeys = {
  all: ['favorites'] as const,
  list: (documentId = '') => [...favoritesKeys.all, 'list', documentId] as const,
}

export function collectionsListQueryOptions() {
  return queryOptions({
    queryKey: collectionsKeys.list(),
    queryFn: () => listCollections(API_PREFIX),
    select: (data: any) => {
      const raw = Array.isArray(data?.collections) ? data.collections : Array.isArray(data) ? data : []
      return raw as Array<{ collection_id: string; name: string; document_count?: number }>
    },
  })
}

export function collectionFolderQueryOptions(collectionId: string) {
  const id = `${collectionId || ''}`.trim()
  return queryOptions({
    queryKey: collectionsKeys.folder(id),
    queryFn: async () => {
      const { documents = [] } = await fetchDocumentList(API_PREFIX, { collectionId: id, limit: 500 } as any)
      return documents as any[]
    },
    enabled: Boolean(id),
  })
}

export function favoritesListQueryOptions(documentId = '') {
  const normalized = `${documentId || ''}`.trim()
  return queryOptions({
    queryKey: favoritesKeys.list(normalized),
    queryFn: () => fetchFavorites(API_PREFIX, { documentId: normalized } as any),
    select: (data: any) => {
      const list = Array.isArray(data?.favorites) ? data.favorites : Array.isArray(data) ? data : []
      return list as Array<{
        favorite_id?: string
        document_id?: string
        job_id?: string
        page_idx?: number
        block_id?: string
        kind?: string
        quote_text?: string
        note?: string
      }>
    },
  })
}

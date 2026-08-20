import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { collectionsListQueryOptions, collectionFolderQueryOptions } from '../api/collections-queries'
import { useCollectionsStore } from '../model/collections-store'

export function CollectionsView() {
  const { data: collections = [], isLoading, error } = useQuery(collectionsListQueryOptions())
  const selectedId = useCollectionsStore((s) => s.selectedCollectionId)
  const setSelected = useCollectionsStore((s) => s.setSelectedCollectionId)
  const openDialog = useCollectionsStore((s) => s.openDialog)
  const [folderError, setFolderError] = useState('')

  const folderQuery = useQuery({
    ...collectionFolderQueryOptions(selectedId || ''),
    enabled: Boolean(selectedId),
  } as any)

  if (selectedId) {
    return (
      <section className="collections-view" data-collections-view="true" aria-label={`合集:${selectedId}`}>
        <div className="mb-3 flex items-center gap-2">
          <button type="button" className="rounded-md border px-3 py-1 text-sm" onClick={() => setSelected(null)}>
            ← 返回合集
          </button>
          <h2 className="text-sm font-semibold">合集详情</h2>
        </div>
        {folderQuery.isLoading ? (
          <div className="text-sm text-neutral-500">正在加载…</div>
        ) : folderQuery.error ? (
          <div className="text-sm text-red-600">{(folderQuery.error as Error).message || '读取合集内容失败'}</div>
        ) : (folderQuery.data as any[])?.length === 0 ? (
          <div className="text-sm text-neutral-500">这个合集还没有书</div>
        ) : (
          <ul className="grid gap-2">
            {((folderQuery.data as any[]) || []).map((item: any) => (
              <li key={item.job_id || item.document_id || item.id} className="rounded border bg-white p-3 text-sm">
                {item.title || item.name || item.job_id || item.document_id || '文档'}
              </li>
            ))}
          </ul>
        )}
        {folderError ? <p className="text-xs text-red-600">{folderError}</p> : null}
      </section>
    )
  }

  return (
    <section className="collections-view" data-collections-view="true" aria-label="合集">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">合集</h2>
        <button type="button" className="rounded-md bg-neutral-900 px-3 py-1 text-sm text-white" onClick={() => openDialog(null)}>
          新建合集
        </button>
      </div>
      {isLoading ? (
        <div className="text-sm text-neutral-500">正在加载合集…</div>
      ) : error ? (
        <div className="text-sm text-red-600">{(error as Error).message || '读取合集失败'}</div>
      ) : collections.length === 0 ? (
        <div className="rounded border border-dashed p-6 text-center text-sm text-neutral-500">还没有合集</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {collections.map((c) => (
            <div key={c.collection_id} className="flex flex-col gap-2 rounded border bg-white p-3">
              <button type="button" className="text-left" onClick={() => setSelected(c.collection_id)}>
                <div className="truncate text-sm font-medium" title={c.name}>{c.name}</div>
                <div className="text-xs text-neutral-500">{c.document_count ?? 0} 本</div>
              </button>
              <button
                type="button"
                className="self-start rounded border px-2 py-1 text-xs"
                onClick={() => openDialog(c)}
              >
                管理
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export const CategoriesView = CollectionsView

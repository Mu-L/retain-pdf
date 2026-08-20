import { useQuery } from '@tanstack/react-query'
import { favoritesListQueryOptions } from '../api/collections-queries'

export function FavoritesView() {
  const { data: items = [], isLoading, error, refetch } = useQuery(favoritesListQueryOptions())

  return (
    <section className="favorites-view" aria-label="收藏" data-favorites-view="true">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">我的收藏</h2>
        <p className="text-xs text-neutral-500">阅读时选中文字即可收藏，在这里统一回看</p>
      </div>
      {isLoading ? (
        <div className="text-sm text-neutral-500">正在加载收藏…</div>
      ) : error ? (
        <div className="text-sm text-red-600">
          <p>{(error as Error).message || '读取收藏失败'}</p>
          <button type="button" className="mt-2 rounded border px-3 py-1 text-xs" onClick={() => refetch()}>重试</button>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded border border-dashed p-6 text-center text-sm text-neutral-500">还没有收藏</div>
      ) : (
        <ul className="grid gap-2">
          {items.map((item) => {
            const id = `${item.favorite_id || ''}`.trim() || `${item.document_id}-${item.block_id}-${item.page_idx}`
            const quote = `${item.quote_text || ''}`.trim()
            const note = `${(item as any).note || ''}`.trim()
            const page = Number.isFinite(Number(item.page_idx)) ? `第 ${Number(item.page_idx) + 1} 页` : ''
            return (
              <li key={id} className="rounded border bg-white p-3">
                <div className="mb-1 flex gap-2 text-xs text-neutral-500">
                  <span>{item.kind || '摘录'}</span>
                  {page ? <span>{page}</span> : null}
                </div>
                <p className="text-sm">{quote || '（无摘录文本）'}</p>
                {note ? <p className="mt-1 text-xs text-neutral-600">{note}</p> : null}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

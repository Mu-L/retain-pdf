/**
 * GlossariesDialog — thin UI shell driven by useGlossariesController.
 * Parity with apps/web/src/pages/home/features/glossaries (controller + view store).
 */
import { getGlossariesStore } from '../model/glossaries-store'
import { useGlossariesController } from '../model/use-glossaries-controller'

export function GlossariesDialog({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const controller = useGlossariesController({ autoLoad: Boolean(open) })
  const store = getGlossariesStore()
  const items = store((s) => s.items)
  const selectedId = store((s) => s.selectedId)
  const draft = store((s) => s.draft)
  const status = store((s) => s.status)

  if (!open) return null

  return (
    <div role="dialog" aria-modal="true" className="glossaries-dialog">
      <h2>术语表</h2>
      <div className="glossaries-list">
        {items.map((item) => (
          <button key={item.glossary_id} onClick={() => controller.selectGlossary(`${item.glossary_id || ''}`)} data-selected={item.glossary_id === selectedId}>
            {item.name} ({item.entry_count ?? 0})
          </button>
        ))}
        <button onClick={() => controller.createNew()}>新建术语表</button>
      </div>
      <div className="glossaries-editor">
        <input value={draft.name} onChange={(e) => store.getState().setName(e.target.value)} placeholder="术语表名称" />
        {draft.entries.map((row, idx) => (
          <div key={idx} className="glossary-row">
            <input value={row.source} onChange={(e) => store.getState().updateEntryField({ index: idx, field: 'source', value: e.target.value })} placeholder="原文" />
            <input value={row.target} onChange={(e) => store.getState().updateEntryField({ index: idx, field: 'target', value: e.target.value })} placeholder="译文" />
            <select value={row.level} onChange={(e) => store.getState().updateEntryField({ index: idx, field: 'level', value: e.target.value })}>
              <option value="preserve">保留原词</option>
              <option value="canonical">固定译法</option>
            </select>
            <button onClick={() => store.getState().removeEntryRow(idx)}>删除</button>
          </div>
        ))}
        <button onClick={() => store.getState().addEntryRow()}>添加行</button>
      </div>
      {status.message && <p data-tone={status.tone}>{status.message}</p>}
      <button onClick={() => controller.save()} disabled={controller.saveMutation.isPending}>保存</button>
      <button onClick={() => controller.deleteCurrent()} disabled={controller.deleteMutation.isPending}>删除</button>
      <button onClick={() => controller.exportCurrent()} disabled={controller.exportMutation.isPending}>导出 CSV</button>
      <button onClick={onClose}>关闭</button>
    </div>
  )
}

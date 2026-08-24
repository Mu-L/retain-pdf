/**
 * useGlossariesController — React port of
 *   apps/web/src/js/features/glossaries/controller.ts (mountGlossariesFeature)
 *
 * Zustand view store + TanStack Query list/detail + mutations for CRUD.
 * Keeps apps/web MPA untouched.
 */
import { useCallback, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { API_PREFIX } from '@retainpdf/api/runtime'

import { getGlossariesStore } from './glossaries-store'
import { glossaryDetailQueryOptions, glossariesApi, glossariesKeys, glossariesListQueryOptions } from '../api/glossaries-queries'
import { shouldBlockSave } from './glossary-helpers'

export type UseGlossariesControllerOptions = {
  apiPrefix?: string
  refreshWorkflowGlossaries?: (opts?: { force?: boolean; selectedId?: string }) => Promise<void> | void
  autoLoad?: boolean
}

export function useGlossariesController(options: UseGlossariesControllerOptions = {}) {
  const { apiPrefix = API_PREFIX, refreshWorkflowGlossaries, autoLoad = false } = options
  const queryClient = useQueryClient()
  const store = useMemo(() => getGlossariesStore(), [])

  const listQuery = useQuery(glossariesListQueryOptions(apiPrefix))

  // Sync listQuery.data -> store.items + selectedId (parity with controller reloadGlossaries)
  useEffect(() => {
    if (listQuery.data) {
      const items = Array.isArray(listQuery.data) ? listQuery.data : []
      const currentSelected = store.getState().selectedId
      const stillExists = items.some((it: any) => `${it?.glossary_id || ''}`.trim() === currentSelected)
      const nextSelected = stillExists ? currentSelected : `${(items[0] as any)?.glossary_id || ''}`.trim()
      store.getState().setList({ items, selectedId: nextSelected })
    }
  }, [listQuery.data, store])

  const selectedId = store.getState().selectedId // for query trigger; components should subscribe via store selector
  const detailQuery = useQuery({
    ...glossaryDetailQueryOptions(selectedId, apiPrefix),
    enabled: Boolean(selectedId),
  })

  useEffect(() => {
    if (detailQuery.data) {
      const detail: any = detailQuery.data
      store.getState().setDraft({ name: detail?.name || '', entries: Array.isArray(detail?.entries) ? detail.entries : [] })
      store.getState().setStatus({ message: '', tone: '' })
    }
    if (detailQuery.error) {
      const msg = (detailQuery.error as any)?.message || String(detailQuery.error)
      store.getState().setStatus({ message: msg, tone: 'error' })
    }
  }, [detailQuery.data, detailQuery.error, store])

  const reloadGlossaries = useCallback(
    async (opts: { keepSelection?: boolean } = {}) => {
      const keepSelection = opts.keepSelection ?? true
      store.getState().setStatus({ message: '正在读取术语表...', tone: '' })
      try {
        const payload: any = await glossariesApi.fetchGlossaries(apiPrefix)
        const items = Array.isArray(payload?.items) ? payload.items : Array.isArray(payload) ? payload : []
        const cur = store.getState().selectedId
        const exists = keepSelection && items.some((it: any) => `${it?.glossary_id || ''}`.trim() === cur)
        const nextSelected = exists ? cur : `${(items[0] as any)?.glossary_id || ''}`.trim()
        store.getState().setList({ items, selectedId: nextSelected })
        if (nextSelected) {
          queryClient.invalidateQueries({ queryKey: glossariesKeys.detail(nextSelected) })
        } else {
          store.getState().setDraft({ name: '', entries: [] })
        }
        store.getState().setStatus({ message: '', tone: '' })
        // Also invalidate list query cache for TanStack parity
        queryClient.setQueryData(glossariesKeys.list(), payload)
        return items
      } catch (err: any) {
        const msg = err?.message || String(err)
        store.getState().setStatus({ message: msg, tone: 'error' })
        throw err
      }
    },
    [apiPrefix, store, queryClient],
  )

  const selectGlossary = useCallback(
    async (glossaryId: string) => {
      const id = `${glossaryId || ''}`.trim()
      if (!id) return
      store.getState().setList({ items: store.getState().items, selectedId: id })
      store.getState().setStatus({ message: '正在读取术语表...', tone: '' })
      try {
        const detail: any = await glossariesApi.fetchGlossary(id, apiPrefix)
        store.getState().setDraft({ name: detail?.name || '', entries: Array.isArray(detail?.entries) ? detail.entries : [] })
        store.getState().setStatus({ message: '', tone: '' })
      } catch (err: any) {
        store.getState().setStatus({ message: err?.message || String(err), tone: 'error' })
      }
    },
    [apiPrefix, store],
  )

  const open = useCallback(async () => {
    store.getState().setStatus({ message: '正在读取术语表...', tone: '' })
    try {
      await reloadGlossaries()
      store.getState().setStatus({ message: '', tone: '' })
    } catch (err: any) {
      store.getState().setStatus({ message: err?.message || String(err), tone: 'error' })
    }
  }, [reloadGlossaries, store])

  const createNew = useCallback(() => {
    store.getState().setList({ items: store.getState().items, selectedId: '' })
    store.getState().setDraft({ name: '未命名术语表', entries: [] })
    store.getState().addEntryRow()
    store.getState().setStatus({ message: '新术语表尚未保存。', tone: '' })
  }, [store])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = store.getState().readEditorPayload()
      const block = shouldBlockSave(payload as any)
      if (block) {
        store.getState().setStatus({ message: block, tone: 'error' })
        throw new Error(block)
      }
      // strip helper field
      const { skippedMissingTarget: _skip, ...rest } = payload as any
      void _skip
      const selected = store.getState().selectedId
      const isUpdate = Boolean(selected && store.getState().items.some((it) => `${it.glossary_id || ''}`.trim() === selected))
      // crude draftOnly heuristic: if selected but not in list then create
      store.getState().setStatus({ message: '正在保存...', tone: '' })
      const saved: any = isUpdate
        ? await glossariesApi.updateGlossary(apiPrefix, selected, rest)
        : await glossariesApi.createGlossary(apiPrefix, rest)
      const savedId = `${saved?.glossary_id || selected || ''}`.trim()
      if (savedId) store.getState().setList({ items: store.getState().items, selectedId: savedId })
      await queryClient.invalidateQueries({ queryKey: glossariesKeys.all })
      await reloadGlossaries()
      await refreshWorkflowGlossaries?.({ force: true, selectedId: savedId })
      store.getState().setStatus({ message: '已保存。', tone: 'valid' })
      return saved
    },
    onError: (err: any) => {
      if (!store.getState().status.message || store.getState().status.tone !== 'error') {
        store.getState().setStatus({ message: err?.message || String(err), tone: 'error' })
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const selected = store.getState().selectedId
      const items = store.getState().items
      const exists = Boolean(selected && items.some((it) => `${it.glossary_id || ''}`.trim() === selected))
      if (!selected || !exists) {
        store.getState().setDraft({ name: '', entries: [] })
        store.getState().setStatus({ message: '', tone: '' })
        return
      }
      store.getState().setStatus({ message: '正在删除...', tone: '' })
      await glossariesApi.deleteGlossary(apiPrefix, selected)
      store.getState().setList({ items: store.getState().items, selectedId: '' })
      await queryClient.invalidateQueries({ queryKey: glossariesKeys.all })
      await reloadGlossaries({ keepSelection: false })
      await refreshWorkflowGlossaries?.({ force: true, selectedId: '' })
      store.getState().setStatus({ message: '已删除。', tone: 'valid' })
    },
    onError: (err: any) => {
      store.getState().setStatus({ message: err?.message || String(err), tone: 'error' })
    },
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      const selected = store.getState().selectedId
      if (!selected) {
        store.getState().setStatus({ message: '请先保存术语表再导出。', tone: 'error' })
        throw new Error('请先保存术语表再导出。')
      }
      store.getState().setStatus({ message: '正在导出 CSV...', tone: '' })
      const resp: Response = await glossariesApi.exportGlossaryCsv(apiPrefix, selected)
      // Trigger browser download (parity with controller exportCurrent)
      const blob = await resp.blob()
      const disposition = resp.headers.get('content-disposition') || ''
      const match = disposition.match(/filename="?([^"]+)"?/i)
      const filename = match?.[1] || `${selected}.csv`
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      store.getState().setStatus({ message: `已导出 ${filename}。`, tone: 'valid' })
      return filename
    },
    onError: (err: any) => {
      store.getState().setStatus({ message: err?.message || String(err), tone: 'error' })
    },
  })

  const parseMutation = useMutation({
    mutationFn: async () => {
      const csvText = store.getState().readCsvText()
      if (!`${csvText || ''}`.trim()) {
        store.getState().setStatus({ message: '请先粘贴 CSV 内容。', tone: 'error' })
        throw new Error('请先粘贴 CSV 内容。')
      }
      store.getState().setStatus({ message: '正在解析 CSV...', tone: '' })
      const payload: any = await glossariesApi.parseGlossaryCsv(apiPrefix, csvText)
      const current = store.getState().readEditorPayload()
      store.getState().setDraft({ name: current.name, entries: Array.isArray(payload?.entries) ? payload.entries : [] })
      store.getState().clearCsvText()
      store.getState().setImportVisible(false)
      store.getState().setStatus({ message: `已解析 ${Number(payload?.entry_count) || 0} 条。`, tone: 'valid' })
      return payload
    },
    onError: (err: any) => {
      store.getState().setStatus({ message: err?.message || String(err), tone: 'error' })
    },
  })

  // Auto-load parity: if autoLoad requested, trigger open once
  useEffect(() => {
    if (autoLoad) void open()
  }, [autoLoad, open])

  return {
    store,
    listQuery,
    detailQuery,
    // imperative parity with mountGlossariesFeature
    open,
    reloadGlossaries,
    selectGlossary,
    createNew,
    save: () => saveMutation.mutateAsync(),
    deleteCurrent: () => deleteMutation.mutateAsync(),
    exportCurrent: () => exportMutation.mutateAsync(),
    applyImport: () => parseMutation.mutateAsync(),
    showImport: () => store.getState().setImportVisible(true),
    hideImport: () => store.getState().setImportVisible(false),
    // mutations for UI binding
    saveMutation,
    deleteMutation,
    exportMutation,
    parseMutation,
    refreshWorkflowGlossaries,
  }
}

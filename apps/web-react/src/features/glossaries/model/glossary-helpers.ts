/**
 * Glossary domain pure helpers — port of
 *   apps/web/src/pages/home/features/glossaries/glossaries-store.ts (readEditorPayload)
 *   + apps/web/src/js/features/glossaries/controller.ts (export/import helpers)
 *
 * Preserves "preserve" semantics verbatim:
 * level==="preserve" && typedTarget===""  => target = source (keep original)
 * level!=="preserve" && typedTarget===""  => skippedMissingTarget (error)
 */

export type GlossaryListItem = {
  glossary_id?: string
  name?: string
  entry_count?: number
  created_at?: string
  updated_at?: string
  [key: string]: unknown
}

export type GlossaryEntryRow = {
  source: string
  target: string
  note: string
  level: string
  match_mode: string
}

export type GlossaryDraft = {
  name: string
  entries: GlossaryEntryRow[]
}

export type GlossaryEditorPayload = {
  name: string
  entries: Array<{
    source: string
    target: string
    level: string
    match_mode: string
    context: string
    note: string
  }>
  skippedMissingTarget: string[]
}

export function normalizeEntryForRow(entry: Partial<GlossaryEntryRow> = {}): GlossaryEntryRow {
  return {
    source: entry.source || '',
    target: entry.target || '',
    note: entry.note || '',
    level: entry.level || 'preserve',
    match_mode: entry.match_mode || 'case_insensitive',
  }
}

export function readEditorPayloadFromDraft(draft: GlossaryDraft): GlossaryEditorPayload {
  const entries: GlossaryEditorPayload['entries'] = []
  const skippedMissingTarget: string[] = []
  for (const row of draft.entries) {
    const source = `${row.source || ''}`.trim()
    if (!source) continue
    const level = row.level || 'preserve'
    const typedTarget = `${row.target || ''}`.trim()
    const target = typedTarget || (level === 'preserve' ? source : '')
    if (!target) {
      skippedMissingTarget.push(source)
      continue
    }
    entries.push({
      source,
      target,
      level,
      match_mode: row.match_mode || 'case_insensitive',
      context: '',
      note: `${row.note || ''}`.trim(),
    })
  }
  return {
    name: `${draft.name || ''}`.trim() || '未命名术语表',
    entries,
    skippedMissingTarget,
  }
}

export function glossaryDisplayName(item: GlossaryListItem | null | undefined): string {
  return `${item?.name || item?.glossary_id || ''}`.trim() || '未命名术语表'
}

export function shouldBlockSave(payload: GlossaryEditorPayload): string | null {
  if (!payload.name.trim()) return '请填写术语表名称。'
  if (payload.skippedMissingTarget?.length > 0) return '固定译法/偏好译法需要填写译文。'
  return null
}

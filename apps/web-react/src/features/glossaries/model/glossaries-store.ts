/**
 * Glossaries view store — Zustand port of
 *   apps/web/src/pages/home/features/glossaries/glossaries-store.ts
 *
 * Pure view state + draft editing. Controller drives mutations.
 */
import { create } from 'zustand'
import {
  normalizeEntryForRow,
  readEditorPayloadFromDraft,
  type GlossaryDraft,
  type GlossaryEditorPayload,
  type GlossaryEntryRow,
  type GlossaryListItem,
} from './glossary-helpers'

export type GlossariesViewState = {
  items: GlossaryListItem[]
  selectedId: string
  draft: GlossaryDraft
  status: { message: string; tone: string }
  importVisible: boolean
  csvText: string
}

type Actions = {
  setList: (payload?: { items?: GlossaryListItem[]; selectedId?: string }) => void
  setDraft: (payload?: { name?: string; entries?: Array<Partial<GlossaryEntryRow>> }) => void
  setName: (name?: string) => void
  addEntryRow: (entry?: Partial<GlossaryEntryRow>) => void
  updateEntryField: (payload?: { index?: number; field?: keyof GlossaryEntryRow; value?: string }) => void
  removeEntryRow: (index: number) => void
  setStatus: (payload?: { message?: string; tone?: string }) => void
  setImportVisible: (visible?: boolean) => void
  setCsvText: (csvText?: string) => void
  // helpers mirroring viewPort
  readEditorPayload: () => GlossaryEditorPayload
  readCsvText: () => string
  clearCsvText: () => void
}

export type GlossariesViewStore = ReturnType<typeof createGlossariesStore>

export function createGlossariesStore() {
  return create<GlossariesViewState & Actions>((set, get) => ({
    items: [],
    selectedId: '',
    draft: { name: '', entries: [] },
    status: { message: '', tone: '' },
    importVisible: false,
    csvText: '',

    setList: ({ items = [], selectedId = '' } = {}) => set((s) => ({ ...s, items, selectedId })),
    setDraft: ({ name = '', entries = [] } = {}) =>
      set((s) => ({
        ...s,
        draft: { name, entries: entries.map((e) => normalizeEntryForRow(e)) },
      })),
    setName: (name = '') => set((s) => ({ ...s, draft: { ...s.draft, name } })),
    addEntryRow: (entry = {}) =>
      set((s) => ({
        ...s,
        draft: { ...s.draft, entries: [...s.draft.entries, normalizeEntryForRow(entry)] },
      })),
    updateEntryField: ({ index, field, value } = {}) => {
      if (field == null || index == null) return
      set((s) => ({
        ...s,
        draft: {
          ...s.draft,
          entries: s.draft.entries.map((row, idx) => (idx === index ? { ...row, [field]: value } : row)),
        },
      }))
    },
    removeEntryRow: (index) =>
      set((s) => ({
        ...s,
        draft: { ...s.draft, entries: s.draft.entries.filter((_, i) => i !== index) },
      })),
    setStatus: ({ message = '', tone = '' } = {}) => set((s) => ({ ...s, status: { message, tone } })),
    setImportVisible: (visible = false) => set((s) => ({ ...s, importVisible: Boolean(visible) })),
    setCsvText: (csvText = '') => set(() => ({ csvText: `${csvText || ''}` }) as any),

    readEditorPayload: () => readEditorPayloadFromDraft(get().draft),
    readCsvText: () => get().csvText,
    clearCsvText: () => set((s) => ({ ...s, csvText: '' })),
  }))
}

let defaultGlossariesStore: GlossariesViewStore | null = null
export function getGlossariesStore(): GlossariesViewStore {
  if (!defaultGlossariesStore) defaultGlossariesStore = createGlossariesStore()
  return defaultGlossariesStore
}

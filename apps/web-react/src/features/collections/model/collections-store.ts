import { create } from 'zustand'

type CollectionsState = {
  selectedCollectionId: string | null
  dialogOpen: boolean
  editingCollection: { collection_id: string; name: string } | null
  setSelectedCollectionId: (id: string | null) => void
  openDialog: (collection?: { collection_id: string; name: string } | null) => void
  closeDialog: () => void
}

export const useCollectionsStore = create<CollectionsState>((set) => ({
  selectedCollectionId: null,
  dialogOpen: false,
  editingCollection: null,
  setSelectedCollectionId: (id) => set({ selectedCollectionId: id }),
  openDialog: (collection) => set({ dialogOpen: true, editingCollection: collection ?? null }),
  closeDialog: () => set({ dialogOpen: false, editingCollection: null }),
}))

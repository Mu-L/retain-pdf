import { useQueryClient } from '@tanstack/react-query'
import { BookDetailDialog } from '../book-detail-dialog'
import { BookReaderDialog } from '../book-reader-dialog'
import { LibraryHomePage } from '../library-home-page'
import { LibrarySettingsDialog } from '../library-settings-dialog'
import { useLibraryController } from '../../model'

function LibraryToast({ error, message }: { error?: string; message?: string }) {
  const text = error || message

  if (!text) {
    return null
  }

  return (
    <div
      role="status"
      data-testid="library-toast"
      className="fixed bottom-5 left-1/2 z-40 -translate-x-1/2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-600 shadow-lg"
    >
      {text}
    </div>
  )
}

export function LibraryRoute() {
  const library = useLibraryController()
  const queryClient = useQueryClient()
  const { actions, selectedBook } = library
  const detailLoading = library.detailLoadingBookId === selectedBook?.id

  function handleRetry() {
    // Offline retry: re-run the router loader + library queries, then fall
    // back to a full reload so a dead network state always gets a fresh shot.
    try {
      void queryClient.invalidateQueries()
    } catch {
      // ignore — reload below still retries
    }
    if (typeof window !== 'undefined' && typeof window.location?.reload === 'function') {
      window.location.reload()
    }
  }

  // Loading state: first fetch with no cached books yet.
  if (library.isLoading && library.books.length === 0) {
    return (
      <main className="h-screen overflow-hidden bg-[#f5f5f7] px-4 py-4 text-neutral-950 sm:px-6 lg:px-8" data-testid="library-loading">
        <div className="mx-auto grid h-full w-full max-w-[1180px] place-items-center">
          <div className="grid gap-2 text-center">
            <h1 className="text-lg font-semibold">Library</h1>
            <p className="text-sm text-neutral-500">Loading books…</p>
          </div>
        </div>
      </main>
    )
  }

  // Error state: fetch failed with nothing to show (toast covers partial failures).
  if (library.loadError && library.books.length === 0) {
    return (
      <main className="h-screen overflow-hidden bg-[#f5f5f7] px-4 py-4 text-neutral-950 sm:px-6 lg:px-8" data-testid="library-error">
        <div className="mx-auto grid h-full w-full max-w-[1180px] place-items-center">
          <div className="grid max-w-sm gap-2 justify-items-center text-center">
            <h1 className="text-lg font-semibold">Library failed to load</h1>
            <p className="text-sm text-red-600">{library.loadError}</p>
            <p className="text-sm text-neutral-500">No books yet — upload a PDF to get started.</p>
            <button
              type="button"
              data-testid="library-retry"
              onClick={handleRetry}
              className="mt-1 inline-flex items-center rounded-full bg-neutral-950 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="h-screen overflow-hidden bg-[#f5f5f7] px-4 py-4 text-neutral-950 sm:px-6 lg:px-8" data-testid="library-route">
      <LibraryHomePage
        books={library.books}
        selectedBookId={library.selectedBookId}
        searchValue={library.searchQuery}
        sortKey={library.sortKey}
        statusFilterKey={library.statusFilterKey}
        selectionMode={library.selectionMode}
        selectedBookIds={library.selectedBookIds}
        onSearchChange={actions.setSearchQuery}
        onSelectSort={actions.setSortKey}
        onSelectStatus={actions.setStatusFilterKey}
        onSelectBook={actions.selectBook}
        onToggleSelectBook={actions.toggleSelectedBook}
        onOpenReader={actions.openReader}
        onDeleteBook={actions.deleteBook}
        onToggleSelectionMode={actions.toggleSelectionMode}
        onDeleteSelectedBooks={actions.deleteSelectedBooks}
        onClearSelection={actions.clearSelection}
        onOpenSettings={() => actions.setSettingsOpen(true)}
      />
      <LibraryToast error={library.loadError} message={library.toastText} />
      <BookDetailDialog
        book={selectedBook}
        open={library.detailOpen}
        readerDisabled={detailLoading}
        downloadDisabled={detailLoading || !selectedBook?.snapshot.pdfReady}
        downloading={library.downloadingBookId === selectedBook?.id}
        deleting={library.deletingBookId === selectedBook?.id}
        loading={detailLoading}
        onClose={() => actions.setDetailOpen(false)}
        onOpenReader={actions.openReader}
        onDownloadPdf={actions.downloadPdf}
        onDownloadArtifact={actions.downloadArtifact}
        onDeleteBook={actions.deleteBook}
      />
      <BookReaderDialog book={selectedBook} open={library.readerOpen} onClose={() => actions.setReaderOpen(false)} />
      <LibrarySettingsDialog open={library.settingsOpen} onClose={() => actions.setSettingsOpen(false)} />
    </main>
  )
}

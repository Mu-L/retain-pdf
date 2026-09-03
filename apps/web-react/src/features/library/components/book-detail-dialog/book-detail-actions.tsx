import { BookOpen, Download, Maximize2, Trash2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui'

import { libraryCopy } from '../../library-config'
import { SHELF_READER_ROUTE_TO } from '../../model/library-shelf-flow'
import type { BookDetailActionHandlers, BookDetailActionState } from './book-detail-types'

type BookDetailActionsProps = BookDetailActionHandlers &
  BookDetailActionState & {
    bookId: string
  }

export function BookDetailActions({
  bookId,
  readerDisabled,
  downloadDisabled,
  downloading,
  deleting,
  onOpenReader,
  onDownloadPdf,
  onDeleteBook,
}: BookDetailActionsProps) {
  const normalizedId = `${bookId || ''}`.trim()
  return (
    <div className="flex flex-wrap gap-2" data-testid="book-detail-actions">
      <Button variant="outline" size="sm" disabled={readerDisabled} data-testid="book-detail-open-reader" onClick={() => normalizedId && onOpenReader?.(normalizedId)}>
        <BookOpen />
        {libraryCopy.detail.actions.reader}
      </Button>
      {normalizedId ? (
        <Link
          to={SHELF_READER_ROUTE_TO}
          params={{ jobId: normalizedId } as never}
          data-testid="book-detail-open-full-reader"
          aria-disabled={readerDisabled ? true : undefined}
          onClick={(event) => {
            if (readerDisabled) event.preventDefault()
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 aria-disabled:pointer-events-none aria-disabled:opacity-50"
        >
          <Maximize2 className="size-3.5" />
          全屏对照
        </Link>
      ) : null}
      <Button size="sm" disabled={downloadDisabled || downloading} data-testid="book-detail-download-pdf" onClick={() => normalizedId && onDownloadPdf?.(normalizedId)}>
        <Download className={downloading ? 'animate-pulse' : undefined} />
        {downloading ? libraryCopy.detail.actions.downloadingPdf : libraryCopy.detail.actions.downloadPdf}
      </Button>
      <Button variant="ghost" size="sm" disabled={deleting} data-testid="book-detail-delete" onClick={() => normalizedId && onDeleteBook?.(normalizedId)}>
        <Trash2 className={deleting ? 'animate-pulse' : undefined} />
        {deleting ? libraryCopy.detail.actions.deletingBook : libraryCopy.detail.actions.deleteBook}
      </Button>
    </div>
  )
}

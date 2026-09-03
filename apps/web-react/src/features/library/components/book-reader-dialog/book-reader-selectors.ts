type BookReaderUrlBook = {
  id: string
}

export function sourcePdfUrl(book: BookReaderUrlBook) {
  return `/api/v1/jobs/${encodeURIComponent(book.id)}/artifacts/source_pdf`
}

export function translatedPdfUrl(book: BookReaderUrlBook) {
  return `/api/v1/jobs/${encodeURIComponent(book.id)}/pdf`
}

/**
 * 书架刀4：预览弹窗不重复实现 reader 路由，全屏对照统一跳该路由。
 * 与 model/library-shelf-flow.readerRouteHref 同源，这里留薄封装供弹窗 Link 使用。
 */
export function fullReaderRouteTo() {
  return '/reader/$jobId' as const
}

export function fullReaderRouteHref(bookId: string): string | null {
  const id = `${bookId || ''}`.trim()
  if (!id) return null
  return `/reader/${encodeURIComponent(id)}`
}

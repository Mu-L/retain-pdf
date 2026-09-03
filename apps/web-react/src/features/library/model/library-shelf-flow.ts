/**
 * 书架刀4 全链纯逻辑 — select / open / download / delete 四回调可测核心。
 *
 * 零 React / DOM / fetch，可被 node:test 直接 bundle 断言。
 * Controller 与弹窗只做薄封装：URL 拼装、确认语义、失败文案全部收敛在这里，
 * 任一步失败上层给 toast，不白屏。
 */

export const SHELF_FLOW_ACTION_KEYS = [
  'selectBook',
  'openReader',
  'downloadPdf',
  'downloadArtifact',
  'deleteBook',
] as const

export type ShelfFlowActionKey = (typeof SHELF_FLOW_ACTION_KEYS)[number]

export const SHELF_READER_ROUTE_TO = '/reader/$jobId' as const

export type ShelfBookLike = {
  id: string
  title?: string
  detail?: {
    artifacts?: Array<{
      key: string
      state?: string
      downloadUrl?: string
      fileName?: string
    }>
  }
}

function normalizedId(bookId: string | null | undefined): string {
  return `${bookId || ''}`.trim()
}

/** openReader 的路由目标：TanStack Router Link/navigate 共用，不用 window.open。 */
export function readerRouteParams(bookId: string): { jobId: string } | null {
  const id = normalizedId(bookId)
  if (!id) return null
  return { jobId: id }
}

/** 直链 href（<a> 兜底 / 测试断言用），与上面 params 同源。 */
export function readerRouteHref(bookId: string): string | null {
  const id = normalizedId(bookId)
  if (!id) return null
  return `/reader/${encodeURIComponent(id)}`
}

export type PdfDownloadTarget = {
  url: string
  fileName: string
  fromArtifact: boolean
}

/**
 * downloadPdf 的下载目标：优先已 ready 产物的 downloadUrl，
 * 否则回退 jobs/{id}/download。与 controller 历史行为一致。
 * 这里只拼“路径/原样 URL”，libraryResourceUrl 的 base 拼接由 api-client 完成。
 */
export function resolvePdfDownloadTarget(
  book: ShelfBookLike | null | undefined,
  bookId: string,
): PdfDownloadTarget | null {
  const id = normalizedId(bookId || book?.id)
  if (!id) return null
  const artifacts = book?.detail?.artifacts ?? []
  const readyUrl = artifacts.find(
    (artifact) => artifact?.state === 'ready' && `${artifact?.downloadUrl || ''}`.trim(),
  )?.downloadUrl
  if (readyUrl) {
    return {
      url: `${readyUrl}`.trim(),
      fileName: `${book?.title || id}.pdf`,
      fromArtifact: true,
    }
  }
  return {
    url: `jobs/${encodeURIComponent(id)}/download`,
    fileName: `${book?.title || id}.pdf`,
    fromArtifact: false,
  }
}

export type ArtifactDownloadTarget = {
  url: string
  fileName: string
}

/** downloadArtifact 的下载目标：不可下载（非 ready / 无 downloadUrl）返回 null，上层 toast。 */
export function resolveArtifactDownloadTarget(
  book: ShelfBookLike | null | undefined,
  artifactKey: string,
): ArtifactDownloadTarget | null {
  const key = `${artifactKey || ''}`.trim()
  if (!book || !key) return null
  const artifact = (book.detail?.artifacts ?? []).find((item) => item.key === key)
  const url = `${artifact?.downloadUrl || ''}`.trim()
  if (!artifact || artifact.state !== 'ready' || !url) return null
  return {
    url,
    fileName: artifact.fileName?.trim() || `${book.id}-${artifact.key}`,
  }
}

/**
 * deleteBook 的确认语义：把 window.confirm 包一层，方便 node:test 注入假 confirm。
 * confirmFn 返回 false => 取消删除，返回 null。
 */
export function confirmShelfDelete(
  confirmFn: ((message: string) => boolean) | undefined,
  message: string,
): boolean {
  if (typeof confirmFn !== 'function') return true
  try {
    return confirmFn(message) !== false
  } catch {
    return false
  }
}

/** 全链任一步失败的 toast 文案：保证非空，不白屏。 */
export function friendlyShelfError(error: unknown, fallback: string): string {
  const message = error instanceof Error ? error.message : `${error || ''}`.trim()
  if (message) return message
  return fallback || '操作失败，请稍后重试'
}

/** selectBook 的前置校验：空 id 直接 toast，不弹详情。 */
export function canOpenDetail(bookId: string | null | undefined): boolean {
  return Boolean(normalizedId(bookId))
}

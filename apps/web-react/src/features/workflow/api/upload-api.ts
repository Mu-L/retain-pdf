/**
 * Upload API — React wrapper around @retainpdf/api + pdfjs-dist
 *
 * Replaces apps/web/src/js/features/upload/{form-data,pdf-page-count,controller} ad-hoc wiring
 * with typed, TanStack Query friendly primitives. Keeps apps/web untouched.
 * Mock-freedom: no window.mock branching, pure fetch.
 */

import { API_PREFIX, buildApiUrl } from '@retainpdf/api/internal/runtime'
import { submitUploadRequest as apiSubmitUploadRequest } from '@retainpdf/api/http'

export type UploadResponsePayload = {
  page_count?: number
  upload_id?: string
  filename?: string
  bytes?: number
  [key: string]: unknown
}

export function buildUploadUrl(apiPrefix = API_PREFIX): string {
  return buildApiUrl(apiPrefix, 'uploads')
}

export function collectUploadFormData(file: File): FormData {
  const form = new FormData()
  form.append('file', file)
  return form
}

export function submitUploadRequest(
  url: string,
  formData: FormData,
  onProgress?: (loaded: number, total: number) => void,
): Promise<UploadResponsePayload> {
  return apiSubmitUploadRequest(url, formData, onProgress) as Promise<UploadResponsePayload>
}

/**
 * Count PDF pages via pdfjs-dist.
 * Lazy-loads pdfjs on demand; caller should handle the async nature via useUploadController.
 * Mirrors apps/web/src/js/features/upload/pdf-page-count.ts behavior.
 */
export async function countPdfPages(file: File): Promise<number> {
  if (!file) return 0
  // pdfjs-dist v5 uses explicit ESM; avoid bundling worker at import time.
  const pdfjsUrl = new URL('pdfjs-dist/build/pdf.mjs', import.meta.url)
  const workerUrl = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url)
  // Dynamic import via string mapping would need vite manual handling; use pdfjs-dist package entry.
  const pdfjs = await import('pdfjs-dist')
  if ((pdfjs as any).GlobalWorkerOptions) {
    ;(pdfjs as any).GlobalWorkerOptions.workerSrc = workerUrl.toString()
    void pdfjsUrl
  }
  const data = await file.arrayBuffer()
  const doc = await (pdfjs as any).getDocument({
    data,
    cMapUrl: new URL('pdfjs-dist/cmaps/', import.meta.url).toString(),
    cMapPacked: true,
    standardFontDataUrl: new URL('pdfjs-dist/standard_fonts/', import.meta.url).toString(),
    disableFontFace: true,
    disableRange: true,
    disableStream: true,
  }).promise
  try {
    return Number(doc?.numPages || 0)
  } finally {
    if (doc?.destroy) await doc.destroy().catch(() => {})
  }
}

export function formatByteLimit(bytes: number): string {
  const mb = Number(bytes) / (1024 * 1024)
  return Number.isFinite(mb) && mb > 0 ? `${Math.round(mb)}MB` : '当前'
}

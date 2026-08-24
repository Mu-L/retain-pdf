import {
  fetchJobArtifactsManifest,
  fetchJobMarkdown,
  fetchJobMarkdownDocument,
} from '@retainpdf/api/jobs-artifacts'
import { API_PREFIX, fetchProtected } from '@retainpdf/api/http'
import { askLibraryAi } from '@retainpdf/api/ai'
import { fetchJobPayload } from '@retainpdf/api/jobs'
import { fetchDocumentByJobId } from '@retainpdf/api/documents'
import { createFavorite, deleteFavorite, fetchFavorites } from '@retainpdf/api/favorites'
import {
  fetchReaderAiChat,
  fetchReaderMetadata,
  fetchReaderRegions,
} from '@retainpdf/api/reader'
import { fetchTranslationItem } from '@retainpdf/api/translation-debug'
import {
  findReadyManifestArtifact,
  resolveJobActions,
  resolveManifestArtifactUrl,
  resolveMarkdownAssetUrl,
  resolveResourceUrl,
  resolveSourcePdfDownloadName,
  resolveTranslatedPdfDownloadName,
} from '@retainpdf/domain/job'
import {
  loadMarkdownPayloadWithFallback,
  setReaderAdapters,
  type ReaderAdapters,
} from '@retainpdf/reader/adapters'
import { toast } from 'sonner'
import { getCredentialsStore } from '@/features/credentials'

let activeJobId = ''

const pdfWorkerUrl = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

const readerDataPort = Object.freeze({
  apiPrefix: '/api/v1',
  fetchProtected,
  async loadReaderPayload(jobId: string) {
    const [jobPayload, manifestPayload, regionsPayload, readerMetadata] = await Promise.all([
      fetchJobPayload(jobId),
      fetchJobArtifactsManifest(jobId),
      fetchReaderRegions(jobId).catch(() => ({ items: [] })),
      fetchReaderMetadata(jobId).catch(() => null),
    ])
    return { jobPayload, manifestPayload, regionsPayload, readerMetadata }
  },
  async loadMarkdownPayload(jobId: string) {
    return loadMarkdownPayloadWithFallback(
      () => fetchJobMarkdownDocument(jobId),
      () => fetchJobMarkdown(jobId),
    )
  },
  submitAiChat: fetchReaderAiChat,
  fetchRegionTranslationItem: fetchTranslationItem,
})

function queryParams() {
  return new URLSearchParams(globalThis.window?.location.search || '')
}

function resolveTranslatedPdf(jobPayload: any, manifestPayload: any): string {
  const actions = jobPayload ? resolveJobActions(jobPayload) : null
  if (actions?.pdfEnabled && actions.pdf) return actions.pdf
  for (const artifactKey of ['pdf', 'translated_pdf', 'result_pdf']) {
    const item = findReadyManifestArtifact(manifestPayload, artifactKey)
    if (item) return resolveResourceUrl(item.resource_url || item.resource_path)
  }
  return ''
}

type ReaderDownloadContext = {
  jobId?: string
  jobPayload?: any
  manifestPayload?: any
}

function resolveReaderDownloadUrls({ jobId = '', jobPayload, manifestPayload }: ReaderDownloadContext = {}) {
  const source = resolveManifestArtifactUrl(manifestPayload, 'source_pdf')
  const translated = resolveTranslatedPdf(jobPayload, manifestPayload)
  return {
    source,
    translated,
    sideBySide: source && translated && jobId
      ? resolveResourceUrl(`${API_PREFIX}/jobs/${encodeURIComponent(jobId)}/pdf/side-by-side`)
      : '',
  }
}

function resolveReaderDownloadName(
  action: string,
  { jobId = '', jobPayload, manifestPayload }: ReaderDownloadContext = {},
) {
  const suffix = action === 'source' ? 'source' : action === 'translated' ? 'translated' : 'side-by-side'
  const fallback = `${jobId || 'result'}-${suffix}.pdf`
  const state = {
    currentJobId: jobId,
    currentJobSnapshot: jobPayload,
    currentJobManifest: manifestPayload,
    currentJobManifestJobId: jobId,
  }
  if (action === 'source') return resolveSourcePdfDownloadName(state, fallback)
  if (action === 'translated') return resolveTranslatedPdfDownloadName(state, fallback)
  return fallback
}

function fileNameFromDisposition(disposition: string | null): string {
  const utf8 = disposition?.match(/filename\*=UTF-8''([^;]+)/i)?.[1]
  if (utf8) return decodeURIComponent(utf8)
  return disposition?.match(/filename="?([^";]+)"?/i)?.[1] || ''
}

async function downloadProtectedResource(
  request: typeof fetch,
  url: string,
  fallbackName: string,
  preferredName = '',
  onStatus?: ((status: Record<string, unknown>) => void) | null,
  onBusy?: ((busy: boolean, status?: string) => void) | null,
) {
  onBusy?.(true, '下载中...')
  try {
    const response = await request(url)
    if (!response.ok) throw new Error(`下载失败: ${response.status}`)
    const blob = await response.blob()
    const filename = preferredName || fileNameFromDisposition(response.headers.get('content-disposition')) || fallbackName
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = filename
    anchor.rel = 'noopener noreferrer'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(objectUrl)
    onStatus?.({ filename, receivedBytes: blob.size, totalBytes: blob.size, percent: 100, done: true })
  } finally {
    onBusy?.(false)
  }
}

function failDownloadToast(message = '下载失败') {
  toast.error(message)
}

const readerAdapters = {
  apiPrefix: API_PREFIX,
  isMockMode: () => false,
  resolveResourceUrl: (url) => resolveResourceUrl(url),
  fetchProtected,
  resolvePdfjsVendorUrl: (relativePath = '') => {
    if (relativePath === 'build/pdf.worker.mjs') return pdfWorkerUrl
    return `/pdfjs/${relativePath.replace(/^\/+/, '')}`
  },
  defaultReaderDataPort: readerDataPort,
  defaultReaderPageConfigPort: {
    messageTargetOrigin: () => globalThis.window?.location.origin || '*',
    readerJobId: () => activeJobId,
  },
  resolveReaderAnchor: () => {
    const params = queryParams()
    const rawPageIdx = params.get('page_idx')
    const blockId = `${params.get('block_id') || ''}`.trim()
    const pageIdx = rawPageIdx == null || rawPageIdx.trim() === '' ? null : Number(rawPageIdx)
    if ((pageIdx == null || !Number.isFinite(pageIdx)) && !blockId) return null
    return { pageIdx: pageIdx != null && Number.isFinite(pageIdx) ? pageIdx : null, blockId }
  },
  resolveReaderDocumentId: () => `${queryParams().get('document_id') || ''}`.trim(),
  resolveReaderJobId: () => activeJobId,
  resolveReaderArtifactUrl: (item: any) => resolveResourceUrl(item?.resource_url || item?.resource_path),
  resolveReaderSourcePdf: (manifestPayload: any) =>
    resolveManifestArtifactUrl(manifestPayload, 'source_pdf')
      || findReadyManifestArtifact(manifestPayload, 'source_pdf'),
  resolveReaderTranslatedPdfUrl: resolveTranslatedPdf,
  resolveReaderDownloadUrls,
  resolveReaderDownloadName,
  downloadProtectedResource,
  failDownloadToast,
  fetchDocumentByJobId,
  createFavorite,
  fetchFavorites,
  deleteFavorite,
  credentialsPort: {
    getCredentials: () => getCredentialsStore().getState().getCredentials(),
  },
  askDocumentAi: askLibraryAi,
  resolveMarkdownAssetUrl,
} satisfies ReaderAdapters

setReaderAdapters(readerAdapters)

export function setReaderHostJobId(jobId: string): string {
  activeJobId = `${jobId || ''}`.trim()
  return activeJobId
}

import type { StageKey, StatusSnapshot } from '@/features/status'
import type {
  ArtifactDisplayItemView,
  LibraryBookDetailView,
  LibraryBookListItemView,
} from '@retainpdf/contracts/library-books'

import type { LibraryBook, LibraryBookArtifact, LibraryBookStatus } from '../types'
import { libraryResourceUrl } from './library-api-client'

const stageMap: Record<string, StageKey> = {
  ocr: 'ocr',
  ocr_upload: 'ocr',
  ocr_processing: 'ocr',
  normalizing: 'ocr',
  translate: 'translate',
  translating: 'translate',
  translation_batches: 'translate',
  continuation_review: 'translate',
  page_policies: 'translate',
  render: 'render',
  rendering: 'render',
  saving: 'render',
  done: 'done',
  finished: 'done',
}

type LibraryProgressSource = {
  status: string
  stage?: string | null
  stage_detail?: string | null
  progress?: {
    current?: number | null
    total?: number | null
  } | null
}

export function jobListToLibraryBooks(items: LibraryBookListItemView[]): LibraryBook[] {
  return items
    .filter((item) => !item.job_id.endsWith('-ocr'))
    .map(jobListItemToLibraryBook)
}

export function jobDetailToLibraryBook(detail: LibraryBookDetailView, previous?: LibraryBook): LibraryBook {
  const status = mapJobStatus(detail.status)
  const stage = mapStage(detail.stage, status)
  const progressText = progressLabel(detail)
  const artifacts = buildDetailArtifacts(detail.artifacts, previous?.detail?.artifacts)

  return {
    id: detail.job_id,
    title: detail.title?.trim() || detail.source_file_name?.trim() || previous?.title || detail.job_id,
    authors: detail.authors?.trim() || previous?.authors || '',
    pages: detail.page_count ?? previous?.pages ?? 0,
    status,
    updatedAt: previous?.updatedAt || '',
    progressLabel: progressText,
    coverTone: previous?.coverTone ?? coverToneForJob(detail.job_id),
    coverUrl: normalizeOptionalResourceUrl(detail.cover_url) || previous?.coverUrl,
    thumbnailUrl: normalizeOptionalResourceUrl(detail.thumbnail_url) || previous?.thumbnailUrl,
    detail: {
      sourceLanguage: detail.source_language?.trim() || previous?.detail?.sourceLanguage || '',
      targetLanguage: detail.target_language?.trim() || previous?.detail?.targetLanguage || '',
      // The library detail wire contract intentionally omits list-only metadata.
      // Preserve it from the existing UI view model instead of inventing values.
      workflow: previous?.detail?.workflow || '',
      ocrProvider: previous?.detail?.ocrProvider ?? '',
      translationEngine: previous?.detail?.translationEngine ?? '',
      fileSize: formatBytes(detail.file_size_bytes) || previous?.detail?.fileSize || '',
      createdAt: previous?.detail?.createdAt || '',
      description: progressText || previous?.detail?.description || '',
      tags: buildDetailTags(detail, previous),
      artifacts,
    },
    snapshot: buildSnapshot(detail, stage, {
      pdfReady: artifactIsReady(artifacts, ['pdf', 'output_pdf', 'translated_pdf', 'result_pdf']) || previous?.snapshot.pdfReady,
      readerReady: artifactIsReady(artifacts, ['markdown', 'markdown_raw']) || previous?.snapshot.readerReady,
    }),
  }
}

function jobListItemToLibraryBook(item: LibraryBookListItemView): LibraryBook {
  const pages = item.page_count ?? 0
  const status = mapJobStatus(item.status)
  const stage = mapStage(item.stage, status)
  const progressText = progressLabel(item)

  return {
    id: item.job_id,
    title: item.title || item.display_name || item.source_file_name || item.job_id,
    authors: item.authors || '',
    pages,
    status,
    updatedAt: formatUpdatedAt(item.updated_at),
    progressLabel: progressText,
    coverTone: coverToneForJob(item.job_id),
    coverUrl: normalizeOptionalResourceUrl(item.cover_url),
    thumbnailUrl: normalizeOptionalResourceUrl(item.thumbnail_url),
    detail: {
      sourceLanguage: '',
      targetLanguage: '',
      workflow: '',
      ocrProvider: '',
      translationEngine: '',
      fileSize: '',
      createdAt: formatUpdatedAt(item.created_at),
      description: item.stage_detail || progressText,
      tags: [item.status],
      artifacts: buildListArtifacts(item),
    },
    snapshot: buildListSnapshot(item, stage),
  }
}

function normalizeOptionalResourceUrl(value?: string | null) {
  return value?.trim() ? libraryResourceUrl(value) : undefined
}

function mapJobStatus(status: string): LibraryBookStatus {
  if (status === 'succeeded') {
    return 'ready'
  }
  if (status === 'queued') {
    return 'queued'
  }
  return 'processing'
}

function mapStage(stage: string | null | undefined, status: LibraryBookStatus): StageKey {
  if (status === 'ready') {
    return 'done'
  }
  if (status === 'queued') {
    return 'ocr'
  }
  const normalized = `${stage ?? ''}`.trim()
  return stageMap[normalized] ?? 'translate'
}

function buildListSnapshot(item: LibraryBookListItemView, activeStage: StageKey): StatusSnapshot {
  return buildSnapshot(item, activeStage, {
    pdfReady: item.output_pdf_ready,
    readerReady: item.markdown_ready,
  })
}

function buildSnapshot(
  item: LibraryProgressSource,
  activeStage: StageKey,
  readiness: Pick<StatusSnapshot, 'pdfReady' | 'readerReady'>,
): StatusSnapshot {
  return {
    activeStage,
    selectedStage: activeStage,
    elapsedText: item.status === 'succeeded' ? '完成' : item.status === 'queued' ? '排队中' : '处理中',
    ...readiness,
    stageProgress: {
      [activeStage]: {
        current: item.progress?.current,
        total: item.progress?.total,
        text: progressLabel(item),
        indeterminate: !item.progress?.total,
      },
    },
  }
}

function progressLabel(item: LibraryProgressSource) {
  if (item.stage_detail?.trim()) {
    return item.stage_detail
  }
  if (item.progress?.current != null && item.progress?.total != null) {
    return `${item.progress.current}/${item.progress.total}`
  }
  return item.status === 'queued' ? '等待开始' : item.status === 'succeeded' ? '已完成' : '处理中'
}

function buildListArtifacts(item: LibraryBookListItemView): LibraryBookArtifact[] {
  return [
    { key: 'pdf', label: '译文 PDF', state: item.output_pdf_ready ? 'ready' : 'processing', detail: item.output_pdf_ready ? '可下载' : '等待生成' },
    { key: 'markdown', label: 'Markdown', state: item.markdown_ready ? 'ready' : 'processing', detail: item.markdown_ready ? '可查看' : '等待生成' },
    { key: 'bundle', label: '任务包', state: item.bundle_ready ? 'ready' : 'processing', detail: item.bundle_ready ? '可下载' : '等待生成' },
  ]
}

function buildDetailArtifacts(
  artifacts: ArtifactDisplayItemView[],
  fallback: LibraryBookArtifact[] = [],
): LibraryBookArtifact[] {
  if (!artifacts?.length) {
    return fallback
  }

  return artifacts.map((artifact) => ({
    key: artifact.key,
    label: artifact.label,
    state: artifact.ready ? 'ready' : 'processing',
    detail: artifact.file_name || formatBytes(artifact.size_bytes) || artifact.kind,
    kind: artifact.kind,
    fileName: artifact.file_name ?? undefined,
    sizeBytes: artifact.size_bytes ?? undefined,
    downloadUrl: artifact.download_url ?? undefined,
  }))
}

function buildDetailTags(detail: LibraryBookDetailView, previous?: LibraryBook) {
  return [
    detail.status,
    detail.source_language,
    detail.target_language,
    ...(previous?.detail?.tags ?? []),
  ].filter((tag, index, tags): tag is string => Boolean(tag?.trim()) && tags.indexOf(tag) === index)
}

function artifactIsReady(artifacts: LibraryBookArtifact[], keys: string[]) {
  return artifacts.some((artifact) => keys.includes(artifact.key) && artifact.state === 'ready')
}

function formatBytes(value?: number | null) {
  if (!Number.isFinite(value) || !value) {
    return ''
  }

  const units = ['B', 'KB', 'MB', 'GB']
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const fixed = size >= 10 || unitIndex === 0 ? size.toFixed(0) : size.toFixed(1)
  return `${fixed} ${units[unitIndex]}`
}

function coverToneForJob(jobId: string): LibraryBook['coverTone'] {
  const hash = Array.from(jobId).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return hash % 3 === 0 ? 'dark' : hash % 3 === 1 ? 'medium' : 'light'
}

function formatUpdatedAt(value: string) {
  if (!value) {
    return ''
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

/**
 * Page range helpers — React-idiomatic port of the page-range logic inside
 *   apps/web/src/js/features/upload/controller.ts
 *
 * Pure. No store/DOM. Tested parity with upload.test.mjs semantics.
 */

export function normalizePageRangeValue(startValue = '', endValue = ''): string {
  const start = `${startValue ?? ''}`.trim()
  const end = `${endValue ?? ''}`.trim()
  if (!start && !end) return ''
  if (start && end) return start === end ? start : `${start}-${end}`
  return start || end
}

export function normalizePageNumberInput(value: unknown): '' | number {
  const text = `${value ?? ''}`.trim()
  if (!text) return ''
  const page = Number(text)
  if (!Number.isFinite(page)) return ''
  return Math.max(1, Math.trunc(page))
}

export type ConstrainPageRangesInput = {
  start: string
  end: string
  maxPage: number
  source?: string
}

export type ConstrainPageRangesOutput = {
  start: string
  end: string
  maxPage: number
  applied: string
}

export function constrainPageRanges({
  start: rawStart,
  end: rawEnd,
  maxPage = 0,
  source = '',
}: ConstrainPageRangesInput): ConstrainPageRangesOutput {
  let start: '' | number = normalizePageNumberInput(rawStart)
  let end: '' | number = normalizePageNumberInput(rawEnd)

  if (maxPage > 0) {
    if (start !== '') start = Math.min(Number(start), maxPage)
    if (end !== '') end = Math.min(Number(end), maxPage)
  }

  if (start !== '' && end !== '' && start > end) {
    if (source === 'end') end = start
    else start = end
  }

  const nextStart = start === '' ? '' : `${start}`
  const nextEnd = end === '' ? '' : `${end}`
  return {
    start: nextStart,
    end: nextEnd,
    maxPage,
    applied: normalizePageRangeValue(nextStart, nextEnd),
  }
}

export type ValidatePageRangesInput = {
  start: string
  end: string
  maxPage: number
}

export type ValidatePageRangesResult =
  | { ok: true; applied: string }
  | { ok: false; reason: string }

export function validatePageRanges({ start: rawStart, end: rawEnd, maxPage = 0 }: ValidatePageRangesInput): ValidatePageRangesResult {
  const start = `${rawStart ?? ''}`.trim()
  const end = `${rawEnd ?? ''}`.trim()
  if ((start && Number(start) < 1) || (end && Number(end) < 1)) {
    return { ok: false, reason: '页码必须从 1 开始' }
  }
  if ((start && maxPage && Number(start) > maxPage) || (end && maxPage && Number(end) > maxPage)) {
    return { ok: false, reason: `页码不能超过 ${maxPage}` }
  }
  if (start && end && Number(start) > Number(end)) {
    return { ok: false, reason: '起始页不能大于结束页' }
  }
  if (maxPage && start && end && Number(end) - Number(start) + 1 > maxPage) {
    return { ok: false, reason: `页码区间不能超过 ${maxPage} 页` }
  }
  return { ok: true, applied: normalizePageRangeValue(start, end) }
}

export function pageRangeMax(uploadedPageCount: number, frontMaxPageCount = 999): number {
  const fromUpload = Number(uploadedPageCount || 0)
  if (Number.isFinite(fromUpload) && fromUpload > 0) return fromUpload
  return Number(frontMaxPageCount || 0) || 0
}

export function currentPageRangesFromParts(start: string, end: string): string {
  return normalizePageRangeValue(start, end)
}

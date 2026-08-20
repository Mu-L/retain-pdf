import { stripOcrSuffix } from '@retainpdf/api/utils/strip-ocr'

export function mockLibraryEnabled() {
  return import.meta.env.VITE_RETAIN_USE_MOCK_LIBRARY === '1'
}

export function normalizedBookId(bookId: string) {
  return stripOcrSuffix(bookId)
}

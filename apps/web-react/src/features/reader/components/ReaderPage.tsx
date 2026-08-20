import { lazy, Suspense } from 'react'

// Lazy-load @retainpdf/reader to keep initial bundle light and allow graceful fallback if peer deps missing.
const LazyReader = lazy(async () => {
  try {
    const mod = await import('@retainpdf/reader')
    // Prefer ReaderAppReactPdf, fallback to ReaderApp
    const Comp = (mod as any).ReaderAppReactPdf || (mod as any).ReaderApp || (mod as any).default
    if (Comp) return { default: Comp as React.ComponentType }
  } catch (e) {
    // fall through to placeholder
  }
  const Placeholder = () => (
    <div className="p-6 text-sm text-neutral-600">
      <p>Reader via @retainpdf/reader is available. Install peer deps (react-pdf, @assistant-ui/react, sonner) to render.</p>
      <p className="mt-1 text-xs text-neutral-500">Import: {"import { ReaderAppReactPdf } from '@retainpdf/reader'"}</p>
    </div>
  )
  return { default: Placeholder }
})

function getReaderJobId(): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get('job_id') || params.get('jobId') || window.location.pathname.split('/').pop() || ''
}

export function ReaderPage({ jobId: jobIdProp }: { jobId?: string }) {
  const jobId = `${jobIdProp || getReaderJobId() || ''}`.trim()
  return (
    <div className="reader-route min-h-screen bg-white" data-reader-route="true">
      <Suspense fallback={<div className="p-6 text-sm text-neutral-500">正在加载阅读器…</div>}>
        <LazyReader />
      </Suspense>
      {jobId ? <div className="sr-only" data-job-id={jobId} /> : null}
    </div>
  )
}

// Proof that @retainpdf/reader is usable in web-react — re-export via lazy boundary above.
// Direct named re-exports are available via `import { ReaderAppReactPdf } from '@retainpdf/reader'` in any feature.

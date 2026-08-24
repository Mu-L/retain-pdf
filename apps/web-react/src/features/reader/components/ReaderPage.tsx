import { useEffect } from 'react'
import { ReaderAppReactPdf } from '@retainpdf/reader'
import readerStyles from '@retainpdf/reader/styles.css?raw'
import { setReaderHostJobId } from '../reader-host-adapters'

const READER_STYLE_ID = 'retainpdf-reader-package-styles'

function useReaderPackageStyles() {
  useEffect(() => {
    if (document.getElementById(READER_STYLE_ID)) return
    const style = document.createElement('style')
    style.id = READER_STYLE_ID
    style.textContent = readerStyles
    document.head.appendChild(style)
    return () => style.remove()
  }, [])
}

function getReaderJobId(): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get('job_id') || params.get('jobId') || window.location.pathname.split('/').pop() || ''
}

export function ReaderPage({ jobId: jobIdProp }: { jobId?: string }) {
  const jobId = `${jobIdProp || getReaderJobId() || ''}`.trim()
  useReaderPackageStyles()
  setReaderHostJobId(jobId)
  return (
    <div className="reader-route min-h-screen bg-white" data-reader-route="true">
      <ReaderAppReactPdf key={jobId} />
      {jobId ? <div className="sr-only" data-job-id={jobId} /> : null}
    </div>
  )
}

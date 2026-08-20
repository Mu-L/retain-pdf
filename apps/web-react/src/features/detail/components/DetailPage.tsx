import { useDetailQuery } from '../model/use-detail-query'

function getJobIdFromLocation(): string {
  if (typeof window === 'undefined') return ''
  const params = new URLSearchParams(window.location.search)
  return params.get('job_id') || params.get('jobId') || window.location.pathname.split('/').pop() || ''
}

export function DetailPage({ jobId: jobIdProp }: { jobId?: string }) {
  const jobId = `${jobIdProp || getJobIdFromLocation() || ''}`.trim()
  const query = useDetailQuery(jobId)

  if (!jobId) {
    return (
      <main className="detail-page mx-auto max-w-[960px] p-6">
        <h1 className="text-lg font-semibold">任务详情</h1>
        <p className="mt-2 text-sm text-neutral-500">缺少 job_id，请通过 ?job_id=... 打开。</p>
      </main>
    )
  }

  if (query.isLoading) {
    return (
      <main className="detail-page mx-auto max-w-[960px] p-6">
        <h1 className="text-lg font-semibold">任务详情</h1>
        <p className="mt-2 text-sm text-neutral-500">正在加载 {jobId}…</p>
      </main>
    )
  }

  if (query.error) {
    return (
      <main className="detail-page mx-auto max-w-[960px] p-6">
        <h1 className="text-lg font-semibold">任务详情</h1>
        <p className="mt-2 text-sm text-red-600">{(query.error as Error).message}</p>
        <p className="mt-1 text-xs text-neutral-500">Job ID: {jobId}</p>
      </main>
    )
  }

  const job: any = query.data || {}
  return (
    <main className="detail-page mx-auto max-w-[960px] p-6" data-detail-page="true">
      <h1 className="text-lg font-semibold">任务详情</h1>
      <section className="mt-4 grid gap-4">
        <div className="rounded border bg-white p-4">
          <div className="text-xs text-neutral-500">Job ID</div>
          <div className="font-mono text-sm">{job.job_id || jobId}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-xs text-neutral-500">状态</div>
          <div className="text-sm">{job.status || job.stage || '-'}</div>
        </div>
        <div className="rounded border bg-white p-4">
          <div className="text-xs text-neutral-500">阶段</div>
          <div className="text-sm">{job.stage || job.display_stage || '-'}</div>
        </div>
        {job.artifacts ? (
          <div className="rounded border bg-white p-4">
            <div className="text-xs text-neutral-500">产物</div>
            <pre className="mt-1 overflow-auto text-xs">{JSON.stringify(job.artifacts, null, 2)}</pre>
          </div>
        ) : null}
        <details className="rounded border bg-white p-4">
          <summary className="cursor-pointer text-sm">原始数据</summary>
          <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(job, null, 2)}</pre>
        </details>
      </section>
    </main>
  )
}

// Re-export as SPA route entry (DetailApp compat)
export const DetailApp = DetailPage

import { fetchJobPayload } from '@retainpdf/api/jobs'
import { fetchProtected as apiFetchProtected } from '@retainpdf/api/http'

export async function fetchDetailJob(jobId: string) {
  const id = `${jobId || ''}`.trim()
  if (!id) throw new Error('缺少 job_id')
  return fetchJobPayload(id)
}

export async function fetchProtected(url: string) {
  return apiFetchProtected(url)
}

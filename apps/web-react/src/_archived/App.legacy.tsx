/**
 * Archived legacy shell — snapshot of src/App.tsx at SPA-default cutover (2026-08-20).
 * Original manual hash/path routing (pre-TanStack Router). Do not edit.
 * Active fallback remains at src/App.tsx (VITE_USE_SPA=false); this file is reference-only.
 * @see src/app-flags.ts — USE_SPA defaults true
 * @see src/router.tsx — current default shell
 */
import { useEffect, useState } from 'react'
import { LibraryRoute } from '@/features/library'
import { CollectionsView, FavoritesView } from '@/features/collections'
import { DetailPage } from '@/features/detail'
import { ReaderPage } from '@/features/reader'

type RouteKey = 'library' | 'collections' | 'favorites' | 'detail' | 'reader'

function getRoute(): { key: RouteKey; jobId?: string } {
  if (typeof window === 'undefined') return { key: 'library' }
  const { pathname, search, hash } = window.location
  // SPA path routes take precedence
  if (pathname.startsWith('/reader')) {
    const segs = pathname.split('/').filter(Boolean)
    const jobId = segs[1] || new URLSearchParams(search).get('job_id') || new URLSearchParams(search).get('jobId') || ''
    return { key: 'reader', jobId }
  }
  if (pathname.startsWith('/jobs') || pathname.startsWith('/detail')) {
    const segs = pathname.split('/').filter(Boolean)
    const jobId = segs[1] || new URLSearchParams(search).get('job_id') || new URLSearchParams(search).get('jobId') || ''
    return { key: 'detail', jobId }
  }
  // hash fallback: #/collections, #/favorites, #/reader/xyz, #/jobs/xyz
  if (hash) {
    const h = hash.replace(/^#\/?/, '')
    if (h.startsWith('reader')) return { key: 'reader', jobId: h.split('/')[1] || '' }
    if (h.startsWith('jobs') || h.startsWith('detail')) return { key: 'detail', jobId: h.split('/')[1] || '' }
    if (h === 'collections' || h === 'categories') return { key: 'collections' }
    if (h === 'favorites') return { key: 'favorites' }
  }
  const params = new URLSearchParams(search)
  const tab = `${params.get('tab') || ''}`.trim().toLowerCase()
  const jobId = params.get('job_id') || params.get('jobId') || ''
  if (jobId && (tab === 'detail' || pathname.includes('detail'))) return { key: 'detail', jobId }
  if (tab === 'collections' || tab === 'categories') return { key: 'collections' }
  if (tab === 'favorites') return { key: 'favorites' }
  if (tab === 'reader' || params.get('reader')) return { key: 'reader', jobId }
  if (jobId) return { key: 'detail', jobId }
  return { key: 'library' }
}

export default function App() {
  const [route, setRoute] = useState(() => getRoute())

  useEffect(() => {
    const onPop = () => setRoute(getRoute())
    window.addEventListener('popstate', onPop)
    window.addEventListener('hashchange', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('hashchange', onPop)
    }
  }, [])

  if (route.key === 'reader') return <ReaderPage jobId={route.jobId} />
  if (route.key === 'detail') return <DetailPage jobId={route.jobId} />
  if (route.key === 'collections') {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-4">
        <CollectionsView />
      </main>
    )
  }
  if (route.key === 'favorites') {
    return (
      <main className="min-h-screen bg-[#f5f5f7] p-4">
        <FavoritesView />
      </main>
    )
  }
  return <LibraryRoute />
}

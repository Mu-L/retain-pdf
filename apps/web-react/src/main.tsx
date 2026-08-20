import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import './index.css'
import App from './App.tsx' // legacy fallback — archived copy at src/_archived/App.legacy.tsx, opt-out via VITE_USE_SPA=false
import { appQueryClient } from './lib/query-client'
import { USE_SPA } from './app-flags'
import { router } from './router'

function SpaApp() {
  return <RouterProvider router={router} />
}

// Default SPA; legacy App kept as opt-out fallback (VITE_USE_SPA=false) until rollback window closes
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={appQueryClient}>{USE_SPA ? <SpaApp /> : <App />}</QueryClientProvider>
  </StrictMode>,
)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:41000',
        changeOrigin: true,
        xfwd: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@retainpdf/api': fileURLToPath(new URL('../../packages/api/src', import.meta.url)),
      '@retainpdf/domain': fileURLToPath(new URL('../../packages/domain/src', import.meta.url)),
    },
  },
})

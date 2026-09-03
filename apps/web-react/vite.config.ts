import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const webReactRoot = fileURLToPath(new URL('.', import.meta.url))
const repoRoot = path.resolve(webReactRoot, '../..')

// 抄 apps/web/scripts/build-js-bundle.mjs:72 resolveMathJaxPackageVersion ——
// mathjax-full/js/components/version.js 在 PACKAGE_VERSION 未定义时走
// eval('require') 读 package.json，浏览器 ESM 下触发回退（见 build EVAL 警告）。
// Vite define 在构建期做词法替换，把该分支直接常量化。
function resolveMathJaxPackageVersion(): string {
  try {
    const pkgPath = path.join(repoRoot, 'node_modules/mathjax-full/package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    return typeof pkg.version === 'string' ? pkg.version : '3.2.1'
  } catch {
    return '3.2.1'
  }
}

// SPA 运行时版本号 —— 读 monorepo 根 package.json/version，与
// src/features/app-update/app-version.ts 的静态回退值保持一致。
function resolveAppVersion(): string {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'))
    return typeof pkg.version === 'string' ? pkg.version : '4.1.0'
  } catch {
    return '4.1.0'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    PACKAGE_VERSION: JSON.stringify(resolveMathJaxPackageVersion()),
    __APP_VERSION__: JSON.stringify(resolveAppVersion()),
  },
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
    // NOTE(P0-1): @retainpdf/* 不设源码别名，统一走各包 package.json exports → dist。
    // apps/web 的 esbuild 构建同样只保留 @ → src 单别名（见 build-js-bundle.mjs 注释：
    // 禁止在宿主构建里维护第二份 subpath 映射）；workspace dist 由 prebuild/prepare:workspace
    // 统一产出。另见 tests/workspace-package-boundary.test.mjs 的显式断言。
    alias: [
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
    ],
    dedupe: ['react', 'react-dom', 'pdfjs-dist'],
  },
})

// Vite define 注入（见 vite.config.ts resolveAppVersion，读 monorepo 根
// package.json/version）。typeof 守卫保证 vitest/tsc 无 define 时不抛
// ReferenceError，回退值须与根 version 手动同步。
declare const __APP_VERSION__: string | undefined

export const APP_VERSION: string =
  typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "4.1.0"
export const GITHUB_REPO = "wxyhgk/retain-pdf"

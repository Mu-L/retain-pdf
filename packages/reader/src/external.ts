// 兼容层：monorepo 内代理 apps/web 的 external，真独立包时由 host 通过 adapters 注入
// 保持与 apps/web/src/pages/reader/external.ts 同步，逐步收敛到 adapters.ts
export * from "../../../apps/web/src/pages/reader/external.js";

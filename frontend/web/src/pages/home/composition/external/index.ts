// composition/external/index — re-export all sub-barrels for backward compat
// Keep external.ts as `export * from "./external/index.js"`; consumers can also import specific sub-barrel.

export * from "./config.js";
export * from "./state.js";
export * from "./job.js";
// API 网关已迁至 src/platform/api（跨功能基础设施，不属主页装配层）。
// 此处继续转出，供仍从 composition/external 全量 barrel 取用的调用方；
// 随蓝图批次 5 各调用方改直连后删除。
export * from "@/platform/api/index.js";
export * from "./features.js";
export * from "./shared.js";

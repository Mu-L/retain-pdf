// composition 层对 src/js/* 的统一出口（backward compat）。
// 新代码优先从 ./external/<sub-barrel>.js 按需导入以降低耦合；本文件保留为全量 re-export。
export * from "./external/index.js";

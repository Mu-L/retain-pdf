// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖（page-state 为纯常量/纯函数，无需注入）
export * from "../../../../../packages/reader/src/shared/state/page-state.js";

// P0-2 UI 收敛后的统一出口：唯一真相源为 @retainpdf/ui（packages/ui）。
//
// - `export *` 提供 Button/buttonVariants、Radix Dialog 部件、Tabs、
//   Toaster、Tooltip、cn（与上游 index.ts 保持一致）。
// - 下面的显式导出是 compat 垫片（优先级高于 `export *`，按 ESM 语义
//   显式命名导出胜出）：
//   - `Dialog`：web-react 业务弹窗（open/title/closeLabel/backdropCloseLabel/
//     hideHeader/contentClassName/onClose），与上游 Radix `Dialog`（Root）
//     完全不同构，6 个调用点依赖旧 API，本次保留本地实现（见 dialog.tsx），
//     待 P0-3 迁移到 Radix 复合组件后再移除垫片。
//     需要 Radix 原生 Dialog 时请 `import { Dialog } from "@retainpdf/ui"`。
//   - `Progress`：上游 packages/ui 暂无该原语，保留本地实现（见 progress.tsx）。
export * from "@retainpdf/ui";
export { Dialog } from "./dialog";
export type { DialogProps } from "./dialog";
export { Progress } from "./progress";
export type { ButtonProps } from "./button";

// P0-2 UI 收敛：Toaster 唯一真相源为 @retainpdf/ui（packages/ui）。
// web-react 此前缺失该原语，本文件补齐 deep-path 导入对称性。
// 注意：上游 Toaster 固定 light 主题（无 next-themes 依赖），与 web-react
// 单一浅色主题一致。
export { Toaster } from "@retainpdf/ui/components/ui/sonner";

// 薄包装：真值已抽至 @retainpdf/reader，保留原路径兼容
// 新增代码请改 packages/reader/src/shared/ai/conversation-store.ts，本文件仅 re-export（经 apps/web/src/shared/ai 注入宿主依赖）
export * from "../../../shared/ai/conversation-store.js";

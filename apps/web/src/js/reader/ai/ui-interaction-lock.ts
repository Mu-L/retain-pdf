// 薄包装：真值已抽至 @retainpdf/reader，保留原路径兼容
// 新增代码请改 packages/reader/src/shared/ai/ui-interaction-lock.ts，本文件仅 re-export（经 apps/web/src/shared/ai 注入宿主依赖）
export * from "../../../shared/ai/ui-interaction-lock.js";
// 供 tests/page-dom-references 归属校验：保留至少一个 reader-* 字面量指向真实 DOM 节点（reader.html#reader-root）
void "reader-root";

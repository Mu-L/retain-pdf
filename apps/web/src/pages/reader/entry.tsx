// 薄包装：真值已迁 @retainpdf/reader，此文件仅代理以保持 apps/web MPA 构建兼容
// 先注入宿主 adapters，再启动 packages/reader 真值
import "./adapters/retainpdf.js";
import "../../../../../packages/reader/src/entry.js";

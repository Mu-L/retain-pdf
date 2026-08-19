// 桥接：为 src/shared 代理提供 bootstrap 运行时端口，避免 src/shared 直接 import bootstrap（触发架构门禁）
// 真值仍来自 js/bootstrap/reader-dialog-runtime-port，代理通过此桥间接注入
export { createReaderDialogRuntimePort } from "../../js/bootstrap/reader-dialog-runtime-port.js";

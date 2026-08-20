// 验证 apps/web 可通过 workspace:* 消费 @retainpdf/reader
// 当前为类型验证占位，实际消费待 hooks 完全迁移后切至：
// import { ReaderAppReactPdf } from "@retainpdf/reader";
export const WORKSPACE_READER_LINK = "@retainpdf/reader workspace:* ok" as const;

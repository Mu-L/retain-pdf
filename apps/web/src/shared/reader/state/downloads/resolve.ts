// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
// 通过 download-runtime-bridge 间接引用 bootstrap，避免 src/shared 直连 bootstrap 触发架构门禁
import {
  resolveSourcePdfDownloadName,
  resolveTranslatedPdfDownloadName,
} from "../../../../js/job/artifacts.js";
import { createReaderDialogRuntimePort } from "../download-runtime-bridge.js";
import { resolveReaderSourcePdf } from "../../data/resource-resolver.js";
import * as shared from "../../../../../../../packages/reader/src/shared/state/downloads/resolve.js";

export const READER_DOWNLOAD_ACTIONS = shared.READER_DOWNLOAD_ACTIONS;
export const trimString = shared.trimString;
export const readerDownloadNameState = shared.readerDownloadNameState;
export const disabledReason = shared.disabledReason;

const bound = shared.createReaderDownloadResolver({
  resolveSourcePdfDownloadName,
  resolveTranslatedPdfDownloadName,
  createRuntimePort: createReaderDialogRuntimePort as any,
  resolveSourcePdf: resolveReaderSourcePdf as any,
});

export const resolveReaderDownloadUrls = bound.resolveReaderDownloadUrls;
export const resolveReaderDownloadName = bound.resolveReaderDownloadName;
export const createReaderDownloadResolver = shared.createReaderDownloadResolver;

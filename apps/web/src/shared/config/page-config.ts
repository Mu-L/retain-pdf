// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { isMockMode, readerMessageTargetOrigin } from "../../js/config/runtime.js";
import { getMockJobId } from "../../js/mock/index.js";
import * as shared from "../../../../../packages/reader/src/shared/config/page-config.js";

export const resolveReaderJobId = (opts: any = {}) => shared.resolveReaderJobId({ isMock: isMockMode, mockJobId: getMockJobId, ...opts });
export const resolveReaderDocumentId = shared.resolveReaderDocumentId;
export const resolveReaderAnchor = shared.resolveReaderAnchor;
export const createReaderPageConfigPort = (opts: any = {}) => shared.createReaderPageConfigPort({ messageTargetOrigin: readerMessageTargetOrigin, isMock: isMockMode, mockJobId: getMockJobId, ...opts });
export const defaultReaderPageConfigPort = shared.defaultReaderPageConfigPort;

// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { API_PREFIX } from "../../js/config/api-constants.js";
import { askLibraryAi } from "../../js/api/ai.js";
import { fetchDocumentByJobId } from "../../js/api/documents.js";
import { resolveReaderAiConfig } from "./config.js";
import * as shared from "../../../../../packages/reader/src/shared/ai/ask-answerer.js";

export const buildScopedQuestion = shared.buildScopedQuestion;

export const createReaderAskAnswerer = (opts: any = {}) =>
  shared.createReaderAskAnswerer({
    apiPrefix: API_PREFIX,
    ask: askLibraryAi as any,
    documentByJobId: fetchDocumentByJobId as any,
    llmConfig: resolveReaderAiConfig as any,
    ...opts,
  });

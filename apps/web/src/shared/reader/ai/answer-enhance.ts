// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import { fetchProtected } from "../../../js/api/http.js";
import { resolveResourceUrl } from "../../../js/job/artifacts.js";
import * as shared from "../../../../../../packages/reader/src/shared/ai/answer-enhance.js";

// 注入宿主实现到共享层（模块级适配器）
shared.setAnswerEnhanceAdapters({ fetchProtected: fetchProtected as any, resolveResourceUrl: resolveResourceUrl as any });

// re-export 共享真值（调用方直接用共享函数，已带注入的宿主能力）
export * from "../../../../../../packages/reader/src/shared/ai/answer-enhance.js";

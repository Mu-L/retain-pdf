// 代理 @retainpdf/reader 共享真值，注入 RetainPDF 真实依赖
import {
  findReadyManifestArtifact,
  resolveManifestArtifactUrl,
  resolveResourceUrl,
} from "../../../js/job/artifacts.js";
import { resolveJobActions } from "../../../js/job/actions.js";
import { resolveReaderArtifactUrl } from "./pdf-document.js";
import * as shared from "../../../../../../packages/reader/src/shared/data/resource-resolver.js";

export const resolveReaderJobId = shared.resolveReaderJobId;

export const resolveReaderSourcePdf = (manifestPayload: any, opts: any = {}) =>
  shared.resolveReaderSourcePdf(manifestPayload, {
    findReadyManifestArtifact,
    resolveManifestArtifactUrl: (payload: any, key: string) =>
      resolveManifestArtifactUrl(payload, key),
    ...opts,
  });

export const resolveReaderTranslatedPdfUrl = (jobPayload: any, manifestPayload: any, opts: any = {}) =>
  shared.resolveReaderTranslatedPdfUrl(jobPayload, manifestPayload, {
    resolveJobActions,
    findReadyManifestArtifact,
    resolveReaderArtifactUrl: (item: any) => resolveReaderArtifactUrl(item),
    resolveResourceUrl,
    ...opts,
  });

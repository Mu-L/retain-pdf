// 运行载荷组装：把当前工作流 + 开发者配置 + 凭据值拼成后端需要的
// ocr / translation / render 载荷，以及文档级 OCR/翻译复用配置。
//
// 纯组装，不读 DOM；所有可变输入经注入的 getter。

import {
  buildOcrPayload as buildOcrPayloadRequest,
  buildRenderPayload as buildRenderPayloadRequest,
  buildSourcePayload as buildSourcePayloadRequest,
  buildTranslationPayload as buildTranslationPayloadRequest,
  type WorkflowDeveloperConfig,
} from "./payload.js";
import type { WorkflowConstants, WorkflowRunPayload, WorkflowSubmitValues } from "./contracts.js";

export interface CreateWorkflowPayloadAssemblyOptions {
  constants: WorkflowConstants;
  developerConfigWithDefaults: () => WorkflowDeveloperConfig;
  isOcrOnlyMode: () => boolean;
  currentPageRanges: () => string;
  getUploadState: () => { uploadId?: string; uploadedPageCount?: number };
  workflowNeedsUpload: (workflow?: string) => boolean;
  workflowUsesRenderStage: (workflow?: string) => boolean;
  defaultPaddleApiUrl: () => string;
  defaultOcrProvider: () => string;
  defaultPaddleToken: () => string;
  defaultModelApiKey: () => string;
  readSubmitValues?: (options?: {
    defaultOcrProvider?: string;
    defaultPaddleToken?: string;
    defaultModelApiKey?: string;
  }) => WorkflowSubmitValues;
}

export function createWorkflowPayloadAssembly({
  constants,
  developerConfigWithDefaults,
  isOcrOnlyMode,
  currentPageRanges,
  getUploadState,
  workflowNeedsUpload,
  workflowUsesRenderStage,
  defaultPaddleApiUrl,
  defaultOcrProvider,
  defaultPaddleToken,
  defaultModelApiKey,
  readSubmitValues,
}: CreateWorkflowPayloadAssemblyOptions) {
  const { WORKFLOW_BOOK, WORKFLOW_TRANSLATE } = constants;
  const WORKFLOW_OCR = (constants as { WORKFLOW_OCR?: string }).WORKFLOW_OCR || "ocr";

  function currentWorkflowSubmitValues(): WorkflowSubmitValues {
    return readSubmitValues?.({
      defaultOcrProvider: defaultOcrProvider(),
      defaultPaddleToken: defaultPaddleToken(),
      defaultModelApiKey: defaultModelApiKey(),
    }) || {};
  }

  function buildOcrPayload(
    pageRanges: string | undefined,
    submitValues: WorkflowSubmitValues = currentWorkflowSubmitValues(),
  ) {
    return buildOcrPayloadRequest({
      pageRanges,
      ocrProvider: submitValues.ocrProvider,
      ocrCredentialRef: submitValues.ocrCredentialRef,
      ocrToken: submitValues.ocrToken,
      defaultPaddleApiUrl,
      constants,
    });
  }

  function buildTranslationPayload(
    developerConfig: WorkflowDeveloperConfig,
    submitValues: WorkflowSubmitValues = currentWorkflowSubmitValues(),
  ) {
    return buildTranslationPayloadRequest({
      developerConfig,
      translationCredentialRef: submitValues.translationCredentialRef,
      modelApiKey: submitValues.modelApiKey,
      selectedGlossaryId: submitValues.selectedGlossaryId,
      constants,
    });
  }

  function buildRenderPayload(developerConfig: WorkflowDeveloperConfig) {
    return buildRenderPayloadRequest({
      developerConfig,
      constants,
    });
  }

  // 馆藏文档“翻译整本/选定页码”(F5)复用主流程的凭据组装:从当前已配置的
  // 凭据(credentialsStatePort,与对话框是否打开无关——readSubmitValues 读的是
  // 凭据 state 而非弹窗 DOM)拼出所选 OCR 提供商 + 翻译模型配置。
  // 不含 source——后端会从文档已存的 upload 注入 upload_id。pageRanges 缺省
  // 空串=整本。
  function buildTranslateJobConfig(pageRanges = "") {
    const developerConfig = developerConfigWithDefaults();
    const submitValues = currentWorkflowSubmitValues();
    if (isOcrOnlyMode()) {
      return {
        ocr: buildOcrPayload(pageRanges, submitValues),
      };
    }
    return {
      ocr: buildOcrPayload(pageRanges, submitValues),
      translation: buildTranslationPayload(developerConfig, submitValues),
    };
  }

  // 馆藏文档 OCR-only：只复用 OCR 凭据，不携带翻译模型配置。
  // source.upload_id 由文档级后端接口安全注入。
  function buildOcrJobConfig(pageRanges = "") {
    return {
      workflow: WORKFLOW_OCR,
      ocr: buildOcrPayload(pageRanges, currentWorkflowSubmitValues()),
    };
  }

  function collectRunPayload(): WorkflowRunPayload {
    const pageRanges = currentPageRanges();
    const developerConfig = developerConfigWithDefaults();
    const ocrOnly = isOcrOnlyMode();
    const workflow = ocrOnly ? WORKFLOW_OCR : developerConfig.workflow;
    const uploadState = getUploadState();
    const submitValues = currentWorkflowSubmitValues();
    const effectiveNeedsUpload = ocrOnly ? () => true : workflowNeedsUpload;
    const payload: WorkflowRunPayload = {
      workflow,
      source: buildSourcePayloadRequest({
        workflow,
        developerConfig,
        uploadId: uploadState.uploadId,
        workflowNeedsUpload: effectiveNeedsUpload,
      }),
      runtime: {
        job_id: "",
        timeout_seconds: developerConfig.timeoutSeconds,
        no_output_timeout_seconds: 0,
      },
    };
    if (ocrOnly) {
      payload.ocr = buildOcrPayload(pageRanges, submitValues);
      return payload;
    }
    if (workflow === WORKFLOW_BOOK || workflow === WORKFLOW_TRANSLATE) {
      payload.ocr = buildOcrPayload(pageRanges, submitValues);
      payload.translation = buildTranslationPayload(developerConfig, submitValues);
    }
    if (workflowUsesRenderStage(workflow)) {
      payload.render = buildRenderPayload(developerConfig);
    }
    return payload;
  }

  return {
    currentWorkflowSubmitValues,
    buildOcrPayload,
    buildTranslationPayload,
    buildRenderPayload,
    buildTranslateJobConfig,
    buildOcrJobConfig,
    collectRunPayload,
  };
}

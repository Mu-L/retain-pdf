// 凭据提供方面板（合并原 OCR 与翻译模型两块，分 provider 渲染）
// 校验徽标语义抽至 shared/credentials/validation-icon

import {
  credentialTokenInputId,
  credentialValidateButtonId,
  credentialValidationId,
} from "./credentials-dom-ids.js";
import { CREDENTIAL_DOM_IDS } from "./credentials-dom-ids.js";
import { useCredentialsController } from "./useCredentialsController.js";
import {
  OCR_PROVIDER_DEFINITIONS,
  TRANSLATION_PROVIDER_DEFINITION,
} from "../../composition/external.js";
import { validationIcon } from "@/shared/credentials/validation-icon.js";

const { browser: BROWSER_IDS } = CREDENTIAL_DOM_IDS;

function resetHandlerFor(handlers) {
  return handlers?.resetPaddleValidation;
}

export function OcrPanels() {
  const { credentials, view, handlers, tokenInputRef } = useCredentialsController();
  const activeProvider = credentials.ocrProvider;

  return (
    <div className="credential-provider-panels">
      {OCR_PROVIDER_DEFINITIONS.map((provider) => {
        const active = provider.id === activeProvider;
        const validation = view.validations[provider.id] || { message: "", tone: "" };
        const content = `${validation.message || ""}`.trim();
        const badgeClasses = [
          "token-inline-status",
          content ? "" : "hidden",
          validation.tone === "valid" ? "is-valid" : "",
          validation.tone === "error" ? "is-error" : "",
          content && !validation.tone ? "is-pending" : "",
        ].filter(Boolean).join(" ");

        return (
          <section
            key={provider.id}
            className={`credential-panel credential-provider-panel${active ? " is-active" : ""}`}
            data-ocr-provider-panel={provider.id}
            role="tabpanel"
            hidden={!active}
          >
            <label>
              <span className="credential-input-row">
                <span className="credential-secret-field">
                  <input
                    id={credentialTokenInputId(provider.id)}
                    type="password"
                    autoComplete="off"
                    placeholder={provider.tokenPlaceholder}
                    defaultValue=""
                    ref={tokenInputRef(provider.id)}
                    onInput={() => resetHandlerFor(handlers)?.()}
                  />
                </span>
                <a className="credential-card-link" href={provider.docsUrl} target="_blank" rel="noopener noreferrer">
                  {provider.docsLabel}
                </a>
              </span>
            </label>
            <div className="credential-card-actions">
              {provider.supportsValidation ? (
                <button
                  id={credentialValidateButtonId(provider.id)}
                  type="button"
                  className="app-button secondary"
                  onClick={() => handlers?.validateOcr?.()}
                >
                  {provider.validationButtonLabel}
                </button>
              ) : null}
              <span id={credentialValidationId(provider.id)} className={badgeClasses} title={content || provider.validationIdleMessage}>
                {validationIcon(validation.tone, content)}
              </span>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function TranslationPanel() {
  const { view, handlers, elementsRef } = useCredentialsController();
  const validation = view.deepSeek || { message: "", tone: "" };
  const content = `${validation.message || ""}`.trim();
  const badgeClasses = [
    "token-inline-status",
    content ? "" : "hidden",
    validation.tone === "valid" ? "is-valid" : "",
    validation.tone === "error" ? "is-error" : "",
    content && !validation.tone ? "is-pending" : "",
  ].filter(Boolean).join(" ");

  return (
    <section className="credential-card">
      <div className="credential-card-head">
        <h3>{TRANSLATION_PROVIDER_DEFINITION.label}</h3>
      </div>
      <label>
        <span className="credential-input-row">
          <span className="credential-secret-field">
            <input
              id={BROWSER_IDS.apiKey}
              type="password"
              autoComplete="off"
              placeholder={TRANSLATION_PROVIDER_DEFINITION.keyPlaceholder}
              defaultValue=""
              ref={(node) => { elementsRef.apiKeyInput = node || null; }}
              onInput={() => handlers?.resetDeepSeekValidation?.()}
            />
          </span>
          <a className="credential-card-link" href={TRANSLATION_PROVIDER_DEFINITION.docsUrl} target="_blank" rel="noopener noreferrer">
            {TRANSLATION_PROVIDER_DEFINITION.docsLabel}
          </a>
        </span>
      </label>
      <div className="credential-card-actions">
        <button
          id={BROWSER_IDS.deepSeekValidateButton}
          type="button"
          className="app-button secondary"
          onClick={() => handlers?.validateDeepSeek?.()}
        >
          {TRANSLATION_PROVIDER_DEFINITION.validationButtonLabel}
        </button>
        <span id={BROWSER_IDS.deepSeekValidation} className={badgeClasses} title={content || TRANSLATION_PROVIDER_DEFINITION.validationIdleMessage}>
          {validationIcon(validation.tone, content)}
        </span>
        <a
          id={BROWSER_IDS.deepSeekTopUpLink}
          className={`credential-top-up-link${view.deepSeekTopUpVisible ? "" : " hidden"}`}
          href="https://platform.deepseek.com/top_up"
          target="_blank"
          rel="noopener noreferrer"
        >
          充值
        </a>
      </div>
    </section>
  );
}

// 兼容旧调用：统一 Provider 面板（可选）
export function ProviderPanels() {
  return (
    <>
      <OcrPanels />
      <TranslationPanel />
    </>
  );
}

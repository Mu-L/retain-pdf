import {
  browserCredentialElements,
  syncOcrProviderControlsView,
} from "./view.js";

export function createCredentialDialogElementsPort({
  elements = browserCredentialElements,
  syncOcrProviderControls = syncOcrProviderControlsView,
  syncTranslationProvider = () => {},
}: any = {}) {
  return {
    elements,
    syncOcrProviderControls,
    syncTranslationProvider,
  };
}

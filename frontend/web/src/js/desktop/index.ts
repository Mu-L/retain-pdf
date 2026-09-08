import {
  loadPersistedConfig,
  savePersistedDesktopConfig,
} from "@/platform/config/desktop-persistence.js";
import { savePersistedBrowserStoredConfig } from "@/platform/config/persisted-config.js";
import {
  applyDefaultCredentialInputs,
} from "@/features/credentials/domain.js";
import { state } from "../state/store.js";
import {
  setDesktopConfigured,
  setDesktopMode,
  setDeveloperConfig,
} from "../state/actions.js";
import { getDeveloperConfig } from "../state/developer-state.js";
import { isDesktopConfigured } from "../state/desktop-state.js";
import {
  APP_DIALOG_IDS,
  APP_EVENTS,
} from "@/platform/contracts/app-contract.js";

export function showDesktopUi() {
  document.getElementById("open-output-btn").classList.remove("hidden");
}

export function setDesktopBusy(message = "") {
  const targetIds = ["browser-credentials-status"];
  for (const id of targetIds) {
    const el = document.getElementById(id);
    if (!el) {
      continue;
    }
    if (message) {
      el.textContent = message;
      el.classList.remove("hidden");
    } else {
      el.textContent = "";
      el.classList.add("hidden");
    }
  }
}

export function openSetupDialog() {
  document.dispatchEvent(new CustomEvent(APP_EVENTS.openBrowserCredentials, {
    detail: { setupMode: true },
  }));
}

export function closeSetupDialog() {
  const dialog = document.getElementById(APP_DIALOG_IDS.browserCredentials) as any;
  if (dialog?.open && dialog.dataset.setupMode === "1") {
    dialog.close();
  }
}

export async function bootstrapDesktop(initialConfig = null) {
  setDesktopMode(state, true);
  showDesktopUi();
  const payload = initialConfig || await loadPersistedConfig();
  setDeveloperConfig(state, payload.developerConfig || {});
  applyDefaultCredentialInputs(payload.browserConfig || {});
  setDesktopConfigured(state, payload.firstRunCompleted);
  if (!isDesktopConfigured(state)) {
    openSetupDialog();
  } else {
    closeSetupDialog();
  }
}

export async function saveDesktopConfig(browserConfig: any = {}, afterSave) {
  const source = (typeof browserConfig === "object" && browserConfig !== null) ? browserConfig : {};
  const nextBrowserConfig = { ...(source.browserConfig || source) };
  const markConfigured = !!source.markConfigured;
  const callback = afterSave;
  let persisted = await savePersistedBrowserStoredConfig({
    ...nextBrowserConfig,
  });
  setDeveloperConfig(state, persisted.developerConfig || getDeveloperConfig(state));
  applyDefaultCredentialInputs(persisted.browserConfig || {});
  if (markConfigured && !persisted.firstRunCompleted) {
    persisted = await savePersistedDesktopConfig({ firstRunCompleted: true });
    setDeveloperConfig(state, persisted.developerConfig || getDeveloperConfig(state));
    applyDefaultCredentialInputs(persisted.browserConfig || {});
  }
  setDesktopConfigured(state, persisted.firstRunCompleted);
  if (isDesktopConfigured(state)) {
    closeSetupDialog();
    const errorBox = document.getElementById("error-box") || document.getElementById("error-box-inline");
    if (errorBox) {
      errorBox.textContent = "-";
      errorBox.classList?.add("hidden");
    }
  }
  if (callback) {
    try {
      await callback();
    } catch (error) {
      if (isDesktopConfigured(state)) {
        const message = error?.message || String(error);
        throw new Error(`首次配置已保存，但当前无法连接本地后端。${message}`);
      }
      throw error;
    }
  }
  setDeveloperConfig(state, persisted.developerConfig || getDeveloperConfig(state));
  applyDefaultCredentialInputs(persisted.browserConfig || {});
  return persisted;
}

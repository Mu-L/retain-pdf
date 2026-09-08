// composition/external/state — state / contracts / store barrel

// —— state ——
export {
  createDeveloperState,
  getDeveloperConfig,
  resetDeveloperConfig,
  setDeveloperConfig,
} from "../../../../js/state/developer-state.js";
export {
  createDesktopState,
  isDesktopMode,
  setDesktopConfigured,
  setDesktopMode,
} from "../../../../js/state/desktop-state.js";

// —— contracts / framework ——
export { APP_EVENTS } from "@/platform/contracts/app-contract.js";
export {
  DOWNLOAD_ACTION_IDS,
  PROTECTED_ARTIFACT_SELECTOR,
} from "@/platform/contracts/download-action-contract.js";
export { createStore } from "../../../../platform/store/store.js";
export type { Store, StoreChangeMeta } from "../../../../platform/store/store.js";

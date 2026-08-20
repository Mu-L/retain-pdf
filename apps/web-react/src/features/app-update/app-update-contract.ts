// Ported from apps/web/src/pages/home/features/app-update/app-update-contract.ts
// IDs / states for AppUpdateBanner. Keep contract in sync with MPA.

export const APP_UPDATE_IDS = Object.freeze({
  button: "app-update-btn",
  dialog: "app-update-dialog",
  status: "app-update-status",
  checkButton: "app-update-check-btn",
})

export const APP_UPDATE_STATES = Object.freeze({
  checking: "checking",
  idle: "idle",
  available: "available",
  latest: "latest",
  error: "error",
})

export const APP_UPDATE_CLASSES = Object.freeze({
  hidden: "hidden",
  hasUpdate: "has-update",
})

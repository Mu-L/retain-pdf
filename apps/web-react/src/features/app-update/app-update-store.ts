/**
 * AppUpdate view store — Zustand port of
 *   apps/web/src/pages/home/features/app-update/app-update-store.ts
 *
 * Pure view state driven by controller (github-release + cache). No DOM.
 * Mirrors original store shape + viewPort methods (setChecking/setReady/...).
 */
import { create } from 'zustand'
import { APP_UPDATE_STATES } from './app-update-contract'
import { APP_VERSION } from './app-version'

export type AppUpdatePanel = {
  title: string
  body: string
  latestVersion: string
  currentVersion: string
  htmlUrl: string
}

export type AppUpdateViewState = {
  buttonState: string
  hasUpdate: boolean
  buttonTitle: string
  statusText: string
  panel: AppUpdatePanel
}

export type AppUpdateReleaseInfo = {
  latestVersion?: string
  currentVersion?: string
  title?: string
  body?: string
  htmlUrl?: string
}

function panelOf({
  title = "检查更新",
  body = "",
  latestVersion = "",
  currentVersion = APP_VERSION,
  htmlUrl = "",
}: Partial<AppUpdatePanel> = {}): AppUpdatePanel {
  return { title, body, latestVersion, currentVersion, htmlUrl }
}

type AppUpdateActions = {
  setChecking: () => void
  setReady: () => void
  setAvailable: (info?: AppUpdateReleaseInfo) => void
  setLatest: (info?: AppUpdateReleaseInfo | null) => void
  setError: (error?: { message?: string } | null) => void
  apply: (next: AppUpdateViewState) => void
}

export type AppUpdateViewStore = ReturnType<typeof createAppUpdateStore>

export function createAppUpdateStore() {
  return create<AppUpdateViewState & AppUpdateActions>((set, get) => ({
    buttonState: APP_UPDATE_STATES.idle,
    hasUpdate: false,
    buttonTitle: "检查更新",
    statusText: "",
    panel: panelOf({
      title: "检查更新",
      body: "点击“重新检查”从 GitHub Releases 获取最新版本。",
    }),

    apply(next) {
      set(next as any)
    },

    setChecking() {
      const hasUpdate = get().hasUpdate
      set({
        buttonState: APP_UPDATE_STATES.checking,
        hasUpdate,
        buttonTitle: "正在检查更新",
        statusText: "正在检查 GitHub Releases...",
        panel: panelOf({
          title: "正在检查更新",
          body: "正在连接 GitHub Releases...",
        }),
      })
    },

    setReady() {
      set({
        buttonState: APP_UPDATE_STATES.idle,
        hasUpdate: false,
        buttonTitle: "检查更新",
        statusText: "",
        panel: panelOf({
          title: "检查更新",
          body: "点击“重新检查”从 GitHub Releases 获取最新版本。",
        }),
      })
    },

    setAvailable(info = {}) {
      set({
        buttonState: APP_UPDATE_STATES.available,
        hasUpdate: true,
        buttonTitle: `发现新版本 ${info.latestVersion}`,
        statusText: "发现新版本",
        panel: panelOf({
          title: info.title || `RetainPDF ${info.latestVersion}`,
          body: info.body,
          latestVersion: info.latestVersion,
          currentVersion: info.currentVersion,
          htmlUrl: info.htmlUrl,
        }),
      })
    },

    setLatest(info = null) {
      set({
        buttonState: APP_UPDATE_STATES.latest,
        hasUpdate: false,
        buttonTitle: "已是最新版本",
        statusText: "已是最新版本",
        panel: panelOf({
          title: "已是最新版本",
          body: "当前版本已经是 GitHub Releases 上的最新版本。",
          latestVersion: info?.latestVersion || APP_VERSION,
          currentVersion: info?.currentVersion || APP_VERSION,
          htmlUrl: info?.htmlUrl || "",
        }),
      })
    },

    setError(error = null) {
      set({
        buttonState: APP_UPDATE_STATES.error,
        hasUpdate: false,
        buttonTitle: "检查更新失败",
        statusText: "检查失败",
        panel: panelOf({
          title: "检查更新失败",
          body: error?.message || "暂时无法连接 GitHub Releases。",
        }),
      })
    },
  }))
}

let defaultAppUpdateStore: AppUpdateViewStore | null = null

export function getAppUpdateStore(): AppUpdateViewStore {
  if (!defaultAppUpdateStore) defaultAppUpdateStore = createAppUpdateStore()
  return defaultAppUpdateStore
}

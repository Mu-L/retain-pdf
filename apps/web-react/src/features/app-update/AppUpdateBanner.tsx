/**
 * AppUpdateBanner — React port of
 *   apps/web/src/pages/home/features/app-update/AppUpdateBanner.tsx
 *
 * View state comes from Zustand (getAppUpdateStore) instead of MPA createStore +
 * home-services-context. Dialog is a lightweight controlled overlay (no radix-ui
 * dependency) to keep web-react bundle minimal — behavior mirrors original:
 *   - button + dot shows hasUpdate
 *   - dialog shows panel title/version, status, release notes, re-check + link
 *   - Escape / backdrop / close button all close
 */
import { useEffect, useCallback } from "react"
import { X } from "lucide-react"
import { APP_UPDATE_IDS } from "./app-update-contract"
import { getAppUpdateStore } from "./app-update-store"
import { useAppUpdateDialogOpen } from "./useAppUpdateDialogOpen"
import { useAppUpdateController } from "./use-app-update-controller"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function formatReleaseNotes(markdown = "") {
  return `${markdown || ""}`
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line
      .replace(/^#{1,6}\s+/, "")
      .replace(/^\s*[-*]\s+/, "• ")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .trimEnd())
    .filter((line, index, lines) => line || (index > 0 && lines[index - 1]))
    .join("\n")
    .trim()
}

export function AppUpdateBanner() {
  const store = getAppUpdateStore()
  const state = store((s) => s)
  const { onCheck } = useAppUpdateController()
  const [dialogOpen, setDialogOpen] = useAppUpdateDialogOpen()

  const handleClose = useCallback(() => setDialogOpen(false), [setDialogOpen])

  // Escape handler when dialog open
  useEffect(() => {
    if (!dialogOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        setDialogOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dialogOpen, setDialogOpen])

  const hasUpdate = Boolean(state.hasUpdate)
  const panel = state.panel
  const notesText = formatReleaseNotes(panel.body) || "暂无更新说明。"
  const versionText = panel.latestVersion
    ? `当前 ${panel.currentVersion} · 最新 ${panel.latestVersion}`
    : `当前 ${panel.currentVersion}`
  const statusText = `${state.statusText || ""}`

  return (
    <>
      <Button
        id={APP_UPDATE_IDS.button}
        variant="ghost"
        size="sm"
        className={cn(
          "app-settings-action app-update-btn",
          hasUpdate && "has-update",
        )}
        aria-label="检查更新"
        title={state.buttonTitle}
        data-update-state={state.buttonState}
        onClick={() => setDialogOpen(true)}
      >
        检查更新
        <span className="app-update-dot ml-1 inline-block size-2 rounded-full bg-red-500 aria-hidden:true" aria-hidden="true" style={{ visibility: hasUpdate ? "visible" : "hidden" }}></span>
      </Button>

      {dialogOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/20 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={panel.title}>
          {/* backdrop */}
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="关闭更新对话框"
            onClick={handleClose}
          />
          <section
            id={APP_UPDATE_IDS.dialog}
            className="desktop-dialog app-update-dialog relative grid max-h-[calc(100vh-48px)] w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
          >
            <div className="desktop-shell app-update-shell grid gap-0">
              <div className="app-update-head grid grid-cols-[minmax(0,1fr)_36px] items-start gap-3 border-b border-neutral-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-neutral-950">{panel.title}</h2>
                  <p className="mt-1 text-sm text-neutral-500">{versionText}</p>
                </div>
                <button
                  type="button"
                  className="desktop-close app-update-close grid size-9 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950"
                  aria-label="关闭"
                  onClick={handleClose}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="app-update-body grid gap-3 p-5">
                <div id={APP_UPDATE_IDS.status} className={cn("app-update-status rounded-lg bg-neutral-50 px-3 py-2 text-sm", !statusText && "hidden")}>
                  {statusText}
                </div>
                <div className="app-update-notes whitespace-pre-wrap break-words text-sm leading-6 text-neutral-700">{notesText}</div>
              </div>

              <div className="app-update-foot flex items-center justify-between gap-3 border-t border-neutral-100 px-5 py-4">
                <Button
                  id={APP_UPDATE_IDS.checkButton}
                  variant="outline"
                  size="sm"
                  className="home-action-btn secondary"
                  onClick={onCheck}
                >
                  重新检查
                </Button>
                <a
                  className={cn("app-update-link text-sm font-medium text-neutral-950 underline-offset-4 hover:underline", !panel.htmlUrl && "hidden")}
                  href={panel.htmlUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  打开 Release
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}

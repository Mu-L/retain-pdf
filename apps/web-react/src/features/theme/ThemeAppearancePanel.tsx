// Settings · Appearance: theme switcher (registry-driven)
// Ported from apps/web/src/pages/home/features/settings/ThemeAppearancePanel.tsx
// Truth: html[data-theme] + localStorage via shared/theme
// Font: render font family (request.render.typst_font_family) persisted to localStorage

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { getTheme, listThemesBySeries, setTheme, type ThemeId } from "./theme"
import { getStoredFontFamily, setStoredFontFamily, RENDER_FONT_STORAGE_KEY } from "@/features/fonts/font"
import { listFonts, type FontInfo } from "@retainpdf/api/fonts"
import { API_PREFIX } from "@retainpdf/api/internal/runtime"

const FALLBACK_FONTS: FontInfo[] = [
  { family: "Source Han Serif SC", files: [], available: true },
  { family: "Source Han Sans SC", files: [], available: true },
]

function FontSelector() {
  const [fonts, setFonts] = useState<FontInfo[]>(FALLBACK_FONTS)
  const [selected, setSelected] = useState<string>(() => getStoredFontFamily())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError("")
      try {
        const list = await listFonts(API_PREFIX)
        if (cancelled) return
        const normalized = Array.isArray(list) && list.length ? list : FALLBACK_FONTS
        const families = new Set(normalized.map((f) => f.family))
        if (!families.has(selected)) {
          const merged: FontInfo[] = [{ family: selected, files: [], available: true }, ...normalized]
          const seen = new Set<string>()
          const deduped: FontInfo[] = []
          for (const f of merged) {
            if (!seen.has(f.family)) {
              seen.add(f.family)
              deduped.push(f)
            }
          }
          setFonts(deduped)
        } else {
          setFonts(normalized)
        }
      } catch (e: unknown) {
        if (cancelled) return
        setError(e instanceof Error ? e.message : `${e}`)
        setFonts((prev) => (prev.length ? prev : FALLBACK_FONTS))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handler = (ev: Event) => {
      const custom = ev as CustomEvent<{ family?: string }>
      const next = custom.detail?.family || getStoredFontFamily()
      setSelected(next)
    }
    window.addEventListener("retainpdf:render-font-change" as unknown as string, handler as EventListener)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === RENDER_FONT_STORAGE_KEY && e.newValue) setSelected(e.newValue)
    }
    window.addEventListener("storage", storageHandler)
    return () => {
      window.removeEventListener("retainpdf:render-font-change" as unknown as string, handler as EventListener)
      window.removeEventListener("storage", storageHandler)
    }
  }, [])

  function handleChange(value: string) {
    const next = `${value || ""}`.trim()
    if (!next) return
    setStoredFontFamily(next)
    setSelected(next)
  }

  return (
    <div className="font-selector" id="font-selector" data-testid="font-selector">
      <h3 className="theme-appearance-group-title text-sm font-semibold text-neutral-800">渲染字体</h3>
      <p className="mt-1 text-xs text-neutral-500">用于 Typst 渲染的正文字体族（request.render.typst_font_family），随下次新建任务生效。</p>
      <label htmlFor="typst-font-family-select" className="sr-only">
        渲染字体
      </label>
      <select
        id="typst-font-family-select"
        data-testid="typst-font-family-select"
        name="typst_font_family"
        value={selected}
        onChange={(e) => handleChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950"
        disabled={loading && fonts.length === 0}
      >
        {fonts.map((f) => (
          <option key={f.family} value={f.family}>
            {f.family}
            {f.available ? "" : " (不可用)"}
          </option>
        ))}
      </select>
      {loading ? <span className="mt-1 block text-xs text-neutral-400">加载字体列表…</span> : null}
      {error ? <span className="mt-1 block text-xs text-amber-600">字体列表加载失败，已显示本地备选：{error}</span> : null}
      <span className="mt-1 block text-xs text-neutral-400">已选：{selected}</span>
    </div>
  )
}

export function ThemeAppearancePanel() {
  const [active, setActive] = useState<ThemeId>(() => getTheme())
  const groups = listThemesBySeries()

  useEffect(() => {
    setActive(getTheme())
  }, [])

  function choose(id: ThemeId) {
    setTheme(id)
    setActive(id)
  }

  return (
    <div className="theme-appearance" id="theme-appearance-panel">
      {groups.map(({ series, label, themes }) => (
        <div key={series} className="theme-appearance-group" data-theme-series={series}>
          <h3 className="theme-appearance-group-title text-sm font-semibold text-neutral-800">{label}</h3>
          <div
            className="theme-appearance-grid mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3"
            role="radiogroup"
            aria-label={`${label}主题`}
          >
            {themes.map((meta) => {
              const swatch = meta.preview
              const selected = active === meta.id
              return (
                <button
                  key={meta.id}
                  id={`theme-option-${meta.id}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  className={cn(
                    "theme-option group relative flex flex-col gap-2 rounded-2xl border bg-white p-3 text-left transition",
                    selected ? "is-selected border-neutral-950 ring-1 ring-neutral-950" : "border-neutral-200 hover:border-neutral-300",
                  )}
                  data-theme-option={meta.id}
                  data-theme-group={meta.group}
                  onClick={() => choose(meta.id)}
                >
                  <span
                    className="theme-option-swatch relative grid h-14 place-items-center overflow-hidden rounded-xl"
                    style={{ background: swatch.bg }}
                    aria-hidden="true"
                  >
                    <span
                      className="theme-option-swatch-paper relative grid h-10 w-16 place-items-center rounded-md shadow-sm"
                      style={{ background: swatch.paper }}
                    >
                      <span className="theme-option-swatch-bar h-1.5 w-10 rounded-full" style={{ background: swatch.accent }} />
                      <span className="theme-option-swatch-line mt-1 h-0.5 w-10 rounded-full opacity-60" style={{ background: swatch.ink }} />
                      <span className="theme-option-swatch-line-short mt-1 h-0.5 w-6 rounded-full opacity-40" style={{ background: swatch.ink }} />
                    </span>
                    <span
                      className="theme-option-swatch-dot absolute right-2 top-2 size-2 rounded-full"
                      style={{ background: swatch.danger }}
                    />
                  </span>
                  <span className="theme-option-copy grid gap-0.5">
                    <strong className="text-sm font-medium text-neutral-950">{meta.label}</strong>
                    <span className="text-xs text-neutral-500">{meta.description}</span>
                  </span>
                  {selected ? (
                    <span className="theme-option-check absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-neutral-950 text-xs text-white" aria-hidden="true">
                      ✓
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>
      ))}
      <div className="theme-appearance-group mt-6" data-theme-series="font">
        <FontSelector />
      </div>
    </div>
  )
}

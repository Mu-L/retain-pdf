// Settings · Appearance: theme switcher (registry-driven)
// Ported from apps/web/src/pages/home/features/settings/ThemeAppearancePanel.tsx
// Truth: html[data-theme] + localStorage via shared/theme

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  getTheme,
  listThemesBySeries,
  setTheme,
  type ThemeId,
} from "./theme"

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
    </div>
  )
}

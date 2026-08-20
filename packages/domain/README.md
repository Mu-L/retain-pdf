# @retainpdf/domain — Phase 0 pure domain package

Framework-agnostic view-models extracted verbatim from `apps/web/src/js/job` (15 files) + `apps/web/src/js/job-status` (46 files). No React, no fetch, no DOM.

## Why
Unify `apps/web` (MPA + React islands, esbuild) and `apps/web-react` (Vite SPA) on a single source of truth for job lifecycle. Keeps backward compat: `apps/web` can still import via `composition/external/job.ts`, but new code may import from `@retainpdf/domain`.

## What was copied
```
packages/domain/src/job/*              ← apps/web/src/js/job/*.ts (15)
packages/domain/src/job-status/*       ← apps/web/src/js/job-status/*.ts (46)
packages/domain/src/internal/*         ← minimal pure shims for 4 impure imports:
  api-constants.ts  — API_PREFIX
  http.ts           — buildApiEndpoint (pure, delegates to runtime.buildApiUrl)
  runtime.ts        — apiBase / buildApiUrl (no window in tests)
  selector.ts       — vendored createSelector (pure memoization)
  upload-state.ts   — getUploadState stub (real state injected via port)
```

Patches (only import rewrites, zero logic change):
- `job/actions.ts`: `../config/api-constants` → `../internal/api-constants`, `../api/http` → `../internal/http`
- `job/artifact-url-config.ts`: `../config/runtime` → `../internal/runtime`
- `job/artifact-runtime-port.ts`: `../features/upload/state` → `../internal/upload-state`
- `job-status/status-card-context.ts`: `../app-framework/selector` → `../internal/selector`

## Usage

```ts
// Preferred (both apps)
import { buildJobStatusSummaryViewModel, currentStageProgressViewModel } from "@retainpdf/domain";
import { normalizeJobPayload } from "@retainpdf/domain/job";

// web-react Vite alias + tsconfig paths already point @retainpdf/domain → packages/domain/src
// web esbuild alias also configured in apps/web/scripts/build-js-bundle.mjs

// Example — proves pattern (stage-progress-view-model)
import { currentStageProgressViewModel } from "@retainpdf/domain";
const progress = currentStageProgressViewModel(snapshot, { normalizeSelectedProgress });
```

## Backward compat
`apps/web/src/pages/home/composition/external/job.ts` still re-exports from `src/js/job*`. It can be swapped to `@retainpdf/domain` incrementally without breaking existing imports.

## Build & alias wiring
- `apps/web/tsconfig.json` paths: `@retainpdf/domain` → `../../packages/domain/src`
- `apps/web/scripts/build-js-bundle.mjs` alias: `@retainpdf/domain` → `packages/domain/src`
- `apps/web-react/tsconfig.app.json` paths + `vite.config.ts` alias: `@retainpdf/domain` → `../../packages/domain/src`
- `apps/web-react/package.json` deps can add `@retainpdf/domain` (workspaces resolves it)

## Verify
```bash
npx tsc --noEmit -p packages/domain/tsconfig.json
npm --prefix apps/web test            # 721 pass, unchanged
npm --prefix apps/web run build       # esbuild still bundles
npx tsc -b --noEmit && vite build --prefix apps/web-react
```

## Next phases
Phase 1+ will gradually move `status-detail/snapshot` + `job/stage-history` consumers to domain and add Zod schema guards from `packages/schemas`.

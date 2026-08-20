# @retainpdf/api

Typed API clients wrapping `@retainpdf/schemas` (`library-books.v1`, `job-status.v1`).

- `library-books.ts` → `fetchLibraryBookList` etc. (from `apps/web/src/js/api/library-books.ts`)
- `jobs.ts` → `fetchJobPayload` etc.
- `types.ts` → `JobStatusKind`, `LibraryBookListItemView`, `ApiResponse` (future: generated from JSON Schema)

Build: `npm --prefix packages/api run build` → `dist/`
Usage: `import { fetchLibraryBookList } from "@retainpdf/api/library-books"`

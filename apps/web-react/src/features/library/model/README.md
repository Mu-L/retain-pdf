# Library Model — Phase2 TanStack Query slice

`model` 放图书馆页面的状态和动作编排。Phase2 已从 `apps/web` 的 `domain/controller.ts` 抽离纯逻辑并改用 TanStack Query。

- `useLibraryData` — TanStack Query for `fetchLibraryBookList` (via `@retainpdf/api/library-books` + `API_PREFIX`), with search/filter (server `q` + client `filterLibraryBooksByQuery/ByStatus/sort`), detail lazy fetch via `libraryKeys.detail`, optimistic `removeBookFromLibrary` via `queryClient.setQueriesData`.
  - Keys: `libraryKeys.all/list(q)/detail(id)` in `api/library-queries.ts`
  - Mock fallback: `mockLibraryEnabled() ? libraryBooks : query` + client-side `q` filtering
- `useLibraryController` — React-idiomatic port of `apps/web/.../library/domain/controller.ts`:
  - `friendlyTranslateError / friendlyDocumentDeleteError / assembleTranslatePayload / shouldPreferTranslateTab` 来自 `library-domain.ts`（纯函数，可抽至 `packages/domain/src/library`）
  - Actions: `translateDocument / deleteDocument / deleteDocuments / deleteCard / updateDocument / openSourceReader / storeOnly / attachJobProgress / openBookDetail / selectJobForDetail / selectJob` (mutations via `useMutation`, invalidation via `libraryKeys.all`)
  - 保留原有 UI actions: `downloadPdf / downloadArtifact / deleteBook / toggleSelectionMode` 等，状态仍由 Zustand-like `useState` + Query 组合
- `library-domain.ts` — 纯领域逻辑，零 React/DOM/fetch，可直接移至 `packages/domain/src/library/index.ts`（已镜像）
- `useLibraryFeedback` — 错误提示和短 toast。

组件不直接请求后端，也不直接读 mock data。后端响应仍先经 `api` adapter 转成 `LibraryBook`。

`apps/web` 的 `domain/controller.ts` 保持原样工作；`web-react` 的 hooks 为共享抽离的演进形态。

export {
  ActivityPanel,
  BookCard,
  BookCover,
  BookDetailDialog,
  BookGrid,
  BookReaderDialog,
  LibraryEmptyState,
  LibraryFilterBar,
  LibraryHeader,
  LibraryHomePage,
  LibraryRoute,
  LibrarySettingsDialog,
  LibrarySidePanel,
  LibrarySidebar,
  LibraryTopBar,
} from './components'
export { useLibraryController } from './model'
export { libraryCopy, libraryNavDefinitions, librarySortItems, libraryStatusFilterItems, libraryStatusMeta } from './library-config'
export {
  activeLibraryCount,
  buildLibrarySidebarItems,
  filterLibraryBooks,
  filterLibraryBooksByQuery,
  filterLibraryBooksByStatus,
  sortLibraryBooks,
} from './library-selectors'
export { deleteLibraryBook, downloadLibraryResource, getLibraryJob, jobDetailToLibraryBook, jobListToLibraryBooks, libraryApiUrl, libraryRequestHeaders, libraryResourceUrl, listLibraryJobs, loadLibraryImageObjectUrl } from './api'
// DEV-ONLY mocks (500 fake books + preview) live in './dev' — never re-export here,
// so the production barrel (`@/features/library`) cannot leak mock books into the shelf.
export type {
  LibraryActivity,
  LibraryBook,
  LibraryBookStatus,
  LibraryNavKey,
  LibrarySidebarItem,
  LibrarySortItem,
  LibrarySortKey,
  LibraryStatusFilterItem,
  LibraryStatusFilterKey,
} from './types'

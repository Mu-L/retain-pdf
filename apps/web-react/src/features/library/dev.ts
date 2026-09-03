/**
 * DEV-ONLY subpath for the library shelf.
 *
 * Import mocks/previews ONLY from here in dev/stories/tests:
 *   import { libraryBooks, LibraryDevPreview } from '@/features/library/dev'
 *
 * Never re-export this module from `./index` — the production barrel
 * (`@/features/library`) must not expose mock books, otherwise the 500
 * fake books can leak into the real shelf.
 */
export { libraryActivities, libraryBooks } from './mock-data'
export { LibraryDevPreview } from './components/library-dev-preview'

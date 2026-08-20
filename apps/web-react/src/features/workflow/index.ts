/**
 * Workflow feature barrel — React slice
 *
 * Exports the Phase2 workflow/upload slice for web-react.
 * Keeps apps/web working; new React-idiomatic hooks live here and are
 * importable as @/features/workflow for sharing to packages/domain later.
 */

// Stores
export { getUploadStore, createUploadStore, DEFAULT_FILE_LABEL } from './model/upload-store'
export { getWorkflowStore, createWorkflowStore } from './model/workflow-store'
export { useWorkflowDialogStore } from './components/TranslationWorkflowDialog'

// Constants & pure helpers
export * from './model/workflow-constants'
export * from './model/budget'
export * from './model/page-range'
export * from './model/workflow-payload'

// Controllers (hooks)
export { useUploadController } from './model/useUploadController'
export { useWorkflowController } from './model/useWorkflowController'

// Components — web-react equivalents of apps/web pages/home/features/workflow/*
export { UploadTile, HeroUpload } from './components/UploadTile'
export { PageRangeDialog } from './components/PageRangeDialog'
export { TranslationWorkflowDialog, useTranslationWorkflowDialog } from './components/TranslationWorkflowDialog'

// API
export * from './api/upload-api'

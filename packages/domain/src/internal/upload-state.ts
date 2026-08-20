// Minimal stub for apps/web/src/js/features/upload/state.ts — pure, injected via port
export interface UploadState {
  uploadId: string;
  uploadedFileName: string;
  uploadedPageCount: number;
  uploadedBytes: number;
  appliedPageRange: string;
  submitBusy: boolean;
}

function emptyUploadState(): UploadState {
  return {
    uploadId: "",
    uploadedFileName: "",
    uploadedPageCount: 0,
    uploadedBytes: 0,
    appliedPageRange: "",
    submitBusy: false,
  };
}

export function getUploadState(): UploadState {
  // Domain default: no upload in progress. Consumers (web) inject real state via ArtifactRuntimePort deps.
  return emptyUploadState();
}

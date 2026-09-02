import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogShell,
} from "@/components/ui/dialog.js";
import { useDialogReturnFocus } from "@/shared/react/use-dialog-return-focus.js";
import { StatusDetailHeader } from "./StatusDetailHeader.js";
import { StatusDetailTabs } from "./StatusDetailTabs.js";
import { STATUS_DETAIL_DIALOG_IDS } from "./status-detail-dom-ids.js";
import { useStatusDetailOverview } from "./useStatusDetailOverview.js";

/**
 * Task-detail composition root.
 *
 * Data orchestration lives in useStatusDetailOverview, navigation in
 * StatusDetailTabs, and each feature area owns its panel. Keeping this shell
 * deliberately small prevents recovery, diagnostics and artifact state from
 * leaking into the dialog lifecycle.
 */
export function StatusDetailDialog() {
  const detail = useStatusDetailOverview();
  const { onCloseAutoFocus } = useDialogReturnFocus(detail.open);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) detail.dialogStore.close();
  }

  return (
    <Dialog open={detail.open} onOpenChange={handleOpenChange}>
      <DialogContent
        id={STATUS_DETAIL_DIALOG_IDS.dialog}
        className="status-detail-dialog"
        level="nested"
        onCloseAutoFocus={onCloseAutoFocus}
        showCloseButton={false}
        size="wide"
      >
        <DialogShell className="desktop-shell">
          <StatusDetailHeader headline={detail.overview.headline} />
          <DialogBody className="desktop-body status-detail-body">
            <StatusDetailTabs
              activeTab={detail.activeTab}
              overview={detail.overview}
              translation={detail.translation}
              rerunPending={detail.rerunPending}
              ocrAmbiguityPending={detail.ocrAmbiguityPending}
              controller={detail.controller}
            />
          </DialogBody>
        </DialogShell>
      </DialogContent>
    </Dialog>
  );
}

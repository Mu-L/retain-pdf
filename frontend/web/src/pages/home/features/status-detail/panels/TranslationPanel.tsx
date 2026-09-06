import { TranslationDebugTab } from "../TranslationDebugTab.jsx";
import type { StatusDetailTranslation } from "../status-detail-store.js";
import type { StatusDetailControllerApi } from "../useStatusDetailOverview.js";
import { STATUS_DETAIL_DIALOG_IDS } from "../status-detail-dom-ids.js";
import { StatusDetailTabPanel } from "./StatusDetailTabPanel.js";

type TranslationPanelProps = {
  translation: StatusDetailTranslation;
  controller: StatusDetailControllerApi;
  active: boolean;
};

export function TranslationPanel({
  translation,
  controller,
  active,
}: TranslationPanelProps) {
  return (
    <StatusDetailTabPanel
      value="translation"
      id={STATUS_DETAIL_DIALOG_IDS.panels.translation}
      active={active}
    >
      <TranslationDebugTab translation={translation} controller={controller} />
    </StatusDetailTabPanel>
  );
}

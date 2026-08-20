// 详情 Tab 单源：preferTranslateTab/defaultTab。
// - prefer_translate_tab 仅在 open 变化时置位（不监听 documentId/payload 持续变化，避免竞态）
// - defaultTab 纯派生 useMemo，不设 state
// - 暴露 setPreferTranslateTab/markTranslateStarted 供 handleTranslate 复用（与原 onTranslateStarted 双写合并为单源）

import { useEffect, useMemo, useState, useCallback } from "react";

export type UseBookDetailTabOptions = {
  open: boolean;
  payloadItem?: any;
  item?: any;
  readerAvailable?: boolean;
  isActive?: boolean;
};

export function useBookDetailTab({
  open,
  payloadItem,
  item,
  readerAvailable = false,
  isActive = false,
}: UseBookDetailTabOptions) {
  const [preferTranslateTab, setPreferTranslateTab] = useState(false);

  // 仅在 open 变化时置位
  useEffect(() => {
    if (!open) {
      setPreferTranslateTab(false);
      return;
    }
    if (payloadItem?.prefer_translate_tab) {
      setPreferTranslateTab(true);
    }
  }, [open]);

  const markTranslateStarted = useCallback(() => {
    setPreferTranslateTab(true);
  }, []);

  const defaultTab = useMemo(() => {
    const failed = `${item?.status || ""}`.trim() === "failed";
    return preferTranslateTab || readerAvailable || isActive || failed ? "translate" : "overview";
  }, [preferTranslateTab, readerAvailable, isActive, item]);

  return {
    preferTranslateTab,
    setPreferTranslateTab,
    markTranslateStarted,
    defaultTab,
  };
}

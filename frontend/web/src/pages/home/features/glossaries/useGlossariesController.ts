// GlossariesDialog 家族(GlossariesDialog/GlossaryList/GlossaryEditor/
// GlossaryImportPanel)的唯一装配面(镜像 useCredentialsController.js)——把
// composition.js 的 glossaries 域(services.glossaries:{feature, view,
// dialogStore})折成一个 hook。
//
// 打开触发:SettingsHubDialog"词表"tab 的 #glossary-btn 直接调
// services.glossaries.dialogStore.open()(蓝图 §0.4 占位调用点,composition
// 就位后即生效),不经 APP_EVENTS——本 hook 用一个 open 状态迁移 effect 把
// "对话框被打开"这件事接回 controller.js 的 open()(内部会 openDialog() +
// reloadGlossaries()),语义等价旧世界"点击词表按钮 → open()"的单一入口,
// 不需要改 SettingsHubDialog.jsx 的既有占位调用。
//
// 旧 refreshGlossaries 事件已删（0 生产派发）：外部刷新直接调 handlers.reload()。

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useStoreSnapshot } from "@/shared/react/use-store.js";
import { useHomeServices } from "../../home-services-context.js";
import { useDialogState } from "../../state/use-dialog-state.js";

const EMPTY_EDITOR_SNAPSHOT = Object.freeze({
  draft: Object.freeze({ name: "", entries: Object.freeze([]) }),
  csvText: "",
});

export function useGlossariesController() {
  const services = useHomeServices();
  const { feature, view, dialogStore } = services.glossaries;
  const dialogState = useDialogState(dialogStore);
  const viewState = useStoreSnapshot(view.store);
  const open = Boolean(dialogState.open);
  const handlers = view.handlersRef.current;

  // draft/csvText 已移出 store(ref + editor 订阅,见 glossaries-store.js):
  // 这里订阅 editor 并把 draft/csvText 合并回 view,调用方(GlossariesDialog)
  // 的 view.draft / view.csvText / store.actions.* 契约保持不变。
  const editorPort = view.editor;
  const editorState = useSyncExternalStore(
    (onChange) => (editorPort ? editorPort.subscribe(() => onChange()) : () => {}),
    () => (editorPort ? editorPort.getSnapshot() : EMPTY_EDITOR_SNAPSHOT) as {
      draft: unknown;
      csvText: string;
    },
  );
  const mergedView = { ...viewState, draft: editorState.draft, csvText: editorState.csvText };
  const storeActions = (view.store as unknown as { actions?: Record<string, unknown> }).actions ?? {};
  const mergedStore = editorPort
    ? { ...view.store, actions: { ...storeActions, ...editorPort.actions } }
    : view.store;

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open && !wasOpenRef.current) {
      // controller.js 的 open() = openDialog()(dialogStore.open() 幂等) +
      // "正在读取术语表..." 状态 + reloadGlossaries() + 清空/错误状态,一次性
      // 复用,不在这里重新拼一遍等价逻辑。
      void feature?.open?.();
    }
    wasOpenRef.current = open;
  }, [open, feature]);

  return {
    open,
    view: mergedView,
    store: mergedStore,
    feature,
    dialogStore,
    handlers,
  };
}

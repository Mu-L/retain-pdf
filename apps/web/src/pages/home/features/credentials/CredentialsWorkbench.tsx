// CredentialsWorkbench：凭据表单主体（API/任务选项双 tab + 面板 + 保存行），
// 从 CredentialsDialog 抽出的双宿主组件：
//   1. SettingsHubDialog 的 API 区内嵌（常规入口，无二层弹窗）
//   2. CredentialsDialog（仅剩首次配置门 setupMode 一个场景）
// 两个宿主互斥挂载（设置是模态、门弹窗只从上传引导触发），BROWSER_IDS 的
// DOM id 不会同屏重复。状态/保存/校验全部走 useCredentialsController 的
// 单例 store——宿主只是壳。
//
// 任务选项面板已内联（原 TaskOptionsPanel 常驻挂载不卸载的约束保留：其字段 ref 在保存时被统一读取）。

import { Tabs as TabsPrimitive } from "radix-ui";
import { CREDENTIAL_DOM_IDS } from "./credentials-dom-ids.js";
import { useCredentialsController } from "./useCredentialsController.js";
import { OcrPanels, TranslationPanel } from "./ProviderPanels.jsx";
import { Button as ButtonBase } from "../../../../components/Button.jsx";

// Button.size 在未注解源文件里被推断为必填;unstyled 路径运行时不用 size。
const Button = ButtonBase as any;

const { browser: BROWSER_IDS } = CREDENTIAL_DOM_IDS;

const TABS = [
  { id: "api", label: "API 设置" },
  { id: "task", label: "任务选项" },
];

export function CredentialsWorkbench() {
  const { view, feature, handlers, elementsRef } = useCredentialsController();

  const setupMode = Boolean(view.setupMode);
  const activeTab = view.activeTab || "api";
  const dialogStatus = view.dialogStatus || { message: "", tone: "" };
  const statusContent = `${dialogStatus.message || ""}`.trim();
  const statusClasses = [
    "upload-status",
    statusContent ? "" : "hidden",
    dialogStatus.tone === "valid" ? "is-valid" : "",
    dialogStatus.tone === "error" ? "is-error" : "",
  ].filter(Boolean).join(" ");

  return (
    <TabsPrimitive.Root
      className="contents"
      value={activeTab}
      onValueChange={(tab) => feature?.activateCredentialTab(tab)}
    >
      <div className="credential-workbench">
        <TabsPrimitive.List
          id={BROWSER_IDS.tabs}
          className={`developer-tabs credential-tabs${setupMode ? " hidden" : ""}`}
          aria-label="接口设置"
        >
          {TABS.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.id}
              value={tab.id}
              id={tab.id === "api" ? BROWSER_IDS.tabApi : BROWSER_IDS.tabTask}
              className={`developer-tab credential-tab${activeTab === tab.id ? " is-active" : ""}`}
              data-credential-tab={tab.id}
            >
              {tab.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        <div className="credential-panels">
          <TabsPrimitive.Content
            value="api"
            forceMount
            hidden={activeTab !== "api"}
            className={`credential-panel${activeTab === "api" ? " is-active" : ""}`}
            data-credential-panel="api"
          >
            <div className="credential-card-grid credential-card-grid-compact credential-api-grid">
              <section className="credential-card">
                <div className="credential-card-head">
                  <h3>OCR</h3>
                </div>
                <OcrPanels />
              </section>
              <TranslationPanel />
            </div>
          </TabsPrimitive.Content>
          {/* 任务选项：原 TaskOptionsPanel 已内联，forceMount + hidden 保持常驻挂载 */}
          <TabsPrimitive.Content
            value="task"
            forceMount
            hidden={activeTab !== "task"}
            className={`credential-panel${activeTab === "task" ? " is-active" : ""}`}
            data-credential-panel="task"
            role="tabpanel"
          >
            <div className="credential-card-grid credential-card-grid-compact">
              <section className="credential-card">
                <div className="credential-card-head">
                  <h3>任务选项</h3>
                </div>
                <label>
                  <span className="developer-label">
                    <span>公式模式</span>
                  </span>
                  <select
                    id={BROWSER_IDS.mathMode}
                    aria-label="公式模式"
                    defaultValue="direct_typst"
                    ref={(node) => { elementsRef.mathModeSelect = node || null; }}
                  >
                    <option value="placeholder">占位保护</option>
                    <option value="direct_typst">直出公式</option>
                  </select>
                </label>
                {/* 模型地址/模型名不在旧模板可见布局里,但 dialog-values.js/dialog-sync.js 仍读写这两个字段——保留隐藏字段契约 */}
                <input
                  id={BROWSER_IDS.modelBaseUrl}
                  name="model_base_url"
                  type="hidden"
                  defaultValue=""
                  ref={(node) => { elementsRef.modelBaseUrlInput = node || null; }}
                />
                <input
                  id={BROWSER_IDS.modelName}
                  name="model_name"
                  type="hidden"
                  defaultValue=""
                  ref={(node) => { elementsRef.modelNameInput = node || null; }}
                />
              </section>
            </div>
          </TabsPrimitive.Content>
        </div>
        <div className="actions credential-dialog-actions">
          <span id={BROWSER_IDS.status} className={statusClasses}>{statusContent}</span>
          <Button
            id={BROWSER_IDS.saveButton}
            className="app-button"
            onClick={() => handlers?.save?.()}
          >
            {setupMode ? "保存并启动" : "保存"}
          </Button>
        </div>
      </div>
    </TabsPrimitive.Root>
  );
}

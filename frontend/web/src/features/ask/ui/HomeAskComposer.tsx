// 主页 AI 输入条：@ 选文档 / 合集 + chips + 发送
//
// 负责组合各子块；状态与交互逻辑见 use-home-ask-composer，
// 副作用（document 监听 / CustomEvent）见 use-home-ask-composer-effects。

import { HomeAskComposerBanner } from "./HomeAskComposerBanner.js";
import { HomeAskComposerChips } from "./HomeAskComposerChips.js";
import { HomeAskComposerInput } from "./HomeAskComposerInput.js";
import { HomeAskComposerPicker } from "./HomeAskComposerPicker.js";
import { HomeAskComposerToolbar } from "./HomeAskComposerToolbar.js";
import { useHomeAskComposer } from "./use-home-ask-composer.js";
import {
  openBrowserCredentials,
  useHomeAskComposerOutsideClose,
} from "./use-home-ask-composer-effects.js";
import type { HomeAskScope } from "../domain/types.js";

export type HomeAskComposerProps = {
  disabled?: boolean;
  isRunning?: boolean;
  /** 当前 Agent 运行模式缺少对应凭据或仍在加载时禁用发送 */
  credentialBlocked?: boolean;
  credentialMessage?: string;
  scopes: HomeAskScope[];
  onScopesChange: (next: HomeAskScope[]) => void;
  onSend: (question: string) => void;
  onStop?: () => void;
  /** hero：空态居中大输入；dock：对话底栏 */
  variant?: "hero" | "dock";
};

export function HomeAskComposer({
  disabled = false,
  isRunning = false,
  credentialBlocked = false,
  credentialMessage = "请先完成 AI Agent 配置",
  scopes,
  onScopesChange,
  onSend,
  onStop,
  variant = "dock",
}: HomeAskComposerProps) {
  const {
    text,
    pickerOpen,
    highlight,
    filtered,
    loadingOpts,
    optionsLoaded,
    textareaRef,
    listId,
    inputDisabled,
    canSend,
    scopeHint,
    closePicker,
    pickScope,
    handleSend,
    onKeyDown,
    handleTextChange,
    syncAtState,
    setHighlight,
  } = useHomeAskComposer({
    disabled,
    isRunning,
    credentialBlocked,
    credentialMessage,
    scopes,
    onScopesChange,
    onSend,
  });

  useHomeAskComposerOutsideClose({
    active: pickerOpen,
    anchorRef: textareaRef,
    onClose: closePicker,
  });

  return (
    <div className={`home-ask-composer home-ask-composer-${variant}${credentialBlocked ? " is-locked" : ""}`}>
      {credentialBlocked ? (
        <HomeAskComposerBanner
          message={credentialMessage}
          onOpenSettings={openBrowserCredentials}
        />
      ) : null}
      {scopes.length > 0 ? (
        <HomeAskComposerChips
          scopes={scopes}
          disabled={disabled}
          isRunning={isRunning}
          onScopesChange={onScopesChange}
        />
      ) : null}

      <div className="home-ask-composer-shell" aria-disabled={credentialBlocked || undefined}>
        <HomeAskComposerInput
          textareaRef={textareaRef}
          text={text}
          credentialBlocked={credentialBlocked}
          credentialMessage={credentialMessage}
          inputDisabled={inputDisabled}
          scopeCount={scopes.length}
          variant={variant}
          onTextChange={handleTextChange}
          onSyncCaret={syncAtState}
          onKeyDown={onKeyDown}
        />

        {pickerOpen ? (
          <HomeAskComposerPicker
            listId={listId}
            loadingOpts={loadingOpts}
            optionsLoaded={optionsLoaded}
            filtered={filtered}
            highlight={highlight}
            scopeCount={scopes.length}
            onHighlight={setHighlight}
            onPick={pickScope}
          />
        ) : null}

        <HomeAskComposerToolbar
          scopeHint={scopeHint}
          isRunning={isRunning}
          canSend={canSend}
          onStop={onStop}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

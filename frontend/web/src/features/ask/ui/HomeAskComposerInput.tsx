// HomeAskComposer 输入区：锁定层 + textarea

import type {
  KeyboardEvent as ReactKeyboardEvent,
  RefObject,
} from "react";

export type HomeAskComposerInputProps = {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  text: string;
  credentialBlocked: boolean;
  credentialMessage: string;
  inputDisabled: boolean;
  scopeCount: number;
  variant: "hero" | "dock";
  onTextChange: (value: string, caret: number) => void;
  onSyncCaret: (value: string, caret: number) => void;
  onKeyDown: (event: ReactKeyboardEvent<HTMLTextAreaElement>) => void;
};

export function HomeAskComposerInput({
  textareaRef,
  text,
  credentialBlocked,
  credentialMessage,
  inputDisabled,
  scopeCount,
  variant,
  onTextChange,
  onSyncCaret,
  onKeyDown,
}: HomeAskComposerInputProps) {
  return (
    <>
      {/* 锁定层：挡住一切输入（比仅 disabled 更稳） */}
      {credentialBlocked ? (
        <div
          className="home-ask-composer-lock"
          aria-hidden
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      ) : null}
      <textarea
        ref={textareaRef}
        className="home-ask-input"
        rows={2}
        value={credentialBlocked ? "" : text}
        disabled={inputDisabled}
        readOnly={credentialBlocked}
        tabIndex={credentialBlocked ? -1 : 0}
        aria-disabled={credentialBlocked}
        placeholder={
          credentialBlocked
            ? credentialMessage
            : scopeCount
              ? "继续提问… @ 可再指定文章或合集"
              : variant === "hero"
                ? "用 AI 做任何事… 输入 @ 指定文章或合集"
                : "继续提问… 输入 @ 指定文章或合集"
        }
        onChange={(e) => {
          if (credentialBlocked) return;
          const value = e.target.value;
          onTextChange(value, e.target.selectionStart ?? value.length);
        }}
        onBeforeInput={(e) => {
          if (credentialBlocked) e.preventDefault();
        }}
        onPaste={(e) => {
          if (credentialBlocked) e.preventDefault();
        }}
        onClick={(e) => {
          if (credentialBlocked) {
            e.preventDefault();
            return;
          }
          const t = e.currentTarget;
          onSyncCaret(t.value, t.selectionStart ?? t.value.length);
        }}
        onKeyUp={(e) => {
          if (credentialBlocked) return;
          const t = e.currentTarget;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            onSyncCaret(t.value, t.selectionStart ?? t.value.length);
          }
        }}
        onKeyDown={(e) => {
          if (credentialBlocked) {
            e.preventDefault();
            return;
          }
          onKeyDown(e);
        }}
      />
    </>
  );
}

// BookDetailShell —— 书籍详情弹窗「壳」。
//
// 只负责:
//   - Radix Dialog 开合 / 遮罩 / 关闭钮
//   - 固定 id="book-detail-dialog"（测试与样式锚点）
//   - 双栏布局槽位 left / right
//
// 不负责:
//   - 拉 document、翻译、删除、合集等业务
//   - 决定左栏放哪些按钮、右栏有哪些区块
//
// 用法:
//   <BookDetailShell open={…} onOpenChange={…} left={…} right={…} />

import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {(event: Event) => void} [props.onCloseAutoFocus]
 * @param {string} [props.title] 无障碍标题（默认「书籍详情」）
 * @param {import("react").ReactNode} props.left  左栏（封面、主操作）
 * @param {import("react").ReactNode} props.right 右栏（元数据、翻译、合集…）
 * @param {string} [props.contentClassName]
 */
export function BookDetailShell({
  open,
  onOpenChange,
  onCloseAutoFocus,
  title = "书籍详情",
  left,
  right,
  contentClassName = "",
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="desktop-dialog-overlay" />
        <DialogPrimitive.Content
          id="book-detail-dialog"
          className={`book-detail-dialog-content fixed inset-0 z-[101] m-auto h-fit w-[min(1040px,96vw)] max-h-[90vh] overflow-hidden rounded-[20px] border border-border/60 bg-paper shadow-[0_32px_80px_color-mix(in_srgb,var(--shadow-color)_24%,transparent)] ${contentClassName}`.trim()}
          onCloseAutoFocus={onCloseAutoFocus}
        >
          <DialogPrimitive.Title asChild>
            <h2 className="sr-only">{title}</h2>
          </DialogPrimitive.Title>
          <DialogPrimitive.Close asChild>
            <button
              id="book-detail-close-btn"
              type="button"
              aria-label="关闭"
              className="absolute right-5 top-5 z-[2] inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted/80 text-muted-foreground backdrop-blur hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogPrimitive.Close>

          <div className="book-detail-shell-grid grid grid-cols-1 gap-0 sm:grid-cols-[320px_1fr] sm:divide-x sm:divide-border/60">
            <div className="book-detail-shell-left bg-muted/20 p-7 pr-6">{left}</div>
            <div className="book-detail-shell-right min-w-0 max-h-[90vh] overflow-y-auto p-7 pl-7 pr-12">{right}</div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

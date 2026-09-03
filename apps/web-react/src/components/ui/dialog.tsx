// P0-2 UI 收敛 compat 说明：
// - 上游 @retainpdf/ui 的 Dialog 是 Radix 复合组件（Root/Trigger/Content…），
//   与本文件的业务弹窗（open/title/closeLabel/backdropCloseLabel/onClose…）
//   不同构，6 个调用点依赖旧 API，故本地 `Dialog` 实现保留，待 P0-3 迁移。
// - 除 `Dialog` 本体外，其余 Radix Dialog 部件从上游 re-export，供新代码使用。
export {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@retainpdf/ui/components/ui/dialog";

import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export type DialogProps = {
  open: boolean
  title: string
  closeLabel: string
  backdropCloseLabel: string
  children: ReactNode
  className?: string
  contentClassName?: string
  hideHeader?: boolean
  onClose: () => void
}

export function Dialog({ open, title, closeLabel, backdropCloseLabel, children, className, contentClassName, hideHeader = false, onClose }: DialogProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/20 px-4 py-6 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="absolute inset-0 cursor-default" aria-label={backdropCloseLabel} onClick={onClose} />
      <section className={cn('relative grid max-h-[calc(100vh-48px)] w-full max-w-3xl overflow-hidden rounded-[28px] bg-white shadow-2xl', className)}>
        {hideHeader ? (
          <button type="button" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-neutral-500 shadow-sm transition hover:bg-white hover:text-neutral-950" aria-label={closeLabel} onClick={onClose}>
            <X className="size-4" />
          </button>
        ) : (
          <header className="grid grid-cols-[minmax(0,1fr)_36px] items-center gap-3 border-b border-neutral-100 px-5 py-4">
            <h2 className="truncate text-base font-semibold text-neutral-950">{title}</h2>
            <button type="button" className="grid size-9 place-items-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950" aria-label={closeLabel} onClick={onClose}>
              <X className="size-4" />
            </button>
          </header>
        )}
        <div className={cn('scrollbar-subtle overflow-auto p-5', hideHeader && 'p-0', contentClassName)}>{children}</div>
      </section>
    </div>
  )
}

// P0-2 UI 收敛 compat 说明：上游 @retainpdf/ui 暂无 Progress 原语，
// 本地实现保留（Radix Progress，neutral 胶囊样式，与 TW3 host 一致）。
// 若 apps/web 后续需要，应抽入 packages/ui 再统一 re-export（P0-3）。
import * as ProgressPrimitive from '@radix-ui/react-progress'
import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Progress({
  className,
  value = 0,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-3 w-full overflow-hidden rounded-full bg-neutral-200', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full w-full flex-1 rounded-full bg-neutral-950 transition-transform"
        style={{ transform: `translateX(-${100 - safeValue}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

// P0-2 UI 收敛：Button 唯一真相源为 @retainpdf/ui（packages/ui）。
// 本文件仅做 re-export + 旧对外 API 兼容（ButtonProps 类型别名）。
export { Button, buttonVariants } from "@retainpdf/ui/components/ui/button";

import type * as React from "react";
import { Button } from "@retainpdf/ui/components/ui/button";

// 兼容旧 `import { ButtonProps } from "@/components/ui/button"`：
// 上游 Button 的 props 即 ComponentProps（含 variant/size/asChild），
// 此别名与旧手写 interface 在现有调用点（variant: default/outline/ghost；
// size: default/sm/icon）上可互换。
export type ButtonProps = React.ComponentProps<typeof Button>;

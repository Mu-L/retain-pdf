// P0-2 UI 收敛：Tooltip 唯一真相源为 @retainpdf/ui（packages/ui）。
// web-react 此前缺失该原语，本文件补齐 deep-path 导入对称性。
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@retainpdf/ui/components/ui/tooltip";

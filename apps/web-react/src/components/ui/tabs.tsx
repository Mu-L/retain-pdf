// P0-2 UI 收敛：Tabs 唯一真相源为 @retainpdf/ui（packages/ui）。
// 上游 API 为超集（Tabs 支持 orientation；TabsList 支持 variant），
// 现有调用点只用 className/defaultValue/value/children，无需改动。
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  tabsListVariants,
} from "@retainpdf/ui/components/ui/tabs";

// 兼容层：历史名 CategoriesView -> 现名 CollectionsView（领域统一为 collections）。
// 新代码请 import { CollectionsView } from "./CollectionsView.jsx" 或从 `features/library` 统一入口。
// 本文件保留以防直接深挖路径的旧引用，未来可删除。
export { CollectionsView } from "./CollectionsView.jsx";
export { CollectionsView as CategoriesView } from "./CollectionsView.jsx";
export { CollectionsView as default } from "./CollectionsView.jsx";

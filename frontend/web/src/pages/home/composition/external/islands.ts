// composition/external/islands — island registration barrel
//
// library-search 自定义元素已随 library 功能迁至
// src/features/library/ui/island；此处保留副作用 import 作为注册点。
import "@/features/library/ui/island/index.js";

// Re-export tag constant for consumers that need it (optional)
export const LIBRARY_SEARCH_ISLAND_TAG = "library-search-island";

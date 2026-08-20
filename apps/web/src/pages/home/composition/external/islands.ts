// composition/external/islands — island registration barrel
// HomeApp previously did `import "../../js/islands/library-search/index.js"` directly,
// violating the "home features/pages must go via composition/external" gate.
// This barrel keeps the side-effect import behind the gate.
import "../../../../js/islands/library-search/index.js";

// Re-export tag constant for consumers that need it (optional)
export const LIBRARY_SEARCH_ISLAND_TAG = "library-search-island";

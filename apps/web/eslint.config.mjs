/**
 * ESLint flat config — enforce @/shared alias for deep relative imports.
 * Task A: migrate remaining 58 deep relative imports from pages→shared.
 * This rule prevents regression: disallow relative imports that resolve to src/shared.
 */
export default [
  {
    files: ["src/pages/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "**/shared/react/**",
                "**/shared/reader/**",
                "**/shared/theme/**",
                "**/shared/navigation/**",
                "**/shared/icons/**",
                "**/shared/credentials/**",
                "**/shared/decor/**",
                // catch deep relative variants explicitly as well
                "../../shared/**",
                "../../../shared/**",
                "../../../../shared/**",
                "../../../../../shared/**",
                "../../../../../../shared/**",
              ],
              message:
                'Use @/shared alias instead of deep relative import (e.g., import { X } from "@/shared/react/use-store.js"). Intra-feature ../shared/** (pages/home/features/shared) remains relative.',
            },
          ],
        },
      ],
    },
  },
  {
    // intra-feature shared is allowed to stay relative
    files: ["src/pages/home/features/shared/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
];

import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import cypressPlugin from "eslint-plugin-cypress/flat";
import { defineConfig } from "eslint/config";

const cypressRecommended = cypressPlugin.configs.recommended;

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    ...cypressRecommended,
    files: ["cypress/**/*.{cy,spec}.{js,ts,tsx}"],
    languageOptions: {
      ...cypressRecommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...(cypressRecommended.languageOptions?.globals ?? {}),
      },
    },
  },
]);

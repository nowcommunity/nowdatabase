import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import cypressPlugin from "eslint-plugin-cypress/flat";
import { defineConfig } from "eslint/config";

const cypressRecommended = cypressPlugin.configs.recommended;
const reactRecommended = pluginReact.configs.flat.recommended;

export default defineConfig([
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...(js.configs.recommended.languageOptions?.globals ?? {}),
      },
    },
  },
  tseslint.configs.recommended,
  {
    ...reactRecommended,
    settings: {
      ...(reactRecommended.settings ?? {}),
      react: {
        version: "18.2",
        ...(reactRecommended.settings?.react ?? {}),
      },
    },
  },
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

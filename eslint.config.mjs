import globals from 'globals'
import jsPlugin from '@eslint/js'
import cypressPlugin from 'eslint-plugin-cypress/flat'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import mochaPlugin from 'eslint-plugin-mocha'

// NOTE: This config is only used for running ESLint on the Cypress tests. Frontend and backend use their own configs.

/** @type {import('eslint').Linter.Config[]} */
export default [
  mochaPlugin.configs.flat.recommended,
  cypressPlugin.configs.recommended,

  {
    rules: {
      ...jsPlugin.configs.recommended.rules,
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-skipped-tests': 'off',
      'mocha/max-top-level-suites': 'off',
      'mocha/no-top-level-hooks': 'off',
      'mocha/no-sibling-hooks': 'off',
    },

    languageOptions: {
      globals: globals.browser,
    },
  },

  prettierPlugin,
]

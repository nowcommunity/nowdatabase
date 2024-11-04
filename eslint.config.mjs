import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginCypress from 'eslint-plugin-cypress/flat'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

// NOTE: This config is only used for running ESLint on the Cypress tests. Frontend and backend use their own configs.

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    languageOptions: { globals: globals.browser },
  },

  {
    files: ['cypress/*.js'],
    rules: pluginJs.configs.recommended.rules,
  },

  pluginCypress.configs.recommended,
  pluginPrettier,
]

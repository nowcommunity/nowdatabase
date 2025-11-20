import globals from 'globals'
import cypressPlugin from 'eslint-plugin-cypress/flat'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import mochaPlugin from 'eslint-plugin-mocha'

// NOTE: This config is only used for running ESLint on the Cypress tests. Frontend and backend use their own configs.

const mochaRecommended = mochaPlugin.configs.flat.recommended
const cypressRecommended = cypressPlugin.configs.recommended
const mochaLanguageOptions = mochaRecommended.languageOptions ?? {}
const cypressLanguageOptions = cypressRecommended.languageOptions ?? {}
const mochaRules = mochaRecommended.rules ?? {}
const cypressRules = cypressRecommended.rules ?? {}

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['cypress/**/*.{cy,spec}.{js,ts,tsx}'],
    ...mochaRecommended,
    ...cypressRecommended,
    rules: {
      ...mochaRules,
      ...cypressRules,
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-skipped-tests': 'off',
      'mocha/max-top-level-suites': 'off',
      'mocha/no-top-level-hooks': 'off',
      'mocha/no-sibling-hooks': 'off',
    },
    languageOptions: {
      ...mochaLanguageOptions,
      ...cypressLanguageOptions,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      mocha: mochaPlugin,
      cypress: cypressPlugin,
    },
  },

  prettierPlugin,
]

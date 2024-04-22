module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:import-resolver-typescript',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'babel.config.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'prettier/prettier': 'error',
    'no-console': 'error',
    'no-async-promise-executor': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['packages/*/tsconfig.json'],
      },
    },
  },
}

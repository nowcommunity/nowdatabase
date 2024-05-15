module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  ignorePatterns: ['build', '.eslintrc.cjs', 'babel.config.js', '*/node_modules/*'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'prettier/prettier': 'error',
    'no-async-promise-executor': 'off',
    'import/no-named-as-default-member': 'off',
    'import/default': 'off',
    'import/namespace': 'off',
    'no-console': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json'],
      },
    },
  },
  parserOptions: {
    project: ['tsconfig.json'],
    tsconfigRootDir: ['backend']
  },
}

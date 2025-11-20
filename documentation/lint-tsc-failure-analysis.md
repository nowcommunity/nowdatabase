# Lint and TypeScript Failure Analysis

## Summary of recurring failure categories
- **Prettier formatting drifts.** Multiple PRs required follow-up fixes solely for formatting (e.g., commits `27360b5`, `fe8e17e`, `64b8476`, `4f3e727`, `67decac`).
- **Unused or mis-scoped imports/vars in UI flows and tests.** Lint fixes such as removing unused ESLint disables or console statements and adjusting Cypress selectors surfaced repeatedly (e.g., `477a6e4`, `05b88c7`, `67decac`).
- **Missing type annotations in tests and utilities.** Several commits added typings to satisfy lint/tsc in jest/cypress contexts (e.g., `2096ca2`, `83f5716`, `8b3b2bb`).
- **Prisma/type declaration gaps.** Lint/tsc runs failed when generated Prisma types or domain types were not referenced explicitly (e.g., PR #951 added explicit Prisma type definitions to satisfy lint/tests).
- **Large fixture or geojson files affecting tsc.** CI changes added ignores for heavy data (e.g., `f45ce2a` excluded country borders from lint/tsc) suggesting type-checking big JSON assets causes timeouts or memory pressure.

## Recommended mitigations and guidelines
- **Run formatters before pushing.** Use `npm run lint -- --fix` or `npm run format` (if available) prior to opening a PR to avoid formatter-only failures.
- **Keep test helpers typed.** Add explicit parameter and return types in Jest/Cypress helpers; avoid implicit `any` and ensure async functions declare `Promise<...>` return types.
- **Prisma type availability.** Ensure `prisma generate` has been run locally so generated types exist; import Prisma-generated types in service/tests rather than relying on implicit `any` shapes.
- **Reduce unused code and console noise.** Remove unused imports/variables early; prefer `debug` logging patterns over `console.*` in production code. Drop stale `eslint-disable` directives when no longer needed.
- **Scope lint/tsc includes.** Confirm large JSON fixtures (e.g., country border data) remain excluded via `tsconfig` `exclude` or ESLint `ignorePatterns` to keep checks performant.
- **Pre-flight local checks.** Run `npm run lint` and `npm run tsc` at least once per PR branch; if working in only frontend or backend, run the workspace-specific commands to catch env-specific rules.

## Mapping categories to preventative actions
- Prettier drifts → automate via pre-commit hook or CI format check and always run formatter locally.
- Unused imports/console noise → enable IDE ESLint integration; clean up during development.
- Missing type annotations → configure TypeScript/Jest/Cypress typings globally and prefer typed helpers; avoid implicit anys.
- Prisma/type gaps → document the need to regenerate Prisma client after schema changes; commit necessary type files when applicable.
- Large fixtures → keep ignores up to date and consider typed stubs or schema-minimized fixtures for tests.

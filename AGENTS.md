# AGENTS.md

Repository-specific instructions for Codex sessions in this repository.

These instructions apply to all work in `nowdatabase_react` unless the user gives a more specific direct instruction for the current task.

## Source Policy Files

Codex must follow the repository policies described in:

- `documentation/codex_planning_prompt.md`
- `documentation/coding_prompt_template_fullstack.md`

Treat those files as the canonical planning and coding policy for this repository.

## How To Handle User Requests In VS Code

- The user may describe tasks in plain language in the Codex chat panel.
- Do not require the user to provide JSON task payloads.
- Translate the user’s plain-language request into the same planning and implementation discipline described in the two policy files above.
- If the request is ambiguous in a way that could cause incorrect implementation, ask a short clarifying question. Otherwise make reasonable assumptions and proceed.

## Default Workflow

For any non-trivial feature, bug fix, refactor, or test change:

1. Read the relevant code before changing anything.
2. Create a short internal plan that follows `documentation/codex_planning_prompt.md`.
3. Implement the task using the coding standards from `documentation/coding_prompt_template_fullstack.md`.
4. Run the relevant validation commands.
5. Summarize what changed, what was verified, and any remaining risks.

For very small requests, Codex may skip writing out a formal plan, but it must still follow the same policy.

## Frontend Test Policy

When changing frontend code or frontend tests, Codex must proactively apply these rules:

- Prefer narrow fixes over broad Jest configuration workarounds.
- Before changing Jest config, check whether the real issue is missing runtime context in tests.
- Wrap Redux-dependent components in `Provider`.
- Wrap router-dependent components in the correct router harness:
  - `MemoryRouter` for simple router hooks
  - `createMemoryRouter` + `RouterProvider` when data-router behavior or `useBlocker` is involved
- Provide required app contexts such as page/detail/notification providers when components depend on them.
- Mock unrelated heavy subtrees when they are not part of the behavior under test.
- Treat these as known Jest risk areas and handle them with focused fixes:
  - `import.meta.env`
  - ESM-only dependencies
  - asset imports
  - RTK Query `fetchBaseQuery`
  - timers and open handles
- Use `act(...)` for programmatic router navigation or other async state transitions when needed.
- Ensure select fields use valid empty values such as `''` rather than `undefined`.
- Avoid introducing runtime circular imports between Redux API modules, reducers, and store setup.
- Keep React hooks lint-safe at all times: do not call hooks conditionally in production components or test-support code.
- Do not attach promise-returning functions directly to DOM event props when a void callback is expected; wrap them in a lint-safe handler.
- Treat `src/tests/setup.ts` and `src/tests/mocks/*` as strict frontend code, not throwaway helpers: they must satisfy ESLint, Prettier, and TypeScript rules too.

## Backend API Test Policy

When changing backend code or backend API tests, Codex must proactively apply these rules:

- Prefer fixing the real backend cause over rewriting many tests, but verify whether a failure is actually caused by stale fixtures, environment dependence, or overly strict assertions before changing production code.
- Treat API tests as strict code too: helper files, mocks, and test-only fetch/database shims must satisfy ESLint, Prettier, and TypeScript rules.
- Do not make API tests depend on live external services. Mock outbound calls such as Geonames requests so CI is deterministic and offline-safe.
- Avoid depending on unstable seeded data details unless the test explicitly verifies them. If a test needs seeded fixtures, use values that are present in the checked-in test SQL and keep related tests aligned to the same seeded ids.
- For update tests, build payloads from known-valid fixture shapes when the endpoint validates broad entity state, but avoid blindly merging fetched server objects if that reintroduces legacy fields that fail current validation.
- When a test only cares about one behavior, keep the payload narrow enough to avoid replaying unrelated edits on subsequent requests.
- Avoid brittle assertions on total log-row counts when broader valid payloads can legitimately produce more audit rows. Assert the required rows and the key audit linkage instead.
- Watch for write-layer helper fields leaking into generic persistence code, especially metadata such as `comment`, `references`, computed helper objects, or UI-only fields. Strip those before calling shared DB writers.
- Be careful with generated ids in MariaDB-backed tests. Prefer deterministic id handling that works with the actual driver behavior instead of assuming `RETURNING` semantics.
- When debugging backend test failures, capture the real exception if possible before applying another speculative fix.

## Cypress / E2E Test Policy

When changing Cypress support code or E2E specs, Codex must proactively apply these rules:

- Prefer fixing the shared Cypress harness first when multiple specs fail in similar ways. Check `cypress/support/commands.js`, `cypress.config.js`, shared fixtures, and common login/reset helpers before patching many individual specs.
- Use deterministic database setup. Prefer a single shared `cy.resetDatabase()` helper over raw reset requests scattered through specs, and use `beforeEach` isolation when tests mutate shared seeded state.
- Treat Cypress support files as strict code too: custom commands, TS declaration files, fixtures used as typed metadata, and support helpers must satisfy ESLint, Prettier, and TypeScript rules.
- Be careful with Material UI wrappers and hidden inputs. Target the actual interactive element (for example the nested `input` inside a `TextField` wrapper) rather than wrapper divs or hidden native select inputs.
- Do not rely on live external services in E2E tests. Stub third-party requests such as Geonames lookups with `cy.intercept(...)` when the behavior under test is not the external service itself.
- Prefer stable post-action assertions over brittle transient UI text. If a save/create flow is asynchronous, verify the actual network response or returned id/slug and then navigate/assert from the durable saved state instead of depending only on an immediate toast or header text.
- Avoid over-asserting read-mode text for fields whose display formatting can legitimately differ from edit-mode values. For selectors such as time-unit sequences, assert against the stable UI state that the current component actually exposes.
- When a Cypress failure shows an application-side unhandled rejection, check whether the real fix belongs in production code, especially around RTK Query `unwrap()` calls, delete flows, or mutation side effects leaking rejected promises.
- Keep hard-coded seeded ids in E2E specs aligned with the current checked-in seed data. If API and E2E tests both exercise the same entity, prefer the same known-good ids.

## Validation Expectations

Before finishing, Codex should run the narrowest useful checks for the task, and run broader checks when the scope justifies it.

Typical commands from the repository root:

- `npm run lint`
- `npm run tsc`
- `npm run test`
- `npm run lint:frontend`
- `npm run tsc:frontend`
- `npm run lint:cypress`

Backend-focused checks are also expected when relevant:

- `cd backend && npm run lint`
- `cd backend && npm run build`
- `cd backend && npm run test:api:local -- --runTestsByPath <path>`

If only a small area changed, targeted test runs are acceptable during iteration, but the final state should reflect the validation standard from the two policy files.

## Scope Control

- Implement only the requested task and directly necessary fixes.
- Do not add unrelated cleanup unless it is required to make the task correct or keep CI green.
- Do not add temporary test hacks without checking whether a production or harness-level fix is the better solution.

## Priority Order For Decisions

When tradeoffs appear, prefer:

1. Correctness
2. Keeping existing tests and CI stable
3. Narrow, local fixes
4. Consistency with existing repository patterns
5. Speed

## Output Expectations

- Be concise and practical.
- Mention files changed, validation performed, and any unresolved risk.
- If a task was only partially verifiable locally, say so clearly.

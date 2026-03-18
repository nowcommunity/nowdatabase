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

## Validation Expectations

Before finishing, Codex should run the narrowest useful checks for the task, and run broader checks when the scope justifies it.

Typical commands from the repository root:

- `npm run lint`
- `npm run tsc`
- `npm run test`
- `npm run lint:frontend`
- `npm run tsc:frontend`

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


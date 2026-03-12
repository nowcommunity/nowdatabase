# Feature Plan: Handle invalid Time Bound IDs in Time Unit PUT requests

## 1) Assumptions & Scope
- The issue is in `PUT /time-unit` backend handling where non-existing `up_bnd` or `low_bnd` can still reach persistence and surface as an unhandled internal error.
- Existing role restrictions for time-unit writes (`Admin`, `EditUnrestricted`) remain unchanged.
- No schema change is required; this is a validation and error-mapping hardening task.
- Impacted areas:
  - Backend request validation and error handling in `backend/src/routes/timeUnit.ts`
  - Shared validation behavior used by backend (`backend/src/services/timeUnit.ts`, shared validator if needed)
  - Backend API tests for time-unit update/create invalid bounds flows
  - Frontend error messaging path for time-unit save failures only if backend response shape changes
- Goal behavior:
  - Invalid/non-existent `up_bnd`/`low_bnd` should return a client error (`400` or existing project-standard `403`) with actionable payload, never `500`.
  - Existing valid flows and cascade checks must remain intact.

## 2) High-Level Plan
1. Reproduce and characterize failure path
   - Add/adjust API test case for `PUT /time-unit` with non-existing `up_bnd` and/or `low_bnd` to confirm current `500` behavior.
2. Harden backend validation before write
   - In time-unit route/service layer, explicitly detect when bound IDs are provided but corresponding time bound lookup returns no record.
   - Return structured validation error response immediately.
3. Normalize database/Prisma error mapping
   - Add defensive handling for Prisma foreign-key violations as a final guardrail, mapping to deterministic client error.
4. Align frontend handling (if necessary)
   - Ensure existing UI save flow shows validation message from backend instead of generic failure when invalid IDs slip through.
5. Validate and regress
   - Extend backend tests for both single-invalid and dual-invalid bound IDs.
   - Run lint/typecheck/tests in impacted scope.

## 3) Tasks (JSON)
```json
[
  {
    "id": "T1",
    "title": "Add failing regression coverage for invalid Time Bound references",
    "summary": "Create backend API tests for PUT /time-unit where up_bnd and/or low_bnd reference non-existent IDs and assert non-500 behavior with structured error payload.",
    "app": "backend",
    "files_touched": [
      "backend/src/api-tests/timeUnit/update.test.ts",
      "backend/src/api-tests/timeUnit/create.test.ts"
    ],
    "migrations": false,
    "permissions": [
      "Requires authenticated users with Admin or EditUnrestricted role"
    ],
    "acceptance_criteria": [
      "Test demonstrates invalid bound IDs are rejected with client error status",
      "Response includes consumable validation message and does not return 500"
    ],
    "test_plan": [
      "Run targeted timeUnit API tests",
      "Verify existing valid update/create tests still pass"
    ],
    "estimate_hours": 1.5,
    "priority": "high"
  },
  {
    "id": "T2",
    "title": "Enforce explicit bound existence validation in PUT /time-unit",
    "summary": "Update backend route/service logic to treat provided up_bnd/low_bnd IDs as invalid when lookup misses, and short-circuit with structured validation response before writeTimeUnit.",
    "app": "backend",
    "files_touched": [
      "backend/src/routes/timeUnit.ts",
      "backend/src/services/timeUnit.ts",
      "frontend/src/shared/validators/timeUnit.ts"
    ],
    "migrations": false,
    "permissions": [
      "Preserve existing role enforcement via requireOneOf([Role.Admin, Role.EditUnrestricted])"
    ],
    "acceptance_criteria": [
      "PUT with non-existing up_bnd is rejected consistently",
      "PUT with non-existing low_bnd is rejected consistently",
      "PUT with both non-existing IDs is rejected consistently",
      "No invalid ID request reaches DB write path"
    ],
    "test_plan": [
      "Re-run timeUnit API tests",
      "Add validator unit test(s) if validation contract changes"
    ],
    "estimate_hours": 2.0,
    "priority": "high"
  },
  {
    "id": "T3",
    "title": "Map Prisma FK constraint errors to deterministic client response",
    "summary": "Add catch-path handling for Prisma known request FK errors as a safety net to return project-standard validation/conflict response instead of 500.",
    "app": "backend",
    "files_touched": [
      "backend/src/routes/timeUnit.ts",
      "backend/src/services/write/timeUnit.ts"
    ],
    "migrations": false,
    "permissions": [
      "Same write permissions as existing endpoint"
    ],
    "acceptance_criteria": [
      "Unexpected FK violations in time-unit write return client error payload",
      "Unhandled 500 for invalid bound references is eliminated"
    ],
    "test_plan": [
      "Add integration assertion for mapped FK error path (if reachable)",
      "Smoke-test PUT /time-unit valid update path"
    ],
    "estimate_hours": 1.0,
    "priority": "medium"
  },
  {
    "id": "T4",
    "title": "Verify frontend error surfacing for time-unit save failures",
    "summary": "Confirm frontend Time Unit edit/create views display backend validation errors for invalid bounds and avoid generic crash-like messaging.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/components/TimeUnit/TimeUnitDetails.tsx",
      "frontend/src/components/DetailView/common/UpdateTab.tsx",
      "frontend/src/redux/timeUnitReducer.ts"
    ],
    "migrations": false,
    "permissions": [
      "UI remains editable only for authorized roles"
    ],
    "acceptance_criteria": [
      "User sees clear validation message when save includes invalid bound IDs",
      "No UI regression for normal time-unit save"
    ],
    "test_plan": [
      "Add/adjust component or reducer tests for error state display",
      "Manual smoke check in Time Unit edit form"
    ],
    "estimate_hours": 1.5,
    "priority": "medium"
  },
  {
    "id": "T5",
    "title": "Document API error contract for invalid bound references",
    "summary": "Update API and entity docs to specify expected status code and payload when Time Unit references missing Time Bound IDs.",
    "app": "docs",
    "files_touched": [
      "documentation/api/time-units.md",
      "documentation/entities/time_unit.md",
      "documentation/CHANGELOG.md"
    ],
    "migrations": false,
    "permissions": [
      "N/A"
    ],
    "acceptance_criteria": [
      "Docs reflect non-500 behavior and example error payload",
      "Changelog records bugfix behavior change"
    ],
    "test_plan": [
      "Documentation review for accuracy against implemented response"
    ],
    "estimate_hours": 0.5,
    "priority": "low"
  }
]
```

## 4) Risks & Mitigations
- Auth failures: endpoint hardening could accidentally bypass/alter auth flow.
  - Mitigation: keep `requireOneOf` unchanged and include unauthorized test coverage.
- Behavior drift in status codes (`403` vs `400`).
  - Mitigation: align with existing NOW validation conventions and update docs/tests to one canonical outcome.
- Hidden FK paths still causing 500.
  - Mitigation: explicit pre-write validation + Prisma error mapping guardrail.
- Frontend mismatch with new error payload shape.
  - Mitigation: preserve existing validation error format where possible; add adapter logic only if needed.
- Regression in create/update cascade checks.
  - Mitigation: run full time-unit create/update test suite and targeted locality-cascade tests.

## 5) Out of Scope
- Legacy data cleanup/migration for already persisted inconsistent records.
- UI redesign or theming changes beyond existing MUI patterns.
- Broad refactor of shared validation framework unrelated to Time Unit bounds.
- General performance tuning not specific to this bug.

## 6) Definition of Done
- [ ] Invalid `up_bnd`/`low_bnd` PUT payloads return structured non-500 client errors.
- [ ] Authorized/unauthorized behavior remains correct.
- [ ] Backend tests added/updated and passing for regression scenarios.
- [ ] Linting and type checks pass in touched scopes.
- [ ] API/entity docs and changelog updated with new behavior.
- [ ] CI passes for backend/frontend checks relevant to touched files.

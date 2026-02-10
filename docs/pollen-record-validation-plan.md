# Pollen Record Validation Plan (Locality → Climate)

## 1) Assumptions & Scope

- The feature applies to existing Locality climate fields `pers_pollen_ap`, `pers_pollen_nap`, and `pers_pollen_other`, which are already present in Prisma and shared frontend/backend locality types.
- No database schema change is required for this feature because all required columns already exist and are typed as nullable integers.
- Validation must be enforced in both layers:
  - Shared field-level validation (used by frontend forms and backend locality service validation flow).
  - Backend request-time validation to guarantee data integrity regardless of client behavior.
- UI impact is limited to Locality Climate tab input behavior and validation feedback; no new routes/pages are needed.
- Existing role-based access control for locality create/update remains unchanged; validation should run after permission checks and before persistence.
- Error responses must stay compatible with current structured validation error patterns used by locality endpoints.

## 2) High-Level Plan

1. **Validation rules definition (shared contract)**
   - Define/extend locality validator behavior so each pollen field accepts only integers in `[0, 100]` when provided.
   - Add a cross-field rule: `AP + NAP + OP <= 100` (ignoring `null` values as zero or validating only when value exists, consistent with existing optional-field behavior).

2. **Backend enforcement**
   - Ensure locality create/update flows surface the shared validator errors and reject invalid payloads with `400` + structured field errors.
   - Confirm validation is applied for partial updates and full payload updates.

3. **Frontend UX validation**
   - Surface immediate field-level errors in the Locality Climate tab for non-integer/out-of-range input.
   - Surface cross-field combined-percentage error in a predictable location (field error or form-level message) before submit.

4. **Testing strategy**
   - Add/extend backend API tests for accepted and rejected cases.
   - Add/extend shared validator tests (or frontend validation tests) to cover integer/range/sum constraints.
   - Verify no regressions for locality create/update and no auth behavior changes.

5. **Docs/ops**
   - No migration, env, or deployment config changes expected.
   - Update any relevant validation documentation/changelog entry if maintained.

## 3) Tasks (JSON)

```json
[
  {
    "id": "T1",
    "title": "Add pollen field constraints to shared locality validator",
    "summary": "Implement validation for pers_pollen_ap, pers_pollen_nap, and pers_pollen_other as optional integers between 0 and 100, plus a cross-field sum constraint AP+NAP+OP<=100.",
    "app": "shared",
    "files_touched": [
      "frontend/src/shared/validators/locality.ts"
    ],
    "migrations": false,
    "permissions": [
      "No RBAC change",
      "Validation applies to any caller already authorized to create/update localities"
    ],
    "acceptance_criteria": [
      "Each pollen field rejects non-integer values",
      "Each pollen field rejects values <0 or >100",
      "Combined AP/NAP/OP values above 100 return a clear validation error",
      "Null/empty pollen fields remain accepted where currently optional"
    ],
    "test_plan": [
      "Add unit tests for per-field integer/range validation",
      "Add unit tests for cross-field sum rule with partial-null and full-value combinations"
    ],
    "estimate_hours": 2.5,
    "priority": "high"
  },
  {
    "id": "T2",
    "title": "Enforce pollen validation in locality backend write flows",
    "summary": "Ensure locality create/update service paths reject invalid pollen payloads with structured 400 responses using existing locality validation pipeline.",
    "app": "backend",
    "files_touched": [
      "backend/src/services/locality.ts",
      "backend/src/api-tests/locality/create.test.ts",
      "backend/src/api-tests/locality/update.test.ts",
      "backend/src/api-tests/locality/data.ts"
    ],
    "migrations": false,
    "permissions": [
      "Existing locality write permissions unchanged",
      "Unauthorized users remain blocked before data validation/persistence"
    ],
    "acceptance_criteria": [
      "Create endpoint returns 400 when pollen values violate integer/range/sum rules",
      "Update endpoint returns 400 for invalid pollen changes",
      "Valid pollen payloads continue to persist successfully"
    ],
    "test_plan": [
      "Add integration tests for invalid create payloads",
      "Add integration tests for invalid update payloads",
      "Assert response contains expected validation error keys/messages"
    ],
    "estimate_hours": 3.0,
    "priority": "high"
  },
  {
    "id": "T3",
    "title": "Improve Locality Climate tab validation feedback",
    "summary": "Ensure Locality Climate tab shows actionable validation messages for pollen fields and cross-field total constraint before submit.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/components/Locality/Tabs/ClimateTab.tsx",
      "frontend/src/shared/validators/locality.ts"
    ],
    "migrations": false,
    "permissions": [
      "No RBAC change",
      "UI controls remain enabled/disabled according to existing locality edit permissions"
    ],
    "acceptance_criteria": [
      "User sees immediate validation feedback for invalid pollen inputs",
      "User sees clear message when AP+NAP+OP exceeds 100",
      "Form submission is blocked client-side when pollen validation fails"
    ],
    "test_plan": [
      "Add/update frontend validation tests for pollen input edge cases",
      "Add component-level tests for error rendering in climate tab"
    ],
    "estimate_hours": 2.5,
    "priority": "medium"
  },
  {
    "id": "T4",
    "title": "Quality gates and release readiness",
    "summary": "Run lint, type-check, and impacted test suites; record feature notes for reviewers.",
    "app": "fullstack",
    "files_touched": [
      "README.md"
    ],
    "migrations": false,
    "permissions": [
      "N/A"
    ],
    "acceptance_criteria": [
      "Lint/type-check pass in affected scopes",
      "All new/updated tests pass",
      "Reviewer notes describe validation behavior and edge cases"
    ],
    "test_plan": [
      "Run npm run lint",
      "Run npm run tsc",
      "Run locality backend API tests and relevant frontend tests"
    ],
    "estimate_hours": 1.5,
    "priority": "medium"
  }
]
```

## 4) Risks & Mitigations

- **Auth failures**: Validation changes might unintentionally alter create/update control flow.
  - *Mitigation*: Keep permission middleware/service checks unchanged and add unauthorized regression tests.
- **Behavior ambiguity for null/partial fields**: Optional fields can conflict with sum validation semantics.
  - *Mitigation*: Document rule as "sum of provided values" and codify with tests for null/empty combinations.
- **Inconsistent frontend/backend messaging**: Users may see different messages client vs server.
  - *Mitigation*: Reuse shared validator constants/messages where possible and assert text in tests.
- **Regression risk on locality updates**: Existing locality test fixtures might fail due to stricter constraints.
  - *Mitigation*: Update fixtures explicitly and add targeted test cases to make constraints clear.
- **Rollback complexity**: Stricter validation can block data entry workflows.
  - *Mitigation*: Keep change isolated to validators and endpoint checks; revertable in one release if needed.

## 5) Out of Scope

- Backfilling or correcting historical pollen data already stored in the database.
- Redesigning Locality Climate UI layout beyond validation feedback.
- Introducing i18n/localized validation messages.
- Unrelated locality performance optimizations.

## 6) Definition of Done ✅

- [ ] Pollen fields accept only integers from 0 to 100.
- [ ] Combined AP/NAP/OP rule (`<=100`) enforced client and server side.
- [ ] Locality create/update API responses return structured validation errors for violations.
- [ ] Frontend displays clear validation messages and blocks invalid submit.
- [ ] Added/updated backend + frontend tests for all new rules.
- [ ] Lint and TypeScript checks pass in CI.
- [ ] Documentation/changelog entry updated for validation behavior.

# Feature Plan: Occurrence Detail Page (now_ls)

## 1️⃣ Assumptions & Scope
- The current `/occurrence` experience is backed by `CrossSearchTable` and reuses `LocalityDetails` for detail routing (`/occurrence/:id`), so this feature introduces a dedicated Occurrence detail view instead of locality detail reuse.
- Occurrence identity must be **composite** (`lid` + `species_id`) because `now_ls` has no primary key; we will not change DB schema or add migrations.
- Backend and frontend contracts should remain additive and backward compatible; existing Locality/Species detail pages and list/table flows must continue to work.
- Required tabs should map to meaningful `now_ls` columns/groups, and an **Updates** tab should be present as a placeholder shell only (no update-log implementation yet), matching existing tab UX patterns.
- Linking behavior from occurrence listings should open the new Occurrence detail route using `lid` + `species_id` key, while preserving existing table filter/sort/pagination query params for return navigation.
- Authorization model remains unchanged: read access follows current authenticated behavior; edit affordances follow existing role checks (Admin/EditUnrestricted/EditRestricted) already used around detail pages.
- No database structure changes, no Prisma migration files, and no table/model renames.

## 2️⃣ High-Level Plan
1. **Occurrence identity and routing design**
   - Define a stable URL shape for composite keys (e.g. `/occurrence/:lid/:speciesId`), and retain list URL compatibility (`/occurrence?...`).
   - Update route wiring so occurrence detail resolves to a new Occurrence detail component instead of `LocalityDetails`.

2. **Backend read endpoint for one occurrence (composite key)**
   - Add/extend an endpoint to fetch one `now_ls` row by `lid` + `species_id` with required joins (species/locality context fields needed for header + tabs).
   - Reuse existing services/query utilities where possible to stay DRY and avoid duplicated SQL mapping.

3. **Frontend data model + API client wiring**
   - Add shared/frontend type(s) for occurrence detail payload shaped around `now_ls` + related display fields.
   - Add query hook/client call for fetching one occurrence by composite key.

4. **Build Occurrence detail feature component (DRY with existing DetailView patterns)**
   - Create `OccurrenceDetails` component mirroring Locality/Species detail architecture (`DetailView`, tab config array, validator wiring).
   - Group tabs by `now_ls` domain columns (e.g., core occurrence info, microwear/mesowear, measurements/notes as available in schema).
   - Add **Updates** tab placeholder using standard tab container/panel only, no data implementation yet.

5. **Linking from occurrence list to detail**
   - Ensure row actions/links in occurrence table navigate with composite key (`lid`, `species_id`) rather than locality-only id.
   - Preserve table query state (`columnfilters`, `sorting`, `pagination`) in return navigation state.

6. **Permissions + UX parity**
   - Keep edit/delete capability checks consistent with existing role policy; if detail is read-only initially, explicitly disable write actions.
   - Keep tab deep-linking behavior (`?tab=n`) consistent with `useSyncTabSearch` and existing detail pages.

7. **Validation, testing, docs**
   - Add/adjust backend integration tests for composite-key fetch and error paths.
   - Add frontend tests for route parsing, tab rendering (including Updates placeholder), and occurrence row-to-detail navigation.
   - Update docs/changelog notes for new occurrence detail page and composite key route contract.

## 3️⃣ Tasks (JSON)
```json
[
  {
    "id": "T1",
    "title": "Define composite-key occurrence route and page wiring",
    "summary": "Introduce occurrence detail routing that accepts lid + species_id and maps to a dedicated OccurrenceDetails component instead of LocalityDetails.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/router/index.tsx",
      "frontend/src/components/pages.tsx",
      "frontend/src/components/Page.tsx"
    ],
    "migrations": false,
    "permissions": [
      "Accessible to logged-in users who can view occurrence list",
      "No role escalation; existing page-level role checks remain intact"
    ],
    "acceptance_criteria": [
      "Navigating to /occurrence/<lid>/<species_id> opens Occurrence detail page",
      "Navigating to /occurrence?columnfilters=[]&sorting=[]&pagination={...} still opens occurrence list",
      "Legacy /occurrence/<id> behavior is either redirected safely or handled explicitly"
    ],
    "test_plan": [
      "Add router-level test for occurrence composite route",
      "Add regression test for occurrence list route query parsing"
    ],
    "estimate_hours": 2.0,
    "priority": "high"
  },
  {
    "id": "T2",
    "title": "Add backend occurrence-detail read endpoint by lid + species_id",
    "summary": "Implement composite-key lookup for a single now_ls occurrence with required joins/shape for detail tabs and header metadata.",
    "app": "backend",
    "files_touched": [
      "backend/src/routes/occurrence.ts",
      "backend/src/controllers/occurrenceController.ts",
      "backend/src/services/occurrenceService.ts",
      "backend/src/services/queries/crossSearchQuery.ts"
    ],
    "migrations": false,
    "permissions": [
      "Available to authorized readers under existing auth middleware",
      "Write permissions unchanged (no new mutation endpoint)"
    ],
    "acceptance_criteria": [
      "GET endpoint returns one occurrence by exact lid + species_id",
      "Missing pair returns 404 with structured error payload",
      "Invalid keys return 400 with validation message"
    ],
    "test_plan": [
      "Add backend integration tests for success/404/400 cases",
      "Add unit tests for service query parameter handling"
    ],
    "estimate_hours": 3.5,
    "priority": "high"
  },
  {
    "id": "T3",
    "title": "Create occurrence detail types and data hook",
    "summary": "Add shared/frontend types and query hook/API client for composite-key occurrence detail retrieval.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/shared/types/data.ts",
      "frontend/src/redux/services/api.ts",
      "frontend/src/hooks/**"
    ],
    "migrations": false,
    "permissions": [
      "Read-only data retrieval inherits existing auth token handling"
    ],
    "acceptance_criteria": [
      "Hook accepts lid + species_id and returns typed detail payload",
      "Loading/error states align with existing detail pages"
    ],
    "test_plan": [
      "Add hook/API tests for correct URL and response mapping",
      "Type-check verifies no implicit any in detail payload usage"
    ],
    "estimate_hours": 2.0,
    "priority": "high"
  },
  {
    "id": "T4",
    "title": "Implement OccurrenceDetails with now_ls-based tabs and Updates placeholder",
    "summary": "Build dedicated detail UI using shared DetailView primitives; include required tabs from now_ls columns and a standard placeholder Updates tab (no updates logic yet).",
    "app": "frontend",
    "files_touched": [
      "frontend/src/components/Occurrence/OccurrenceDetails.tsx",
      "frontend/src/components/Occurrence/Tabs/*.tsx",
      "frontend/src/components/DetailView/common/UpdateTab.tsx"
    ],
    "migrations": false,
    "permissions": [
      "Edit controls shown only for roles already allowed by policy",
      "If mutations are not implemented, controls remain disabled/hidden"
    ],
    "acceptance_criteria": [
      "Detail page renders tab set derived from now_ls fields",
      "Updates tab is visible and clearly marked placeholder",
      "Tab deep-linking works via ?tab=<index>"
    ],
    "test_plan": [
      "Add component tests for tab labels/content and placeholder tab",
      "Add test for out-of-range tab param fallback behavior"
    ],
    "estimate_hours": 4.0,
    "priority": "high"
  },
  {
    "id": "T5",
    "title": "Wire occurrence table row navigation to composite-key detail",
    "summary": "Update occurrence list row action/linking so each row opens its specific occurrence detail using lid + species_id key.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/components/CrossSearch/CrossSearchTable.tsx",
      "frontend/src/components/TableView/TableView.tsx",
      "frontend/src/hooks/useReturnNavigation.ts"
    ],
    "migrations": false,
    "permissions": [
      "Row visibility restrictions remain unchanged",
      "Navigation does not bypass protected routes"
    ],
    "acceptance_criteria": [
      "Clicking an occurrence row opens /occurrence/<lid>/<species_id>",
      "Return button restores prior list URL including filter/sort/pagination query",
      "No regression in locality/species table row navigation"
    ],
    "test_plan": [
      "Add frontend tests asserting navigation target path composition",
      "Regression tests for return navigation stack behavior"
    ],
    "estimate_hours": 2.5,
    "priority": "high"
  },
  {
    "id": "T6",
    "title": "Quality gate, docs, and rollout safeguards",
    "summary": "Run lint/type/tests, document route contract and placeholder status, and ensure feature is safely reviewable/deployable.",
    "app": "fullstack",
    "files_touched": [
      "README.md",
      "frontend/docs/routing.md",
      "frontend/tests/**",
      "backend/src/api-tests/**"
    ],
    "migrations": false,
    "permissions": [
      "Verify role-based UI states for read/edit users"
    ],
    "acceptance_criteria": [
      "Lint + type-check pass in affected scopes",
      "New/updated tests pass",
      "Docs mention composite key route and Updates tab placeholder"
    ],
    "test_plan": [
      "npm run lint:frontend && npm run lint:backend",
      "npm run tsc:frontend && npm run tsc:backend",
      "Run targeted frontend/backend test suites for occurrence detail"
    ],
    "estimate_hours": 2.0,
    "priority": "medium"
  }
]
```

## 4️⃣ Risks & Mitigations
- **Auth Failures**: New detail route could miss existing guard expectations.  
  **Mitigation**: Keep route under existing authenticated shell and add explicit unauthorized tests for restricted edit actions.
- **Composite Key Ambiguity**: Using only `lid` could open wrong record when multiple species share locality.  
  **Mitigation**: Enforce `lid + species_id` in route, API contract, and row navigation helpers.
- **Performance**: Occurrence detail joins may fetch unnecessary fields.  
  **Mitigation**: Select only tab-needed columns; defer heavy/related datasets to lazy queries if needed.
- **Error Handling**: Bad URL params may produce opaque failures.  
  **Mitigation**: Add input validation and consistent 400/404 JSON errors; render friendly UI fallback.
- **Security**: Query construction risk if custom SQL is touched.  
  **Mitigation**: Keep Prisma/parameterized query patterns and avoid string interpolation for user params.
- **Rollback**: Route change could disrupt existing deep links.  
  **Mitigation**: Add compatibility redirect/fallback for legacy paths and keep change isolated behind clean commits.

## 5️⃣ Out of Scope
- Any database schema/table/index/primary-key changes for `now_ls`.
- Implementing actual Updates tab data loading/editing/audit timeline logic.
- Broad UI redesign beyond adding occurrence detail page and required tabs.
- Refactoring unrelated list/detail pages (Locality, Species, etc.) outside minimal DRY extraction.
- Non-feature performance tuning unrelated to occurrence detail fetch/render.

## 6️⃣ Definition of Done ✅
- [ ] All acceptance criteria in tasks T1–T6 are satisfied.
- [ ] Occurrence detail is accessible via composite key route (`lid` + `species_id`).
- [ ] Required `now_ls`-based tabs are implemented and Updates tab placeholder is present.
- [ ] No DB migrations/schema changes are introduced.
- [ ] Unit/integration/frontend route tests for new behavior pass.
- [ ] Linting and TypeScript checks pass in affected scopes.
- [ ] Role-based read/edit behavior is verified unchanged.
- [ ] Documentation is updated with new route contract and placeholder note.

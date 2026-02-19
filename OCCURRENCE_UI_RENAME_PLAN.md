# Feature Plan: Rename “Locality-Species” UI Labels to “Occurrence(s)”

## 1) Assumptions & Scope
- This is a **UI terminology update only**: replace visible labels such as “Locality-Species”, “Locality Species”, and “Locality-Species-Cross-Search” with “Occurrence” / “Occurrences”.
- **Database and backend persistence remain unchanged**: table names (including `now_ls`), Prisma model names, API route names, and payload contracts are not renamed.
- Expected impact is concentrated in frontend presentation layers (navigation labels, page/tab/table captions, breadcrumbs, toolbar text, empty states, and helper text), plus any shared constants feeding those labels.
- Backend impact is limited to optional API response metadata strings only if currently surfaced directly in UI; otherwise no backend changes.
- Role-based authorization behavior does not change. Existing coordinator/admin restrictions remain as-is.
- No migration should be required unless a persisted settings/config table stores user-visible caption text (unlikely; verify quickly before implementation).

## 2) High-Level Plan
1. **Inventory all user-visible strings**
   - Search frontend and shared UI config for “Locality-Species”, “Locality Species”, and “Cross-Search” variants.
   - Classify each usage as singular (“Occurrence”) vs plural (“Occurrences”) based on context.

2. **Centralize/normalize labels where needed**
   - If labels are scattered literals, introduce/extend a UI label constants module for this domain to reduce future drift.
   - Keep route paths/IDs stable unless they are explicitly user-facing display text.

3. **Update UI surfaces**
   - Navigation menus, page titles, tabs, table headings, card headers, action dialogs, and search forms.
   - Ensure document titles and route shell wrappers reflect the new term.

4. **Preserve API/data compatibility**
   - Do not rename backend endpoints, Prisma models, DB tables, or query parameters unless purely display-oriented.
   - Keep request/response schema compatibility for frontend consumers.

5. **Auth/permissions verification**
   - Confirm that label updates do not accidentally expose hidden actions/sections.
   - Validate coordinator-only UI controls still gate correctly after refactors.

6. **Testing and QA**
   - Frontend unit/integration tests for rendered labels and key page headings.
   - Optional E2E smoke checks for navigation text and cross-search page captions.
   - Run lint/type-check; update snapshots where appropriate.

7. **Docs and release notes**
   - Add a concise changelog/readme note that terminology changed in UI only.

## 3) Tasks (JSON)
```json
[
  {
    "id": "T1",
    "title": "Inventory all Locality-Species UI label usages",
    "summary": "Locate every user-visible occurrence of Locality-Species terminology in frontend components, pages, navigation config, and tests.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/components/**",
      "frontend/src/pages/**",
      "frontend/src/App.tsx",
      "frontend/src/router/**",
      "frontend/src/redux/**",
      "frontend/tests/**"
    ],
    "migrations": false,
    "permissions": [
      "No permission model changes",
      "Verify restricted views retain existing role gates"
    ],
    "acceptance_criteria": [
      "A complete checklist of UI label locations is produced",
      "Each location is tagged as singular (Occurrence) or plural (Occurrences)"
    ],
    "test_plan": [
      "Run repository search for all target label variants",
      "Peer-review checklist against major UI routes"
    ],
    "estimate_hours": 1.0,
    "priority": "high"
  },
  {
    "id": "T2",
    "title": "Replace navigation and route-shell captions",
    "summary": "Update menu entries, breadcrumb labels, and route-level page titles from Locality-Species wording to Occurrence(s) without changing route paths.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/App.tsx",
      "frontend/src/pages/**",
      "frontend/src/components/Navigation/**",
      "frontend/src/router/**"
    ],
    "migrations": false,
    "permissions": [
      "Visible only where existing route access is allowed",
      "Coordinator-only routes remain coordinator-only"
    ],
    "acceptance_criteria": [
      "Primary navigation no longer shows Locality-Species labels",
      "Document titles and breadcrumbs use Occurrence/Occurrences consistently"
    ],
    "test_plan": [
      "Frontend render tests for nav labels",
      "Manual smoke test through key routes"
    ],
    "estimate_hours": 2.0,
    "priority": "high"
  },
  {
    "id": "T3",
    "title": "Update table, tab, and cross-search captions",
    "summary": "Rename captions in list/table headers, tabs, and cross-search UI text to Occurrence(s) while preserving data bindings to now_ls-backed APIs.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/components/**",
      "frontend/src/pages/**",
      "frontend/src/hooks/**",
      "frontend/src/redux/**"
    ],
    "migrations": false,
    "permissions": [
      "No new permissions",
      "Existing disabled/hidden controls remain unchanged"
    ],
    "acceptance_criteria": [
      "All table/tab captions display Occurrence terminology",
      "Cross-search captions no longer contain Locality-Species wording",
      "Data loading behavior is unchanged"
    ],
    "test_plan": [
      "Update/extend component tests asserting headings and tab labels",
      "Run regression checks for list and cross-search screens"
    ],
    "estimate_hours": 2.5,
    "priority": "high"
  },
  {
    "id": "T4",
    "title": "Harden consistency via shared UI label constants",
    "summary": "Introduce or update a shared constants file for Occurrence labels to prevent future terminology drift across components.",
    "app": "frontend",
    "files_touched": [
      "frontend/src/constants/**",
      "frontend/src/components/**",
      "frontend/src/pages/**"
    ],
    "migrations": false,
    "permissions": [
      "No permission changes"
    ],
    "acceptance_criteria": [
      "Key labels are sourced from centralized constants",
      "No duplicate legacy Locality-Species literals remain in UI code"
    ],
    "test_plan": [
      "Static search confirms no legacy literals in frontend src",
      "Type-check passes after refactor"
    ],
    "estimate_hours": 1.5,
    "priority": "medium"
  },
  {
    "id": "T5",
    "title": "Validate non-functional requirements and documentation",
    "summary": "Run lint/type-check/tests, capture visual verification, and add a documentation note clarifying UI-only terminology change with no DB/table rename.",
    "app": "fullstack",
    "files_touched": [
      "README.md",
      "CHANGELOG.md",
      "frontend/tests/**",
      "cypress/**"
    ],
    "migrations": false,
    "permissions": [
      "Verify UI access boundaries through smoke tests"
    ],
    "acceptance_criteria": [
      "Lint and type-check complete successfully",
      "Relevant automated tests pass",
      "Docs explicitly state now_ls table name is unchanged"
    ],
    "test_plan": [
      "npm run lint",
      "npm run tsc",
      "Frontend test suite for affected screens",
      "Optional Cypress smoke for navigation/caption text"
    ],
    "estimate_hours": 2.0,
    "priority": "medium"
  }
]
```

## 4) Risks & Mitigations
- **Auth Failures**: UI refactors may bypass existing guard wrappers.
  - *Mitigation*: regression-check protected routes/components with both coordinator and non-coordinator accounts.
- **Data Migration Risk**: accidental backend renaming could break persistence contracts.
  - *Mitigation*: explicitly prohibit DB/Prisma/API renames; no migration files in this feature.
- **Performance**: negligible risk, but broad refactor could trigger unnecessary rerenders.
  - *Mitigation*: keep changes text-only where possible; avoid state shape changes.
- **Error Handling Drift**: changed labels in error banners/toasts may become inconsistent.
  - *Mitigation*: update shared message constants and validate key failure flows.
- **Security**: low direct risk, but route/config edits can accidentally expose links.
  - *Mitigation*: preserve existing authorization checks and conditional rendering.
- **Rollback**: need safe revert if terminology causes confusion.
  - *Mitigation*: isolate commits to label updates and optional constants; revertable without schema impact.

## 5) Out of Scope
- Renaming DB tables, Prisma models, backend route paths, or API field names.
- Legacy data migration/backfill tasks.
- Visual redesign/theming changes beyond text replacement.
- Full i18n localization framework rollout.
- Unrelated performance optimizations.

## 6) Definition of Done ✅
- All approved UI surfaces use “Occurrence” / “Occurrences” appropriately.
- No database table/model/API contract renames were introduced.
- Unit/integration (and applicable E2E smoke) tests pass for affected areas.
- Linting and type checks pass.
- Role-based visibility and access behavior verified unchanged.
- Documentation/changelog note added for terminology-only update.
- CI pipeline succeeds.

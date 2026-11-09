# Changelog

## Unreleased
### Changed
- Merge species (`/admin/merge-species`) copy-parameters list now also shows fields where the Obsolete value is empty and Accepted has a value, so the empty Obsolete value can be selected to clear the Accepted value.
- Museums and Projects (navbar links, lists and details, and the `GET /museum/all`, `GET /museum/:id`, `GET /project/all` endpoints) are now restricted to logged-in users; non-logged-in users see a permission denied page or a `403`.
- UI terminology now uses Occurrence/Occurrences instead of Locality-Species in user-facing captions; backend/database contracts remain unchanged (including `now_ls`).
- Repositioned table row action icons to the right edge, tightened spacing, and added aria labels so Locality, Species, and related tables reclaim horizontal room while keeping tooltips and restriction markers accessible.
- Species detail Locality-Species tab now renders MW Score as a computed, read-only display field based on mw_scale_min, mw_scale_max, and mw_value instead of a placeholder value.

### Fixed
- Species finalization now requires administrators to acknowledge taxonomy hierarchy conflicts before continuing to reference staging.
- Occurrence isotope sample-count inputs now preserve decimal entry so fractional δ13C N / δ18O N values are rejected by positive-integer validation instead of being silently changed.
- Locality list map now shows the base map tiles immediately on page load in a collapsed state, with markers and country borders loading only after clicking "Open map" (re-applying the fix from commit e5465527 that was inadvertently reverted).
- Password validation (backend and frontend) now requires at least one lowercase letter, uppercase letter, digit and special character (`^?$%&~!`) in addition to the 8-character minimum; the random password generator always satisfies this.
- Occurrence table (`/occurrence`) filtering by range columns such as Max age / Min age no longer fails with "You do not have permission to view this data."; cross-search endpoints now accept `[min, max]` range filter values and apply them as numeric comparisons. Setting Min / Max range filters no longer throws "Cannot assign to read only property" (filter arrays are copied before being passed to RTK Query).
- Resolved Update log detail navigation so Return buttons honor the originating table using the new shared return-navigation helper.
- Restored Locality edit view synonym creation so saving a valid synonym immediately appears in the Synonyms table.
- Locality Age tab now preserves age-entry drafts per dating method (`time_unit`, `absolute`, `composite`) so switching methods no longer clears previously entered min/max age and basis values.
- Locality Approximate Coordinates now remains unset when its value is unknown instead of defaulting to 0/No.
- Locality age validation now enforces required age-basis rules against the active dating method while tolerating preserved values from non-active methods.
- Locality -> Species (`/locality/:id?tab=2`) edit-mode minus action now consistently targets the clicked species row when table ordering differs from source data, preventing incorrect red highlight on other rows.
- Added Cypress regression coverage in `cypress/e2e/locality.cy.js` to verify row-action remove state is applied only to the clicked species row.
- Time Unit write failures with non-existent `up_bnd`/`low_bnd` now return structured `403` validation payloads (including Prisma FK guardrail mapping) instead of internal `500` errors.

### Added
- Species table Genus and Species filters now also match synonym names (syn_genus_name and syn_species_name) returned with each species record.
- Added backend validation for tab-list query params (`sorting`, `pagination`, `limit/offset`, `columnfilters`) with structured `400` errors on invalid inputs for Reference, Time Unit, Time Bound, and Museum detail-tab endpoints.
- Added tab-list API integration coverage for invalid sorting/filter payloads and pagination behavior, plus read-only Project tab unit coverage that verifies edit-only controls stay hidden without edit rights.
- Added rollout documentation for unified `DetailTabTable` behavior, migration checklist, and known server/client filtering constraints.
- Added a front-page changelog sourced from GitHub releases via `GET /changelog` (see `documentation/functionality/changelog.md`).

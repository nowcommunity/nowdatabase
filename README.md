# Nowdatabase

**NOW - New and Old Worlds - Database of fossil mammals**

Rebuild of a fossil database application, old version at https://nowdatabase.luomus.fi/

The new version is not deployed yet.

---

### Developer documentation

**Basic commands** :computer:

- `npm run setup`
  - Creates all files and directories required to run the project
- `npm run dev`
  - Runs the application in development mode
  - Supports hot reloading
  - Serves frontend by default at `http://localhost:5173`
- `npm run test:api`
  - Runs api-tests inside Docker
  - Requires database to be running (start one with correct data: `npm run start:anon:api`)
- `npm run test:e2e`
  - Runs api-tests inside Docker
  - Requires frontend, backend and database to be running (start all with `npm run start:anon`)

**Further documentation**

:rocket: [Setup app & restore db](documentation/devops/setup.md) How to get the app up & running, and initialize database from sql-dumps

:keyboard: [List of all commands](documentation/devops/commands.md) A comprehensive list of all of the most important commands

:raised_hands: [Contributing & integration flow](documentation/contributing.md) Where to commit? Where are tests run? How is the code deployed?

:memo: [Frontend](documentation/frontend/frontend.md) Explanation of the frontend logic and how to add views

:bookmark_tabs: [Species synonym creation flow](documentation/backend/species_synonym_creation_flow.md) Backend write logic overview used by the synonym API tests

:mag_right: [Validators](frontend/src/shared/validators/) The [readme](frontend/src/shared/validators/README.md) explains how validators are written

:mag_right: [Class diagram](documentation/class_diagram.md) See the relations of relevant tables. Notice that it omits some unimportant tables and does not show most columns.

:earth_africa: [Map features](documentation/frontend/components/maps/README.md) Maps' functionality and development notes

**DeepWiki documentation for the NOW database can be found here:** 
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/nowcommunity/nowdatabase)

---

### Reviewer notes: Locality climate pollen validation

- Locality pollen fields (`pers_pollen_ap`, `pers_pollen_nap`, `pers_pollen_other`) now require integer values in the range `0...100`.
- Shared locality validation enforces combined pollen constraint `AP + NAP + OP <= 100` and surfaces the same message in form validation feedback.
- Backend locality write validation now evaluates pollen totals with full update context so partial updates cannot bypass the combined-value rule.
- API tests include invalid create/update pollen payload coverage for non-integer, out-of-range, and total-above-100 cases.

### Reviewer notes: Locality age method persistence

- In Locality edit mode, the Age tab now preserves method-specific values when switching Dating method between `Time unit`, `Absolute`, and `Composite`.
- Switching methods restores previously entered age values (e.g., `min_age`, `max_age`, basis/fraction selections) instead of clearing them.
- Locality age validation now evaluates required basis fields against the currently active dating method, while allowing preserved values from other methods to remain in draft state.
- See [documentation/CHANGELOG.md](documentation/CHANGELOG.md) for release-level tracking.

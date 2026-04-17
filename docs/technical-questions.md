# Technical questions

This note answers `nowcommunity/nowdatabase#101`.

## 1) Calculated / derived fields

In this codebase, there are a few different “calculated field” patterns:

- **Pure display formatting (client-side):** Some table columns are derived from multiple persisted fields at render time.
  - Example: developmental/functional crown type strings are formatted client-side via
    `frontend/src/shared/types/util.ts` (`formatDevelopmentalCrownType`, `formatFunctionalCrownType`) and used as
    `accessorFn` in table definitions (e.g. `frontend/src/components/Species/SpeciesTable.tsx`).
- **UI-only edit metadata (client-side):** Edit payload types wrap nested arrays as `Editable<T>` and add `rowState`
  (e.g. `"new"`, `"removed"`) to drive add/remove UI behavior. This field is not a DB column.
  - Type-level definition: `frontend/src/shared/types/util.ts` (`EditDataType`, `Editable`, `RowState`).
  - Backend write-layer interprets `rowState` for join tables via `applyListChanges`:
    `backend/src/services/write/writeOperations/writeHandler.ts`.
- **Client-side derived state / pagination metadata:** Some UI metadata is computed from server responses and cached in
  Redux/context; it is not persisted to the DB.
  - Example: `frontend/src/hooks/usePaginatedQuery.ts` computes table pagination metadata.

### Should derived values be written to the DB?

General guidance for this repository:

- Prefer **not** storing derived display-only values in the DB (avoid duplication and drift).
- Store (or materialize) a derived value only if you need it for **server-side filtering/sorting** or it is
  **expensive** to compute and frequently used.
  - In those cases, prefer computing it in SQL/query code first; only persist if you have a clear contract and
    a single source of truth.

## 2) How does deletion of an entire entity show in tables?

For “entity delete” routes, the backend uses **hard deletes** (SQL `DELETE`) rather than a soft-delete flag:

- Low-level delete: `backend/src/services/write/writeOperations/databaseHandler.ts` (`DELETE FROM ...`).
- Write handler delete: `backend/src/services/write/writeOperations/writeHandler.ts` (`deleteObject`) also logs the
  removed values before deleting (so update/audit views can still show a deletion event).

Practical UI behavior:

- In list tables (e.g. `/locality/all`), a deleted entity typically **disappears from results** after the next fetch.
- In edit-mode tables that represent **join rows** (e.g. child lists inside a DetailView), clicking remove generally
  marks the row with a UI-only `rowState` (often rendered with a red background) until the user saves.
  - Example: `frontend/src/components/DetailView/common/EditableTable.tsx`.


# Table Pagination and Selector Usage

This guide explains how to build paginated tables in the NOW Database frontend, especially when you need to transform API rows with a `selectorFn` before rendering.

## Detail tab table inventory (audit baseline)

The matrix below inventories current detail-tab table/list implementations under:

- `frontend/src/components/Locality/Tabs/*`
- `frontend/src/components/Species/Tabs/*`
- `frontend/src/components/Reference/Tabs/*`
- `frontend/src/components/TimeUnit/Tabs/*`
- `frontend/src/components/TimeBound/Tabs/*`
- `frontend/src/components/Museum/Tabs/*`

Legend:

- **Primitive**: `SimpleTable`, `EditableTable`, `SelectingTable`, `LookupSelectingTable`, or direct `TableView` usage.
- **Data source**:
  - `API-driven`: tab issues a query hook in the tab component.
  - `Context-driven`: table rows come from detail context payload (`data`/`editData`) and are rendered client-side.
  - `Mixed`: selection is API-driven while edited/read table rows are context-driven.
- **Edit-mode actions** summarize current mutation UX.

### User-requested URLs (explicit coverage)

| URL | Tab component | Primitive(s) | Data source | Edit-mode actions |
| --- | --- | --- | --- | --- |
| `/locality/10003?tab=2` (Locality/Species) | `Locality/Tabs/SpeciesTab.tsx` | `SelectingTable` + `EditableTable` | Mixed | Add new species form, copy taxonomy selector, select existing species, remove/re-add linked rows via `rowState` in editable table. |
| `/locality/10006?tab=8` (Locality/Museums) | `Locality/Tabs/MuseumTab.tsx` | `SelectingTable` + `EditableTable` | Mixed | Select museum from lookup list, add link to `now_mus`, remove/re-add linked rows via editable table actions. |
| `/locality/10003?tab=9` (Locality/Projects) | `Locality/Tabs/ProjectTab.tsx` | `SelectingTable` + `EditableTable` | Mixed | Select project from API list, duplicate guard message, remove/re-add project links via editable table actions. |
| `/species/10001?tab=6` (Species/Localities) | `Species/Tabs/LocalityTab.tsx` | `SelectingTable` + `EditableTable` | Mixed | Select locality and append to `now_ls`, remove/re-add links via editable table actions. |
| `/species/10001?tab=7` (Species/Locality Species) | `Species/Tabs/LocalitySpeciesTab.tsx` | `EditableTable` | Context-driven | "Add new Locality Species" modal is present (TODO save path), row remove/re-add handled by editable table actions. |
| `/reference/10029?tab=1` (Reference/Localities) | `Reference/Tabs/LocalityTab.tsx` | `SimpleTable` | API-driven | No edit actions (read-only linked list with row navigation). |
| `/reference/10029?tab=2` (Reference/Species) | `Reference/Tabs/SpeciesTab.tsx` | `SimpleTable` | API-driven | No edit actions (read-only linked list with row navigation). |
| `/time-unit/agenian?tab=1` (Time Unit/Localities) | `TimeUnit/Tabs/LocalityTab.tsx` | `SimpleTable` | API-driven (+ client transform for checkmark/X columns) | No edit actions. |
| `/time-bound/9?tab=1` (Time Bound/Time Units) | `TimeBound/Tabs/TimeUnitTab.tsx` | `SimpleTable` | API-driven | No edit actions. |
| `/museum/APM?tab=0` (Museum/Localities) | `Museum/Tabs/LocalityTab.tsx` | `SimpleTable` | Context-driven (museum details payload) | No edit actions in this tab; guidance text shown for linking via Locality edit flow. |

### Additional table/list tabs in audited folders

| Component | Primitive(s) | Data source | Edit-mode actions |
| --- | --- | --- | --- |
| `Locality/Tabs/TaphonomyTab.tsx` | `LookupSelectingTable` + `EditableTable` | Mixed | Select collecting methods from lookup API and manage linked rows through editable row actions. |
| `Locality/Tabs/LithologyTab.tsx` | `LookupSelectingTable` + `EditableTable` | Mixed | Select sedimentary structures from lookup API and manage links via editable row actions. |
| `Locality/Tabs/LocalityTab.tsx` | `EditableTable` | Context-driven | Manage locality synonyms through editable row actions. |
| `Species/Tabs/SynonymTab.tsx` | `EditableTable` | Context-driven | Add/edit/remove synonym rows on species detail payload. |
| `Species/Tabs/TaxonomyTab.tsx` | `SelectingTable` | API-driven | Copy taxonomy from an existing species into taxonomy form fields. |
| `Reference/Tabs/AuthorTab.tsx` | `SelectingTable` + `EditableTable` | Mixed | Select/add authors and manage relation rows in edit mode. |
| `Reference/Tabs/JournalTab.tsx` | `SelectingTable` + `EditableTable` | Mixed | Select/add journals and manage relation rows in edit mode. |

### Current DRY opportunity notes

- `SimpleTable` and `EditableTable` currently disable advanced column/table interactions (sorting/column actions/filtering parity with `TableView` is not present).
- The dominant repeating pattern in edit tabs is **selector table + editable linked table**, which is a suitable extraction target for a shared detail-tab table abstraction.
- User-requested parity work should prioritize the ten explicitly listed URLs first, then roll over to additional table tabs listed above.

## Core building blocks

| Concern | Implementation |
| --- | --- |
| Pagination metadata cache | `frontend/src/redux/slices/tablesSlice.ts` stores `TablePaginationMetadata` keyed by `tableId`. |
| Query wiring | `frontend/src/hooks/usePaginatedQuery.ts` derives pagination info from RTK Query (or other data hooks) and keeps the slice in sync. |
| Shared table chrome | `frontend/src/components/Table/Table.tsx` reads metadata for a `tableId` and conditionally renders `TablePagination`. |
| Controls | `frontend/src/components/Table/TablePagination.tsx` renders next/previous buttons, item counts, and loading states. |

Always pick a **stable `tableId`** (string) for each paginated table instance. The ID links the query hook, Redux metadata, and `<Table>` wrapper together.

## Using `usePaginatedQuery`

1. Choose or create a query hook (e.g. an RTK Query endpoint). Ensure the server response exposes pagination hints:
   - Either wrap rows in an envelope `{ data, totalItems, pageIndex, pageSize }`,
   - **or** include a `full_count` field on the first row (legacy convention).
2. Call `usePaginatedQuery` with:
   - the query hook,
   - a `tableId`,
   - the current `queryArg` (include `limit`/`offset` if supported),
   - an optional `selectorFn` to map raw rows to the render shape.
3. Use the returned `rows` (from your hook) or the transformed output from `selectorFn` to render table content.
4. `usePaginatedQuery` automatically:
   - normalises envelopes/arrays,
   - preserves `full_count` when `selectorFn` strips it,
   - computes and stores `TablePaginationMetadata` in Redux,
   - exposes helper booleans (`isLoading`, `isFetching`, `isError`) from the underlying query result for UI state.

### Selector-specific tips

- When mapping rows, ensure your selector returns a stable key for list rendering.
- If your mapped rows drop the `full_count` column, `usePaginatedQuery` re-injects it into the first item so pagination totals stay accurate.
- Avoid deriving pagination totals inside the component—always trust the metadata from `usePaginatedQuery` to keep controls and counts consistent.

## Rendering the table

Wrap the body of your table inside `<Table>` to get controls for free:

```tsx
<Table
  tableId="time-unit-sequences"
  onPageChange={handlePageChange}
  isLoading={isFetching}
  paginationPlacement="both"
  renderEmptyState={() => <Alert severity="info">No sequences found</Alert>}
>
  <SequenceRows rows={sequences} />
</Table>
```

Key props:

- `tableId`: must match the ID passed to `usePaginatedQuery`.
- `onPageChange`: receives a zero-based page index. Update the `offset`/`page` in your query arg and let `usePaginatedQuery` refetch.
- `isLoading`: disables pagination buttons while data is reloading.
- `paginationPlacement`: choose `'top' | 'bottom' | 'both'`.
- `renderEmptyState`: optional placeholder when there are zero results.
- `hidePaginationWhenEmpty`: hides controls when `totalItems === 0`.

## Working with query arguments

- Treat `pageIndex` as zero-based throughout the UI. Convert to 1-based numbers only in copy (`Page 1 of 3`).
- When using limit/offset APIs:
  - `limit = pageSize`
  - `offset = pageIndex * pageSize`
- When an endpoint expects `page` + `pageSize`, store `pageIndex` in component state and convert before dispatching the query.

## Testing checklist

For every paginated table with a selector:

- Assert that the rendered pagination summary matches the metadata (e.g. "Showing 11-20 of 24").
- Simulate `Next`/`Previous` clicks and assert that new query args are dispatched.
- Confirm the rendered rows change between pages (catching stale selector memoisation).

## Troubleshooting

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Pagination controls do not render | Missing metadata in Redux | Ensure `usePaginatedQuery` wraps the query and that `tableId` matches the `<Table>` component. |
| Counts update but rows stay the same | `selectorFn` memoises rows or query arg never changes | Derive new `offset`/`page` values on `onPageChange` and avoid caching rows outside React state. |
| Buttons never disable | `isLoading` not forwarded | Pass `isFetching || isLoading` from the query result to the `<Table>` component. |

Keep this guide updated as new pagination utilities or patterns land in the codebase.

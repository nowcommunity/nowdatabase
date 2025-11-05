# Table Pagination and Selector Usage

This guide explains how to build paginated tables in the NOW Database frontend, especially when you need to transform API rows with a `selectorFn` before rendering.

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

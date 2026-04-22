# Reviewer Notes

This file collects high-signal review notes that previously lived in the root `README.md`.

## Locality climate pollen validation

- Locality pollen fields (`pers_pollen_ap`, `pers_pollen_nap`, `pers_pollen_other`) now require integer values in the range `0...100`.
- Shared locality validation enforces combined pollen constraint `AP + NAP + OP <= 100` and surfaces the same message in form validation feedback.
- Backend locality write validation now evaluates pollen totals with full update context so partial updates cannot bypass the combined-value rule.
- API tests include invalid create/update pollen payload coverage for non-integer, out-of-range, and total-above-100 cases.

## Locality age method persistence

- In Locality edit mode, the Age tab now preserves method-specific values when switching Dating method between `Time unit`, `Absolute`, and `Composite`.
- Switching methods restores previously entered age values (e.g., `min_age`, `max_age`, basis/fraction selections) instead of clearing them.
- Locality age validation now evaluates required basis fields against the currently active dating method, while allowing preserved values from other methods to remain in draft state.
- See `documentation/CHANGELOG.md` for release-level tracking.

## Occurrence terminology update

- User-facing UI captions now use **Occurrence/Occurrences** in navigation, cross-search, and Species detail surfaces.
- This is a presentation-only rename: backend/database identifiers are unchanged, including the `now_ls` table and related API payload fields.
- See `frontend/src/constants/occurrenceLabels.ts` for centralized frontend label constants and `frontend/tests/locality-species-ui-label-inventory.md` for inventory coverage.


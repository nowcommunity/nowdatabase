# Locality-Species UI Label Inventory (Task T1)

This checklist inventories user-visible "Locality-Species" terminology in frontend UI surfaces and maps each item to the intended replacement term.

## Legend
- **Singular target**: `Occurrence`
- **Plural/collection target**: `Occurrences`

## Inventory Checklist

- [x] `frontend/src/components/NavBar.tsx` (line 23)
  - Current UI label: `Locality-Species` (navigation item)
  - Context: navigation entry linking to `/crosssearch`
  - Target label: **Occurrences** (plural, module/list entry)

- [x] `frontend/src/components/CrossSearch/CrossSearchTable.tsx` (line 820)
  - Current UI label: `Locality-Species-Cross-Search` (table/view title)
  - Context: cross-search page caption/title
  - Target label: **Occurrence Cross-Search** (collection search surface)

- [x] `frontend/src/components/Species/SpeciesDetails.tsx` (line 108)
  - Current UI label: `Locality Species` (tab title)
  - Context: species details tab that lists linked rows
  - Target label: **Occurrences** (plural tab content)

- [x] `frontend/src/components/Species/Tabs/LocalitySpeciesTab.tsx` (line 200)
  - Current UI label: `Add new Locality Species` (action button text)
  - Context: action creates one new row
  - Target label: **Add new Occurrence** (singular action target)

- [x] `frontend/src/components/Species/Tabs/LocalitySpeciesTab.tsx` (line 215)
  - Current UI label: `Locality-Species Information` (group section title)
  - Context: grouped information panel describing row collection
  - Target label: **Occurrence Information** (domain section heading)

- [x] `frontend/src/components/FrontPage.tsx` (line 75)
  - Current UI label: `Locality-species` (statistics card label)
  - Context: count of all rows in collection
  - Target label: **Occurrences** (plural count label)

## Related Non-UI Mentions (Do Not Rename in this task)

These are not user-facing captions and are intentionally excluded from UI wording replacement:

- Type names and identifiers (e.g. `LocalitySpecies`, `LocalitySpeciesDetailsType`) in shared/frontend TypeScript.
- File names and test suite names that reference implementation details.
- Export filename slug in `frontend/src/components/CrossSearch/CrossSearchExportMenuItem.tsx` (`locality-species-...csv`) unless product decides file naming should also change.
- Internal comparisons/guards in `frontend/src/components/TableView/TableView.tsx` using the legacy title token.

## Validation Notes

- Search terms used: `Locality-Species`, `Locality Species`, `Locality-species`, `Locality-Species-Cross-Search`, `locality-species`.
- Coverage scope: `frontend/src/**` and `frontend/tests/**`.
- Result: all discovered user-visible captions are listed above and tagged with singular/plural replacement intent.

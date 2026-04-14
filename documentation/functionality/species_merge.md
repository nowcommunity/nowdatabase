# Species Merge

The Species Merge tool replaces all obsolete species ids with a selected accepted species id, while preserving
occurrence data, synonyms, and update logs. This flow is **Admin-only** and uses the same reference-selection and
save procedures as other DetailView updates.

## UI Flow Summary

1. Select an **Obsolete taxonomy** and an **Accepted taxonomy**.
2. Review the **Selected taxonomies** table (side-by-side values on the same row).
3. Choose whether to copy selected parameters from obsolete to accepted.
4. Decide whether to append the obsolete species name to locality-species `source_name` values.
5. Resolve occurrence conflicts (only shown when obsolete values exist and differ from accepted).
6. Decide whether to add the obsolete species as a synonym (optional comment).
7. Proceed to **Reference selection** (staging view) and save.

After a successful merge, the UI navigates to the accepted species detail page.

## Selected Taxonomies Table

- Displayed as a single table with columns: **Field**, **Obsolete taxonomy**, **Accepted taxonomy**.
- Field names are bold and rows are striped for quick comparison.

## Copy Selected Parameters

The copy list is intentionally tight:
- **Shows only** fields where the **obsolete value is non-empty** and **differs** from the accepted value.
- **Taxonomic fields are excluded** (see list below).
- Additional excluded fields: `class_name`, `used_morph`, `used_now`, `used_gene`, `sp_status`.

When the admin selects the obsolete value for a field, the accepted species is updated with that value during merge.

### Taxonomic Fields Excluded

- `order_name`
- `family_name`
- `genus_name`
- `species_name`
- `subclass_or_superorder_name`
- `suborder_or_superfamily_name`
- `subfamily_name`
- `unique_identifier`

## Occurrence Conflict Resolution

Occurrence conflicts are listed per locality only when:
- the obsolete value **exists**, and
- the obsolete value is **different** from the accepted value.

Selections are applied during merge to update accepted occurrence rows and migrate obsolete rows.

## References and Save

The merge flow uses the same staging/reference selection flow as other entity edits:
- References are **required**.
- Save triggers the merge and logs updates in the update log tables.

## API Endpoints

Backend endpoints are defined in `backend/src/routes/speciesMerge.ts` and implemented in
`backend/src/services/speciesMerge.ts`:

- `GET /admin/species-merge/summary?obsoleteId=<id>&acceptedId=<id>`
- `POST /admin/species-merge`

Payload and response shapes are defined in `frontend/src/shared/types` under `SpeciesMergeRequest`,
`SpeciesMergeSummary`, and `SpeciesMergeResponse`.


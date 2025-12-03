# Species synonym creation flow

## Endpoints and authorization
- **PUT `/species`** (defined in `backend/src/routes/species.ts`) is the write entrypoint for synonym changes. It is protected by `requireOneOf([Role.Admin, Role.EditUnrestricted])`, so only admin or edit-unrestricted users can submit synonym writes. On success it returns HTTP 200 with a JSON body `{ "species_id": <number> }`.
- **GET `/species/:id`** returns the full species payload after writes and includes `com_taxa_synonym` entries loaded via `getSpeciesDetails`.
- **GET `/species/synonyms`** returns all synonym rows without filtering for convenience listings.

## Request payload shape
- The PUT route expects a body `{ species: SpeciesDetailsType & EditMetaData }`.
- Synonyms are supplied on `species.com_taxa_synonym` as an array of editable synonym rows. Each row can include:
  - `synonym_id` (number) – omitted for new rows.
  - `species_id` (number) – automatically set from the parent species when missing.
  - `syn_genus_name` (string | null), `syn_species_name` (string | null), `syn_comment` (string | null).
  - `rowState` ("new" | "removed" | undefined) – controls how the write handler treats the row.

## Write behavior
- `writeSpecies` detects whether the species is being created or updated and sets `idValue` to the final `species_id` before list handling.
- Synonym writes call `writeHandler.applyListChanges('com_taxa_synonym', species.com_taxa_synonym, ['synonym_id', 'species_id'])`.
- `applyListChanges` iterates each row and:
  - Inserts rows where `rowState === 'new'` via `createObject`, which fills `species_id` from the parent if it was missing.
  - Deletes rows where `rowState === 'removed'`.
  - Leaves rows with other `rowState` values unchanged.
- There is **no explicit duplicate detection** in this flow, and the Prisma model for `com_taxa_synonym` has no uniqueness constraint beyond the auto-increment `synonym_id`.

## Response schema for verification
- After a successful PUT, only `{ species_id }` is returned; synonym rows are not echoed.
- A follow-up GET `/species/:id` returns the updated species record with `com_taxa_synonym` populated as plain rows from the `com_taxa_synonym` table.

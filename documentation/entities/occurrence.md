# Occurrences

An “occurrence” is a *composite* record: it represents the relationship between a **Locality** (`lid`) and a **Species** (`species_id`) and the editable occurrence-specific fields associated with that pair.

## Composite key

Occurrences are uniquely identified by:

- `lid` (locality id)
- `species_id` (species id)

## API endpoints

- `GET /occurrence/:lid/:speciesId` (authenticated): read occurrence details
- `PUT /occurrence/:lid/:speciesId` (edit roles): update occurrence-specific fields for the (lid, species_id) pair

## Editable fields (high level)

The editable payload is a partial object (`EditableOccurrenceData`) that includes fields such as:

- counts / measurements (for example `nis`, `pct`, `quad`, `mni`, `body_mass`)
- qualitative strings (for example `qua`, `id_status`, `orig_entry`, `source_name`)
- wear / isotopes / derived fields (for example `mesowear`, `microwear`, `dc13_*`, `do18_*`, `mw_*`)

Non-editable fields in the detail response include locality and taxonomy context (for example `loc_name`, `country`, `genus_name`, `species_name`) so the occurrence page can be rendered without extra fetches.


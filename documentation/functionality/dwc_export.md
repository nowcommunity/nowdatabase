# Darwin Core Archive export (v1, admin-only)

Issue: `nowcommunity/nowdatabase#1150`

This repository includes an **admin-only** Darwin Core Archive (DwC-A) export intended for initial testing.

## Access

- Backend route: `GET /species/export/dwc-archive` (**Role.Admin only**)
- The frontend exposes this as an export option on the `/species` page for administrators.

## Output

The downloaded ZIP contains:

- `taxon.csv` (DwC Taxon core)
- `measurementorfact.csv` (DwC MeasurementOrFact extension)
- `meta.xml` (DwC-A descriptor)
- `eml.xml` (minimal placeholder metadata; TODOs included)

## v1 field mappings

### `taxon.csv`

One row per `com_species` record.

Columns:

- `taxonID` = `com_species.species_id`
- `scientificName` = `${genus_name} ${species_name} ${sp_author}` (trimmed; authorship appended when present)
- `scientificNameAuthorship` = `sp_author`
- `vernacularName` = `common_name`
- `taxonRank` = `species` (TODO: validate for `indet.` / `gen.` / `sp.` cases)
- `taxonomicStatus` = `taxonomic_status` (fallback: `accepted`)
- `class` = `class_name`
- `order` = `order_name`
- `family` = `family_name`
- `genus` = `genus_name`
- `specificEpithet` = `species_name`
- `infraspecificEpithet` = `unique_identifier` (only when meaningful and not `-`)
- `higherClassification` = `class_name|subclass_or_superorder_name|order_name|suborder_or_superfamily_name|family_name|subfamily_name` (skip empty / `-`)
- `taxonRemarks` = `sp_comment`
- `taxonConceptID` = empty (TODO)

Note:

- v1 intentionally exports only `com_species` rows as taxa (no synonyms yet).

### `measurementorfact.csv`

Long-format measurements linked by `taxonID`.

Columns:

- `taxonID` = `species_id`
- `measurementID` = `NOW:<species_id>:<field_name>`
- `measurementType` / `measurementUnit` / `measurementValue` per field mapping
- `verbatimMeasurementType` = original DB field name (e.g. `diet1`, `body_mass`)
- `measurementMethod` = Pantheria VSP field description where available (`https://www.pantherion.com/dbmanual97/VSP.html`)
- `measurementRemarks` = empty

v1 includes only these `com_species` fields (rows emitted only when source value is non-null and non-empty; `-` is treated as empty):

- `body_mass` → type: `body mass`, unit: `g`
- `brain_mass` → type: `brain mass`, unit: `g`
- `diet1` → type: `diet category 1`
- `diet2` → type: `diet category 2`
- `diet3` → type: `diet category 3`
- `diet_description` → type: `diet description`
- `locomo1` → type: `locomotion 1`
- `locomo2` → type: `locomotion 2`
- `locomo3` → type: `locomotion 3`
- `activity` → type: `activity`
- `crowntype` → type: `crown type`
- `microwear` → type: `microwear`
- `mesowear` → type: `mesowear`
- `mw_value` → type: `mesowear value`

## Extension points (TODOs)

- Add synonym export from `com_taxa_synonym` (either separate Taxon rows or a dedicated extension).
- Add additional traits/measurements from `com_species`.
- Replace the placeholder `eml.xml` generator with a real dataset-level EML implementation.

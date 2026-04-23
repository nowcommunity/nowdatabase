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
- `nomenclaturalCode` = `ICZN`
- `scientificName` = `${genus_name} ${species_name} ${sp_author}` (trimmed; authorship appended when present)
- `genericName` = `genus_name` (only when `species_name` is a simple epithet; no spaces or dots)
- `scientificNameAuthorship` = `sp_author`
- `vernacularName` = `common_name`
- `taxonRank`:
  - `order` if `family_name` contains `.`
  - `family` if `genus_name` contains `.`
  - `genus` if `species_name` contains a space or `.`
  - `species` if `unique_identifier` is `-`
  - `subspecies` if `unique_identifier` is a single lowercase word
- `taxonomicStatus` = `taxonomic_status` (fallback: `accepted`)
- `kingdom` = `Animalia`
- `phylum` = `Chordata`
- `class` = `class_name`
- `order` = `order_name`
- `superfamily` = `subclass_or_superorder_name` (only when it ends with `-oidea`)
- `family` = `family_name`
- `subfamily` = `subfamily_name` (only when it ends with `-inae`)
- `tribe` = `subfamily_name` (only when it ends with `-ini`)
- `subtribe` = `subfamily_name` (only when it ends with `-ina`)
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

v1 includes these `com_species` fields (rows emitted only when source value is non-null and non-empty; `-` is treated as empty):

- `strain`
- `gene`
- `taxon_status`
- `body_mass` → type: `body mass`, unit: `g`
- `brain_mass` → type: `brain mass`, unit: `g`
- `sv_length`
- `sd_size`
- `sd_display`
- `tshm`
- `symph_mob`
- `relative_blade_length`
- `tht`
- `diet1` → type: `diet category 1`
- `diet2` → type: `diet category 2`
- `diet3` → type: `diet category 3`
- `diet_description` → type: `diet description`
- `rel_fib`
- `selectivity`
- `digestion`
- `feedinghab1`
- `feedinghab2`
- `shelterhab1`
- `shelterhab2`
- `locomo1` → type: `locomotion 1`
- `locomo2` → type: `locomotion 2`
- `locomo3` → type: `locomotion 3`
- `hunt_forage`
- `activity` → type: `activity`
- `crowntype` → type: `crown type`
- `microwear` → type: `microwear`
- `mesowear` → type: `mesowear`
- `horizodonty`
- `cusp_shape`
- `cusp_count_buccal`
- `cusp_count_lingual`
- `loph_count_lon`
- `loph_count_trs`
- `fct_al`
- `fct_ol`
- `fct_sf`
- `fct_ot`
- `fct_cm`
- `mw_or_high`
- `mw_or_low`
- `mw_cs_sharp`
- `mw_cs_round`
- `mw_cs_blunt`
- `mw_scale_min`
- `mw_scale_max`
- `mw_value` → type: `mesowear value`
- `pop_struc`
- `sp_status`

## Extension points (TODOs)

- Add synonym export from `com_taxa_synonym` (either separate Taxon rows or a dedicated extension).
- Add additional traits/measurements from `com_species`.
- Replace the placeholder `eml.xml` generator with a real dataset-level EML implementation.

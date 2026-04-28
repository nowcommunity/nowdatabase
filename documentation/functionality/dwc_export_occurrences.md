# DwC-A export: occurrences (v1)

This document describes the admin-only Darwin Core Archive (DwC-A) test export for occurrence records (`now_ls`).

## Files

The export ZIP contains:

- `occurrence.csv` (DwC `Occurrence` core)
- `measurementorfact.csv` (DwC `MeasurementOrFact` extension for `now_ls` facts)
- `location.csv` (companion file using the same structure as the locality export)
- `geologicalcontext.csv` (companion file using the same structure as the locality export)
- `taxon.csv` (companion file using the same structure as the taxon export)
- `meta.xml`
- `eml.xml` (minimal placeholder EML metadata)

## Core: `occurrence.csv`

Core rowType: `http://rs.tdwg.org/dwc/terms/Occurrence`

v1 columns:

- `occurrenceID` = `NOW:OCC:<lid>:<species_id>`
- `locationID` = `NOW:LOC:<lid>`
- `taxonID` = `NOW:<species_id>`
- `scientificName` = genus, species, optional unique identifier, and authorship from `com_species`
- `occurrenceStatus` = `present`
- `organismQuantity` / `organismQuantityType` = first available quantity from `mni`, `nis`, `pct`, then `quad`
- `identificationQualifier` = `id_status`
- `occurrenceRemarks` = `orig_entry`, `source_name`, and `qua` (joined with `|`)

## Extension: `measurementorfact.csv`

The occurrence export uses the same `measurementorfact.csv` column structure as the taxon and locality exports.

For occurrence-level measurements, the `taxonID` column contains the occurrence core id (`NOW:OCC:<lid>:<species_id>`). `verbatimMeasurementType` values from `now_ls` are prefixed with `now_ls.` so they do not collide with same-named `com_species` fields such as `body_mass`, `mesowear`, `mw_value`, or `microwear`.

Included `now_ls` fields for v1:

- count / abundance fields: `nis`, `pct`, `quad`, `mni`
- body mass: `body_mass`
- wear fields: `mesowear`, `mw_or_high`, `mw_or_low`, `mw_cs_sharp`, `mw_cs_round`, `mw_cs_blunt`, `mw_scale_min`, `mw_scale_max`, `mw_value`, `microwear`
- isotope fields: `dc13_mean`, `dc13_n`, `dc13_max`, `dc13_min`, `dc13_stdev`, `do18_mean`, `do18_n`, `do18_max`, `do18_min`, `do18_stdev`

## Companion Files

`location.csv`, `geologicalcontext.csv`, and `taxon.csv` are included as lookup/context files for the occurrence rows and intentionally reuse the existing locality and taxon export structures.

## Admin-only

The backend route is restricted to `Role.Admin`.

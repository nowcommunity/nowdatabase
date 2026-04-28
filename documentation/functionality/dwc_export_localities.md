# DwC-A export: localities (v1)

This document describes the admin-only Darwin Core Archive (DwC-A) test export for localities.

## Files

The export ZIP contains:

- `location.csv` (DwC `Location` core)
- `geologicalcontext.csv` (DwC `GeologicalContext` extension)
- `measurementorfact.csv` (DwC `MeasurementOrFact` extension)
- `meta.xml` (DwC-A metadata)
- `eml.xml` (minimal placeholder EML metadata)

## Core: `location.csv`

Core rowType: `http://rs.tdwg.org/dwc/terms/Location`

v1 columns:

- `locationID` = `NOW:LOC:<lid>`
- `locality` = `loc_name`
- `continent` = derived from `country` (via shared country→continent map)
- `country` = `country`
- `stateProvince` = `state`
- `county` = `county`
- `higherGeography` = `continent|country|state|county|basin|subbasin` (skip empty)
- `decimalLatitude` / `decimalLongitude` = `dec_lat` / `dec_long` (0 treated as empty for v1)
- `verbatimLatitude` / `verbatimLongitude` = `dms_lat` / `dms_long`
- `verbatimElevation` = `altitude`
- `locationRemarks` = `loc_detail` and `age_comm` (joined with ` | `)

## Extension: `geologicalcontext.csv`

Extension rowType: `http://rs.tdwg.org/dwc/terms/GeologicalContext`

v1 columns:

- `locationID` = `NOW:LOC:<lid>` (core id)
- `geologicalContextID` = `NOW:LOC:<lid>:geology`
- `lithostratigraphicTerms` = `chron`, `lgroup`, `formation`, `member`, `bed` (joined with ` | `)
- `group` / `formation` / `member` / `bed` mapped from locality columns
- `earliestAgeOrLowestStage` = `bfa_max` (uses related `now_time_unit.tu_display_name` when available)
- `latestAgeOrHighestStage` = `bfa_min` (uses related `now_time_unit.tu_display_name` when available)

## Extension: `measurementorfact.csv`

Extension rowType: `http://rs.tdwg.org/dwc/terms/MeasurementOrFact`

`measurementorfact.csv` uses the same column headings as the taxa export (for consistency), but the `taxonID` column contains the locality `locationID` value (`NOW:LOC:<lid>`).

Each emitted row has:

- `taxonID` = `NOW:LOC:<lid>` (core id for Location)
- `measurementID` = `NOW:LOC:<lid>:<field_name>` (or calculated group id)
- `parentMeasurementID` is used for the age hierarchy:
  - `NOW:LOC:<lid>:age` (parent) → `max_age` / `min_age`
  - `bfa_*`, `*_abs`, `frac_*` link to the relevant `max_age` / `min_age`
- `verbatimMeasurementType` = original DB field name

Concatenation rules (v1):

- Locality synonyms are concatenated with `|` into a single `synonyms` measurement row.
- Collecting methods (`now_coll_meth`) are concatenated with `|` into a single measurement row.
- Sedimentary structures (`now_ss`) are concatenated with `|` into a single measurement row.

Field coverage (v1):

- Fossil Assemblage, Taphonomy, Climate, Ecometrics, and Archaeology tab fields are exported as `MeasurementOrFact` rows when populated (plus selected calculated values such as mean hypsodonty).
- `basin` and `subbasin` are exported both as part of `higherGeography` and as explicit `MeasurementOrFact` rows.
- `now_plr` project links and `now_lau` last-update rows are intentionally excluded.

## Admin-only

The backend route is restricted to `Role.Admin`.

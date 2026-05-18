# Darwin Core Data Package export (v1, admin-only)

Issue: `nowcommunity/nowdatabase#1150`

This repository includes an **admin-only** Darwin Core Data Package (DwC-DP) test export for relational locality and occurrence data.

DwC-DP is intentionally published as a separate format from the existing DwC-A exports. The taxon trait-heavy `com_species` export remains a DwC-A `Taxon` core with `MeasurementOrFact`, because those traits are synthesized at taxon level rather than linked to specimen/material source entities.

## Access

- Backend route: `GET /occurrence/export/dwc-data-package` (**Role.Admin only**)
- Backend route: `GET /occurrence/export/dwc-full-package` (**Role.Admin only**)
- The frontend exposes both as export options on the cross-search occurrence table for administrators.

## Output

The downloaded ZIP contains:

- `datapackage.json` (Frictionless Data Package descriptor with table schemas and foreign keys)
- `event.csv` (DwC-DP Event rows derived from `now_loc`)
- `geological-context.csv` (geological context rows referenced from `event.csv`)
- `occurrence.csv` (DwC-DP Occurrence rows derived from `now_ls`)
- `event-assertion.csv` (locality-level facts formerly expressed as locality `MeasurementOrFact`)
- `occurrence-assertion.csv` (occurrence-level facts formerly expressed as occurrence `MeasurementOrFact`)
- `eml.xml` (minimal placeholder EML metadata)

## Full Darwin Core Convenience Bundle

The full export route downloads one outer ZIP for users who need both occurrence/event data and taxon traits.

The outer ZIP contains:

- `README.txt`
- `dwc-dp/` with the DwC-DP event + occurrence package described above
- `dwc-a-taxa/` with the existing DwC-A taxon trait archive:
  - `taxon.csv`
  - `measurementorfact.csv`
  - `meta.xml`
  - `eml.xml`

The outer ZIP is a NOW convenience bundle, not a single hybrid standard artifact. Each subfolder remains its own internally described export format.

For spreadsheet compatibility, embedded line breaks in exported CSV cell values are normalized to spaces. This keeps each exported record on one physical CSV line.

Join key:

- `dwc-dp/occurrence.csv` uses `taxonID = NOW:<species_id>`
- `dwc-a-taxa/taxon.csv` uses the same `taxonID`
- `dwc-a-taxa/measurementorfact.csv` links synthesized taxon traits by the same `taxonID`

## Model

### `event.csv`

One row per `now_loc` record.

Key mappings:

- `eventID` = `NOW:EVENT:<lid>`
- `eventType` = `paleontological locality`
- `locationID` = `NOW:LOC:<lid>`
- locality, geography, coordinates, elevation, and remarks map from the corresponding locality fields
- `geologicalContextID` = `NOW:GEO:<lid>`

### `geological-context.csv`

One row per locality geological context.

Key mappings:

- `geologicalContextID` = `NOW:GEO:<lid>`
- stratigraphic terms map from `chron`, `lgroup`, `formation`, `member`, and `bed`
- earliest/latest stage terms map from `bfa_max` / `bfa_min`, using related time-unit display names when available

### `occurrence.csv`

One row per `now_ls` record.

Key mappings:

- `occurrenceID` = `NOW:OCC:<lid>:<species_id>`
- `eventID` = `NOW:EVENT:<lid>`
- `taxonID` = `NOW:<species_id>`
- `scientificName` follows the existing occurrence DwC-A mapping
- `identificationVerificationStatus` maps from `id_status`

### Assertion Tables

The assertion tables preserve the non-core facts without overloading one DwC-A `measurementorfact.csv` across multiple entity types.

- `event-assertion.csv` uses `eventID` and contains locality-level facts from `now_loc` and related locality lists.
- `occurrence-assertion.csv` uses `occurrenceID` and contains occurrence-level facts from `now_ls`.

The original database field name is preserved in `verbatimAssertionType`.

## Relationship To Existing DwC-A Exports

- Keep species traits as DwC-A `Taxon` + `MeasurementOrFact`.
- Keep locality and occurrence DwC-A exports available for current test users.
- Prefer this DwC-DP export for relational event/locality/geology/occurrence data because it avoids the DwC-A one-core star-schema limitation.

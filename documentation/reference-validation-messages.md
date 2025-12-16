# Reference validation message sources

## Grouped required-field errors
- The string `"At least one of the following fields is required: …"` is produced in `orCheck` inside `frontend/src/shared/validators/reference.ts`.
- `orCheck` builds the list of field keys based on `ref_type_id` and checks whether any of those fields contain a non-empty string. When none do, it returns the concatenated message.
- `validateReference` wires `orCheck` into the validators for `title_primary`, `title_secondary`, `title_series`, and `gen_notes`, so the message appears both in inline errors and aggregate validation results.

## Display labels for reference fields
- Human-readable labels per reference type come from the database table `ref_field_name` (via Prisma model `ref_field_name`), which stores `ref_field_name` (display text) alongside `field_name` (schema key) scoped by `ref_type_id`.
- The backend returns these labels through `getReferenceTypes` in `backend/src/services/reference.ts`, which fetches `ref_ref_type` records including their `ref_field_name` children, and `buildReferenceDisplayLabelMap` converts them into a lookup keyed by `ref_type_id`.
- `validateEntireReference` passes this `displayLabelMap` into `validateReference`, enabling `orCheck` to swap field keys for per-type display labels when building the grouped required-field message.
- On the frontend, `ReferenceDetails` injects the same display-label map into `validateReference` so both inline and aggregate messages show labels like "Title", "Organisation", or "Notes" instead of raw schema keys for the active reference type.

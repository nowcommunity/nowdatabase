# Time Units API

This document outlines the REST endpoints for time units and the duplicate-name validation response shape used by the frontend.

## Create or Update a Time Unit

`PUT /time-unit/`

Creates a new time unit when `tu_name` is omitted. Updates an existing time unit when `tu_name` is provided.

### Request Body

```json
{
  "timeUnit": {
    "tu_display_name": "Carboniferous",
    "rank": "Period",
    "sequence": "...",
    "up_bnd": "...",
    "low_bnd": "...",
    "references": []
  }
}
```

Only the relevant editable fields are shown above; the full payload mirrors the `TimeUnitDetailsType` shape.

### Successful Responses

- `200 OK` – Time unit was created or updated. Returns `{ "tu_name": "carboniferous" }` for created records.

### Validation Responses

- `403 Forbidden` – Standard validation errors. Response matches the existing validator error array or cascade error object.

### Duplicate Name Response

- `409 Conflict` – A time unit with the same normalized name already exists.
- Response body:

```json
{
  "message": "Time unit with the provided name already exists",
  "code": "duplicate_name"
}
```

### Authentication

- Requires a valid JWT with `Admin` or `EditUnrestricted` roles.


# Museums

Museums are institution lookup records that can be linked to localities. The museum record itself describes the institution; the locality tab stores which museums are connected to a locality.

## Database model

The main museum lookup record is `com_mlist`:

- `museum` (primary key, museum code)
- `institution`
- `alt_int_name`
- `city`
- `state_code`
- `state`
- `country`
- `used_morph`
- `used_now`
- `used_gene`

Locality links are stored in `now_mus`:

- `lid` references `now_loc.lid`
- `museum` references `com_mlist.museum`
- composite primary key: `lid` + `museum`

Deleting a locality cascades its `now_mus` rows. Deleting or renaming a museum code needs care because the code is part of the link-table key.

## API endpoints

- `GET /museum/all`: list museums
- `GET /museum/:id`: read museum details and linked localities
- `PUT /museum`: create or update a museum; requires an edit role

The detail endpoint supports tabular query options for the linked locality list.

## Frontend usage

- `/museum/:id?` routes to the museum detail page.
- Locality edit views use the museum lookup list when linking museums to a locality.
- The Museum tab in locality details edits `now_mus` rows through the locality edit payload rather than by editing the museum record directly.

## Validation notes

Museum codes are treated as stable identifiers. Backend tests cover creation, update, empty-code validation, and duplicate-code checks that differ only by case.

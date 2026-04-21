# Regions

Regions represent a named geographic region that can be associated with:

- one or more countries (`now_reg_coord_country`)
- one or more coordinators / people (`now_reg_coord_people` → `com_people`)

## Database model

The main region record is `now_reg_coord`:

- `reg_coord_id` (primary key)
- `region` (name)

Relations:

- `now_reg_coord_country` rows (composite key: `reg_coord_id` + `country`)
- `now_reg_coord_people` rows (composite key: `reg_coord_id` + `initials`)

## API endpoints

All region endpoints are admin-only:

- `GET /region/all`
- `GET /region/:id`
- `PUT /region` (create/update; returns `{ reg_coord_id }`)
- `DELETE /region/:id`


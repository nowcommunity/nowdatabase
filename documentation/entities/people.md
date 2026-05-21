# People

People represent contributors, coordinators, contacts, and optionally application users. A person can exist without a login account.

## Database model

The main person record is `com_people`:

- `initials` (primary key)
- `first_name`
- `surname`
- `full_name`
- `format`
- `email`
- `user_id`
- `organization`
- `country`
- `password_set`
- `used_morph`
- `used_now`
- `used_gene`

If `user_id` is set, it links the person to a `com_users` row:

- `user_id` (primary key)
- `user_name`
- `password`
- `newpassword`
- `last_login`
- `now_user_group`
- `mor_user_group`
- `gen_user_group`

Person initials are also used in coordinator, authorizer, contact, and membership relations, including project people, region coordinators, species coordinators, stratigraphy coordinators, and update-log coordinator/authorizer fields.

## API endpoints

- `GET /person/all`: list all people; admin-only
- `GET /person/:id`: read person details; admin users can read any person and non-admin users can read only their own person record
- `PUT /person`: update a person; admin users can update any person and non-admin users can update only their own person record

Creating new people is not implemented through `PUT /person`; the route returns an error when `initials` is missing.

## Frontend usage

- `/person` shows the people table for admins.
- `/person/:id?` shows person details when the signed-in user is authorized.
- Person lookup data is reused by coordinator/contact selectors, such as project and region editing.

## Permission notes

The person routes intentionally do not use only the shared role middleware because self-service profile access is allowed. Route-level checks compare `req.user.initials` with the requested or edited person initials.

Admin-only user-group edits are handled during person update when the payload includes a valid `user_id` and `now_user_group`.

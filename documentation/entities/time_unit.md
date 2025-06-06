### Time Unit

A Time Unit can be given the following information:

- Name (`tu_display_name`)
- A Rank (`rank`)
- A comment (`tu_comment`)
- Sequence (`sequence`)
- Lower Bound Id (`low_bnd`)
- Upper Bound Id (`up_bnd`)

Out of these, the rank and comment fields are optional and the rest are required.

The components that are used to change the upper or lower time bounds are `TimeBoundSelection` components. These are almost exactly the same as `FieldWithTableSelection` components, but when their value is changed, they also update the `up_bound` and `low_bound` objects in `editData`. This way when the upper/lower bound id's are changed by the user, the actual bounds are immediately updated too and can be shown to the user or passed to a validator. `TimeBoundSelection` components should not be used anywhere else.

After the time unit is created, its ID (`tu_name`) is set to be the same as its name, but lowercase (for example, a time unit with the name "Abdounian" has the id "abdounian"). Because of this, changing an existing time unit's name causes a foreign key error in the database because the "now_time_unit" and "now_tau" tables are connected by it. When editing a time unit, the name field is currently disabled to not allow this error to happen.

## Problems:

At the moment it seems that Time Units get info about their updates from wrong places. Old PHP-version displays differring data on updates tab. It seems (I might be wrong about this) that PHP-version bases the info on the table now_time_update and the new one on the table now_tau. Prisma doesn't seem to handle the query if based on now_time_update with current schema, but the change should be doable with Prisma's rawSQL.

Also Time Units do not log updates when relevant Time Bounds are successfully edited.

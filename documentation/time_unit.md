### Time Unit

When a user creates a new time unit, the following fields are needed:

- Name
- Sequence
- Lower Bound Id
- Upper Bound Id

The components that are used to change the upper or lower time bounds are `TimeBoundSelection` components. These are almost exactly the same as `FieldWithTableSelection` components, but when their value is changed, they also update the `up_bound` and `low_bound` objects in `editData`. This way when the upper/lower bound id's are changed by the user, the actual bounds are immediately updated too and can be shown to the user or passed to a validator. `TimeBoundSelection` components should not be used anywhere else.

Changing a time unit's name causes a foreign key error in the database because the "now_time_unit" and "now_tau" tables are connected by it. When editing a time unit, the name field is currently disabled because of this.

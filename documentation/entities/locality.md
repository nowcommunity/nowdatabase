# Localities

## Required fields

A locality has the following required fields in the database:

- `lid`, the id of the locality
- `loc_name`, the name of the locality
- `date_meth`, which dating method the locality uses, this value should be "time_unit", "absolute" or "composite"
- `min_age`, minimum age
- `max_age`, maximum age
- `dec_lat`, latitude coordinate in the Decimal Degrees system
- `dec_long`, longitude coordinate in the Decimal Degrees system
- `hominin_skeletal_remains`, a Boolean value
- `bipedal_footprints`, a Boolean value
- `stone_tool_technology`, a Boolean value
- `stone_tool_cut_marks_on_bones`, a Boolean value

All of these are also editable and required when editing or creating a new locality (with the exception of `lid`).

## Dating Methods & Basis for Age

Depending on the selected dating method, different fields are required:

- When the Time Unit dating method is selected, the `bfa_min` and `bfa_max` fields are required.
- When the Absolute dating method is selected, the `bfa_min_abs` and `bfa_max_abs` fields are required.
- When the Composite dating method is selected, a combination of either `bfa_min` and `bfa_max_abs` or `bfa_min_abs` and `bfa_max` are required, e.g. one age must be defined by a time unit and the other absolutely.

When the Time Unit dating method is selected, two time units need to be selected as the basis for the locality's age (both bases can also use the same time unit). When selecting a basis for the minimum age, the upper bound of the time unit is used as the value, and when selecting a basis for the maximum age the lower bound is used.

Changing the value of the Dating Method selector clears all existing values from the age fields.

## Fractions

Selecting a fraction modifies the min/max age set by a time unit. Here's an example:

- Select a time unit that has 56 as its Lower Bound and 48.6 as its Upper Bound. The minimum age is now 48.6 and the maximum age is 56.
- Select "Early Half 1:2" as the minimum age fraction. This effectively splits the range of ages in half and says that the actual age of the locality is somewhere in the early half, so now the minimum age of the locality is 52.3.
- Select "Middle Third 2:3" as the maximum age fraction. This splits the range of ages in three and says that the actual age of the locality is somewhere in the middle third, so now the maximum age of the locality is 53.53.
- The min/max age fields now show 52.3 and 53.53 to reflect this.

This is implemented by passing the selected fraction to the `BasisForAgeSelection` component, which uses the fraction and the selected time unit to calculate the minimum/maximum ages.

## Coordinate Conversion in the Locality Tab

Typing in a dec coordinate automatically converts it to a DMS coordinate, and writes it in the dms field (also works the other way around). This is implemented by passing the handleCoordinateChange function to the textfield component, which it calls every time its value changes.

### BasisForAgeSelection Component

The BasisForAgeSelection component is used to select a time unit as the Basis for Age for a locality. If for some reason the component is used anywhere else in the app, it will need to be refactored since it's only designed to be used in the Age tab of a locality's edit view. The component is used by giving it

- a `targetField` which is the field in editData that the component should change (Required)
- a `fraction` which is used to calculate the minimum/maximum age of the locality (Required)
- a `timeUnit` value which is used together with the fraction to calculate the ages (Optional)
- a `selectorTable` which is used to select the time unit (Required)
- a `disabled` boolean value (Optional)

Whenever the user either selects a new time unit using the component, or the fraction value changes, the BasisForAgeSelection component calculates a new min/max age using and updates the `editData` with the new value. The currently selected time unit is saved in the `currentBasisForAge` state variable. When creating a new locality, this state variable will initially be undefined, but when editing an existing locality the state variable will first be set to the existing time unit (which is passed through the `timeUnit` argument to the component).

If `disabled` is set to true, the component cannot be clicked.

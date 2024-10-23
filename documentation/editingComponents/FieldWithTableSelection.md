### FieldWithTableSelection Component

The FieldWithTableSelection component is used by giving it

- a `targetField` which is the field in editData that the component should change (Required)
- a `sourceField` which is a field in the object that the FieldWithTableSelection receives when the user selects an item (Required)
- a `selectorTable` which is the table that is shown when the user clicks the field (Required)
- a `disabled` boolean value (Optional)

The FieldWithTableSelection looks like a normal text field. When the user clicks the field, a pop-up with a table view is shown. When the user selects an item from this table, the `selectorFn` function inside the component is called, with the `selected` parameter being an object that contains the item's data. Since we don't want to write this entire object to editData, the `sourceField` parameter is used to specify which field we want to use.

If `disabled` is set to true, the FieldWithTableSelection cannot be clicked.

If the user selects an invalid value, the FieldWithTableSelection will show a red text underneath it explaining the issue. This is done by getting the validator from the current context (if one exists), and then passing it the current `editData` (also from context) and the `targetField` value. The validator will check if the value in editData corresponding to `targetField` is valid.

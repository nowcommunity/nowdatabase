### DropDownSelector Component

The DropDownSelector component is used by giving it

- an array of `options` (Required)
- a `name` (Required)
- a `field` which is the field in editData that the component should change (Required)
- a `disabled` boolean value (Optional)

The options array consists of strings, numbers or objects of type DropDownOption. A DropDownOption is a simple object that contains the actual value, a display string which is used to show the option's name to the user, and an optional optionDisplay string which is an alternate name for the option used, for example, when the option is inside of a menu.

If `disabled` is set to true, the dropdown selector cannot be clicked.

If the selected value is invalid, the DropDownSelector will show a red text underneath it explaining the issue. This is done by getting the validator from the current context (if one exists), and then passing it the current `editData` (also from context) and the `field` value. The validator will check if the value in editData corresponding to `field` is valid.

### RadioSelector Component

The RadioSelector component is a group of one or more radio buttons. The component is used by giving it

- an array of `options` (Required)
- a `name` (Required)
- a `field` value which is the field in editData that the component should change (Required)
- a `defaultValue` (Optional)

The `options` array consists of strings, numbers or objects of type DropDownOption. A DropDownOption is a simple object that contains the actual value, a display string which is used to show the option's name to the user, and an optional optionDisplay string which is an alternate name for the option used, for example, when the option is inside of a menu.
All options have to be of the same type!

If a `defaultValue` is not given, the RadioSelector will choose the first option's value as the default value. This means that a RadioSelector always has a value. The selector will also immediately add this default value to the editData.

The values that the RadioSelector supports are strings, numbers, and booleans as strings. This means that strings 'true' or 'false' will be converted to booleans in the backend. This also means that the options cannot be 'true' or 'false' if you want to actually write those as strings to database.

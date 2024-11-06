### EditableTextField Component

The EditableTextField component is a basic text input field. The component is used by giving it

- a `field` which is the field in editData that the component should change (Required)
- a `type` which details the type of input the component receives (Optional, defaults to 'text')
- a `round` value which controls how the value should be rounded if it's a number (Optional)
- a `big` boolean value that changes the field to a multiline field (Optional)
- a `disabled` boolean value (Optional)
- a `readonly` boolean value (Optional)
- a `handleSetEditData` function (Optional)

The component's `type` can be a lot of values, but the ones we use are `text` and `number`.

The `round` value controls how many values are shown after the decimal point. This only affects fields that contain numbers, obviously.

If `disabled` is set to true, the EditableTextField cannot be clicked.

If `readonly` is set to true, the user can't change the value of the input field directly.

The `handleSetEditData` function is used to set the editData state using setEditData, instead of the default handling. This is useful if you want changing the text field to have an effect on some other input field, e.g. another component. An example use is `handleDmsLatChange` (and three similar functions) in [LocalityTab](../../frontend/src/components/Locality/Tabs/LocalityTab.tsx)

If the selected value is invalid, the EditableTextField will show a red text underneath it explaining the issue. This is done by getting the validator from the current context (if one exists), and then passing it the current `editData` (also from context) and the `field` value. The validator will check if the value in editData corresponding to `field` is valid.

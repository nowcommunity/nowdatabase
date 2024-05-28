### Validators

Validators are created as objects with the following fields. Only `name` is required.

+ `name` The clear-language version of the field, usually same as the label shown in frontend. For example 'bfa_min_abs' field would have a name of 'Basis for age (absolute)'
+ `required` Set to true if always requires some (non-empty) value, otherwise
+ `minLength`
+ `maxLength` Inclusive min and max length for value, applies only to string fields
+ `asString` Either "true" to just require a string, or a function which can do more complex validation for the string value
+ `asNumber` Same as asString but for numbers: Set to `true` to require a valid number, or set the function to both require a valid number (checked automatically if function is supplied) and apply more custom validations in the function body

Example:

```
    bfa_min_abs: {
      name: 'Basis for age (minimum)',
      asNumber: (num: number) => {
        const bfa_max_abs = editData.bfa_max_abs
        if (!bfa_max_abs) return
        if (parseInt(bfa_max_abs) > num) return 'Min value cannot be higher than max'
      },
    },
```
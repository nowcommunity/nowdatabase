### Validators

Validators are created as objects with the following fields. Only `name` is required.

- `name` The clear-language version of the field, usually same as the label shown in frontend. For example 'bfa_min_abs' field would have a name of 'Basis for age (absolute)'
- `required` Set to true if always requires some (non-empty) value. Can also be given a function that returns a ValidationError, if requirement and error strings are more conditional. Example usage can be found in locality validators.
- `minLength`
- `maxLength` Inclusive min and max length for value, applies only to string fields
- `asString` Either "true" to just require a string, or a function which can do more complex validation for the string value
- `asNumber` Same as asString but for numbers: Set to `true` to require a valid number, or set the function to both require a valid number (checked automatically if function is supplied) and apply more custom validations in the function body
- `miscCheck` is used to simply run any check you want. Currently it's used to e.g. validate the low_bound and up_bound fields of a time unit in the timeUnit validator.
- `miscArray` is used to run any check you want on arrays. Used for example in reference validators to check all authors are in correct format, author name is set etc.
- `condition` used to set some condition for when a validator is run. Happens before the check for if a value is required. Used for example in references to only run validators for for certain fields since they are only mandatory on some reference types, not all. Although using 'required' instead may now be possible after changes to it.
- `useEditData` A boolean for if you want to pass editData to the different checks of a validator instead of just the data of the field being validated. Used in references since some validators need to pass editData to a common function. Again, using 'required' instead may be possible after its changes

Use `validator(...)` when validating one edited field. Use `validateFields(...)` for full-object validation, such as backend create/update checks, so validators run for every configured field even when a required key is missing from the submitted data.

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

To know if user is creating a new entry or editing existing one, check if the id exists. For example put `const isNew = editData.lid === undefined` at the beginning of the entire validator so it can be used in all of the fields' validators.

### Note!

For full-object validation, do not iterate over `Object.keys(editData)`. That only checks fields included in the payload. Instead, call `validateFields(...)`, which iterates over the configured validator keys and catches required fields that are `undefined` or missing entirely.

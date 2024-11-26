import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Radio,
  Box,
  Modal,
  Button,
  Autocomplete,
} from '@mui/material'
import { cloneElement, ChangeEvent, ReactNode, useState, ReactElement, useEffect } from 'react'
import { RegisterOptions, FieldValues, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useDetailContext } from '../Context/DetailContext'
import { DataValue } from './tabLayoutHelpers'
import { modalStyle } from './misc'
import { EditDataType } from '@/backendTypes'
import { calculateLocalityMinAge, calculateLocalityMaxAge } from '@/util/ageCalculator'
import { ValidationObject } from '@/validators/validator'
import { FieldsWithErrorsType, SetFieldsWithErrorsType } from '../DetailView'

const fieldWidth = '14em'

export type DropdownOptionValue = string | number
export type DropdownOption = { value: DropdownOptionValue; display: string; optionDisplay?: string }

const setDropdownOptionValue = (
  setValue: (val: string | number | boolean) => void,
  value: string | undefined,
  asNumber: boolean
) => {
  if (value && asNumber) {
    setValue(parseInt(value))
  } else if (value === 'true' || value === 'false') {
    setValue(String(value === 'true'))
  } else {
    setValue(value ?? '')
  }
}

const checkFieldErrors = (
  field: string,
  errorObject: ValidationObject,
  fieldsWithErrors: FieldsWithErrorsType,
  setFieldsWithErrors: SetFieldsWithErrorsType
) => {
  const fieldAsString = String(field)
  if (errorObject.error) {
    if (!(fieldAsString in fieldsWithErrors)) {
      setFieldsWithErrors(prevFieldsWithErrors => {
        return { ...prevFieldsWithErrors, [fieldAsString]: errorObject }
      })
    }
  } else if (!errorObject.error && fieldAsString in fieldsWithErrors) {
    setFieldsWithErrors(prevFieldsWithErrors => {
      const newFieldsWithErrors = { ...prevFieldsWithErrors }
      delete newFieldsWithErrors[fieldAsString]
      return newFieldsWithErrors
    })
  }
}

export const DropdownSelector = <T extends object>({
  options,
  name,
  field,
  disabled,
}: {
  options: Array<DropdownOption | string>
  name: string
  field: keyof EditDataType<T>
  disabled?: boolean
}) => {
  const { setEditData, editData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<T>()
  const errorObject = validator(editData, field)
  const { error } = errorObject

  useEffect(() => {
    checkFieldErrors(String(field), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const editingComponent = (
    <FormControl size="small" error={!!error}>
      <InputLabel id={`${name}-multiselect-label`}>{name}</InputLabel>
      <Select
        labelId={`${name}-multiselect-label`}
        label={name}
        id={`${name}-multiselect`}
        value={(editData[field] as string) || ''}
        onChange={(event: SelectChangeEvent) => {
          const setValue = (value: number | string | boolean) => setEditData({ ...editData, [field]: value })
          const asNumber = typeof options[0] === 'number'
          setDropdownOptionValue(setValue, event?.target?.value, asNumber)
        }}
        sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
        size="small"
        disabled={disabled}
      >
        {options.map(item => (
          <MenuItem key={getValue(item)} value={getValue(item)} style={{ height: '2em' }}>
            {getDisplay(item, true)}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )

  return <MultiSelector<T> {...{ editingComponent, field, options }} />
}

export const DropdownSelectorWithSearch = <T extends object>({
  options,
  name,
  field,
  disabled,
}: {
  options: Array<DropdownOption | string>
  name: string
  field: keyof EditDataType<T>
  disabled?: boolean
}) => {
  const { setEditData, editData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<T>()
  const errorObject = validator(editData, field)
  const { error } = errorObject

  useEffect(() => {
    checkFieldErrors(String(field), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  //current state of the search, not the selected option that is set into editData
  const [inputValue, setInputValue] = useState('')

  const editingComponent = (
    <FormControl size="small" error={!!error}>
      <InputLabel id={`${name}-multiselect-label`}></InputLabel>

      <Autocomplete
        id={`${name}-multiselect`}
        options={options}
        value={(editData[field] as string) || ''}
        disabled={disabled}
        onChange={(_, newValue) => {
          const setValue = (value: number | string | boolean) => setEditData({ ...editData, [field]: value })
          const asNumber = typeof options[0] === 'number'
          if (newValue) {
            setDropdownOptionValue(setValue, newValue as string, asNumber)
          } else {
            setDropdownOptionValue(setValue, '', asNumber)
          }
        }}
        inputValue={inputValue}
        onInputChange={(_, newInputValue) => {
          setInputValue(newInputValue)
        }}
        sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
        renderInput={params => <TextField {...params} label="Choose a country" error={!!error} />}
      />

      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )

  return <MultiSelector<T> {...{ editingComponent, field, options }} />
}

export const FormTextField = <T extends string>({
  register,
  errors,
  fieldName,
  label,
  required = false,
  big = false,
}: {
  register: (name: T, options?: RegisterOptions<FieldValues, T>) => UseFormRegisterReturn<T>
  errors: FieldErrors<FieldValues>
  fieldName: T
  label: string
  required: boolean
  big: boolean
}) => {
  const props = {
    ...register(fieldName, { required: required }),
    error: !!errors[fieldName],
    label,
    required,
    multiline: big,
  }
  return <TextField {...props} />
}

const getValue = (item: DropdownOption | DropdownOptionValue) => (typeof item !== 'object' ? item : item.value)
const getDisplay = (item: DropdownOption | DropdownOptionValue, inMenu?: boolean) => {
  if (typeof item === 'string' || typeof item === 'number') return item
  if (inMenu && item.optionDisplay) return item.optionDisplay
  return item.display
}

/*
  Supports string and number values, and booleans as strings. This means that
  strings 'true' or 'false' will be handled by the app (and server) as boolean-type.
  This also means that the options cannot be 'true' or 'false' if you want
  to actually write those as strings to database. If that is required, this
  needs to be changed. Empty strings or null should not be used as options either, 
  because the RadioSelector will overwrite those with the default value.
  ALSO: All options have to be of same type! This isn't enforced with types.
*/
export const RadioSelector = <T extends object>({
  options,
  name,
  field,
  defaultValue,
  handleSetEditData,
}: {
  options: Array<DropdownOption | DropdownOptionValue>
  name: string
  field: keyof EditDataType<T>
  defaultValue?: DropdownOptionValue
  handleSetEditData?: (value: number | string | boolean) => void
}) => {
  const { setEditData, editData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<T>()
  const errorObject = validator(editData, field)

  useEffect(() => {
    checkFieldErrors(String(field), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  if (defaultValue === undefined) {
    defaultValue = getValue(options[0])
  }

  useEffect(() => {
    if (editData[field] === null || editData[field] === '') {
      setEditData({ ...editData, [field]: defaultValue })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData])

  const editingComponent = (
    <FormControl>
      <RadioGroup
        aria-labelledby={`${name}-radio-selection`}
        name={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          let setValue: (value: number | string | boolean) => void
          if (handleSetEditData) {
            setValue = (value: number | string | boolean) => handleSetEditData(value)
          } else {
            setValue = (value: number | string | boolean) => setEditData({ ...editData, [field]: value })
          }
          const asNumber = typeof options[0] === 'number'
          setDropdownOptionValue(setValue, event?.currentTarget?.value, asNumber)
        }}
        value={editData[field]}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        {options.map(option => (
          <FormControlLabel
            key={getValue(option)}
            value={getValue(option)}
            control={<Radio />}
            label={getDisplay(option, true)}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
  return <MultiSelector<T> {...{ editingComponent, field, options }} />
}

const MultiSelector = <T extends object>({
  options,
  field,
  editingComponent,
}: {
  options: Array<DropdownOption | DropdownOptionValue>
  field: keyof EditDataType<T>
  editingComponent: ReactNode
}) => {
  const { data } = useDetailContext<T>()
  const valueInField = data[field as keyof T]
  const option = options.find(option => getValue(option) === valueInField || getValue(option) === valueInField + '')
  const displayValue = option ? getDisplay(option) : null
  return <DataValue<T> field={field} EditElement={editingComponent} displayValue={displayValue} />
}

export const EditableTextField = <T extends object>({
  field,
  type = 'text',
  round,
  big = false,
  disabled = false,
  readonly = false,
  handleSetEditData,
}: {
  field: keyof EditDataType<T>
  type?: React.HTMLInputTypeAttribute
  round?: number
  big?: boolean
  disabled?: boolean
  readonly?: boolean
  handleSetEditData?: (value: number | string) => void
}) => {
  const { setEditData, editData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<T>()
  const errorObject = validator(editData, field)
  const { error } = errorObject

  useEffect(() => {
    checkFieldErrors(String(field), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event?.currentTarget?.value
    if (handleSetEditData) {
      handleSetEditData(value)
    } else {
      if (type === 'date') {
        // For date fields, ensure the value is stored as a string in the format 'YYYY-MM-DD'
        setEditData({ ...editData, [field]: value })
      } else if (type === 'text' || value === '') {
        setEditData({ ...editData, [field]: value })
      } else {
        setEditData({ ...editData, [field]: parseFloat(value) })
      }
    }
  }

  const editingComponent = (
    <TextField
      sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
      onChange={handleChange}
      id={`${String(field)}-textfield`}
      value={editData[field] ?? ''}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error ?? ''}
      type={type}
      multiline={big}
      disabled={disabled}
      InputProps={readonly ? { readOnly: true } : { readOnly: false }}
    />
  )

  return <DataValue<T> field={field} EditElement={editingComponent} round={round} />
}

export const FieldWithTableSelection = <T extends object, ParentType extends object>({
  targetField,
  sourceField,
  selectorTable,
  disabled,
}: {
  targetField: keyof ParentType
  sourceField: keyof T
  selectorTable: ReactElement
  disabled?: boolean
}) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<ParentType>()
  const errorObject = validator(editData, targetField as keyof EditDataType<ParentType>)
  const { error } = errorObject
  const [open, setOpen] = useState(false)
  const selectorFn = (selected: T) => {
    setEditData({ ...editData, [targetField]: selected[sourceField] })
    setOpen(false)
  }

  useEffect(() => {
    checkFieldErrors(String(targetField), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const selectorTableWithFn = cloneElement(selectorTable, { selectorFn })
  if (open)
    return (
      <Box>
        <Modal
          open={open}
          aria-labelledby={`modal-${targetField as string}`}
          aria-describedby={`modal-${targetField as string}`}
        >
          <Box sx={{ ...modalStyle }}>
            <Box marginBottom="2em" marginTop="1em">
              {selectorTableWithFn}
            </Box>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </Box>
        </Modal>
      </Box>
    )
  const editingComponent = (
    <TextField
      id={`${String(targetField)}-tableselection`}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error ?? ''}
      value={editData[targetField as keyof EditDataType<ParentType>] ?? undefined}
      onClick={() => setOpen(true)}
      disabled={disabled}
      sx={{ backgroundColor: disabled ? 'grey' : '' }}
      inputProps={{ readOnly: true }}
    />
  )
  return <DataValue<ParentType> field={targetField as keyof EditDataType<ParentType>} EditElement={editingComponent} />
}

export const TimeBoundSelection = <T extends object, ParentType extends object>({
  targetField,
  sourceField,
  selectorTable,
  disabled,
}: {
  targetField: keyof ParentType
  sourceField: keyof T
  selectorTable: ReactElement
  disabled?: boolean
}) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<ParentType>()
  const errorObject = validator(
    editData,
    (targetField === 'up_bnd' ? 'up_bound' : 'low_bound') as keyof EditDataType<ParentType>
  )
  const { error } = errorObject
  const [open, setOpen] = useState(false)

  const selectorFn = (selected: T) => {
    if (targetField === 'up_bnd') {
      setEditData({ ...editData, [targetField]: selected[sourceField], ['up_bound']: selected })
    } else if (targetField === 'low_bnd') {
      setEditData({ ...editData, [targetField]: selected[sourceField], ['low_bound']: selected })
    }
    setOpen(false)
  }

  useEffect(() => {
    checkFieldErrors(String(targetField), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const selectorTableWithFn = cloneElement(selectorTable, { selectorFn })
  if (open)
    return (
      <Box>
        <Modal
          open={open}
          aria-labelledby={`modal-${targetField as string}`}
          aria-describedby={`modal-${targetField as string}`}
        >
          <Box sx={{ ...modalStyle }}>
            <Box marginBottom="2em" marginTop="1em">
              {selectorTableWithFn}
            </Box>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </Box>
        </Modal>
      </Box>
    )
  const editingComponent = (
    <TextField
      id={`${String(targetField)}-tableselection`}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error ?? ''}
      value={editData[targetField as keyof EditDataType<ParentType>] ?? undefined}
      onClick={() => setOpen(true)}
      disabled={disabled}
      sx={{ backgroundColor: disabled ? 'grey' : '' }}
      inputProps={{ readOnly: true }}
    />
  )
  return <DataValue<ParentType> field={targetField as keyof EditDataType<ParentType>} EditElement={editingComponent} />
}

export const BasisForAgeSelection = <T extends object, ParentType extends object>({
  targetField,
  sourceField,
  lowBoundField,
  upBoundField,
  fraction,
  selectorTable,
  disabled,
}: {
  targetField: keyof ParentType
  sourceField: keyof T
  selectorTable: ReactElement
  lowBoundField: keyof T
  upBoundField: keyof T
  fraction: string | null | undefined
  disabled?: boolean
}) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<ParentType>()
  const errorObject = validator(editData, targetField as keyof EditDataType<ParentType>)
  const { error } = errorObject
  const [open, setOpen] = useState(false)
  const selectorFn = (selected: T) => {
    if (targetField === 'bfa_min') {
      setEditData({
        ...editData,
        min_age: calculateLocalityMinAge(
          Number(selected[upBoundField]),
          Number(selected[lowBoundField]),
          String(fraction)
        ),
        [targetField]: selected[sourceField],
      })
    } else if (targetField === 'bfa_max') {
      setEditData({
        ...editData,
        max_age: calculateLocalityMaxAge(
          Number(selected[upBoundField]),
          Number(selected[lowBoundField]),
          String(fraction)
        ),
        [targetField]: selected[sourceField],
      })
    } else {
      setEditData({ ...editData, [targetField]: selected[sourceField] })
    }
    setOpen(false)
  }

  useEffect(() => {
    checkFieldErrors(String(targetField), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const selectorTableWithFn = cloneElement(selectorTable, { selectorFn })
  if (open)
    return (
      <Box>
        <Modal
          open={open}
          aria-labelledby={`modal-${targetField as string}`}
          aria-describedby={`modal-${targetField as string}`}
        >
          <Box sx={{ ...modalStyle }}>
            <Box marginBottom="2em" marginTop="1em">
              {selectorTableWithFn}
            </Box>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </Box>
        </Modal>
      </Box>
    )
  const editingComponent = (
    <TextField
      id={`${String(targetField)}-tableselection`}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error ?? ''}
      value={editData[targetField as keyof EditDataType<ParentType>]}
      onClick={() => setOpen(true)}
      disabled={disabled}
      sx={{ backgroundColor: disabled ? 'grey' : '' }}
      inputProps={{ readOnly: true }}
    />
  )
  return <DataValue<ParentType> field={targetField as keyof EditDataType<ParentType>} EditElement={editingComponent} />
}

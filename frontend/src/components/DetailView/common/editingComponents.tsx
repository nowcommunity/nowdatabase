import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
  Radio,
  Box,
  Modal,
  Button,
  IconButton,
  Autocomplete,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { cloneElement, ChangeEvent, ReactNode, useState, ReactElement, useEffect } from 'react'
import { RegisterOptions, FieldValues, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useDetailContext } from '../Context/DetailContext'
import { DataValue } from './tabLayoutHelpers'
import { modalStyle } from './misc'
import { EditDataType, TimeUnitDetailsType, LocalityDetailsType, TimeUnit, TimeBoundDetailsType } from '@/shared/types'
import { calculateLocalityMinAge, calculateLocalityMaxAge } from '@/util/ageCalculator'
import { checkFieldErrors } from './checkFieldErrors'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'

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
  label,
}: {
  options: Array<DropdownOption | string>
  name: string
  field: keyof EditDataType<T>
  disabled?: boolean
  label?: string
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
        renderInput={params => <TextField {...params} label={label ?? 'Choose a country'} error={!!error} />}
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

export const EditableTextField = <T extends object>(props: EditableTextFieldProps<T>) => {
  const { field, disabled = false, big = false, readonly = false, handleSetEditData } = props
  const type = props.type ?? 'text'
  const trim = type === 'text' ? (props as EditableTextFieldTextProps<T>).trim ?? false : false
  const round = type === 'number' ? (props as EditableTextFieldNumberProps<T>).round : undefined
  const integerOnly = type === 'number' ? (props as EditableTextFieldNumberProps<T>).integerOnly ?? false : false
  const min = type === 'number' ? (props as EditableTextFieldNumberProps<T>).min : undefined
  const { setEditData, editData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<T>()
  const errorObject = validator(editData, field)
  const { error } = errorObject

  const [numberInputValue, setNumberInputValue] = useState('')

  const updateFieldErrors = (nextEditData: EditDataType<T>) => {
    const nextErrorObject = validator(nextEditData, field)
    checkFieldErrors(String(field), nextErrorObject, fieldsWithErrors, setFieldsWithErrors)
  }

  useEffect(() => {
    if (type !== 'number') return
    const raw = editData[field]
    if (raw === null || raw === undefined || raw === '') {
      setNumberInputValue('')
      return
    }
    setNumberInputValue(String(raw))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData[field], type])

  useEffect(() => {
    checkFieldErrors(String(field), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject.error, errorObject.name])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event?.currentTarget?.value
    if (type === 'number') {
      const setNumberValue = handleSetEditData as EditableTextFieldNumberProps<T>['handleSetEditData']
      const allowNegative = min === undefined || min < 0
      if (value === '') {
        setNumberInputValue('')
        if (setNumberValue) {
          setNumberValue('')
        } else {
          const nextEditData = { ...editData, [field]: '' }
          setEditData(nextEditData)
          updateFieldErrors(nextEditData)
        }
        return
      }

      if (integerOnly) {
        if (!isAllowedIntegerInputValue(value, allowNegative)) return
      } else {
        if (!isAllowedNumberInputValue(value)) return
      }
      setNumberInputValue(value)

      const asNumber = Number(value)
      if (
        (integerOnly ? isPartialIntegerInputValue(value, allowNegative) : isPartialNumberInputValue(value)) ||
        Number.isNaN(asNumber)
      )
        return

      if (setNumberValue) {
        setNumberValue(asNumber)
      } else {
        const nextEditData = { ...editData, [field]: asNumber }
        setEditData(nextEditData)
        updateFieldErrors(nextEditData)
      }
      return
    }

    if (handleSetEditData) {
      ;(handleSetEditData as (value: string) => void)(value)
      return
    }

    if (type === 'date') {
      // For date fields, ensure the value is stored as a string in the format 'YYYY-MM-DD'
      const nextEditData = { ...editData, [field]: value }
      setEditData(nextEditData)
      updateFieldErrors(nextEditData)
    } else if (type === 'text' || value === '') {
      const nextEditData = { ...editData, [field]: value }
      setEditData(nextEditData)
      updateFieldErrors(nextEditData)
    } else {
      const nextEditData = { ...editData, [field]: parseFloat(value) }
      setEditData(nextEditData)
      updateFieldErrors(nextEditData)
    }
  }

  // if trim is set to true, this is called whenever the component loses focus
  const trimValue = () => {
    setEditData({ ...editData, [field]: (editData[field] as string).trim() })
  }

  const handleNumberBlur = () => {
    const value = numberInputValue
    const setNumberValue = handleSetEditData as EditableTextFieldNumberProps<T>['handleSetEditData']
    if (value === '') return
    const allowNegative = min === undefined || min < 0
    if (integerOnly ? isPartialIntegerInputValue(value, allowNegative) : isPartialNumberInputValue(value)) {
      setNumberInputValue('')
      if (setNumberValue) setNumberValue('')
      else setEditData({ ...editData, [field]: '' })
      return
    }
    const asNumber = Number(value)
    if (Number.isNaN(asNumber)) return
    setNumberInputValue(String(asNumber))
  }

  const editingComponent = (
    <TextField
      sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
      onChange={handleChange}
      onKeyDown={event => {
        if (type !== 'number') return
        if (event.key === 'e' || event.key === 'E' || event.key === '+') event.preventDefault()
        if (integerOnly && event.key === '.') event.preventDefault()
      }}
      id={`${String(field)}-textfield`}
      value={type === 'number' ? numberInputValue : editData[field] ?? ''}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error ?? ''}
      type={type}
      multiline={big}
      disabled={disabled}
      onBlur={() => {
        if (type === 'number') handleNumberBlur()
        if (trim) trimValue()
      }}
      InputProps={readonly ? { readOnly: true } : { readOnly: false }}
    />
  )

  return <DataValue<T> field={field} EditElement={editingComponent} round={round} />
}

const isAllowedNumberInputValue = (value: string) => /^-?\d*(\.\d*)?$/.test(value) || isPartialNumberInputValue(value)

const isPartialNumberInputValue = (value: string) => value === '-' || value === '.' || value === '-.'

const isAllowedIntegerInputValue = (value: string, allowNegative: boolean) =>
  (allowNegative ? /^-?\d*$/.test(value) : /^\d*$/.test(value)) || isPartialIntegerInputValue(value, allowNegative)

const isPartialIntegerInputValue = (value: string, allowNegative: boolean) => allowNegative && value === '-'

type EditableTextFieldCommonProps<T extends object> = {
  field: keyof EditDataType<T>
  big?: boolean
  disabled?: boolean
  readonly?: boolean
}

type EditableTextFieldTextProps<T extends object> = EditableTextFieldCommonProps<T> & {
  type?: 'text'
  trim?: boolean
  handleSetEditData?: (value: string) => void
}

type EditableTextFieldNumberProps<T extends object> = EditableTextFieldCommonProps<T> & {
  type: 'number'
  integerOnly?: boolean
  min?: number
  max?: number
  round?: number
  handleSetEditData?: (value: number | '') => void
}

type EditableTextFieldDateProps<T extends object> = EditableTextFieldCommonProps<T> & {
  type: 'date'
  handleSetEditData?: (value: string) => void
}

export type EditableTextFieldProps<T extends object> =
  | EditableTextFieldTextProps<T>
  | EditableTextFieldNumberProps<T>
  | EditableTextFieldDateProps<T>

export const FieldWithTableSelection = <T extends object, ParentType extends object>({
  targetField,
  sourceField,
  selectorTable,
  disabled,
  displayValue,
  getDisplayValue,
}: {
  targetField: keyof ParentType
  sourceField: keyof T
  selectorTable: ReactElement
  disabled?: boolean
  displayValue?: string | number | null
  getDisplayValue?: (selected: T) => string | number | null | undefined
}) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } = useDetailContext<ParentType>()
  const errorObject = validator(editData, targetField as keyof EditDataType<ParentType>)
  const { error } = errorObject
  const [open, setOpen] = useState(false)
  const [selectedDisplayValue, setSelectedDisplayValue] = useState<string | number | null | undefined>(displayValue)

  useEffect(() => {
    setSelectedDisplayValue(displayValue)
  }, [displayValue])

  const selectorFn = (selected: T) => {
    setEditData({ ...editData, [targetField]: selected[sourceField] })
    const newDisplayValue = getDisplayValue ? getDisplayValue(selected) : selected[sourceField]
    setSelectedDisplayValue(
      typeof newDisplayValue === 'string' || typeof newDisplayValue === 'number' ? newDisplayValue : null
    )
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
      value={selectedDisplayValue ?? editData[targetField as keyof EditDataType<ParentType>] ?? undefined}
      onClick={() => setOpen(true)}
      disabled={disabled}
      sx={{ backgroundColor: disabled ? 'grey' : '' }}
      inputProps={{ readOnly: true }}
    />
  )

  const fallbackDisplayValue =
    typeof displayValue === 'string' || typeof displayValue === 'number' ? displayValue : null

  const effectiveDisplayValue = selectedDisplayValue ?? fallbackDisplayValue

  return (
    <DataValue<ParentType>
      field={targetField as keyof EditDataType<ParentType>}
      EditElement={editingComponent}
      displayValue={effectiveDisplayValue}
    />
  )
}

export const TimeBoundSelection = ({
  targetField,
  disabled,
}: {
  targetField: keyof TimeUnitDetailsType
  disabled?: boolean
}) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<TimeUnitDetailsType>()
  const errorObject = validator(
    editData,
    (targetField === 'up_bnd' ? 'up_bound' : 'low_bound') as keyof EditDataType<TimeUnitDetailsType>
  )
  const [open, setOpen] = useState(false)

  const selectorFn = (selected: TimeBoundDetailsType) => {
    if (targetField === 'up_bnd') {
      setEditData({ ...editData, [targetField]: selected['bid'], ['up_bound']: selected })
    } else if (targetField === 'low_bnd') {
      setEditData({ ...editData, [targetField]: selected['bid'], ['low_bound']: selected })
    }
    setOpen(false)
  }

  useEffect(() => {
    checkFieldErrors(String(targetField), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const selectorTableWithFn = cloneElement(<TimeBoundTable showBid />, { selectorFn })
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
  return (
    <Button
      id={`${String(targetField)}-tableselection`}
      onClick={() => setOpen(true)}
      variant="contained"
      disabled={disabled}
    >
      Select Time Bound
    </Button>
  )
}

export const BasisForAgeSelection = ({
  targetField,
  fraction,
  timeUnit,
  selectorTable,
  disabled,
  displayValue,
}: {
  targetField: keyof LocalityDetailsType
  fraction: string | null | undefined
  timeUnit?: TimeUnitDetailsType
  selectorTable: ReactElement
  disabled?: boolean
  displayValue?: string | null
}) => {
  const { editData, setEditData, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<LocalityDetailsType>()
  const errorObject = validator(editData, targetField)
  const { error } = errorObject
  const [open, setOpen] = useState(false)
  const [currentBasisForAge, setCurrentBasisForAge] = useState<TimeUnit>()
  const normalizedFraction = fraction || null

  if (timeUnit && !currentBasisForAge) {
    // this converts the time unit from TimeUnitDetailsType to TimeUnit, so it can be used properly
    const fixedTimeUnit: TimeUnit = {
      low_bound: timeUnit.low_bound.age!,
      up_bound: timeUnit.up_bound.age!,
      seq_name: timeUnit.sequence,
      tu_name: timeUnit.tu_name,
      tu_display_name: timeUnit.tu_display_name,
      rank: timeUnit.rank ?? '',
    }
    setCurrentBasisForAge(fixedTimeUnit)
  }

  const selectorFn = (selected: TimeUnit) => {
    setCurrentBasisForAge(selected)
    if (targetField === 'bfa_min') {
      setEditData({
        ...editData,
        min_age: calculateLocalityMinAge(
          Number(selected['up_bound']),
          Number(selected['low_bound']),
          normalizedFraction
        ),
        [targetField]: selected['tu_name'],
      })
    } else if (targetField === 'bfa_max') {
      setEditData({
        ...editData,
        max_age: calculateLocalityMaxAge(
          Number(selected['up_bound']),
          Number(selected['low_bound']),
          normalizedFraction
        ),
        [targetField]: selected['tu_name'],
      })
    } else {
      setEditData({ ...editData, [targetField]: selected['tu_name'] })
    }
    setOpen(false)
  }

  const handleClear = () => {
    setCurrentBasisForAge(undefined)

    if (targetField === 'bfa_min') {
      setEditData({
        ...editData,
        bfa_min: '',
        min_age: undefined,
        frac_min: '',
      })
      return
    }

    if (targetField === 'bfa_max') {
      setEditData({
        ...editData,
        bfa_max: '',
        max_age: undefined,
        frac_max: '',
      })
      return
    }

    setEditData({ ...editData, [targetField]: '' })
  }

  useEffect(() => {
    if (targetField === 'bfa_min' && currentBasisForAge) {
      setEditData({
        ...editData,
        min_age: calculateLocalityMinAge(
          Number(currentBasisForAge['up_bound']),
          Number(currentBasisForAge['low_bound']),
          normalizedFraction
        ),
      })
    } else if (targetField === 'bfa_max' && currentBasisForAge) {
      setEditData({
        ...editData,
        max_age: calculateLocalityMaxAge(
          Number(currentBasisForAge['up_bound']),
          Number(currentBasisForAge['low_bound']),
          normalizedFraction
        ),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fraction, normalizedFraction])

  useEffect(() => {
    checkFieldErrors(String(targetField), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  const selectorTableWithFn = cloneElement(selectorTable, { selectorFn })
  if (open)
    return (
      <Box>
        <Modal open={open} aria-labelledby={`modal-${targetField}`} aria-describedby={`modal-${targetField}`}>
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
      value={editData[targetField]}
      onClick={() => setOpen(true)}
      disabled={disabled}
      sx={{ backgroundColor: disabled ? 'grey' : '' }}
      inputProps={{ 'aria-label': String(targetField) }}
      InputProps={{
        readOnly: true,
        endAdornment:
          !disabled && editData[targetField] ? (
            <InputAdornment position="end">
              <IconButton
                aria-label={`Clear ${String(targetField)}`}
                size="small"
                onClick={event => {
                  event.preventDefault()
                  event.stopPropagation()
                  handleClear()
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
      }}
    />
  )
  return (
    <DataValue<LocalityDetailsType> field={targetField} EditElement={editingComponent} displayValue={displayValue} />
  )
}

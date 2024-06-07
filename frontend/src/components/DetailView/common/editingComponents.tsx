import {
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  MenuItem,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Modal,
  Button,
} from '@mui/material'
import { cloneElement, ChangeEvent, ReactNode, useState, ReactElement } from 'react'
import { RegisterOptions, FieldValues, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useDetailContext } from '../Context/DetailContext'
import { DataValue } from './tabLayoutHelpers'
import { modalStyle } from './misc'
import { EditDataType } from '@/backendTypes'

const fieldWidth = '14em'

export type DropdownOptionValue = string | number
export type DropdownOption = { value: DropdownOptionValue; display: string }

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
  const { setEditData, editData } = useDetailContext<T>()
  const editingComponent = (
    <FormControl size="small">
      <InputLabel id={`${name}-multiselect-label`}>{name}</InputLabel>
      <Select
        labelId={`${name}-multiselect-label`}
        label={name}
        id={`${name}-multiselect`}
        value={(editData[field] || '') as string}
        onChange={(event: SelectChangeEvent) => setEditData({ ...editData, [field]: event.target.value })}
        sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
        size="small"
        disabled={disabled}
      >
        {options.map(item => (
          <MenuItem key={getValue(item)} value={getValue(item)}>
            {getDisplay(item)}
          </MenuItem>
        ))}
      </Select>
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
  register: (name: T, options?: RegisterOptions<FieldValues, T> | undefined) => UseFormRegisterReturn<T>
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
const getDisplay = (item: DropdownOption | DropdownOptionValue) => (typeof item !== 'object' ? item : item.display)

/*
  Supports string and number values, and booleans as strings. This means that
  strings 'true' or 'false' will be handled by the app (and server) as boolean-type.
  This also means that the options cannot be 'true' or 'false' if you want
  to actually write those as strings to database. If that is required, this
  needs to be changed.
*/
export const RadioSelector = <T extends object>({
  options,
  name,
  field,
}: {
  options: Array<DropdownOption | DropdownOptionValue>
  name: string
  field: keyof EditDataType<T>
}) => {
  const { setEditData, editData } = useDetailContext<T>()
  const editingComponent = (
    <FormControl>
      <RadioGroup
        aria-labelledby={`${name}-radio-selection`}
        name={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = event?.currentTarget?.value
          const setValue = (val: string | number | boolean) => setEditData({ ...editData, [field]: val })
          if (value && typeof getValue(options[0]) === 'number') {
            setValue(parseInt(value))
          } else if (value === 'true' || value === 'false') {
            setValue(value === 'true')
          } else {
            setEditData({ ...editData, [field]: value })
          }
        }}
        value={editData[field]}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        {options.map(option => (
          <FormControlLabel
            key={getValue(option)}
            value={getValue(option)}
            control={<Radio />}
            label={getDisplay(option)}
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
  const option = options.find(option => getValue(option) == data[field as keyof T]) // TODO intentional use of == but is it necessary anymore
  const displayValue = option ? getDisplay(option) : null
  return <DataValue<T> field={field} EditElement={editingComponent} displayValue={displayValue} />
}

export const EditableTextField = <T extends object>({
  field,
  type = 'text',
  big = false,
  disabled = false,
}: {
  field: keyof EditDataType<T>
  type?: React.HTMLInputTypeAttribute
  big?: boolean
  disabled?: boolean
}) => {
  const { setEditData, editData, validator } = useDetailContext<T>()
  const { error } = validator(editData, field)
  const editingComponent = (
    <TextField
      sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        const value = event?.currentTarget?.value
        if (type === 'text' || value === '') {
          setEditData({ ...editData, [field]: value })
          return
        }
        setEditData({ ...editData, [field]: parseFloat(value) })
      }}
      value={editData[field] ?? ''}
      variant="outlined"
      size="small"
      error={!!error}
      helperText={error ?? ''}
      type={type}
      multiline={big}
      disabled={disabled}
    />
  )

  return <DataValue<T> field={field} EditElement={editingComponent} />
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
  const { editData, setEditData } = useDetailContext<ParentType>()
  const [open, setOpen] = useState(false)
  const selectorFn = (selected: T) => {
    setEditData({ ...editData, [targetField]: selected[sourceField] })
    setOpen(false)
  }

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
      variant="outlined"
      size="small"
      value={editData[targetField]}
      onClick={() => setOpen(true)}
      disabled={disabled}
      sx={{ backgroundColor: disabled ? 'grey' : '' }}
      inputProps={{ readOnly: true }}
    />
  )
  return <DataValue<ParentType> field={targetField} EditElement={editingComponent} />
}

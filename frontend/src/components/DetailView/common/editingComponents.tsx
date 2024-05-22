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
} from '@mui/material'
import { ChangeEvent, ReactNode } from 'react'
import { RegisterOptions, FieldValues, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'
import { useDetailContext } from '../hooks'
import { DataValue } from './tabLayoutHelpers'

export type DropdownOption = { value: string; display: string }

export const DropdownSelector = <T extends object>({
  options,
  name,
  field,
}: {
  options: Array<DropdownOption | string>
  name: string
  field: keyof T
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
        sx={{ width: '12em' }}
        size="small"
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
}: {
  register: (name: T, options?: RegisterOptions<FieldValues, T> | undefined) => UseFormRegisterReturn<T>
  errors: FieldErrors<FieldValues>
  fieldName: T
  label: string
  required: boolean
}) => (
  <TextField {...register(fieldName, { required: required })} error={!!errors[fieldName]} {...{ label, required }} />
)

const getValue = (item: DropdownOption | string) => (typeof item === 'string' ? item : item.value)
const getDisplay = (item: DropdownOption | string) => (typeof item === 'string' ? item : item.display)

export const RadioSelector = <T extends object>({
  options,
  name,
  field,
}: {
  options: Array<DropdownOption | string>
  name: string
  field: keyof T
}) => {
  const { setEditData, editData } = useDetailContext<T>()
  const editingComponent = (
    <FormControl>
      <RadioGroup
        aria-labelledby={`${name}-radio-selection`}
        name={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setEditData({ ...editData, [field]: event?.currentTarget?.value })
        }
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
  options: Array<DropdownOption | string>
  field: keyof T
  editingComponent: ReactNode
}) => {
  const { data } = useDetailContext<T>()
  const option = options.find(option => getValue(option) === data[field])
  const displayValue = option ? getDisplay(option) : null
  return <DataValue<T> field={field} EditElement={editingComponent} displayValue={displayValue} />
}

export const EditableTextField = <T extends object>({
  field,
  type,
}: {
  field: keyof T
  type?: React.HTMLInputTypeAttribute
}) => {
  const { setEditData, editData, validator } = useDetailContext<T>()
  const error = validator(editData, field)
  const editingComponent = (
    <TextField
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setEditData({ ...editData, [field]: event?.currentTarget?.value })
      }
      value={editData[field] ?? ''}
      variant="outlined"
      size="small"
      error={error !== null}
      helperText={error ?? ''}
      type={type ?? 'text'}
    />
  )

  return <DataValue<T> field={field} EditElement={editingComponent} />
}

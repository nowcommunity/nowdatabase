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

const fieldWidth = '14em'

export type DropdownOption = { value: string; display: string }

export const DropdownSelector = <T extends object>({
  options,
  name,
  field,
  disabled,
}: {
  options: Array<DropdownOption | string>
  name: string
  field: keyof T
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
  const option = options.find(option => getValue(option) == data[field]) // intentional use of ==
  const displayValue = option ? getDisplay(option) : null
  return <DataValue<T> field={field} EditElement={editingComponent} displayValue={displayValue} />
}

export const EditableTextField = <T extends object>({
  field,
  type,
  big = false,
  disabled = false,
}: {
  field: keyof T
  type?: React.HTMLInputTypeAttribute
  big?: boolean
  disabled?: boolean
}) => {
  const { setEditData, editData, validator } = useDetailContext<T>()
  const { error } = validator(editData, field)
  const editingComponent = (
    <TextField
      sx={{ width: fieldWidth, backgroundColor: disabled ? 'grey' : '' }}
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        setEditData({ ...editData, [field]: event?.currentTarget?.value })
      }
      value={editData[field] ?? ''}
      variant="outlined"
      size="small"
      error={error !== null}
      helperText={error ?? ''}
      type={type ?? 'text'}
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
    />
  )
  return <DataValue<ParentType> field={targetField} EditElement={editingComponent} />
}

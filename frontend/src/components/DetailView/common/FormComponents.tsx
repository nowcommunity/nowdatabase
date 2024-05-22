import {
  Card,
  Typography,
  Box,
  Grid,
  Divider,
  Modal,
  Button,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import { ReactNode, useState, ChangeEvent } from 'react'
import { useDetailContext } from '../hooks'
import { RegisterOptions, FieldValues, UseFormRegisterReturn, FieldErrors } from 'react-hook-form'

export const ArrayToTable = ({ array, half }: { array: Array<Array<ReactNode>>; half?: boolean }) => {
  const maxRowLength = Math.max(...array.map(row => row.length))
  const width = half ? 12 / maxRowLength : Math.min(12 / maxRowLength, 4)
  const getCellWidth = (row: number, index: number) => {
    if (index === 1 && array[row].length === 2) return 12 - width
    return width
  }
  return (
    <Grid container direction="row">
      {array.map((row, rowIndex) => (
        <Grid key={rowIndex} container direction="row" minHeight="2.5em">
          {row.map((item, index) => (
            <Grid
              key={index}
              item
              xs={getCellWidth(rowIndex, index)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'left',
                height: '100%',
              }}
              padding="5px"
            >
              {typeof item === 'string' ? <b>{item}</b> : item}
            </Grid>
          ))}
        </Grid>
      ))}
    </Grid>
  )
}

export const ArrayFrame = ({
  array,
  title,
  half,
}: {
  array: Array<Array<ReactNode>>
  title: string
  half?: boolean
}) => (
  <Grouped title={title}>
    <ArrayToTable half={half} array={array} />
  </Grouped>
)

export const HalfFrames = ({ children }: { children: [ReactNode, ReactNode] }) => {
  const ArrayFrameStyle = {
    flexGrow: 1,
    flexBasis: '50%', // Each item should start at 50% of the parent's width
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}>
      {children.map((child, index) => (
        <div key={index} style={ArrayFrameStyle}>
          {child}
        </div>
      ))}
    </div>
  )
}

export const Grouped = ({ title, children }: { title?: string; children: ReactNode }) => {
  const styles = {
    padding: '10px',
    paddingBottom: '15px',
    backgroundColor: 'white',
    margin: '0em',
  }

  return (
    <Card style={styles}>
      {title && (
        <>
          <Typography sx={{ fontSize: 16 }} color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Divider />
        </>
      )}
      <Box marginTop="15px">{children}</Box>
    </Card>
  )
}

export const DataValue = <T extends object>({
  field,
  EditElement,
  displayValue,
}: {
  field: keyof T
  EditElement: ReactNode
  displayValue?: ReactNode | null
}) => {
  const { data, mode } = useDetailContext<T>()
  if (mode === 'edit') {
    return EditElement
  }
  return displayValue ?? data[field]
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
  const { data, setEditData, editData } = useDetailContext<T>()
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

  const option = options.find(option => getValue(option) === data[field])
  const displayValue = option ? getDisplay(option) : null
  return <DataValue<T> field={field} EditElement={editingComponent} displayValue={displayValue} />
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
  const { data, setEditData, editData } = useDetailContext<T>()
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

  const option = options.find(option => getValue(option) === data[field])
  const displayValue = option ? getDisplay(option) : null
  return <DataValue<T> field={field} EditElement={editingComponent} displayValue={displayValue} />
}

/* 
  buttonText = Text for the button that opens modal
  children = Content of modal
  onSave = If defined, the modal will have a separate saving button.
           onSave is a function, that will return true or false, depending
           on if we want to proceed with closing the form (return false to cancel closing)
*/
export const EditingModal = ({
  buttonText,
  children,
  onSave,
}: {
  buttonText: string
  children: ReactNode | ReactNode[]
  onSave?: () => Promise<boolean>
}) => {
  const [open, setOpen] = useState(false)
  const closeWithSave = async () => {
    if (!onSave) return
    const close = await onSave()
    if (!close) return
    setOpen(false)
  }

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1200,
    maxHeight: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    overflow: 'auto',
    boxShadow: 24,
    p: 4,
  }

  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant="contained" sx={{ marginBottom: '1em' }}>
        {buttonText}
      </Button>
      <Modal open={open} aria-labelledby={`modal-${buttonText}`} aria-describedby={`modal-${buttonText}`}>
        <Box sx={{ ...modalStyle }}>
          <Box marginBottom="2em" marginTop="1em">
            {' '}
            {children}
          </Box>
          {onSave && <Button onClick={() => void closeWithSave()}>Save</Button>}
          <Button onClick={() => setOpen(false)}>{onSave ? 'Cancel' : 'Close'}</Button>
        </Box>
      </Modal>
    </Box>
  )
}

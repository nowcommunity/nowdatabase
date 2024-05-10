import {
  Card,
  Typography,
  Box,
  Grid,
  Divider,
  Modal,
  Button,
  CircularProgress,
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
import { ReactNode, useState } from 'react'
import { useDetailContext } from '../hooks'
import { type MRT_ColumnDef, type MRT_RowData, MaterialReactTable, MRT_Row } from 'material-react-table'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

export const ArrayToTable = ({ array }: { array: Array<Array<ReactNode>> }) => (
  <Grid container direction="row">
    {array.map((row, index) => (
      <Grid key={index} container direction="row" height="2.5em">
        {row.map((item, index) => (
          <Grid key={index} item xs={index === 0 ? 2 : Math.min(12 / row.length, 4)} padding="5px">
            {typeof item === 'string' ? <b>{item}</b> : item}
          </Grid>
        ))}
      </Grid>
    ))}
  </Grid>
)

export const ArrayFrame = ({ array, title }: { array: Array<Array<ReactNode>>; title: string }) => (
  <Grouped title={title}>
    <ArrayToTable array={array} />
  </Grouped>
)

export const Grouped = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <Card style={{ margin: '1em', padding: '10px', paddingBottom: '15px', backgroundColor: 'white' }}>
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

export const DataValue = <T extends object>({ field, EditElement }: { field: keyof T; EditElement: ReactNode }) => {
  const { data, mode } = useDetailContext<T>()
  if (mode === 'edit') {
    return EditElement
  }
  return data[field]
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  overflow: 'auto',
  boxShadow: 24,
  p: 4,
}

export const EditableTextField = <T extends object>({ field }: { field: keyof T }) => {
  const { setEditData, editData } = useDetailContext<T>()

  const editingComponent = (
    <TextField
      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
        setEditData({ ...editData, [field]: event?.currentTarget?.value })
      }
      value={editData[field] ?? ''}
      variant="outlined"
      size="small"
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
  const { setEditData, editData } = useDetailContext<T>()
  const getValue = (item: DropdownOption | string) => (typeof item === 'string' ? item : item.value)
  const getDisplay = (item: DropdownOption | string) => (typeof item === 'string' ? item : item.display)
  const editingComponent = (
    <FormControl>
      <InputLabel id={`${name}-multiselect-label`}>{name}</InputLabel>
      <Select
        labelId={`${name}-multiselect-label`}
        label={name}
        id={`${name}-multiselect`}
        value={editData[field] as string}
        onChange={(event: SelectChangeEvent) => setEditData({ ...editData, [field]: event.target.value })}
        sx={{ width: '10em' }}
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

  return <DataValue<T> field={field} EditElement={editingComponent} />
}

export const RadioSelector = <T extends object>({
  options,
  name,
  field,
}: {
  options: string[]
  name: string
  field: keyof T
}) => {
  const { setEditData, editData } = useDetailContext<T>()
  const editingComponent = (
    <FormControl>
      <RadioGroup
        aria-labelledby={`${name}-radio-selection`}
        name={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setEditData({ ...editData, [field]: event?.currentTarget?.value })
        }
        value={editData[field]}
        sx={{ display: 'flex', flexDirection: 'row' }}
      >
        {options.map(option => (
          <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
        ))}
      </RadioGroup>
    </FormControl>
  )

  return <DataValue<T> field={field} EditElement={editingComponent} />
}

/* 
  buttonText = Text for the button that opens modal
  children = Content of modal
  onSave = If defined, the modal will have a separate saving button.
           onSave is a function, that will return true or false, depending
           on if we want to proceed with closing the form (return false to cancel closing)
*/
export const EditingModal = ({ buttonText, children, onSave }: { buttonText: string; children: ReactNode | ReactNode[]; onSave?: () => Promise<boolean> }) => {
  const [open, setOpen] = useState(false)

  const closeWithSave = async () => {
    if (!onSave) return
    const close = await onSave()
    if (!close) return
    setOpen(false)
  }

  return (
    <Box>
      <Button onClick={() => setOpen(true)} variant="contained" sx={{ marginBottom: "1em"}}>{buttonText}</Button>
      <Modal open={open} aria-labelledby={`modal-${buttonText}`} aria-describedby={`modal-${buttonText}`}>
        <Box sx={{ ...modalStyle }}>
          <Box marginBottom="2em"> {children}</Box>
          {onSave && <Button onClick={closeWithSave}>Save</Button>}
          <Button onClick={() => setOpen(false)}>{onSave ? "Cancel" : "Close"}</Button>
        </Box>
      </Modal>
    </Box>
  )
}

export type RowState = 'new' | 'removed' | 'cancelled' | 'clean'

const getNewState = (state: RowState) => {
  if (!state || state === 'clean') return 'removed'
  if (state === 'new') return 'cancelled'
  return 'clean'
}

export const EditableTable = <T extends MRT_RowData, ParentType extends MRT_RowData>({
  data,
  columns,
  editable,
  field,
}: {
  data: Array<T> | null
  columns: MRT_ColumnDef<T>[]
  editable?: boolean
  field: keyof ParentType
}) => {
  if (!data) return <CircularProgress />
  const { editData, setEditData, mode } = useDetailContext<ParentType>()
  const actionRow = ({ row, staticRowIndex }: { row: MRT_Row<T>; staticRowIndex?: number | undefined }) => {
    const state = row.original.rowState

    // TODO: Using static index - need to use some id, probably sorting breaks this
    const rowClicked = (index: number | undefined) => {
      if (index === undefined) return
      const museums = [...editData[field]]
      museums[index].rowState = getNewState(state)
      setEditData({ ...editData, museums })
    }

    const getIcon = () => {
      if (['removed', 'cancelled'].includes(state)) return <AddCircleOutlineIcon />
      return <RemoveCircleOutlineIcon />
    }

    return (
      <Box>
        <Button onClick={() => rowClicked(staticRowIndex)}>{getIcon()}</Button>
      </Box>
    )
  }

  const actionRowProps = editable && mode === 'edit' ? { enableRowActions: true, renderRowActions: actionRow } : {}

  const rowStateToColor = (state: RowState | undefined) => {
    if (state === 'new') return 'lightgreen'
    else if (state === 'removed' || state === 'cancelled') return '#FFCCCB'
    return null
  }

  return (
    <MaterialReactTable
      {...actionRowProps}
      columns={columns}
      data={data}
      enableTopToolbar={false}
      enableColumnActions={false}
      enablePagination={false}
      muiTableBodyRowProps={({ row }: { row: MRT_Row<T> }) => ({
        sx: { backgroundColor: rowStateToColor(row.original.rowState) },
      })}
    />
  )
}

import { EditDataType, RowState } from '@/backendTypes'
import { CircularProgress, Box, Button } from '@mui/material'
import { type MRT_ColumnDef, type MRT_RowData, MaterialReactTable, MRT_Row } from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const getNewState = (state: RowState): RowState => {
  if (!state || state === 'clean') return 'removed'
  if (state === 'new') return 'cancelled'
  if (state === 'cancelled') return 'new'
  return 'clean'
}

export const EditableTable = <T extends MRT_RowData & { rowState?: RowState }, ParentType extends MRT_RowData>({
  tableData,
  editTableData,
  columns,
  field,
}: {
  tableData?: Array<T> | null
  editTableData?: Array<EditDataType<T>> | null
  columns: MRT_ColumnDef<T>[]
  field: keyof EditDataType<ParentType>
}) => {
  const { editData, setEditData, mode, data } = useDetailContext<ParentType>()
  if (tableData === null || editTableData === null) return <CircularProgress />

  const actionRow = ({ row, staticRowIndex }: { row: MRT_Row<T>; staticRowIndex?: number | undefined }) => {
    const state = row.original.rowState ?? 'clean'

    // TODO: Using static index - need to use some id, sorting breaks this
    const rowClicked = (index: number | undefined) => {
      if (index === undefined) return
      const items = [...editData[field]]
      if (items[index].rowState === 'new') {
        items.splice(index, 1)
        setEditData({ ...editData, [field]: items })
        return
      }
      items[index].rowState = getNewState(state)
      setEditData({ ...editData, items })
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

  const actionRowProps = mode.read ? {} : { enableRowActions: true, renderRowActions: actionRow }

  const rowStateToColor = (state: RowState | undefined) => {
    if (mode.read) return null
    if (state === 'new') return 'lightgreen'
    else if (state === 'removed' || state === 'cancelled') return '#FFCCCB'
    return null
  }

  const getData = () => {
    if (!mode.read) {
      if (!editTableData) return editData[field] as T[]
      return editTableData as T[]
    }
    if (!tableData) return data[field as keyof ParentType] as T[]
    return tableData
  }

  return (
    <MaterialReactTable
      {...actionRowProps}
      columns={columns}
      data={getData()}
      enableTopToolbar={false}
      enableColumnActions={false}
      enablePagination={false}
      state={{ density: 'compact' }}
      muiTableBodyRowProps={({ row }: { row: MRT_Row<T> }) => ({
        sx: { backgroundColor: rowStateToColor(row.original.rowState) },
      })}
    />
  )
}

import { EditDataType, RowState } from '@/shared/types'
import { CircularProgress, Box, Button } from '@mui/material'
import {
  type MRT_ColumnDef,
  type MRT_RowData,
  MaterialReactTable,
  MRT_Row,
  MRT_PaginationState,
} from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useState, useEffect } from 'react'
import { checkFieldErrors } from './checkFieldErrors'
import { ActionComponent } from '@/components/TableView/ActionComponent'

const defaultPagination: MRT_PaginationState = { pageIndex: 0, pageSize: 15 }

const getNewState = (state: RowState): RowState => {
  if (!state || state === 'clean') return 'removed'
  if (state === 'new') return 'cancelled'
  if (state === 'cancelled') return 'new'
  return 'clean'
}

export const EditableTable = <
  T extends MRT_RowData & { rowState?: RowState; index?: number },
  ParentType extends MRT_RowData,
>({
  tableData,
  editTableData,
  columns,
  field,
  visible_data, // use some filtered data instead of the actual data. Allows you to hide some rows. But be careful that the data is in the right format
  useDefinedIndex = false, // Control whether to use the defined index or static index. The index data needs to have a key named 'index'.
  useObject = false,
  idFieldName,
  url,
}: {
  tableData?: Array<T> | null
  editTableData?: Array<EditDataType<T>> | null
  columns: MRT_ColumnDef<T>[]
  field: keyof EditDataType<ParentType>
  visible_data?: Array<T>
  useDefinedIndex?: boolean
  useObject?: boolean
  idFieldName?: keyof T
  url?: string
}) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>(defaultPagination)
  const { editData, setEditData, mode, data, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<ParentType>()
  const errorObject = validator(editData, field)

  useEffect(() => {
    checkFieldErrors(String(field), errorObject, fieldsWithErrors, setFieldsWithErrors)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorObject])

  if (tableData === null || editTableData === null) return <CircularProgress />

  const actionRow = ({ row, staticRowIndex }: { row: MRT_Row<T>; staticRowIndex?: number | undefined }) => {
    const state = row.original.rowState ?? 'clean'

    // uses either 'row.original.index' or 'staticRowIndex' based on 'useDefinedIndex'
    const rowClicked = () => {
      let index = useDefinedIndex ? row.original.index : staticRowIndex
      if (index === undefined) return
      let items: Array<EditDataType<T>>
      if (useObject) {
        items = [editData[field]]
        index = 0
      } else {
        items = [...editData[field]]
      }

      if (items[index].rowState === 'new') {
        items.splice(index, 1)
        setEditData({ ...editData, [field]: useObject ? items[0] : items })
        return
      }
      items[index].rowState = getNewState(state)
      setEditData({ ...editData, [field]: useObject ? items[0] : items })
    }

    const getIcon = () => {
      if (['removed', 'cancelled'].includes(state)) return <AddCircleOutlineIcon />
      return <RemoveCircleOutlineIcon />
    }

    return (
      <Box>
        <Button onClick={rowClicked}>{getIcon()}</Button>
      </Box>
    )
  }

  const linkToDetails = ({ row }: { row: MRT_Row<T> }) => {
    if (idFieldName && url) return <ActionComponent {...{ row, idFieldName, url }} />
    return null // code shouldn't get here!
  }

  const actionRowProps = () => {
    if (mode.read && (!idFieldName || !url)) {
      return {}
    } else if (mode.read && idFieldName && url) {
      return { enableRowActions: true, renderRowActions: linkToDetails }
    } else {
      return { enableRowActions: true, renderRowActions: actionRow }
    }
  }

  const rowStateToColor = (state: RowState | undefined) => {
    if (mode.read) return null
    if (state === 'new') return 'lightgreen'
    else if (state === 'removed' || state === 'cancelled') return '#FFCCCB'
    return null
  }

  const getData = () => {
    // Ensure `visible_data` is in the correct form before using it
    if (visible_data) {
      return visible_data
    }

    if (!mode.read) {
      if (!editTableData) return editData[field] as T[]
      return editTableData as T[]
    }
    if (!tableData) return data[field as keyof ParentType] as T[]
    return tableData
  }

  return (
    <MaterialReactTable
      {...actionRowProps()}
      columns={columns}
      data={getData()}
      enableTopToolbar={false}
      enableColumnActions={false}
      enableSorting={false}
      enablePagination={getData().length > 15}
      onPaginationChange={setPagination}
      positionPagination="both"
      paginationDisplayMode="pages"
      state={{ density: 'compact', pagination }}
      muiTableBodyRowProps={({ row }: { row: MRT_Row<T> }) => ({
        sx: { backgroundColor: rowStateToColor(row.original.rowState) },
      })}
    />
  )
}

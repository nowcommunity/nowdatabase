import { EditDataType, RowState } from '@/shared/types'
import { CircularProgress, Box, Button } from '@mui/material'
import { type MRT_ColumnDef, type MRT_Row, type MRT_RowData } from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useEffect } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { usePageContext } from '@/components/Page'
import { checkFieldErrors } from './checkFieldErrors'
import { ActionComponent } from '@/components/TableView/ActionComponent'
import { DetailTabTable } from './DetailTabTable'

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
  enableAdvancedTableControls = false,
  idFieldName,
  url,
  getDetailPath,
}: {
  tableData?: Array<T> | null
  editTableData?: Array<EditDataType<T>> | null
  columns: MRT_ColumnDef<T>[]
  field: keyof EditDataType<ParentType>
  visible_data?: Array<T>
  useDefinedIndex?: boolean
  useObject?: boolean
  enableAdvancedTableControls?: boolean
  idFieldName?: keyof T
  url?: string
  getDetailPath?: (row: T) => string
}) => {
  const { editData, setEditData, mode, data, validator, fieldsWithErrors, setFieldsWithErrors } =
    useDetailContext<ParentType>()

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { previousTableUrls, setPreviousTableUrls } = usePageContext()
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

  const resolveDetailPath = (row: T) => {
    if (getDetailPath) return getDetailPath(row)
    return `/${url}/${String(row[idFieldName as keyof T] ?? '')}`
  }

  const linkToDetails = ({ row }: { row: MRT_Row<T> }) => {
    if (idFieldName && url) return <ActionComponent {...{ row, idFieldName, url, getDetailPath }} />
    return null // code shouldn't get here!
  }

  const resolveRenderRowActions = () => {
    if (mode.read && (!idFieldName || !url)) {
      return undefined
    }

    if (mode.read && idFieldName && url) {
      return linkToDetails
    }

    return actionRow
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
    <DetailTabTable<T>
      mode="edit"
      columns={columns}
      data={getData()}
      enableTopToolbar={enableAdvancedTableControls}
      enableColumnActions={enableAdvancedTableControls}
      enableSorting={enableAdvancedTableControls}
      enableRowActions={Boolean(resolveRenderRowActions())}
      renderRowActions={resolveRenderRowActions()}
      muiTableBodyRowProps={({ row }: { row: MRT_Row<T> }) => ({
        onClick: () => {
          if (mode.read && idFieldName && url && getDetailPath) {
            setPreviousTableUrls([...previousTableUrls, `${location.pathname}?tab=${searchParams.get('tab')}`])
            navigate(resolveDetailPath(row.original), {
              state: { returnTo: `${location.pathname}${location.search}` },
            })
          }
        },
        sx: {
          backgroundColor: rowStateToColor(row.original.rowState),
          cursor: mode.read && idFieldName && url && getDetailPath ? 'pointer' : undefined,
        },
      })}
    />
  )
}

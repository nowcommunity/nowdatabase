import { MRT_ColumnDef, MRT_RowData } from 'material-react-table'
import { EditingModal } from './EditingModal'
import { TableView } from '@/components/TableView/TableView'
import { useDetailContext } from '../Context/DetailContext'
import { useMemo } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { EditDataType } from '@/backendTypes'

/*
If editabletable has different type than selectingtable rows,
give an array in prop "selectedValues" that contains the string values
that already exist in editdata
*/
export const SelectingTable = <T extends MRT_RowData, ParentType extends object>({
  buttonText,
  data,
  columns,
  editingAction,
  fieldName,
  idFieldName,
  selectedValues,
  isError,
}: {
  buttonText: string
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  editingAction?: (object: T) => void
  fieldName: keyof ParentType
  idFieldName: keyof T
  selectedValues?: string[]
  isError: boolean
}) => {
  const { editData, setEditData } = useDetailContext<ParentType>()
  const selectedItems = editData[fieldName as keyof EditDataType<ParentType>] as T[]

  const defaultEditingAction = (newObject: T) => {
    if (selectedItems.find(item => item[idFieldName] === newObject[idFieldName])) return
    setEditData({ ...editData, [fieldName]: [...selectedItems, { ...newObject, rowState: 'new' }] })
  }

  const idSet = useMemo(() => {
    return new Set(selectedItems.map(item => item[idFieldName] as T))
  }, [selectedItems, idFieldName])

  const hiddenColumns = {
    id: false,
  }

  const filteredData = useMemo(() => {
    if (!data) return []
    return data.filter(row => {
      if (selectedValues) return !selectedValues.includes(row[idFieldName])
      return !idSet.has(row[idFieldName])
    })
  }, [data, idSet, idFieldName, selectedValues])

  if (isError) return <Box>Error fetching data for the selecting table.</Box>
  if (!data) return <CircularProgress />
  return (
    <EditingModal buttonText={buttonText}>
      {data ? (
        <TableView<T>
          data={filteredData}
          columns={columns}
          hiddenColumns={hiddenColumns}
          selectorFn={editingAction ?? defaultEditingAction}
          idFieldName={idFieldName}
        />
      ) : (
        <CircularProgress />
      )}
    </EditingModal>
  )
}

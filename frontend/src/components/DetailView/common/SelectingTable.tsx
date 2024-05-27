import { MRT_ColumnDef, MRT_RowData } from 'material-react-table'
import { EditingModal } from './EditingModal'
import { TableView } from '@/components/TableView/TableView'
import { useDetailContext } from '../hooks'
import { useMemo } from 'react'
import { CircularProgress } from '@mui/material'

/*
If editabletable has different type than selectingtable rows,
give an array in prop "selectedValues" that contains the string values
that already exist in editdata
*/
export const SelectingTable = <T extends MRT_RowData, ParentType>({
  buttonText,
  data,
  columns,
  editingAction,
  fieldName,
  idFieldName,
  selectedValues,
}: {
  buttonText: string
  data: T[] | undefined
  columns: MRT_ColumnDef<T>[]
  editingAction?: (object: T) => void
  fieldName: keyof ParentType
  idFieldName: keyof T
  selectedValues?: string[]
}) => {
  const { editData, setEditData } = useDetailContext<ParentType>()

  const selectedItems = editData[fieldName] as T[]

  const defaultEditingAction = (newObject: T) => {
    if (selectedItems.find(item => item[idFieldName] === newObject[idFieldName])) return
    setEditData({ ...editData, [fieldName]: [...selectedItems, { ...newObject, rowState: 'new' }] })
  }

  const idSet = useMemo(() => {
    return new Set(selectedItems.map(item => item[idFieldName] as T))
  }, [selectedItems, idFieldName])

  const filteredMuseums = useMemo(() => {
    if (!data) return []
    return data.filter(row => {
      if (selectedValues) return !selectedValues.includes(row[idFieldName])
      return !idSet.has(row[idFieldName])
    })
  }, [data, idSet, idFieldName, selectedValues])

  return (
    <EditingModal buttonText={buttonText}>
      {data ? (
        <TableView<T>
          data={filteredMuseums}
          columns={columns}
          selectorFn={editingAction ?? defaultEditingAction}
          idFieldName={idFieldName}
        />
      ) : (
        <CircularProgress />
      )}
    </EditingModal>
  )
}

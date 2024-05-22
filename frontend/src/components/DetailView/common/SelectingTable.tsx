import { MRT_ColumnDef, MRT_RowData } from 'material-react-table'
import { EditingModal } from './FormComponents'
import { TableView } from '@/components/TableView/TableView'
import { useDetailContext } from '../hooks'
import { useMemo } from 'react'

export const SelectingTable = <T extends MRT_RowData, ParentType>({
  buttonText,
  data,
  columns,
  editingAction,
  fieldName,
  idFieldName,
}: {
  buttonText: string
  data: T[]
  columns: MRT_ColumnDef<T>[]
  editingAction?: (object: T) => void
  fieldName: keyof ParentType
  idFieldName: keyof T
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
    return data.filter(row => !idSet.has(row[idFieldName]))
  }, [data, idSet, idFieldName])

  return (
    <EditingModal buttonText={buttonText}>
      <TableView<T>
        data={filteredMuseums}
        columns={columns}
        selectorFn={editingAction ?? defaultEditingAction}
        idFieldName={idFieldName}
      />
    </EditingModal>
  )
}

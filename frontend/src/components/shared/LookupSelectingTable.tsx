import { MRT_RowData, MRT_ColumnDef } from 'material-react-table'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useAppendDetailArray } from '@/hooks/useAppendDetailArray'
import { EditDataType } from '@/shared/types'

type LookupSelectingTableProps<TValue extends MRT_RowData, TEditData extends object, TItem> = {
  buttonText: string
  title: string
  isError?: boolean
  data?: TValue[]
  columns: MRT_ColumnDef<TValue>[]
  fieldName: keyof TEditData
  idFieldName: keyof TValue
  selectedValues: string[]
  buildItem: (value: TValue, editData: EditDataType<TEditData>) => TItem
}

export const LookupSelectingTable = <TValue extends MRT_RowData, TEditData extends object, TItem>(
  props: LookupSelectingTableProps<TValue, TEditData, TItem>
) => {
  const { buttonText, title, isError, data, columns, fieldName, idFieldName, selectedValues, buildItem } = props

  const appendItem = useAppendDetailArray<TEditData, TValue, TItem>(fieldName, buildItem)

  return (
    <SelectingTable<TValue, TEditData>
      buttonText={buttonText}
      isError={isError ?? false}
      columns={columns}
      data={data}
      title={title}
      fieldName={fieldName}
      idFieldName={idFieldName}
      editingAction={appendItem}
      selectedValues={selectedValues}
    />
  )
}

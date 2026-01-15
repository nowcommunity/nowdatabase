import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { EditDataType } from '@/shared/types'

export const useAppendDetailArray = <TData extends object, TValue, TItem>(
  fieldName: keyof TData,
  buildItem: (value: TValue, editData: EditDataType<TData>) => TItem
) => {
  const { editData, setEditData } = useDetailContext<TData>()

  return (value: TValue) => {
    const existing = (editData[fieldName as keyof EditDataType<TData>] as unknown as TItem[]) ?? []
    setEditData({
      ...editData,
      [fieldName]: [...existing, buildItem(value, editData)],
    })
  }
}

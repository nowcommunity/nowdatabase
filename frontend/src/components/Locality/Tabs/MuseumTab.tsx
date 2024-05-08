import { LocalityDetails, Museum } from '@/backendTypes'
import { EditableTable, Grouped, RowState } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { MRT_ColumnDef } from 'material-react-table'

export const MuseumTab = () => {
  const { editData, setEditData, mode } = useDetailContext<LocalityDetails>()

  const columns: MRT_ColumnDef<Museum>[] = [
    {
      accessorKey: 'museum',
      header: 'Code',
    },
    {
      accessorKey: 'institution',
      header: 'Museum',
    },
    {
      accessorKey: 'city',
      header: 'City',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
  ]

  const clickRow = (index: number, newState: RowState) => {
    const museums = [...editData.museums]
    museums[index].rowState = newState
    setEditData({ ...editData, museums })
  }

  return (
    <Grouped title="Museums">
      <EditableTable<Museum & { rowState?: RowState }> columns={columns} data={editData.museums} editable={mode === 'edit'} clickRow={clickRow} />
    </Grouped>
  )
}

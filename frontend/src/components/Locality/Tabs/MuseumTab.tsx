import { Editable, LocalityDetails, Museum } from '@/backendTypes'
import { EditableTable, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { MRT_ColumnDef } from 'material-react-table'

export const MuseumTab = () => {
  const { editData } = useDetailContext<LocalityDetails>()

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

  return (
    <Grouped title="Museums">
      <EditableTable<Editable<Museum>, LocalityDetails> columns={columns} data={editData.museums} editable field="museums" />
    </Grouped>
  )
}

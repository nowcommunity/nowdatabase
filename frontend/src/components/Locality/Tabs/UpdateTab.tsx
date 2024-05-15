import { Editable, LocalityDetails, LocalityUpdate } from '@/backendTypes'
import { EditableTable, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { MRT_ColumnDef } from 'material-react-table'

export const UpdateTab = () => {
  const { editData } = useDetailContext<LocalityDetails>()

  const columns: MRT_ColumnDef<LocalityUpdate>[] = [
    {
      accessorKey: 'lau_date',
      header: 'Date',
    },
    {
      accessorKey: 'lau_authorizer',
      header: 'Editor',
    },
    {
      accessorKey: 'lau_coordinator',
      header: 'Coordinator',
    },
    {
      accessorKey: 'now_lr.rid',
      header: 'Reference',
    },
  ]

  return (
    <Grouped title="Updates">
      <EditableTable<Editable<LocalityUpdate>, LocalityDetails>
        columns={columns}
        data={editData.now_lau}
        editable
        field="now_lau"
      />
    </Grouped>
  )
}

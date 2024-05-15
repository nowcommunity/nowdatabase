import { Editable, LocalityDetails, LocalityUpdate } from '@/backendTypes'
import { EditableTable, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const UpdateTab = () => {
  const { editData } = useDetailContext<LocalityDetails>()

  const formatDate = (date: Date | null) => {
    if (!date) return 'No date'
    return new Date(date).toISOString().split('T')[0]
  }

  const columns: MRT_ColumnDef<LocalityUpdate>[] = [
    {
      accessorKey: 'lau_date',
      header: 'Date',
      Cell: ({ cell }) => formatDate(cell.getValue() as Date | null),
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
      accessorKey: 'now_lr',
      header: 'Reference',
      Cell: () => <Box>not implemented</Box>,
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

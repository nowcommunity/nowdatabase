import { Editable, LocalityDetailsType, LocalityUpdate } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const UpdateTab = () => {
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
      <EditableTable<Editable<LocalityUpdate>, LocalityDetailsType> columns={columns} field="now_lau" />
    </Grouped>
  )
}

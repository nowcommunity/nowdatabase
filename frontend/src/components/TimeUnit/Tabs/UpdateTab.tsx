import { Editable, TimeUnitDetailsType, TimeUnitUpdate } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const UpdateTab = () => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'No date'
    return new Date(date).toISOString().split('T')[0]
  }

  const columns: MRT_ColumnDef<TimeUnitUpdate>[] = [
    {
      accessorKey: 'tau_date',
      header: 'Date',
      Cell: ({ cell }) => formatDate(cell.getValue() as Date | null),
    },
    {
      accessorKey: 'tau_authorizer',
      header: 'Editor',
    },
    {
      accessorKey: 'tau_coordinator',
      header: 'Coordinator',
    },
    {
      accessorKey: 'now_tr',
      header: 'Reference',
      Cell: () => <Box>not implemented</Box>,
    },
  ]

  return (
    <Grouped title="Updates">
      <EditableTable<Editable<TimeUnitUpdate>, TimeUnitDetailsType> columns={columns} field="now_tau" />
    </Grouped>
  )
}

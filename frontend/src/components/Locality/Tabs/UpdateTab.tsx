import { LocalityDetailsType, LocalityUpdate, UpdateLog } from '@/backendTypes'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { EditingModal } from '@/components/DetailView/common/EditingModal'
import { SimpleTable } from '@/components/DetailView/common/SimpleTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box } from '@mui/material'
import { MRT_ColumnDef, MRT_Row } from 'material-react-table'

export const UpdateTab = () => {
  const { data } = useDetailContext<LocalityDetailsType>()

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
    {
      header: 'Details',
      Cell: ({ row }: { row: MRT_Row<LocalityUpdate> }) => <DetailsModal updates={row.original.updates} />,
    },
  ]

  return (
    <Grouped title="Updates">
      <SimpleTable columns={columns} data={data.now_lau} />
    </Grouped>
  )
}

const DetailsModal = ({ updates }: { updates: UpdateLog[] }) => {
  const columns: MRT_ColumnDef<UpdateLog>[] = [
    {
      header: 'Table',
      accessorKey: 'table_name',
    },
    {
      header: 'Field',
      accessorKey: 'column_name',
    },
    {
      header: 'Action',
      accessorFn: ({ log_action }) => (log_action === 1 ? 'Delete' : log_action === 2 ? 'Update' : 'Add'),
    },
    {
      header: 'Old data',
      accessorKey: 'old_data',
    },
    {
      header: 'New data',
      accessorKey: 'new_data',
    },
  ]

  return (
    <EditingModal buttonText="Details">
      <SimpleTable columns={columns} data={updates} />
    </EditingModal>
  )
}

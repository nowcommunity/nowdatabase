import { Editable, SpeciesDetailsType, SpeciesUpdate } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const UpdateTab = () => {
  const formatDate = (date: Date | null) => {
    if (!date) return 'No date'
    return new Date(date).toISOString().split('T')[0]
  }

  const columns: MRT_ColumnDef<SpeciesUpdate>[] = [
    {
      accessorKey: 'sau_date',
      header: 'Date',
      Cell: ({ cell }) => formatDate(cell.getValue() as Date | null),
    },
    {
      accessorKey: 'sau_authorizer',
      header: 'Editor',
    },
    {
      accessorKey: 'sau_coordinator',
      header: 'Coordinator',
    },
    {
      accessorKey: 'now_sr',
      header: 'Reference',
      Cell: () => <Box>not implemented</Box>,
    },
  ]

  return (
    <Grouped title="Updates">
      <EditableTable<Editable<SpeciesUpdate>, SpeciesDetailsType> columns={columns} editable field="now_sau" />
    </Grouped>
  )
}

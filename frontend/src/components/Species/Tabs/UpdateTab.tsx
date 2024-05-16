import { Editable, SpeciesDetails, SpeciesUpdate } from '@/backendTypes'
import { EditableTable, Grouped } from '@/components/DetailView/common/FormComponents'
import { useDetailContext } from '@/components/DetailView/hooks'
import { Box } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const UpdateTab = () => {
  const { editData } = useDetailContext<SpeciesDetails>()

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
      <EditableTable<Editable<SpeciesUpdate>, SpeciesDetails>
        columns={columns}
        data={editData.now_sau}
        editable
        field="now_sau"
      />
    </Grouped>
  )
}

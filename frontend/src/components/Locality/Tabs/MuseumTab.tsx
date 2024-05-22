import { Editable, LocalityDetails, Museum } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { Grouped } from '@/components/DetailView/common/FormComponents'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/hooks'
import { useGetAllMuseumsQuery } from '@/redux/museumReducer'
import { Box, CircularProgress } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const MuseumTab = () => {
  const { editData, mode } = useDetailContext<LocalityDetails>()
  const { data: museumData, isError } = useGetAllMuseumsQuery()

  if (isError) return 'Error loading museums.'
  if (!museumData) return <CircularProgress />

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

  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'code', label: 'Code', required: true },
    { name: 'museum', label: 'Museum', required: true },
    { name: 'alternativeName', label: 'Alternative name' },
    { name: 'city', label: 'City', required: true },
    { name: 'state', label: 'State' },
    { name: 'stateCode', label: 'State code' },
    { name: 'country', label: 'Country', required: true },
  ]

  return (
    <Grouped title="Museums">
      {mode === 'edit' && (
        <Box display="flex" gap={1}>
          <EditingForm<Museum, LocalityDetails>
            buttonText="Add new museum"
            formFields={formFields}
            arrayFieldName="museums"
          />
          <SelectingTable<Museum, LocalityDetails>
            buttonText="Add existing museum"
            data={museumData}
            columns={columns}
            fieldName="museums"
            idFieldName="museum"
          />
        </Box>
      )}
      <EditableTable<Editable<Museum>, LocalityDetails>
        columns={columns}
        data={editData.museums}
        editable
        field="museums"
      />
    </Grouped>
  )
}

import { Editable, LocalityDetailsType, Museum } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllMuseumsQuery } from '@/redux/museumReducer'
import { Box, CircularProgress } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const MuseumTab = () => {
  const { mode } = useDetailContext<LocalityDetailsType>()
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
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<Museum, LocalityDetailsType>
            buttonText="Add new museum"
            formFields={formFields}
            arrayFieldName="museums"
          />
          <SelectingTable<Museum, LocalityDetailsType>
            buttonText="Add existing museum"
            data={museumData}
            columns={columns}
            fieldName="museums"
            idFieldName="museum"
          />
        </Box>
      )}
      <EditableTable<Editable<Museum>, LocalityDetailsType> columns={columns} field="museums" />
    </Grouped>
  )
}

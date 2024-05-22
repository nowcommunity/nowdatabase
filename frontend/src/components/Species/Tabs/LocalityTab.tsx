import { Editable, Locality, LocalityDetails, SpeciesDetails, SpeciesLocality } from '@/backendTypes'
import { Grouped } from '@/components/DetailView/common/FormComponents'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { useDetailContext } from '@/components/DetailView/hooks'
import { useGetAllLocalitiesQuery } from '@/redux/localityReducer'
import { Box, CircularProgress } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'

export const LocalityTab = () => {
  const { editData, mode } = useDetailContext<SpeciesDetails>()
  const { data, isError } = useGetAllLocalitiesQuery()

  if (isError) return 'Error loading Localities.'
  if (!data) return <CircularProgress />

  const columns = [
    {
      accessorKey: 'loc_name',
      header: 'Locality',
    },
    {
      accessorKey: 'country',
      header: 'Country',
    },
    {
      accessorKey: 'max_age',
      header: 'Max Age',
    },
    {
      accessorKey: 'min_age',
      header: 'Min Age',
    },
  ]

  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'name', label: 'Locality', required: true },
    { name: 'country', label: 'Country', required: true },
    { name: 'dms_lat', label: 'Latitude dms' },
    { name: 'dms_lon', label: 'Longitude dms', required: true },
    { name: 'max_age', label: 'Maximum Age', required: true },
    { name: 'min_age', label: 'Minimum Age', required: true },
    { name: 'bfa_max_abs', label: 'Basis for Age Maximum', required: true },
    { name: 'bfa_min_abs', label: 'Basis for Age Minimum', required: true },
  ]

  const editingModal = <EditingForm buttonText="Add new locality" formFields={formFields} arrayFieldName="now_ls" />

  const selectingTable = (
    <SelectingTable<Editable<Locality>, SpeciesDetails>
      buttonText="Add existing locality"
      columns={columns}
      data={data}
      fieldName="now_ls"
      idFieldName="lid"
    />
  )
  console.log(editData.now_ls)
  return (
    <Grouped title="Localities">
      {mode === 'edit' && (
        <Box display="flex" gap={1}>
          {editingModal} {selectingTable}
        </Box>
      )}
      <EditableTable<Editable<SpeciesLocality>, SpeciesDetails>
        columns={columns}
        data={editData.now_ls.map(item => item.now_loc)}
        editable
        field="now_ls"
      />
    </Grouped>
  )
}

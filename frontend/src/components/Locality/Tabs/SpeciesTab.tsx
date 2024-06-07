//import { Editable, LocalityDetailsType, Museum } from '@/backendTypes'
import { Editable, LocalityDetailsType, Species } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { Box, CircularProgress } from '@mui/material'
import { MRT_ColumnDef } from 'material-react-table'

export const SpeciesTab = () => {
  const { mode } = useDetailContext<LocalityDetailsType>()
  const { data: speciesData, isError } = useGetAllSpeciesQuery()

  if (isError) return 'Error loading Species.'
  if (!speciesData) return <CircularProgress />

  const columns: MRT_ColumnDef<Species>[] = [
    {
      accessorKey: 'order_name',
      header: 'Order',
    },
    {
      accessorKey: 'family_name',
      header: 'Family',
    },
    {
      accessorKey: 'genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'species_name',
      header: 'Species',
    },
    {
      accessorKey: 'subclass_or_superorder_name',
      header: 'Subclass or Superorder',
    },
    {
      accessorKey: 'suborder_or_superfamily_name',
      header: 'Suborder or Superfamily',
    },
    {
      accessorKey: 'unique_identifier',
      header: 'Unique Identifier',
    },
    {
      accessorKey: 'taxonomic_status',
      header: 'Taxon status',
    },
  ]

  const formFields: { name: string; label: string; required?: boolean }[] = [
    { name: 'order_name', label: 'Order', required: true },
    { name: 'family_name', label: 'Family', required: true },
    { name: 'genus_name', label: 'Genus', required: true },
    { name: 'species_name', label: 'Species', required: true },
    { name: 'subclass_or_superorder_name', label: 'Subclass or Superorder' },
    { name: 'suborder_or_superfamily_name', label: 'Suborder or Superfamily' },
    { name: 'unique_identifier', label: 'Unique Identifier', required: true },
    { name: 'taxonomic_status', label: 'Taxon status' },
  ]

  return (
    <Grouped title="Species">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<Species, LocalityDetailsType>
            buttonText="Add new Species"
            formFields={formFields}
            arrayFieldName="species"
          />
          <SelectingTable<Species, LocalityDetailsType>
            buttonText="Select Species"
            data={speciesData}
            columns={columns}
            fieldName="species"
            idFieldName="species_id"
          />
        </Box>
      )}
      <EditableTable<Editable<Species>, LocalityDetailsType> columns={columns} field="species" />
    </Grouped>
  )
}

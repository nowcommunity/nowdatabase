import { LocalityDetailsType, Species } from '@/backendTypes'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
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

          {/* 
          TODO fix this. EditDataType still doesn't work correctly: requires now_ls all fields
          <SelectingTable<EditDataType<SpeciesType>, EditDataType<LocalityDetailsType>>
            buttonText="Select Species"
            data={speciesData}
            columns={columns}
            fieldName="now_ls"
            idFieldName="species_id"
            editingAction={(newSpecies: SpeciesType) => {
              setEditData({ ...editData, now_ls: [...editData.now_ls, { com_species: newSpecies }] })
            }} 
          />*/}
        </Box>
      )}
      <EditableTable<Species, LocalityDetailsType> columns={columns} field="species" />
    </Grouped>
  )
}

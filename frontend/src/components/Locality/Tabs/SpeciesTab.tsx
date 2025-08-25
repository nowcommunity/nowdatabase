import { Editable, LocalityDetailsType, LocalitySpecies, Species, SpeciesDetailsType } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { Box, CircularProgress } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_ColumnDef } from 'material-react-table'
import { checkTaxonomy } from '@/util/taxonomyFunctions'
import { useNotify } from '@/hooks/notification'

export const SpeciesTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const { data: speciesData, isError } = useGetAllSpeciesQuery(mode.read ? skipToken : undefined)
  const { notify } = useNotify()

  const speciesColumns: MRT_ColumnDef<Species>[] = [
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
  const localitySpeciesColumns: MRT_ColumnDef<LocalitySpecies>[] = [
    {
      accessorKey: 'com_species.order_name',
      header: 'Order',
    },
    {
      accessorKey: 'com_species.family_name',
      header: 'Family',
    },
    {
      accessorKey: 'com_species.genus_name',
      header: 'Genus',
    },
    {
      accessorKey: 'com_species.species_name',
      header: 'Species',
    },
    {
      accessorKey: 'com_species.subclass_or_superorder_name',
      header: 'Subclass or Superorder',
    },
    {
      accessorKey: 'com_species.suborder_or_superfamily_name',
      header: 'Suborder or Superfamily',
    },
    {
      accessorKey: 'com_species.unique_identifier',
      header: 'Unique Identifier',
    },
    {
      accessorKey: 'com_species.taxonomic_status',
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

  if (!mode.read && !speciesData) return <CircularProgress />

  return (
    <Grouped title="Species">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<Species, LocalityDetailsType>
            buttonText="Add new Species"
            formFields={formFields}
            editAction={(newSpecies: Species) => {
              const allSpecies = editData.now_ls.map(ls => ls.com_species) as unknown as Editable<Species>[]
              const filteredSpecies = allSpecies.filter(species => species.rowState === 'new')
              const taxonomyErrors = checkTaxonomy(newSpecies, speciesData!.concat(filteredSpecies), [])
              if (taxonomyErrors.size > 0) {
                const errorMessage = [...taxonomyErrors].reduce((acc, currentError) => acc + `\n${currentError}`)
                notify(errorMessage, 'error', null)
                return
              }
              setEditData({
                ...editData,
                now_ls: [
                  ...editData.now_ls,
                  {
                    lid: editData.lid,
                    species_id: newSpecies.species_id,
                    com_species: { ...(newSpecies as unknown as SpeciesDetailsType) },
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
          <SelectingTable<Species, LocalityDetailsType>
            buttonText="Select Species"
            data={speciesData}
            isError={isError}
            columns={speciesColumns}
            fieldName="now_ls"
            idFieldName="species_id"
            editingAction={(newSpecies: Species) => {
              setEditData({
                ...editData,
                now_ls: [
                  ...editData.now_ls,
                  {
                    lid: editData.lid,
                    species_id: newSpecies.species_id,
                    com_species: { ...(newSpecies as unknown as SpeciesDetailsType) },
                    rowState: 'new',
                  },
                ],
              })
            }}
          />
        </Box>
      )}
      <EditableTable<LocalitySpecies, LocalityDetailsType>
        columns={localitySpeciesColumns}
        field="now_ls"
        idFieldName="species_id"
        url="species"
      />
    </Grouped>
  )
}

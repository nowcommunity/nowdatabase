import { LocalityDetailsType, LocalitySpecies, Species, SpeciesDetailsType } from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { Box } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_ColumnDef } from 'material-react-table'
import { smallSpeciesTableColumns } from '@/common'

export const SpeciesTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const { data: speciesData, isError } = useGetAllSpeciesQuery(mode.read ? skipToken : undefined)

  const localitySpeciesColumns: MRT_ColumnDef<LocalitySpecies>[] = smallSpeciesTableColumns.map(column => {
    return { ...column, accessorKey: `com_species.${column.accessorKey!}` } as MRT_ColumnDef<LocalitySpecies>
  })

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
            editAction={(newSpecies: Species) => {
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
            columns={smallSpeciesTableColumns}
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

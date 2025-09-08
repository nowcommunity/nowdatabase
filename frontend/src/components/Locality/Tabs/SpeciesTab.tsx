import {
  Editable,
  EditDataType,
  LocalityDetailsType,
  LocalitySpecies,
  Species,
  SpeciesDetailsType,
} from '@/shared/types'
import { EditableTable } from '@/components/DetailView/common/EditableTable'
import { EditingForm } from '@/components/DetailView/common/EditingForm'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { Box, CircularProgress } from '@mui/material'
import { skipToken } from '@reduxjs/toolkit/query'
import { MRT_ColumnDef } from 'material-react-table'
import { checkTaxonomy, convertTaxonomyFields, fixNullValuesInTaxonomyFields } from '@/util/taxonomyUtilities'
import { useNotify } from '@/hooks/notification'
import { validateSpecies } from '@/shared/validators/species'
import { smallSpeciesTableColumns } from '@/common'
import { useState } from 'react'
import { SynonymsModal } from '@/components/Species/SynonymsModal'

export const SpeciesTab = () => {
  const { mode, editData, setEditData } = useDetailContext<LocalityDetailsType>()
  const { data: speciesData, isError } = useGetAllSpeciesQuery(mode.read ? skipToken : undefined)
  const { notify } = useNotify()
  const [replacedValues, setReplacedValues] = useState<Species | undefined>()
  const [selectedSpecies, setSelectedSpecies] = useState<string | undefined>()
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleRowActionClick = (row: Species) => {
    setSelectedSpecies(row.species_id.toString())
    setModalOpen(true)
  }

  const copyTaxonomyButton = (
    <Box key="copy_existing_taxonomy_button" id="copy_existing_taxonomy_button">
      <SelectingTable<Species, Species>
        buttonText="Copy existing taxonomy"
        data={speciesData}
        isError={isError}
        columns={smallSpeciesTableColumns}
        fieldName="order_name" // this doesn't do anything here but is required
        idFieldName="species_id"
        useObject={true}
        tableRowAction={handleRowActionClick}
        editingAction={(selectedSpecies: Species) => {
          setReplacedValues(fixNullValuesInTaxonomyFields(selectedSpecies) as Species)
        }}
      />
      <SynonymsModal open={modalOpen} onClose={() => setModalOpen(false)} selectedSpecies={selectedSpecies} />
    </Box>
  )

  const convertAndCheckNewSpeciesTaxonomy = (newSpecies: Species) => {
    const errors = []
    for (const field in newSpecies) {
      const errorObject = validateSpecies(
        newSpecies as unknown as EditDataType<SpeciesDetailsType>,
        field as unknown as keyof EditDataType<SpeciesDetailsType>
      )
      const { error } = errorObject
      if (error) errors.push(errorObject)
    }
    if (errors.length > 0) {
      notify('Following validators failed: \n' + errors.map(e => `${e.name}: ${e.error}`).join('\n'), 'error')
      return false
    }

    const convertedSpecies = convertTaxonomyFields(newSpecies)
    const everyLs = editData.now_ls.map(ls => ls.com_species) as unknown as Editable<Species>[]
    const filteredLs = everyLs.filter(species => species.rowState === 'new')

    const taxonomyErrors = checkTaxonomy(convertedSpecies, speciesData!.concat(filteredLs), [])
    if (taxonomyErrors.size > 0) {
      const errorMessage = [...taxonomyErrors].reduce((acc, currentError) => acc + `\n${currentError}`)
      notify(errorMessage, 'error', null)
      return false
    }
    return convertedSpecies
  }

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
    { name: 'sp_comment', label: 'Comment' },
    { name: 'sp_author', label: 'Author' },
  ]

  if (!mode.read && !speciesData) return <CircularProgress />

  return (
    <Grouped title="Species">
      {!mode.read && (
        <Box display="flex" gap={1}>
          <EditingForm<Species, LocalityDetailsType>
            buttonText="Add new Species"
            formFields={formFields}
            replacedValues={replacedValues}
            copyTaxonomyButton={copyTaxonomyButton}
            editAction={(newSpecies: Species) => {
              const convertedSpecies = convertAndCheckNewSpeciesTaxonomy(newSpecies)
              if (!convertedSpecies) return
              setEditData({
                ...editData,
                now_ls: [
                  ...editData.now_ls,
                  {
                    lid: editData.lid,
                    species_id: newSpecies.species_id,
                    com_species: { ...(convertedSpecies as unknown as SpeciesDetailsType) },
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
                    com_species: {
                      ...(fixNullValuesInTaxonomyFields(newSpecies) as SpeciesDetailsType),
                    },
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

import { SpeciesDetailsType, Species } from '@/shared/types'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { fixNullValuesInTaxonomyFields, taxonStatusOptions } from '@/util/taxonomyUtilities'
import { Box } from '@mui/material'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { smallSpeciesTableColumns } from '@/common'
import { SynonymsModal } from '../SynonymsModal'
import { useState } from 'react'

export const TaxonomyTab = () => {
  const { textField, dropdown, bigTextField, editData, setEditData, mode } = useDetailContext<SpeciesDetailsType>()
  const { data: speciesQueryData, isError } = useGetAllSpeciesQuery()
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
        data={speciesQueryData}
        isError={isError}
        columns={smallSpeciesTableColumns}
        fieldName="order_name" // this doesn't do anything here but is required
        idFieldName="species_id"
        useObject={true}
        tableRowAction={handleRowActionClick}
        editingAction={(selectedSpecies: Species) => {
          const fixedSpecies = fixNullValuesInTaxonomyFields(selectedSpecies)
          setEditData({
            ...editData,
            subclass_or_superorder_name: fixedSpecies.subclass_or_superorder_name,
            order_name: fixedSpecies.order_name!,
            suborder_or_superfamily_name: fixedSpecies.suborder_or_superfamily_name,
            family_name: fixedSpecies.family_name!,
            subfamily_name: fixedSpecies.subfamily_name,
            genus_name: fixedSpecies.genus_name!,
            species_name: fixedSpecies.species_name!,
            unique_identifier: fixedSpecies.unique_identifier!,
          })
        }}
      />
      <SynonymsModal open={modalOpen} onClose={() => setModalOpen(false)} selectedSpecies={selectedSpecies} />
    </Box>
  )

  const classification = [
    [
      'Class',
      'Mammalia',
      'Subclass or Superorder',
      textField('subclass_or_superorder_name', { type: 'text', trim: true }),
    ],
    [
      'Order',
      textField('order_name', { type: 'text', trim: true }),
      'Suborder or Superfamily',
      textField('suborder_or_superfamily_name', { type: 'text', trim: true }),
    ],
    [
      'Family',
      textField('family_name', { type: 'text', trim: true }),
      'Subfamily or Tribe',
      textField('subfamily_name', { type: 'text', trim: true }),
    ],
    ['Genus', textField('genus_name', { type: 'text', trim: true })],
    [
      'Species',
      textField('species_name', { type: 'text', trim: true }),
      'Unique Identifier',
      textField('unique_identifier', { type: 'text', trim: true }),
    ],
    ['Taxonomic Status', dropdown('taxonomic_status', taxonStatusOptions, 'Taxonomic Status')],
  ]

  if (mode.new) classification[0][0] = copyTaxonomyButton // adds copy button to the start of the array

  const comment = [['Comment', bigTextField('sp_comment')]]

  const author = [['Author', textField('sp_author')]]

  return (
    <>
      <ArrayFrame array={classification} title="Taxonomic Classification" />
      <HalfFrames>
        <ArrayFrame half array={comment} title="Comment" />
        <ArrayFrame half array={author} title="Author" />
      </HalfFrames>
    </>
  )
}

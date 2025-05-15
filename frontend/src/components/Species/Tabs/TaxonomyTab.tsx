import { SpeciesDetailsType, Species } from '@/shared/types'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { emptyOption } from '@/components/DetailView/common/misc'
import { Box } from '@mui/material'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { smallSpeciesTableColumns } from '@/common'

export const TaxonomyTab = () => {
  const { textField, dropdown, bigTextField, editData, setEditData, mode } = useDetailContext<SpeciesDetailsType>()
  const { data: speciesQueryData, isError } = useGetAllSpeciesQuery()

  const copyTaxonomyButton = (
    <Box key="copy_existing_taxonomy_button" id="copy_existing_taxonomy_button">
      <SelectingTable<Species, Species>
        buttonText="Copy existing taxonomy"
        buttonTooltip="Use an existing species' taxonomy as a base for this species."
        data={speciesQueryData}
        isError={isError}
        columns={smallSpeciesTableColumns}
        fieldName="order_name" // this doesn't do anything here but is required
        idFieldName="species_id"
        useObject={true}
        editingAction={(selectedSpecies: Species) => {
          setEditData({
            ...editData,
            subclass_or_superorder_name: selectedSpecies.subclass_or_superorder_name ?? '',
            order_name: selectedSpecies.order_name ?? '',
            suborder_or_superfamily_name: selectedSpecies.suborder_or_superfamily_name ?? '',
            family_name: selectedSpecies.family_name ?? '',
            subfamily_name: selectedSpecies.subfamily_name ?? '',
            genus_name: selectedSpecies.genus_name ?? '',
            species_name: selectedSpecies.species_name ?? '',
          })
        }}
      />
    </Box>
  )

  const taxonStatusOptions = [
    emptyOption,
    'family attrib of genus uncertain',
    'genus attrib of species uncertain',
    'informal species',
    'species validity uncertain',
    'taxonomic validity uncertain',
    'NOW synonym',
  ]

  const classification = [
    ['Class', 'Mammalia', 'Subclass or Superorder', textField('subclass_or_superorder_name')],
    ['Order', textField('order_name'), 'Suborder or Superfamily', textField('suborder_or_superfamily_name')],
    ['Family', textField('family_name'), 'Subfamily or Tribe', textField('subfamily_name')],
    ['Genus', textField('genus_name'), ''],
    ['Species', textField('species_name'), 'Unique Identifier', textField('unique_identifier')],
    ['Taxonomic Status', dropdown('taxonomic_status', taxonStatusOptions, 'Taxonomic Status')],
  ]

  if (mode.new) classification.unshift([copyTaxonomyButton]) // adds copy button to the start of the array

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

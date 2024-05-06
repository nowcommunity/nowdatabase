import { Box } from '@mui/material'
import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, DataValue } from '@components/DetailView/common/FormComponents'
import { useGetEditableTextField, useGetMultiSelection, useGetRadioSelection } from '@components/DetailView/hooks'

export const TaxonomyTab = () => {
  const getEditableTextField = useGetEditableTextField<SpeciesDetails>()
  const getRadioSelection = useGetRadioSelection<SpeciesDetails>()
  const getMultiSelection = useGetMultiSelection<SpeciesDetails>()

  const textField = (field: keyof SpeciesDetails) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getEditableTextField(field)} />
  )

  const radioSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getRadioSelection({ fieldName: field, options, name })} />
  )

  const multiSelection = (field: keyof SpeciesDetails, options: string[], name: string) => (
    <DataValue<SpeciesDetails> field={field as keyof SpeciesDetails} EditElement={getMultiSelection({ fieldName: field, options, name })} />
  )

  const taxonStatusOptions = ['', 'family attrib of genus uncertain',
    'genus attrib of species uncertain',
    'informal species',
    'species validity uncertain',
    'taxonomic validity uncertain',
    'NOW synonym']

  const classification = [
    // TODO Add static Class field
    ['Class', 'Mammalia', 'Subclass or Superorder', textField('subclass_or_superorder_name')],
    ['Order', textField('order_name'), 'Suborder or Superfamily', textField('suborder_or_superfamily_name')],
    ['Family', textField('family_name'), 'Subfamily or Tribe', textField('subfamily_name')],
    ['Genus', textField('genus_name'),''],
    ['Species', textField('species_name'), 'Unique Identifier', textField('unique_identifier')],
    ['Taxon Status', multiSelection('sp_status', taxonStatusOptions, 'Taxon Status')],
  ]

  const comment = [
    ['Comment', textField('sp_comment')],
  ]

  const author = [
    ['Author', textField('sp_author')],
  ]


  return (
    <Box>
      <ArrayFrame array={classification} title="Taxonomic Classification" />
      <ArrayFrame array={comment} title="Comment" />
      <ArrayFrame array={author} title="Author" />
    </Box>
  )
}

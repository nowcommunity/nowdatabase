import { SpeciesDetailsType } from '@/shared/types'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { emptyOption } from '@/components/DetailView/common/misc'

export const TaxonomyTab = () => {
  const { textField, dropdown, bigTextField } = useDetailContext<SpeciesDetailsType>()

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
    ['Genus', textField('genus_name')],
    ['Species', textField('species_name'), 'Unique Identifier', textField('unique_identifier')],
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

import { SpeciesDetails } from '@/backendTypes'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/hooks'

export const TaxonomyTab = () => {
  const { textField, dropdown } = useDetailContext<SpeciesDetails>()

  const taxonStatusOptions = [
    '',
    'family attrib of genus uncertain',
    'genus attrib of species uncertain',
    'informal species',
    'species validity uncertain',
    'taxonomic validity uncertain',
    'NOW synonym',
  ]

  const classification = [
    // TODO Add static Class field
    ['Class', 'Mammalia', 'Subclass or Superorder', textField('subclass_or_superorder_name')],
    ['Order', textField('order_name'), 'Suborder or Superfamily', textField('suborder_or_superfamily_name')],
    ['Family', textField('family_name'), 'Subfamily or Tribe', textField('subfamily_name')],
    ['Genus', textField('genus_name'), ''],
    ['Species', textField('species_name'), 'Unique Identifier', textField('unique_identifier')],
    ['Taxon Status', dropdown('sp_status', taxonStatusOptions, 'Taxon Status')],
  ]

  const comment = [['Comment', textField('sp_comment')]]

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

import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'
import { Link } from 'react-router-dom'
import { idStatusOptions, quantityOptions } from '../constants'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { buildTaxonomySuggestionOptions, TaxonomySuggestionFieldName } from '@/components/Species/taxonomySuggestions'
import { useMemo } from 'react'
import { TaxonomySuggestionField } from '@/components/Species/TaxonomySuggestionField'

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? '-' : String(value)

export const OccurrenceCoreTab = () => {
  const { data: speciesQueryData, isError } = useGetAllSpeciesQuery()
  const { data, editData, mode, textField, dropdown } = useDetailContext<OccurrenceDetailsType>()

  console.log(editData)
  const taxonomySuggestionOptions = useMemo(
    () => ({
      subclass_or_superorder_name: buildTaxonomySuggestionOptions(speciesQueryData, 'subclass_or_superorder_name'),
      order_name: buildTaxonomySuggestionOptions(speciesQueryData, 'order_name'),
      suborder_or_superfamily_name: buildTaxonomySuggestionOptions(speciesQueryData, 'suborder_or_superfamily_name'),
      family_name: buildTaxonomySuggestionOptions(speciesQueryData, 'family_name'),
      subfamily_name: buildTaxonomySuggestionOptions(speciesQueryData, 'subfamily_name'),
      genus_name: buildTaxonomySuggestionOptions(speciesQueryData, 'genus_name'),
      species_name: buildTaxonomySuggestionOptions(speciesQueryData, 'species_name'),
    }),
    [speciesQueryData]
  )

  const taxonomySuggestionField = (field: TaxonomySuggestionFieldName) => (
    <TaxonomySuggestionField field={field} options={taxonomySuggestionOptions[field]} />
  )

  return (
    <>
      <HalfFrames>
        {[
          <ArrayFrame
            key="identification"
            title="Identification"
            array={[
              [
                'Locality',
                <Link key={`locality-${data.lid}`} to={`/locality/${data.lid}`}>
                  {toText(data.loc_name)}
                </Link>,
              ],
              ['Family', taxonomySuggestionField('family_name')],
              ['Genus', taxonomySuggestionField('genus_name')],
              ['Species', taxonomySuggestionField('species_name')],
              ['ID status', dropdown('id_status', idStatusOptions, 'ID status')],
              ['Additional Information', textField('orig_entry', { type: 'text' })],
              ['Source name', textField('source_name', { type: 'text' })],
            ]}
          />,
          <ArrayFrame
            key="counts"
            title="Occurrence counts"
            array={[
              ['NISP', textField('nis', { type: 'number', integerOnly: true, min: 1 })],
              ['Percent', textField('pct', { type: 'number' })],
              ['Quadrate', textField('quad', { type: 'number', integerOnly: true, min: 1 })],
              ['MNI', textField('mni', { type: 'number', integerOnly: true, min: 1 })],
              ['Quantity', dropdown('qua', quantityOptions, 'Quantity')],
            ]}
          />,
        ]}
      </HalfFrames>
      <ArrayFrame
        array={[['Body Mass (g)', textField('body_mass', { type: 'number', integerOnly: true, min: 1 })]]}
        title="Size"
      />
    </>
  )
}

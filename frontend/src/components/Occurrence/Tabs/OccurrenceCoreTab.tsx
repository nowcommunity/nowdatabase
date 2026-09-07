import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { EditDataType, LocalityDetailsType, OccurrenceDetailsType, Species, SpeciesDetailsType } from '@/shared/types'
import { Link } from 'react-router-dom'
import { idStatusOptions, quantityOptions } from '../constants'
import { useGetAllSpeciesQuery } from '@/redux/speciesReducer'
import { SelectingTable } from '@/components/DetailView/common/SelectingTable'
import { MRT_ColumnDef } from 'material-react-table'

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? '-' : String(value)
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
export const OccurrenceCoreTab = () => {
  const { data: speciesQueryData, isError } = useGetAllSpeciesQuery()
  const { data, editData, setEditData, mode, textField, dropdown } = useDetailContext<OccurrenceDetailsType>()

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
              !mode.read
                ? [
                    '',
                    <SelectingTable
                      key={'selecting-table'}
                      buttonText="Select Species"
                      data={speciesQueryData}
                      title="Species"
                      isError={isError}
                      columns={speciesColumns}
                      fieldName="species_id"
                      idFieldName="species_id"
                      useObject
                      editingAction={(newSpecies: Species) => {
                        setEditData({
                          ...editData,
                          family_name: newSpecies.family_name,
                          genus_name: newSpecies.genus_name!,
                          species_name: newSpecies.species_name!,
                          species_id: newSpecies.species_id,
                          unique_identifier: newSpecies.unique_identifier,
                        })
                      }}
                    />,
                  ]
                : [],
              ['Family', editData.family_name],
              ['Genus', editData.genus_name],
              ['Species', editData.species_name],
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

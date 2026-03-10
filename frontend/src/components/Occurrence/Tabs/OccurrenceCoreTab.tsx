import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'
import { Link } from 'react-router-dom'
import { formatIdStatus, formatQuantity, idStatusOptions, quantityOptions } from '../constants'

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined || value === '' ? '-' : String(value)

export const OccurrenceCoreTab = () => {
  const { data, editData, mode, textField, dropdown } = useDetailContext<OccurrenceDetailsType>()
  const sourceData = mode.read ? data : editData

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
              ['Family', toText(data.family_name)],
              ['Genus', toText(data.genus_name)],
              ['Species', toText(data.species_name)],
              [
                'ID status',
                mode.read ? formatIdStatus(sourceData.id_status) : dropdown('id_status', idStatusOptions, 'ID status'),
              ],
              [
                'Additional Information',
                mode.read ? toText(sourceData.orig_entry) : textField('orig_entry', { type: 'text' }),
              ],
              ['Source name', mode.read ? toText(sourceData.source_name) : textField('source_name', { type: 'text' })],
            ]}
          />,
          <ArrayFrame
            key="counts"
            title="Occurrence counts"
            array={[
              ['NISP', mode.read ? toText(sourceData.nis) : textField('nis', { type: 'number' })],
              ['Percent', mode.read ? toText(sourceData.pct) : textField('pct', { type: 'number' })],
              ['Quadrate', mode.read ? toText(sourceData.quad) : textField('quad', { type: 'number' })],
              ['MNI', mode.read ? toText(sourceData.mni) : textField('mni', { type: 'number' })],
              ['Quantity', mode.read ? formatQuantity(sourceData.qua) : dropdown('qua', quantityOptions, 'Quantity')],
            ]}
          />,
        ]}
      </HalfFrames>
      <ArrayFrame
        array={[
          ['Body Mass (g)', mode.read ? toText(sourceData.body_mass) : textField('body_mass', { type: 'number' })],
        ]}
        title="Size"
      />
    </>
  )
}

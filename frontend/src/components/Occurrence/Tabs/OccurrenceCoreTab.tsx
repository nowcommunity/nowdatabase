import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'

const toText = (value: string | number | null) => (value === null || value === '' ? '-' : String(value))

const quantityLabel = (value: string | null) => {
  const quantityMap: Record<string, string> = {
    a: 'Abundant',
    c: 'Common',
    r: 'Rare',
    v: 'Very rare',
  }

  if (!value) return '-'
  return quantityMap[value] ?? value
}

export const OccurrenceCoreTab = () => {
  const { data } = useDetailContext<OccurrenceDetailsType>()

  return (
    <>
      <HalfFrames>
        {[
          <ArrayFrame
            key="identification"
            title="Identification"
            array={[
              ['Locality ID', toText(data.lid)],
              ['Species ID', toText(data.species_id)],
              ['Genus', toText(data.genus_name)],
              ['Species', toText(data.species_name)],
              ['ID status', toText(data.id_status)],
              ['Original entry', toText(data.orig_entry)],
              ['Source name', toText(data.source_name)],
            ]}
          />,
          <ArrayFrame
            key="counts"
            title="Occurrence counts"
            array={[
              ['NISP', toText(data.nis)],
              ['Percent', toText(data.pct)],
              ['Quadrate', toText(data.quad)],
              ['MNI', toText(data.mni)],
              ['Quantity', quantityLabel(data.qua)],
            ]}
          />,
        ]}
      </HalfFrames>
      <ArrayFrame array={[['Body mass', toText(data.body_mass)]]} title="Size" />
    </>
  )
}

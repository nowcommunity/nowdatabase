import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'

const toText = (value: string | number | null) => (value === null || value === '' ? '-' : String(value))

export const OccurrenceCoreTab = () => {
  const { data } = useDetailContext<OccurrenceDetailsType>()

  return (
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
            ['Quality', toText(data.qua)],
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
            ['Original entry', toText(data.orig_entry)],
            ['Source name', toText(data.source_name)],
          ]}
        />,
      ]}
    </HalfFrames>
  )
}

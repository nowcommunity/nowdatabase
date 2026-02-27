import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'

const toText = (value: string | number | null) => (value === null || value === '' ? '-' : String(value))

export const OccurrenceWearTab = () => {
  const { data } = useDetailContext<OccurrenceDetailsType>()

  return (
    <HalfFrames>
      {[
        <ArrayFrame
          key="mesowear"
          title="Mesowear"
          array={[
            ['Mesowear', toText(data.mesowear)],
            ['MW OR High', toText(data.mw_or_high)],
            ['MW OR Low', toText(data.mw_or_low)],
            ['MW CS Sharp', toText(data.mw_cs_sharp)],
            ['MW CS Round', toText(data.mw_cs_round)],
            ['MW CS Blunt', toText(data.mw_cs_blunt)],
          ]}
        />,
        <ArrayFrame
          key="microwear"
          title="Microwear"
          array={[
            ['Microwear', toText(data.microwear)],
            ['MW scale min', toText(data.mw_scale_min)],
            ['MW scale max', toText(data.mw_scale_max)],
            ['MW value', toText(data.mw_value)],
          ]}
        />,
      ]}
    </HalfFrames>
  )
}

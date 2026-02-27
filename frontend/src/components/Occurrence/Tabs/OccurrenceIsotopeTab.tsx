import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'

const toText = (value: number | null) => (value === null ? '-' : String(value))

export const OccurrenceIsotopeTab = () => {
  const { data } = useDetailContext<OccurrenceDetailsType>()

  return (
    <HalfFrames>
      {[
        <ArrayFrame
          key="dc13"
          title="δ13C"
          array={[
            ['Mean', toText(data.dc13_mean)],
            ['N', toText(data.dc13_n)],
            ['Max', toText(data.dc13_max)],
            ['Min', toText(data.dc13_min)],
            ['Stdev', toText(data.dc13_stdev)],
          ]}
        />,
        <ArrayFrame
          key="do18"
          title="δ18O"
          array={[
            ['Mean', toText(data.do18_mean)],
            ['N', toText(data.do18_n)],
            ['Max', toText(data.do18_max)],
            ['Min', toText(data.do18_min)],
            ['Stdev', toText(data.do18_stdev)],
          ]}
        />,
      ]}
    </HalfFrames>
  )
}

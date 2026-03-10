import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { OccurrenceDetailsType } from '@/shared/types'

const toText = (value: number | null | undefined) => (value === null || value === undefined ? '-' : String(value))

export const OccurrenceIsotopeTab = () => {
  const { data, editData, mode, textField } = useDetailContext<OccurrenceDetailsType>()
  const sourceData = mode.read ? data : editData

  return (
    <HalfFrames>
      {[
        <ArrayFrame
          key="dc13"
          title="δ13C"
          array={[
            ['Mean', mode.read ? toText(sourceData.dc13_mean) : textField('dc13_mean', { type: 'number' })],
            ['N', mode.read ? toText(sourceData.dc13_n) : textField('dc13_n', { type: 'number' })],
            ['Max', mode.read ? toText(sourceData.dc13_max) : textField('dc13_max', { type: 'number' })],
            ['Min', mode.read ? toText(sourceData.dc13_min) : textField('dc13_min', { type: 'number' })],
            ['Stdev', mode.read ? toText(sourceData.dc13_stdev) : textField('dc13_stdev', { type: 'number' })],
          ]}
        />,
        <ArrayFrame
          key="do18"
          title="δ18O"
          array={[
            ['Mean', mode.read ? toText(sourceData.do18_mean) : textField('do18_mean', { type: 'number' })],
            ['N', mode.read ? toText(sourceData.do18_n) : textField('do18_n', { type: 'number' })],
            ['Max', mode.read ? toText(sourceData.do18_max) : textField('do18_max', { type: 'number' })],
            ['Min', mode.read ? toText(sourceData.do18_min) : textField('do18_min', { type: 'number' })],
            ['Stdev', mode.read ? toText(sourceData.do18_stdev) : textField('do18_stdev', { type: 'number' })],
          ]}
        />,
      ]}
    </HalfFrames>
  )
}

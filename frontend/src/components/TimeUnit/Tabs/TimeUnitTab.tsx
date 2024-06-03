import { TimeUnitDetailsType } from '@/backendTypes'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'

export const TimeUnitTab = () => {
  const { textField } = useDetailContext<TimeUnitDetailsType>()

  const timeUnit = [
    ['Name', textField('tu_display_name')],
    ['Rank', textField('rank')],
    ['Sequence', textField('sequence')],
    ['Comment', textField('tu_comment')],
  ]

  const upperTimeUnitBound = [['ID', textField('up_bnd')]]

  const lowerTimeUnitBound = [['ID', textField('low_bnd')]]

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      <ArrayFrame array={upperTimeUnitBound} title="Upper Time Unit Bound" />
      <ArrayFrame array={lowerTimeUnitBound} title="Lower Time Unit Bound" />
    </>
  )
}

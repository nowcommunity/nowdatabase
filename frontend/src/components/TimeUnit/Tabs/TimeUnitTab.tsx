import { SequenceDetailsType, TimeBoundDetailsType, TimeUnitDetailsType } from '@/backendTypes'
import { FieldWithTableSelection } from '@/components/DetailView/common/editingComponents'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceTable } from '@/components/Sequence/SequenceTable'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'

export const TimeUnitTab = () => {
  const { textField, data } = useDetailContext<TimeUnitDetailsType>()

  const timeUnit = [
    ['Name', textField('tu_display_name')],
    ['Rank', textField('rank')],
    ['Sequence', textField('sequence')],
    ['Comment', textField('tu_comment')],
    [
      'Sequence',
      <FieldWithTableSelection<SequenceDetailsType, TimeUnitDetailsType>
        key="sequence"
        sourceField="seq_name"
        targetField="sequence"
        selectorTable={<SequenceTable />}
      />,
    ],
    [
      'Upper Time Unit Bound',
      <FieldWithTableSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="up_bnd"
        sourceField="bid"
        targetField="up_bnd"
        selectorTable={<TimeBoundTable />}
      />,
    ],
    [
      'Lower Time Unit Bound',
      <FieldWithTableSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="low_bnd"
        sourceField="bid"
        targetField="low_bnd"
        selectorTable={<TimeBoundTable />}
      />,
    ],
  ]

  const low_bound = [
    ['Id', data.low_bound.bid],
    ['Name', data.low_bound.b_name],
    ['Age', data.low_bound.age],
    ['Comment', data.low_bound.b_comment],
  ]

  const up_bound = [
    ['Id', data.up_bound.bid],
    ['Name', data.up_bound.b_name],
    ['Age', data.up_bound.age],
    ['Comment', data.up_bound.b_comment],
  ]

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      <ArrayFrame array={low_bound} title="Lower bound" />
      <ArrayFrame array={up_bound} title="Upper bound" />
    </>
  )
}

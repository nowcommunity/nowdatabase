import { SequenceDetailsType, TimeBoundDetailsType, TimeUnitDetailsType } from '@/backendTypes'
import { FieldWithTableSelection } from '@/components/DetailView/common/editingComponents'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceTable } from '@/components/Sequence/SequenceTable'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'

export const TimeUnitTab = () => {
  const { textField } = useDetailContext<TimeUnitDetailsType>()

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
        sourceField="b_name"
        targetField="up_bnd"
        selectorTable={<TimeBoundTable />}
      />,
    ],
    [
      'Lower Time Unit Bound',
      <FieldWithTableSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="low_bnd"
        sourceField="b_name"
        targetField="low_bnd"
        selectorTable={<TimeBoundTable />}
      />,
    ],
  ]

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
    </>
  )
}

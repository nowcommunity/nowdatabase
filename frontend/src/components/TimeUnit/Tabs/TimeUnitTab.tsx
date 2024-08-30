import { SequenceDetailsType, TimeBoundDetailsType, TimeUnitDetailsType } from '@/backendTypes'
import { FieldWithTableSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceTable } from '@/components/Sequence/SequenceTable'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'

export const TimeUnitTab = () => {
  const { textField, dropdown, data, mode } = useDetailContext<TimeUnitDetailsType>()

  const rankOptions = [
    'Age',
    'Chron',
    'Culture',
    'Epoc',
    'Period',
    'Stage',
    'Subage',
    'Subchron',
    'Unit',
    'Zone',
    emptyOption,
  ]

  const timeUnit = [
    ['Name', textField('tu_display_name')],
    ['Rank', dropdown('rank', rankOptions, 'Rank')],
    ['Comment', textField('tu_comment')],
    [
      'Sequence',
      <FieldWithTableSelection<SequenceDetailsType, TimeUnitDetailsType>
        key="sequence"
        sourceField="sequence"
        targetField="sequence"
        selectorTable={<SequenceTable />}
      />,
    ],
  ]

  const low_bound = mode.new
    ? []
    : [
        ['Id', data.low_bound?.bid],
        ['Name', data.low_bound?.b_name],
        ['Age', data.low_bound?.age],
        ['Comment', data.low_bound?.b_comment],
      ]

  const up_bound = mode.new
    ? []
    : [
        ['Id', data.up_bound?.bid],
        ['Name', data.up_bound?.b_name],
        ['Age', data.up_bound?.age],
        ['Comment', data.up_bound?.b_comment],
      ]

  const time_bound_edit = [
    [
      'New Upper Bound',
      <FieldWithTableSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="up_bnd"
        sourceField="bid"
        targetField="up_bnd"
        selectorTable={<TimeBoundTable />}
      />,
    ],
    [
      'New Lower Bound',
      <FieldWithTableSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="low_bnd"
        sourceField="bid"
        targetField="low_bnd"
        selectorTable={<TimeBoundTable />}
      />,
    ],
  ]

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      {!mode.new && (
        <>
          <ArrayFrame array={low_bound} title="Lower bound" />
          <ArrayFrame array={up_bound} title="Upper bound" />
        </>
      )}
      {!mode.read && <ArrayFrame array={time_bound_edit} title="Edit bounds" />}
    </>
  )
}

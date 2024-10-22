import { SequenceDetailsType, TimeBoundDetailsType, TimeUnitDetailsType } from '@/backendTypes'
import { FieldWithTableSelection, TimeBoundSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceTable } from '@/components/Sequence/SequenceTable'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'

export const TimeUnitTab = () => {
  const { textField, dropdown, data, editData, mode } = useDetailContext<TimeUnitDetailsType>()

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
    ['Name', textField('tu_display_name', { type: 'text', disabled: true })],
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

  const low_bound =
    mode.new || !data.low_bound
      ? []
      : [
          ['Id', editData.low_bound ? editData.low_bound.bid : data.low_bound.bid],
          ['Name', editData.low_bound ? editData.low_bound.b_name : data.low_bound.b_name],
          ['Age', editData.low_bound ? editData.low_bound.age : data.low_bound.age],
          ['Comment', editData.low_bound ? editData.low_bound.b_comment : data.low_bound.b_comment],
        ]

  const up_bound =
    mode.new || !data.up_bound
      ? []
      : [
          ['Id', editData.up_bound ? editData.up_bound.bid : data.up_bound.bid],
          ['Name', editData.up_bound ? editData.up_bound.b_name : data.up_bound.b_name],
          ['Age', editData.up_bound ? editData.up_bound.age : data.up_bound.age],
          ['Comment', editData.up_bound ? editData.up_bound.b_comment : data.up_bound.b_comment],
        ]

  const time_bound_edit = [
    [
      'New Upper Bound Id',
      <TimeBoundSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="up_bnd"
        sourceField="bid"
        targetField="up_bnd"
        selectorTable={<TimeBoundTable showBid />}
      />,
    ],
    [
      'New Lower Bound Id',
      <TimeBoundSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="low_bnd"
        sourceField="bid"
        targetField="low_bnd"
        selectorTable={<TimeBoundTable showBid />}
      />,
    ],
  ]
  let lowerBoundTitle: string
  let upperBoundTitle: string
  if (!editData.low_bound) {
    lowerBoundTitle = 'Lower bound'
  } else {
    lowerBoundTitle = editData.low_bound.bid === data.low_bound.bid ? 'Lower bound' : 'Lower bound (edited)'
  }
  if (!editData.up_bound) {
    upperBoundTitle = 'Upper bound'
  } else {
    upperBoundTitle = editData.up_bound.bid === data.up_bound.bid ? 'Upper bound' : 'Upper bound (edited)'
  }

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      {!mode.new && data.low_bound && data.up_bound && (
        <>
          <ArrayFrame
            array={low_bound}
            title={lowerBoundTitle}
            highlighted={lowerBoundTitle === 'Lower bound (edited)' ? true : false}
          />
          <ArrayFrame
            array={up_bound}
            title={upperBoundTitle}
            highlighted={upperBoundTitle === 'Upper bound (edited)' ? true : false}
          />
        </>
      )}
      {!mode.read && <ArrayFrame array={time_bound_edit} title="Edit bounds" />}
    </>
  )
}

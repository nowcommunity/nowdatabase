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
    ['Name', textField('tu_display_name', { type: 'text', disabled: mode.new ? false : true })],
    ['Rank', dropdown('rank', rankOptions, 'Rank')],
    [
      'Sequence',
      <FieldWithTableSelection<SequenceDetailsType, TimeUnitDetailsType>
        key="sequence"
        sourceField="sequence"
        targetField="sequence"
        selectorTable={<SequenceTable />}
      />,
    ],
    ['Comment', textField('tu_comment')],
  ]

  const up_id = editData.up_bound ? editData.up_bound.bid : data.up_bound ? data.up_bound.bid : ''
  const up_bname = editData.up_bound ? editData.up_bound.b_name : data.up_bound ? data.up_bound.b_name : ''
  const up_age = editData.up_bound ? editData.up_bound.age : data.up_bound ? data.up_bound.age : ''
  const up_bcomment = editData.up_bound ? editData.up_bound.b_comment : data.up_bound ? data.up_bound.b_comment : ''

  const upBound = [
    [
      'Select New Upper Bound',
      <TimeBoundSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="up_bnd"
        sourceField="bid"
        targetField="up_bnd"
        selectorTable={<TimeBoundTable showBid />}
      />,
    ],
    ['Id', up_id],
    ['Name', up_bname],
    ['Age', up_age],
    ['Comment', up_bcomment],
  ]

  const low_id = editData.low_bound ? editData.low_bound.bid : data.low_bound ? data.low_bound.bid : ''
  const low_bname = editData.low_bound ? editData.low_bound.b_name : data.low_bound ? data.low_bound.b_name : ''
  const low_age = editData.low_bound ? editData.low_bound.age : data.low_bound ? data.low_bound.age : ''
  const low_bcomment = editData.low_bound
    ? editData.low_bound.b_comment
    : data.low_bound
      ? data.low_bound.b_comment
      : ''

  const lowBound = [
    [
      'Select New Lower Bound',
      <TimeBoundSelection<TimeBoundDetailsType, TimeUnitDetailsType>
        key="low_bnd"
        sourceField="bid"
        targetField="low_bnd"
        selectorTable={<TimeBoundTable showBid />}
      />,
    ],
    ['Id', low_id],
    ['Name', low_bname],
    ['Age', low_age],
    ['Comment', low_bcomment],
  ]

  let upperBoundTitle: string
  let lowerBoundTitle: string
  if (!editData.up_bound || !data.up_bound) {
    upperBoundTitle = 'Upper bound'
  } else {
    upperBoundTitle = editData.up_bound.bid === data.up_bound.bid ? 'Upper bound' : 'Upper bound (edited)'
  }
  if (!editData.low_bound || !data.low_bound) {
    lowerBoundTitle = 'Lower bound'
  } else {
    lowerBoundTitle = editData.low_bound.bid === data.low_bound.bid ? 'Lower bound' : 'Lower bound (edited)'
  }

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      <>
        <ArrayFrame
          array={upBound}
          title={upperBoundTitle}
          highlighted={upperBoundTitle === 'Upper bound (edited)' ? true : false}
        />
        <ArrayFrame
          array={lowBound}
          title={lowerBoundTitle}
          highlighted={lowerBoundTitle === 'Lower bound (edited)' ? true : false}
        />
      </>
    </>
  )
}

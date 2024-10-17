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
        ['Id', editData.low_bound!.bid],
        ['Name', editData.low_bound!.b_name],
        ['Age', editData.low_bound!.age],
        ['Comment', editData.low_bound!.b_comment],
      ]

  const up_bound = mode.new
    ? []
    : [
        ['Id', editData.up_bound!.bid],
        ['Name', editData.up_bound!.b_name],
        ['Age', editData.up_bound!.age],
        ['Comment', editData.up_bound!.b_comment],
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

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      {!mode.new && (
        <>
          <ArrayFrame
            array={low_bound}
            title={editData.low_bound!.bid === data.low_bound?.bid ? 'Lower bound' : 'Lower Bound (edited)'}
            highlighted={editData.low_bound!.bid !== data.low_bound?.bid ? true : false}
          />
          <ArrayFrame
            array={up_bound}
            title={editData.up_bound!.bid === data.up_bound?.bid ? 'Upper bound' : 'Upper Bound (edited)'}
            highlighted={editData.up_bound!.bid !== data.up_bound?.bid ? true : false}
          />
        </>
      )}
      {!mode.read && <ArrayFrame array={time_bound_edit} title="Edit bounds" />}
    </>
  )
}

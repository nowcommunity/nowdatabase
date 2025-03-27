import { SequenceDetailsType, TimeUnitDetailsType } from '@/shared/types'
import { FieldWithTableSelection, TimeBoundSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame, Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceTable } from '@/components/Sequence/SequenceTable'
import { TimeBoundTable } from '@/components/TimeBound/TimeBoundTable'
import { Box } from '@mui/material'

export const TimeUnitTab = () => {
  const { textField, dropdown, data, editData, fieldsWithErrors, mode } = useDetailContext<TimeUnitDetailsType>()

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
    ['Id', low_id],
    ['Name', low_bname],
    ['Age', low_age],
    ['Comment', low_bcomment],
  ]

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      <>
        <Grouped title="Upper Bound" error={'up_bnd' in fieldsWithErrors}>
          {!mode.read && (
            <Box display="flex" gap={1} marginBottom={'15px'}>
              <TimeBoundSelection key="up_bnd" targetField="up_bnd" />
            </Box>
          )}
          <ArrayFrame array={upBound} title={'Selected Upper Bound'} />
        </Grouped>
        <Grouped title="Lower Bound" error={'low_bnd' in fieldsWithErrors}>
          {!mode.read && (
            <Box display="flex" gap={1} marginBottom={'15px'}>
              <TimeBoundSelection key="low_bnd" targetField="low_bnd" />
            </Box>
          )}
          <ArrayFrame array={lowBound} title={'Selected Lower Bound'} />
        </Grouped>
      </>
    </>
  )
}

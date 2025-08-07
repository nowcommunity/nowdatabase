import { SequenceDetailsType, TimeBound, TimeUnitDetailsType } from '@/shared/types'
import { FieldWithTableSelection, TimeBoundSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame, Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { SequenceTable } from '@/components/Sequence/SequenceTable'
import { Box } from '@mui/material'
import { EditingForm, EditingFormField } from '@/components/DetailView/common/EditingForm'

export const TimeUnitTab = () => {
  const { textField, dropdown, data, editData, setEditData, fieldsWithErrors, mode } =
    useDetailContext<TimeUnitDetailsType>()

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

  const formFields: EditingFormField[] = [
    { name: 'b_name', label: 'Name', required: true },
    { name: 'age', label: 'Age (Ma)', required: true, type: 'number' },
    { name: 'b_comment', label: 'Comment', required: false },
  ]

  return (
    <>
      <ArrayFrame array={timeUnit} title="Time Unit" />
      <>
        <Grouped title="Upper Bound" error={'up_bnd' in fieldsWithErrors}>
          {!mode.read && (
            <Box display="flex" gap={1} marginBottom={'15px'}>
              <EditingForm<TimeBound, TimeUnitDetailsType>
                dataCy="add-new-up-bound-form"
                buttonText="Add new time bound"
                formFields={formFields}
                editAction={(newUpTimeBound: TimeBound) => {
                  setEditData({
                    ...editData,
                    up_bnd: undefined,
                    up_bound: {
                      b_name: newUpTimeBound.b_name,
                      age: Number(newUpTimeBound.age),
                      b_comment: newUpTimeBound.b_comment,
                    },
                  })
                }}
              />
              <TimeBoundSelection key="up_bnd" targetField="up_bnd" />
            </Box>
          )}
          <ArrayFrame array={upBound} title={'Selected Upper Bound'} />
        </Grouped>
        <Grouped title="Lower Bound" error={'low_bnd' in fieldsWithErrors}>
          {!mode.read && (
            <Box display="flex" gap={1} marginBottom={'15px'}>
              <EditingForm<TimeBound, TimeUnitDetailsType>
                dataCy="add-new-low-bound-form"
                buttonText="Add new time bound"
                formFields={formFields}
                editAction={(newLowTimeBound: TimeBound) => {
                  setEditData({
                    ...editData,
                    low_bnd: undefined,
                    low_bound: {
                      b_name: newLowTimeBound.b_name,
                      age: Number(newLowTimeBound.age),
                      b_comment: newLowTimeBound.b_comment,
                    },
                  })
                }}
              />
              <TimeBoundSelection key="low_bnd" targetField="low_bnd" />
            </Box>
          )}
          <ArrayFrame array={lowBound} title={'Selected Lower Bound'} />
        </Grouped>
      </>
    </>
  )
}

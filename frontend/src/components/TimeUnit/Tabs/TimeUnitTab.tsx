import { useEffect, useMemo } from 'react'
import { TimeBound, TimeUnitDetailsType } from '@/shared/types'
import { TimeBoundSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame, Grouped } from '@/components/DetailView/common/tabLayoutHelpers'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { Alert, Box } from '@mui/material'
import { EditingForm, EditingFormField } from '@/components/DetailView/common/EditingForm'
import { SequenceSelect } from '@/components/Sequence/SequenceSelect'
import { useGetAllTimeUnitsQuery } from '@/redux/timeUnitReducer'
import { skipToken } from '@reduxjs/toolkit/query'

const DUPLICATE_NAME_FIELD = 'duplicateTimeUnitName'
const DUPLICATE_NAME_MESSAGE = 'Time unit with this name already exists.'

const normalizeTimeUnitName = (name: string | null | undefined) => (name ?? '').toLowerCase().replace(' ', '').trim()

export const TimeUnitTab = () => {
  const { textField, dropdown, data, editData, setEditData, fieldsWithErrors, setFieldsWithErrors, mode } =
    useDetailContext<TimeUnitDetailsType>()

  const { data: allTimeUnits } = useGetAllTimeUnitsQuery(mode.new ? undefined : skipToken)

  const normalizedInputName = useMemo(() => normalizeTimeUnitName(editData.tu_display_name), [editData.tu_display_name])

  const hasDuplicateName = useMemo(() => {
    if (!mode.new || !allTimeUnits || !normalizedInputName) return false

    return allTimeUnits.some(timeUnit => {
      const normalizedDisplayName = normalizeTimeUnitName(timeUnit.tu_display_name)
      const normalizedId = normalizeTimeUnitName(timeUnit.tu_name)

      return normalizedInputName === normalizedDisplayName || normalizedInputName === normalizedId
    })
  }, [allTimeUnits, mode.new, normalizedInputName])

  useEffect(() => {
    setFieldsWithErrors(prevFieldsWithErrors => {
      const duplicateErrorExists = DUPLICATE_NAME_FIELD in prevFieldsWithErrors

      if (!mode.new || !hasDuplicateName) {
        if (!duplicateErrorExists) return prevFieldsWithErrors

        const { [DUPLICATE_NAME_FIELD]: _removed, ...remaining } = prevFieldsWithErrors
        return remaining
      }

      const duplicateError = prevFieldsWithErrors[DUPLICATE_NAME_FIELD]
      if (duplicateError?.error === DUPLICATE_NAME_MESSAGE) return prevFieldsWithErrors

      return {
        ...prevFieldsWithErrors,
        [DUPLICATE_NAME_FIELD]: { name: 'duplicate_name', error: DUPLICATE_NAME_MESSAGE },
      }
    })
  }, [hasDuplicateName, mode.new, setFieldsWithErrors])

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
    ['Sequence', <SequenceSelect key="sequence" />],
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
      {hasDuplicateName && (
        <Alert severity="warning" data-testid="duplicate-timeunit-warning">
          {DUPLICATE_NAME_MESSAGE}
        </Alert>
      )}
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

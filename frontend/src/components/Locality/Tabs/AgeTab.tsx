import { EditDataType, LocalityDetailsType } from '@/shared/types'
import { BasisForAgeSelection } from '@/components/DetailView/common/editingComponents'
import { emptyOption } from '@/components/DetailView/common/misc'
import { ArrayFrame, HalfFrames } from '@/components/DetailView/common/tabLayoutHelpers'
import { makeEditData, useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { TimeUnitTable } from '@/components/TimeUnit/TimeUnitTable'
import { useGetTimeUnitDetailsQuery } from '@/redux/timeUnitReducer'
import { skipToken } from '@reduxjs/toolkit/query'
import { CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'

type LocalityDatingMethod = 'time_unit' | 'absolute' | 'composite'

type AgeFields = Pick<
  EditDataType<LocalityDetailsType>,
  'min_age' | 'bfa_min_abs' | 'bfa_min' | 'frac_min' | 'max_age' | 'bfa_max_abs' | 'bfa_max' | 'frac_max'
>

type AgeDraftsByMethod = Record<LocalityDatingMethod, AgeFields>

const emptyAgeFields = (): AgeFields => ({
  min_age: undefined,
  bfa_min_abs: '',
  bfa_min: '',
  frac_min: '',
  max_age: undefined,
  bfa_max_abs: '',
  bfa_max: '',
  frac_max: '',
})

const getAgeFields = (editData: EditDataType<LocalityDetailsType>): AgeFields => ({
  min_age: editData.min_age,
  bfa_min_abs: editData.bfa_min_abs,
  bfa_min: editData.bfa_min,
  frac_min: editData.frac_min,
  max_age: editData.max_age,
  bfa_max_abs: editData.bfa_max_abs,
  bfa_max: editData.bfa_max,
  frac_max: editData.frac_max,
})

const toDatingMethod = (value: number | string | boolean | undefined): LocalityDatingMethod | null => {
  if (value === 'time_unit' || value === 'absolute' || value === 'composite') return value
  return null
}

const initializeDrafts = (editData: EditDataType<LocalityDetailsType>): AgeDraftsByMethod => {
  const drafts = {
    time_unit: emptyAgeFields(),
    absolute: emptyAgeFields(),
    composite: emptyAgeFields(),
  }

  const dateMethod = toDatingMethod(editData.date_meth)
  if (!dateMethod) return drafts

  return { ...drafts, [dateMethod]: getAgeFields(editData) }
}

export const AgeTab = () => {
  const { textField, radioSelection, dropdown, bigTextField, editData, setEditData, data } =
    useDetailContext<LocalityDetailsType>()
  const [ageDraftsByMethod, setAgeDraftsByMethod] = useState<AgeDraftsByMethod>(() => initializeDrafts(editData))

  const { data: bfaMinData, isFetching: bfaMinFetching } = useGetTimeUnitDetailsQuery(editData.bfa_min || skipToken)
  const { data: bfaMaxData, isFetching: bfaMaxFetching } = useGetTimeUnitDetailsQuery(editData.bfa_max || skipToken)

  useEffect(() => {
    setAgeDraftsByMethod(initializeDrafts(makeEditData(data)))
  }, [data])

  const minTimeUnitDisplay = data.bfa_min_time_unit?.tu_display_name
  const maxTimeUnitDisplay = data.bfa_max_time_unit?.tu_display_name

  if (bfaMinFetching || bfaMaxFetching) return <CircularProgress />

  const fracOptions = [
    emptyOption,
    { display: 'Early half 1:2', value: '1:2' },
    { display: 'Late half 2:2', value: '2:2' },
    { display: 'Early third 1:3', value: '1:3' },
    { display: 'Middle third 2:3', value: '2:3' },
    { display: 'Late third 3:3', value: '3:3' },
  ]

  const bfa_abs_options = [
    'AAR',
    'Ar/Ar',
    'C14',
    'chemical',
    'Delta_018',
    'ESR',
    'fission_track',
    'K/Ar',
    'obsidian_hyd',
    'other_absolute',
    'other_radiometric',
    'Rb/Sr',
    'Sr/Sr',
    'TL',
    'tree_ring',
    'U-series',
    'U/Th',
  ]

  const handleDateMethChange = (value: number | string | boolean) => {
    const nextDateMethod = toDatingMethod(value)
    if (!nextDateMethod) return

    const currentDateMethod = toDatingMethod(editData.date_meth)
    const nextDrafts = { ...ageDraftsByMethod }

    if (currentDateMethod) {
      nextDrafts[currentDateMethod] = getAgeFields(editData)
    }

    const restoredFields = nextDrafts[nextDateMethod] ?? emptyAgeFields()

    setAgeDraftsByMethod(nextDrafts)

    setEditData({
      ...editData,
      date_meth: nextDateMethod,
      ...restoredFields,
    })
  }

  const minAgeAbsoluteDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_max_abs) ||
    (editData.date_meth === 'composite' && !!editData.bfa_min) ||
    editData.date_meth === 'time_unit'
  const minAgeTimeUnitDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_max) ||
    (editData.date_meth === 'composite' && !!editData.bfa_min_abs) ||
    editData.date_meth === 'absolute'
  const maxAgeAbsoluteDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_min_abs) ||
    (editData.date_meth === 'composite' && !!editData.bfa_max) ||
    editData.date_meth === 'time_unit'
  const maxAgeTimeUnitDisabled =
    (editData.date_meth === 'composite' && !!editData.bfa_min) ||
    (editData.date_meth === 'composite' && !!editData.bfa_max_abs) ||
    editData.date_meth === 'absolute'

  // TODO: The date_meth options should come from db: distinct(now_loc.date_meth)
  const age = [
    [
      'Dating method',
      radioSelection(
        'date_meth',
        [
          { value: 'time_unit', display: 'Time unit' },
          { value: 'absolute', display: 'Absolute' },
          { value: 'composite', display: 'Composite' },
        ],
        'dating-method',
        { handleSetEditData: handleDateMethChange }
      ),
    ],
    [''],
    ['', 'Age (Ma)', 'Basis for age (Absolute)', 'Basis for age (Time Unit)', 'Basis for age (Fraction)'],
    [
      'Minimum age',
      textField('min_age', { type: 'number', round: 3, readonly: minAgeAbsoluteDisabled }),
      dropdown('bfa_min_abs', bfa_abs_options, 'Min Basis for age (absolute)', minAgeAbsoluteDisabled),
      <BasisForAgeSelection
        key="bfa_min"
        targetField="bfa_min"
        fraction={editData.frac_min}
        timeUnit={bfaMinData}
        selectorTable={<TimeUnitTable clickableRows={false} />}
        disabled={minAgeTimeUnitDisabled}
        displayValue={minTimeUnitDisplay}
      />,
      dropdown('frac_min', fracOptions, 'Minimum fraction', minAgeTimeUnitDisabled),
    ],
    [
      'Maximum age',
      textField('max_age', { type: 'number', round: 3, readonly: maxAgeAbsoluteDisabled }),
      dropdown('bfa_max_abs', bfa_abs_options, 'Max Basis for age (absolute)', maxAgeAbsoluteDisabled),
      <BasisForAgeSelection
        key="bfa_max"
        targetField="bfa_max"
        fraction={editData.frac_max}
        timeUnit={bfaMaxData}
        selectorTable={<TimeUnitTable />}
        disabled={maxAgeTimeUnitDisabled}
        displayValue={maxTimeUnitDisplay}
      />,
      dropdown('frac_max', fracOptions, 'Maximum fraction', maxAgeTimeUnitDisabled),
    ],
    [''],
    ['Chronostratigraphic Age', textField('chron')],
    ['Age Comment', bigTextField('age_comm')],
  ]

  const lithostratigraphy = [
    ['Group', textField('lgroup')],
    ['Formation', textField('formation')],
    ['Member', textField('member')],
    ['Bed', textField('bed')],
  ]

  const sampleUnit = [
    ['Datum Plane', textField('datum_plane')],
    ['Top of Sample Unit (m)', textField('tos', { type: 'number' })],
    ['Bottom of Sample Unit (m)', textField('bos', { type: 'number' })],
  ]

  const basinInformation = [
    ['Basin', textField('basin')],
    ['Subbasin', textField('subbasin')],
  ]

  return (
    <>
      <ArrayFrame array={age} title="Age" />
      <ArrayFrame array={lithostratigraphy} title="Lithostratigraphy" />
      <HalfFrames>
        <ArrayFrame half array={sampleUnit} title="Sample Unit" />
        <ArrayFrame half array={basinInformation} title="Basin Information" />
      </HalfFrames>
    </>
  )
}

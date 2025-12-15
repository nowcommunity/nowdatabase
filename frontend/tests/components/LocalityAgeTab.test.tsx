import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { AgeTab } from '@/components/Locality/Tabs/AgeTab'
import { DetailContext, type DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, LocalityDetailsType } from '@/shared/types'

jest.mock('@/redux/timeUnitReducer', () => ({
  useGetTimeUnitDetailsQuery: () => ({ data: undefined, isFetching: false }),
}))

jest.mock('@/components/TimeUnit/TimeUnitTable', () => ({
  TimeUnitTable: () => <div data-testid="time-unit-table" />,
}))

type TestDetailContext = DetailContextType<LocalityDetailsType>

type ContextOverrides = Partial<TestDetailContext>

const createLocalityDetails = (overrides: Partial<LocalityDetailsType> = {}) =>
  ({
    lid: 1,
    loc_name: 'Test locality',
    date_meth: 'time_unit',
    min_age: null,
    max_age: null,
    bfa_min: 'min_tu',
    bfa_max: 'max_tu',
    bfa_min_abs: '',
    bfa_max_abs: '',
    frac_min: '',
    frac_max: '',
    chron: '',
    age_comm: '',
    basin: '',
    subbasin: '',
    lgroup: '',
    formation: '',
    member: '',
    bed: '',
    datum_plane: '',
    tos: null,
    bos: null,
    now_mus: [],
    now_ls: [],
    now_syn_loc: [],
    now_ss: [],
    now_coll_meth: [],
    now_plr: [],
    now_lau: [],
    projects: [],
    bfa_min_time_unit: { tu_name: 'min_tu', tu_display_name: 'Min Display' },
    bfa_max_time_unit: { tu_name: 'max_tu', tu_display_name: 'Max Display' },
    ...overrides,
  }) as unknown as LocalityDetailsType

const createContextValue = (overrides: ContextOverrides = {}): TestDetailContext => {
  const data = overrides.data ?? createLocalityDetails()
  return {
    data,
    mode: overrides.mode ?? modeOptionToMode.read,
    setMode: jest.fn(),
    editData: overrides.editData ?? (data as EditDataType<LocalityDetailsType>),
    setEditData: overrides.setEditData ?? jest.fn(),
    textField: () => <input aria-label="text-field" readOnly />,
    bigTextField: () => <textarea aria-label="big-text-field" readOnly />,
    dropdown: () => <select aria-label="dropdown" />,
    dropdownWithSearch: () => <select aria-label="dropdown-with-search" />,
    radioSelection: () => <input type="radio" aria-label="radio-selection" readOnly />,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: jest.fn(),
    isDirty: false,
    resetEditData: jest.fn(),
    ...overrides,
  }
}

const renderWithContext = (contextOverrides: ContextOverrides = {}) => {
  const contextValue = createContextValue(contextOverrides)
  return render(
    <DetailContext.Provider value={contextValue as unknown as DetailContextType<unknown>}>
      <AgeTab />
    </DetailContext.Provider>
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('AgeTab time unit display values', () => {
  it('shows display values for basis for age fields in read mode', () => {
    renderWithContext()

    expect(screen.getByText('Min Display')).toBeTruthy()
    expect(screen.getByText('Max Display')).toBeTruthy()
  })

  it('keeps tu_name values bound for editing', () => {
    const data = createLocalityDetails({
      bfa_min: 'min_tu_name',
      bfa_max: 'max_tu_name',
      bfa_min_time_unit: { tu_name: 'min_tu_name', tu_display_name: 'Min TU' },
      bfa_max_time_unit: { tu_name: 'max_tu_name', tu_display_name: 'Max TU' },
    })
    renderWithContext({ mode: modeOptionToMode.edit, data })

    expect(screen.getByDisplayValue('min_tu_name')).toBeTruthy()
    expect(screen.getByDisplayValue('max_tu_name')).toBeTruthy()
  })
})

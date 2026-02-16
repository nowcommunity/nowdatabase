import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ReactNode, useState } from 'react'
import { AgeTab } from './AgeTab'
import { DetailContext, DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { EditDataType, LocalityDetailsType } from '@/shared/types'
import { DropdownOption } from '@/components/DetailView/common/editingComponents'
import { OptionalRadioSelectionProps, TextFieldOptions } from '@/components/DetailView/DetailView'
import '@testing-library/jest-dom'

jest.mock('@/redux/timeUnitReducer', () => ({
  useGetTimeUnitDetailsQuery: () => ({ data: undefined, isFetching: false }),
}))

jest.mock('@/components/TimeUnit/TimeUnitTable', () => ({
  TimeUnitTable: () => <div>TimeUnitTable</div>,
}))

const toDisplayValue = (option: DropdownOption | string): string => {
  if (typeof option === 'string') return option
  return option.display
}

const toRawValue = (option: DropdownOption | string): number | string | boolean => {
  if (typeof option === 'string') return option
  return option.value
}

const initialEditData = {
  date_meth: 'time_unit',
  min_age: 10,
  max_age: 20,
  bfa_min_abs: '',
  bfa_max_abs: '',
  bfa_min: 'tu-min-initial',
  bfa_max: 'tu-max-initial',
  frac_min: '1:2',
  frac_max: '2:2',
  chron: '',
  age_comm: '',
} as unknown as EditDataType<LocalityDetailsType>

const toInputValue = (value: unknown): string => {
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  return ''
}

const ContextWrapper = ({ children }: { children: ReactNode }) => {
  const [editData, setEditData] = useState<EditDataType<LocalityDetailsType>>(initialEditData)

  const setFieldValue = (field: keyof EditDataType<LocalityDetailsType>, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value === '' ? '' : Number.isNaN(Number(value)) ? value : Number(value),
    }))
  }

  const contextValue: DetailContextType<LocalityDetailsType> = {
    data: initialEditData as unknown as LocalityDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => undefined,
    editData,
    setEditData,
    isDirty: false,
    resetEditData: () => setEditData(initialEditData),
    textField: (field: keyof EditDataType<LocalityDetailsType>, options?: TextFieldOptions) => (
      <input
        aria-label={String(field)}
        value={toInputValue(editData[field])}
        readOnly={options?.readonly}
        onChange={event => setFieldValue(field, event.currentTarget.value)}
      />
    ),
    bigTextField: (field: keyof EditDataType<LocalityDetailsType>) => (
      <textarea
        aria-label={String(field)}
        value={toInputValue(editData[field])}
        onChange={event => setFieldValue(field, event.currentTarget.value)}
      />
    ),
    dropdown: (field: keyof EditDataType<LocalityDetailsType>) => (
      <input
        aria-label={String(field)}
        value={toInputValue(editData[field])}
        onChange={event => setFieldValue(field, event.currentTarget.value)}
      />
    ),
    dropdownWithSearch: () => <></>,
    radioSelection: (
      field: keyof EditDataType<LocalityDetailsType>,
      options: Array<DropdownOption | string>,
      _name: string,
      optionalRadioSelectionProps?: OptionalRadioSelectionProps
    ) => (
      <>
        {options.map(option => (
          <button
            key={String(toRawValue(option))}
            type="button"
            onClick={() => {
              const value = toRawValue(option)
              if (optionalRadioSelectionProps?.handleSetEditData) {
                optionalRadioSelectionProps.handleSetEditData(value)
                return
              }
              setEditData(prev => ({ ...prev, [field]: value }))
            }}
          >
            {toDisplayValue(option)}
          </button>
        ))}
      </>
    ),
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => undefined,
  }

  return <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>{children}</DetailContext.Provider>
}

describe('AgeTab', () => {
  it('preserves per-method age drafts while switching dating method', async () => {
    const user = userEvent.setup()

    render(
      <ContextWrapper>
        <AgeTab />
      </ContextWrapper>
    )

    await user.click(screen.getByRole('button', { name: 'Composite' }))

    const minAgeInput = screen.getByLabelText('min_age')
    const maxAgeInput = screen.getByLabelText('max_age')

    await user.clear(minAgeInput)
    await user.type(minAgeInput, '1.5')
    await user.clear(maxAgeInput)
    await user.type(maxAgeInput, '2.5')
    const minAbsInput = screen.getByLabelText('bfa_min_abs')
    const maxAbsInput = screen.getByLabelText('bfa_max_abs')

    await user.clear(minAbsInput)
    await user.type(minAbsInput, 'AAR')
    await user.clear(maxAbsInput)
    await user.type(maxAbsInput, 'C14')

    await user.click(screen.getByRole('button', { name: 'Time unit' }))

    expect(screen.getByLabelText<HTMLInputElement>('min_age').value).toBe('10')
    expect(screen.getByLabelText<HTMLInputElement>('max_age').value).toBe('20')
    expect(screen.getByLabelText<HTMLInputElement>('bfa_min').value).toBe('tu-min-initial')
    expect(screen.getByLabelText<HTMLInputElement>('bfa_max').value).toBe('tu-max-initial')
    expect(screen.getByLabelText<HTMLInputElement>('frac_min').value).toBe('1:2')
    expect(screen.getByLabelText<HTMLInputElement>('frac_max').value).toBe('2:2')

    await user.click(screen.getByRole('button', { name: 'Composite' }))

    expect(screen.getByLabelText<HTMLInputElement>('min_age').value).toBe('1.5')
    expect(screen.getByLabelText<HTMLInputElement>('max_age').value).toBe('2.5')
    expect(screen.getByLabelText<HTMLInputElement>('bfa_min_abs').value).toBe('AAR')
    expect(screen.getByLabelText<HTMLInputElement>('bfa_max_abs').value).toBe('C14')
  })
})

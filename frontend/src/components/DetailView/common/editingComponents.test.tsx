import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailContext, DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { BasisForAgeSelection, EditableTextField } from './editingComponents'
import { EditDataType, LocalityDetailsType, TimeUnit } from '@/shared/types'
import { ReactNode, useState } from 'react'
import '@testing-library/jest-dom'

const mockTimeUnit: TimeUnit = {
  tu_name: 'abdounian',
  tu_display_name: 'abdounian',
  seq_name: 'sequence',
  low_bound: 40,
  up_bound: 45,
  rank: 'Age',
}

const SelectorTable = ({ selectorFn }: { selectorFn?: (timeUnit: TimeUnit) => void }) => (
  <button type="button" onClick={() => selectorFn?.(mockTimeUnit)}>
    choose time unit
  </button>
)

const Wrapper = ({ children }: { children: ReactNode }) => {
  const initialEditData = {
    min_age: 10,
    max_age: 20,
    frac_min: '',
    frac_max: '',
    bfa_min: '',
    bfa_max: '',
  } as unknown as EditDataType<LocalityDetailsType>

  const [editData, setEditData] = useState<EditDataType<LocalityDetailsType>>(initialEditData)

  const contextValue: DetailContextType<LocalityDetailsType> = {
    data: initialEditData as unknown as LocalityDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => undefined,
    editData,
    setEditData,
    isDirty: false,
    resetEditData: () => setEditData(initialEditData),
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => undefined,
  }

  return (
    <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>
      <div data-testid="min-age">{editData.min_age}</div>
      <BasisForAgeSelection targetField="bfa_min" fraction={editData.frac_min} selectorTable={<SelectorTable />} />
      {children}
    </DetailContext.Provider>
  )
}

const FractionUpdateWrapper = () => {
  const initialEditData = {
    min_age: 10,
    max_age: 20,
    frac_min: '',
    bfa_min: '',
  } as unknown as EditDataType<LocalityDetailsType>

  const [editData, setEditData] = useState<EditDataType<LocalityDetailsType>>(initialEditData)

  const contextValue: DetailContextType<LocalityDetailsType> = {
    data: initialEditData as unknown as LocalityDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => undefined,
    editData,
    setEditData,
    isDirty: false,
    resetEditData: () => setEditData(initialEditData),
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => undefined,
  }

  return (
    <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>
      <div data-testid="min-age">{editData.min_age}</div>
      <button type="button" onClick={() => setEditData({ ...editData, frac_min: '1:2' })}>
        set fraction 1:2
      </button>
      <BasisForAgeSelection targetField="bfa_min" fraction={editData.frac_min} selectorTable={<SelectorTable />} />
    </DetailContext.Provider>
  )
}

describe('BasisForAgeSelection', () => {
  it('keeps minimum age populated when selecting a time unit without a fraction', async () => {
    const user = userEvent.setup()

    render(
      <Wrapper>
        <div />
      </Wrapper>
    )

    const basisField = screen.getByRole<HTMLInputElement>('textbox')

    await user.click(basisField)
    await user.click(screen.getByRole('button', { name: /choose time unit/i }))

    await waitFor(() => {
      const minAge = screen.getByTestId('min-age')
      const updatedBasisField = screen.getByRole<HTMLInputElement>('textbox')
      expect(minAge.textContent).toContain('45')
      expect(updatedBasisField.value).toBe('abdounian')
    })
  })

  it('recalculates minimum age when fraction changes after selecting a time unit', async () => {
    const user = userEvent.setup()

    render(<FractionUpdateWrapper />)

    await user.click(screen.getByRole('textbox'))
    await user.click(screen.getByRole('button', { name: /choose time unit/i }))

    await waitFor(() => {
      expect(screen.getByTestId('min-age').textContent).toContain('45')
    })

    await user.click(screen.getByRole('button', { name: /set fraction 1:2/i }))

    await waitFor(() => {
      expect(screen.getByTestId('min-age').textContent).toContain('42.5')
    })
  })
})

const NumberInputWrapper = ({ handleSetEditData }: { handleSetEditData?: (value: number | string) => void }) => {
  const initialEditData = { min_age: '' } as unknown as EditDataType<LocalityDetailsType>
  const [editData, setEditData] = useState<EditDataType<LocalityDetailsType>>(initialEditData)

  const contextValue: DetailContextType<LocalityDetailsType> = {
    data: initialEditData as unknown as LocalityDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => undefined,
    editData,
    setEditData,
    isDirty: false,
    resetEditData: () => setEditData(initialEditData),
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => undefined,
  }

  return (
    <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>
      <div data-testid="min-age">{String(editData.min_age ?? '')}</div>
      <EditableTextField<LocalityDetailsType> field="min_age" type="number" handleSetEditData={handleSetEditData} />
    </DetailContext.Provider>
  )
}

describe('EditableTextField (number)', () => {
  it('rejects non-numeric characters like e/E/+ while typing', async () => {
    const user = userEvent.setup()
    render(<NumberInputWrapper />)

    const input = screen.getByRole<HTMLInputElement>('spinbutton')
    await user.type(input, '12e3')

    expect(input.value).toBe('123')
    expect(screen.getByTestId('min-age').textContent).toBe('123')
  })

  it('allows negative numbers without setting NaN in editData', async () => {
    const user = userEvent.setup()
    render(<NumberInputWrapper />)

    const input = screen.getByRole<HTMLInputElement>('spinbutton')
    await user.type(input, '-1.5')

    expect(input.value).toBe('-1.5')
    expect(screen.getByTestId('min-age').textContent).toBe('-1.5')
  })

  it('calls handleSetEditData only with numbers or empty string', async () => {
    const user = userEvent.setup()
    const handleSetEditData = jest.fn()

    render(<NumberInputWrapper handleSetEditData={handleSetEditData} />)

    const input = screen.getByRole<HTMLInputElement>('spinbutton')
    await user.type(input, '1e2')

    for (const call of handleSetEditData.mock.calls) {
      const arg = call[0]
      expect(typeof arg === 'number' || arg === '').toBe(true)
    }
  })
})

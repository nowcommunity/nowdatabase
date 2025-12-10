import { describe, expect, it } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DetailContext, DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { BasisForAgeSelection } from './editingComponents'
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
})

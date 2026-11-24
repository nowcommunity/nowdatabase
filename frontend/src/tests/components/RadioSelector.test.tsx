import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { DetailContext, type DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { RadioSelector } from '@/components/DetailView/common/editingComponents'
import type { EditDataType, LocalityDetailsType } from '@/shared/types'

const ApproximateCoordinatesRadio = ({ preserveEmptyValue = false }: { preserveEmptyValue?: boolean }) => {
  const initialEditData = { approx_coord: null } as unknown as EditDataType<LocalityDetailsType>
  const [editData, setEditData] = useState(initialEditData)

  const contextValue = {
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
  } as DetailContextType<LocalityDetailsType>

  return (
    <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>
      <output data-testid="approx-coord">{String(editData.approx_coord)}</output>
      <RadioSelector<LocalityDetailsType>
        field="approx_coord"
        name="Approximate Coordinates"
        options={[
          { value: 'false', display: 'No' },
          { value: 'true', display: 'Yes' },
        ]}
        preserveEmptyValue={preserveEmptyValue}
      />
    </DetailContext.Provider>
  )
}

describe('RadioSelector empty values', () => {
  it('preserves a null value and leaves the radio options unselected when requested', () => {
    render(<ApproximateCoordinatesRadio preserveEmptyValue />)

    expect(screen.getByTestId('approx-coord').textContent).toBe('null')
    expect(screen.getByRole<HTMLInputElement>('radio', { name: 'No' }).checked).toBe(false)
    expect(screen.getByRole<HTMLInputElement>('radio', { name: 'Yes' }).checked).toBe(false)
  })

  it('keeps the existing default behavior unless empty values are preserved', () => {
    render(<ApproximateCoordinatesRadio />)

    expect(screen.getByTestId('approx-coord').textContent).toBe('false')
    expect(screen.getByRole<HTMLInputElement>('radio', { name: 'No' }).checked).toBe(true)
  })

  it('stores an explicit selection after preserving an unset value', async () => {
    const user = userEvent.setup()
    render(<ApproximateCoordinatesRadio preserveEmptyValue />)

    await user.click(screen.getByRole('radio', { name: 'Yes' }))

    expect(screen.getByTestId('approx-coord').textContent).toBe('true')
    expect(screen.getByRole<HTMLInputElement>('radio', { name: 'Yes' }).checked).toBe(true)
  })
})

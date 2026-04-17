import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'

import { ErrorBox } from './components'
import { EditableTextField } from './common/editingComponents'
import { DetailContext, type DetailContextType, modeOptionToMode } from './Context/DetailContext'
import { validateLocality } from '@/shared/validators/locality'
import type { EditDataType, LocalityDetailsType } from '@/shared/types'
import { Role } from '@/shared/types/misc'

jest.mock('@/hooks/user', () => ({
  useUser: () => ({ role: Role.Admin }),
}))

const ErrorBoxWrapper = () => {
  const initialEditData = {
    min_age: '',
    max_age: 10,
    date_meth: 'absolute',
  } as unknown as EditDataType<LocalityDetailsType>
  const [editData, setEditData] = useState<EditDataType<LocalityDetailsType>>(initialEditData)
  const [fieldsWithErrors, setFieldsWithErrors] = useState({})

  const contextValue: DetailContextType<LocalityDetailsType> = {
    data: initialEditData as unknown as LocalityDetailsType,
    mode: modeOptionToMode.new,
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
    validator: (nextEditData, field) => {
      if (field === 'min_age') {
        return validateLocality(nextEditData, field)
      }
      return { name: String(field), error: null }
    },
    fieldsWithErrors,
    setFieldsWithErrors: updaterFn => setFieldsWithErrors(updaterFn),
  }

  return (
    <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>
      <EditableTextField<LocalityDetailsType> field="min_age" type="number" />
      <ErrorBox<LocalityDetailsType> />
    </DetailContext.Provider>
  )
}

describe('ErrorBox', () => {
  it('shows the latest validator error for a number field after typing', async () => {
    const user = userEvent.setup()
    render(<ErrorBoxWrapper />)

    const input = screen.getByRole<HTMLInputElement>('spinbutton')
    await user.type(input, '-1')

    await waitFor(() => {
      expect(screen.getByText('Age (min): Min value must be a positive real value')).not.toBeNull()
    })

    expect(screen.queryByText('Age (min): This field is required')).toBeNull()
  })
})

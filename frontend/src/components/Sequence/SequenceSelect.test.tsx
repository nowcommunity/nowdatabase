import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DetailContext,
  DetailContextType,
  ModeOptions,
  modeOptionToMode,
} from '@/components/DetailView/Context/DetailContext'
import { SequenceSelect } from './SequenceSelect'
import { TimeUnitDetailsType } from '@/shared/types'
import { ReactNode } from 'react'
import '@testing-library/jest-dom'

jest.mock('./SequenceTable', () => ({
  SequenceTable: ({
    selectorFn,
  }: {
    selectorFn?: (sequence: { sequence: number; display_value?: string }) => void
  }) => (
    <button
      type="button"
      onClick={() =>
        selectorFn?.({
          sequence: 2,
          display_value: 'Updated Sequence Display',
        })
      }
    >
      open selector
    </button>
  ),
}))

type ContextWrapperProps = {
  children: ReactNode
  data?: Partial<TimeUnitDetailsType>
  mode?: ModeOptions
}

const renderWithContext = ({ children, data, mode = 'edit' }: ContextWrapperProps) => {
  const timeUnit = {
    sequence: 1,
    tu_name: 'TU-1',
    tu_display_name: 'TU display',
    rank: 'Age',
    low_bnd: 0,
    up_bnd: 0,
    now_tu_sequence: {
      sequence: 1,
      seq_name: 'Central Paratethys',
    },
    now_tau: [],
    low_bound: {
      bid: 1,
      b_name: 'low',
      age: 1,
      b_comment: '',
    },
    up_bound: {
      bid: 2,
      b_name: 'up',
      age: 2,
      b_comment: '',
    },
    ...data,
  } as unknown as TimeUnitDetailsType

  const contextValue: DetailContextType<TimeUnitDetailsType> = {
    data: timeUnit,
    mode: modeOptionToMode[mode],
    setMode: () => undefined,
    editData: timeUnit,
    setEditData: () => undefined,
    isDirty: false,
    resetEditData: () => undefined,
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: (_editData, fieldName) => ({ name: String(fieldName), error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => undefined,
  }

  return render(
    <DetailContext.Provider value={contextValue as DetailContextType<unknown>}>{children}</DetailContext.Provider>
  )
}

describe('SequenceSelect', () => {
  it('shows display label in edit mode when sequence has a name', () => {
    renderWithContext({ children: <SequenceSelect /> })

    expect(screen.getByDisplayValue('Central Paratethys')).toBeTruthy()
  })

  it('updates display label when a new sequence is selected', async () => {
    const user = userEvent.setup()
    renderWithContext({ children: <SequenceSelect /> })

    await user.click(screen.getByRole('button', { name: /open selector/i }))

    expect(screen.getByDisplayValue('Updated Sequence Display')).toBeTruthy()
  })

  it('shows display label in read mode for existing data', () => {
    renderWithContext({ children: <SequenceSelect />, mode: 'read' })

    expect(screen.getByText('Central Paratethys')).toBeTruthy()
  })
})

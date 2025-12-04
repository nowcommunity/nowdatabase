import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DetailContextProvider,
  modeOptionToMode,
  useDetailContext,
  type ModeType,
} from '@/components/DetailView/Context/DetailContext'
import type { EditDataType } from '@/shared/types'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
  isEqual: (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b),
}))

type TestData = { name: string; count: number }

type TestContextState = {
  data: TestData
  mode: ModeType
  setMode: () => void
}

const validator = () => ({ name: '', error: null })

const TestConsumer = () => {
  const { editData, setEditData, isDirty, resetEditData } = useDetailContext<TestData>()
  return (
    <div>
      <span data-testid="dirty-state">{isDirty ? 'dirty' : 'clean'}</span>
      <button onClick={() => setEditData({ ...editData, name: 'Changed' })}>Change name</button>
      <button onClick={resetEditData}>Reset</button>
    </div>
  )
}

const createProvider = (state: TestContextState) => (
  <DetailContextProvider
    contextState={{
      ...state,
      editData: state.data as EditDataType<TestData>,
      textField: () => <></>,
      bigTextField: () => <></>,
      dropdown: () => <></>,
      dropdownWithSearch: () => <></>,
      radioSelection: () => <></>,
      validator,
      fieldsWithErrors: {},
      setFieldsWithErrors: () => {},
    }}
  >
    <TestConsumer />
  </DetailContextProvider>
)

describe('DetailContext dirty state tracking', () => {
  it('marks form as dirty after edits and clean on reset', async () => {
    const user = userEvent.setup()
    const initialState: TestContextState = {
      data: { name: 'Initial', count: 1 },
      mode: modeOptionToMode.edit,
      setMode: () => undefined,
    }

    render(createProvider(initialState))

    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')

    await user.click(screen.getByRole('button', { name: /change name/i }))
    expect(screen.getByTestId('dirty-state').textContent).toBe('dirty')

    await user.click(screen.getByRole('button', { name: /reset/i }))
    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')
  })

  it('resets dirty flag when a new entry is loaded', async () => {
    const user = userEvent.setup()
    const initialState: TestContextState = {
      data: { name: 'Initial', count: 1 },
      mode: modeOptionToMode.edit,
      setMode: () => undefined,
    }

    const { rerender } = render(createProvider(initialState))

    await user.click(screen.getByRole('button', { name: /change name/i }))
    expect(screen.getByTestId('dirty-state').textContent).toBe('dirty')

    const updatedState: TestContextState = {
      ...initialState,
      data: { name: 'New entry', count: 2 },
    }

    rerender(createProvider(updatedState))

    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')
  })
})

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
  cloneDeep: <T,>(value: T) => structuredClone(value),
  isEqualWith: (a: unknown, b: unknown, customizer?: (left: unknown, right: unknown) => boolean | undefined) => {
    const customizedResult = customizer?.(a, b)
    if (customizedResult !== undefined) return customizedResult
    return JSON.stringify(a) === JSON.stringify(b)
  },
}))

type TestData = { name: string; count: number }
type NestedTestData = {
  now_ls: Array<{ species_id: number; rowState?: string }>
}

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

const NestedTestConsumer = () => {
  const { editData, setEditData, isDirty } = useDetailContext<NestedTestData>()

  return (
    <div>
      <span data-testid="dirty-state">{isDirty ? 'dirty' : 'clean'}</span>
      <button
        onClick={() => {
          const items = [...editData.now_ls]
          items[0].rowState = 'removed'
          setEditData({ ...editData, now_ls: items })
        }}
      >
        Remove species
      </button>
      <button
        onClick={() => {
          const items = [...editData.now_ls]
          items[0].rowState = 'clean'
          setEditData({ ...editData, now_ls: items })
        }}
      >
        Restore species
      </button>
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

const createNestedProvider = (data: NestedTestData) => (
  <DetailContextProvider
    contextState={{
      data,
      mode: modeOptionToMode.edit,
      setMode: () => undefined,
      editData: data as EditDataType<NestedTestData>,
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
    <NestedTestConsumer />
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

  it('tracks nested row-state edits after data reloads', async () => {
    const user = userEvent.setup()
    const initialData: NestedTestData = {
      now_ls: [{ species_id: 1 }],
    }

    const { rerender } = render(createNestedProvider(initialData))

    rerender(
      createNestedProvider({
        now_ls: [{ species_id: 2 }],
      })
    )

    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')

    await user.click(screen.getByRole('button', { name: /remove species/i }))

    expect(screen.getByTestId('dirty-state').textContent).toBe('dirty')
  })

  it('clears dirty state when a removed row is restored to clean', async () => {
    const user = userEvent.setup()
    const initialData: NestedTestData = {
      now_ls: [{ species_id: 1 }],
    }

    render(createNestedProvider(initialData))

    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')

    await user.click(screen.getByRole('button', { name: /remove species/i }))
    expect(screen.getByTestId('dirty-state').textContent).toBe('dirty')

    await user.click(screen.getByRole('button', { name: /restore species/i }))
    expect(screen.getByTestId('dirty-state').textContent).toBe('clean')
  })
})

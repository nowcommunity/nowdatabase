import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'

import { LocalityTab } from '@/components/Locality/Tabs/LocalityTab'
import { DetailContext, type DetailContextType, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, Editable, LocalityDetailsType, LocalitySynonym } from '@/shared/types'

const notifyMock = jest.fn()

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({
    notify: notifyMock,
    setMessage: jest.fn(),
  }),
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="editable-table" />,
}))

jest.mock('@/components/DetailView/common/EditingModal', () => {
  const React = jest.requireActual<typeof import('react')>('react')
  const { useState } = React

  return {
    EditingModal: ({
      buttonText,
      onSave,
      children,
    }: {
      buttonText: string
      onSave?: () => Promise<boolean>
      children: ReactNode | ReactNode[]
    }) => {
      const [open, setOpen] = useState(false)

      return (
        <div>
          <button type="button" onClick={() => setOpen(true)}>
            {buttonText}
          </button>
          {open && (
            <div>
              {children}
              {onSave && (
                <button
                  type="button"
                  onClick={() => {
                    if (!onSave) return
                    void onSave().then(shouldClose => {
                      if (shouldClose) setOpen(false)
                    })
                  }}
                >
                  Save
                </button>
              )}
            </div>
          )}
        </div>
      )
    },
  }
})

jest.mock('@/components/Map/CoordinateSelectionMap', () => ({
  CoordinateSelectionMap: () => <div data-testid="coordinate-map" />,
}))

jest.mock('@/components/Map/SingleLocalityMap', () => ({
  SingleLocalityMap: () => <div data-testid="single-locality-map" />,
}))

jest.mock('@mui/material', () => {
  const actual = jest.requireActual<typeof import('@mui/material')>('@mui/material')

  return {
    ...actual,
    Modal: ({ open, children }: { open: boolean; children: ReactNode }) => (open ? <div>{children}</div> : null),
  }
})

type TestDetailContext = DetailContextType<LocalityDetailsType>

type EditableSynonym = Editable<LocalitySynonym>

const createSynonym = (synonym: string, overrides: Partial<EditableSynonym> = {}): EditableSynonym => ({
  lid: 1001,
  syn_id: 1,
  synonym,
  rowState: 'clean',
  ...overrides,
})

const createEditData = (synonyms: EditableSynonym[]): EditDataType<LocalityDetailsType> =>
  ({
    lid: 1001,
    now_syn_loc: synonyms,
  }) as unknown as EditDataType<LocalityDetailsType>

const createDetailContextValue = (overrides: Partial<TestDetailContext>): TestDetailContext => ({
  data: {} as LocalityDetailsType,
  mode: modeOptionToMode.edit,
  setMode: () => {},
  editData: createEditData([]),
  setEditData: () => {},
  isDirty: false,
  resetEditData: () => {},
  textField: () => <></>,
  bigTextField: () => <></>,
  dropdown: () => <></>,
  dropdownWithSearch: () => <></>,
  radioSelection: () => <></>,
  validator: () => ({ name: '', error: null }),
  fieldsWithErrors: {},
  setFieldsWithErrors: () => {},
  ...overrides,
})

type RenderOptions = {
  editData?: EditDataType<LocalityDetailsType>
}

const renderLocalityTab = ({ editData }: RenderOptions = {}) => {
  type SetEditData = TestDetailContext['setEditData']
  const setEditData = jest.fn<SetEditData>()
  const contextValue: TestDetailContext = createDetailContextValue({
    editData: editData ?? createEditData([]),
    setEditData,
  })

  render(
    <DetailContext.Provider value={contextValue as unknown as DetailContextType<unknown>}>
      <LocalityTab />
    </DetailContext.Provider>
  )

  return { setEditData }
}

beforeEach(() => {
  notifyMock.mockClear()
})

describe('LocalityTab synonyms modal', () => {
  it('appends a new synonym with rowState "new"', async () => {
    const initialSynonyms = [createSynonym('Existing synonym')]
    const editData = createEditData(initialSynonyms)
    const { setEditData } = renderLocalityTab({ editData })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add new synonym/i }))

    const synonymField = await screen.findByLabelText(/synonym/i)
    await user.clear(synonymField)
    await user.type(synonymField, 'Fresh Synonym')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await waitFor(() => {
      expect(setEditData).toHaveBeenCalledTimes(1)
    })

    const updatedEditData = setEditData.mock.calls[0][0]
    const synonyms = updatedEditData.now_syn_loc as EditableSynonym[]

    expect(synonyms).toHaveLength(initialSynonyms.length + 1)
    expect(synonyms.at(-1)).toMatchObject({
      lid: 1001,
      synonym: 'Fresh Synonym',
      rowState: 'new',
    })
  })

  it('requires a synonym value before saving', async () => {
    const { setEditData } = renderLocalityTab()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add new synonym/i }))
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await screen.findByText('Synonym is required')
    expect(notifyMock).toHaveBeenCalledWith('Synonym is required', 'error')
    expect(setEditData).not.toHaveBeenCalled()
  })

  it('prevents adding duplicate synonyms', async () => {
    const existingSynonym = createSynonym('Duplicate value')
    const editData = createEditData([existingSynonym])
    const { setEditData } = renderLocalityTab({ editData })
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /add new synonym/i }))

    const synonymField = await screen.findByLabelText(/synonym/i)
    await user.clear(synonymField)
    await user.type(synonymField, 'duplicate value')

    await user.click(screen.getByRole('button', { name: /^save$/i }))

    await screen.findByText('This synonym already exists for this locality')
    expect(notifyMock).toHaveBeenCalledWith('This synonym already exists for this locality', 'error')
    expect(setEditData).not.toHaveBeenCalled()
  })
})

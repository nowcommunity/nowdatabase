import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  DetailContextProvider,
  modeOptionToMode,
  useDetailContext,
} from '@/components/DetailView/Context/DetailContext'
import { StagingView } from '@/components/DetailView/StagingView'
import type { EditDataType, Reference, ReferenceDetailsType } from '@/shared/types'
import type { ValidationObject } from '@/shared/validators/validator'

const mockUseGetAllReferencesQuery = jest.fn()
const mockUseGetReferenceTypesQuery = jest.fn()
const mockEditReferenceRequest = jest.fn()
const mockNotify = jest.fn()

jest.mock('@/redux/referenceReducer', () => ({
  useGetAllReferencesQuery: (...args: unknown[]) => mockUseGetAllReferencesQuery(...args),
  useGetReferenceTypesQuery: () => mockUseGetReferenceTypesQuery(),
  useEditReferenceMutation: () => [mockEditReferenceRequest, { isLoading: false }],
}))

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: ({ buttonText }: { buttonText: string }) => <button type="button">{buttonText}</button>,
}))

jest.mock('../../components/DetailView/common/SelectingTable', () => ({
  SelectingTable: ({ buttonText }: { buttonText: string }) => <button type="button">{buttonText}</button>,
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="selected-references" />,
}))

jest.mock('../../components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="selected-references" />,
}))

jest.mock('@/components/Reference/Tabs/ReferenceTab', () => ({
  ReferenceTab: () => {
    const { editData, setEditData } = useDetailContext<ReferenceDetailsType>()

    return (
      <div>
        Reference form
        <button
          type="button"
          onClick={() =>
            setEditData({
              ...editData,
              ref_type_id: 1,
              title_primary: 'Created reference',
              date_primary: 2026,
              ref_authors: [
                {
                  rid: 0,
                  au_num: 1,
                  author_surname: 'Doe',
                  author_initials: 'J',
                  field_id: 1,
                },
              ],
              ref_journal: undefined,
            } as unknown as EditDataType<ReferenceDetailsType>)
          }
        >
          Fill reference
        </button>
      </div>
    )
  },
}))

jest.mock('@/shared/validators/reference', () => ({
  createReferenceValidatorWithLabels: () => (_editData: unknown, field: string) => ({ name: field, error: null }),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockNotify }),
}))

type StagingData = {
  references: Reference[]
  comment: string
}

const SelectedReferencesProbe = () => {
  const { editData } = useDetailContext<StagingData>()
  const reference = editData.references[0]

  return (
    <>
      <div data-testid="reference-count">{editData.references.length}</div>
      {reference && (
        <div data-testid="created-reference">
          {[
            reference.ref_authors[0]?.author_surname,
            reference.date_primary,
            reference.title_primary,
            reference.ref_ref_type?.ref_type,
          ].join('|')}
        </div>
      )}
    </>
  )
}

const renderStagingView = () => {
  const validator = (): ValidationObject => ({ name: 'test', error: '' })

  return render(
    <DetailContextProvider<StagingData>
      contextState={{
        data: { references: [], comment: '' },
        mode: modeOptionToMode['staging-new'],
        setMode: jest.fn(),
        editData: { references: [], comment: '' } as EditDataType<StagingData>,
        textField: jest.fn(() => <input aria-label="field" />),
        bigTextField: jest.fn(() => <textarea aria-label="comment" />),
        dropdown: jest.fn(() => <select aria-label="dropdown" />),
        dropdownWithSearch: jest.fn(() => <select aria-label="dropdown search" />),
        radioSelection: jest.fn(() => <input aria-label="radio" />),
        validator,
        fieldsWithErrors: {},
        setFieldsWithErrors: jest.fn(),
      }}
    >
      <StagingView<StagingData> />
      <SelectedReferencesProbe />
    </DetailContextProvider>
  )
}

describe('StagingView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseGetAllReferencesQuery.mockReturnValue({ data: [], isError: false })
    mockUseGetReferenceTypesQuery.mockReturnValue({
      data: [{ ref_type_id: 1, ref_type: 'Article', ref_field_name: [] }],
    })
    mockEditReferenceRequest.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          rid: 123,
        }),
    })
  })

  it('creates a new reference in a dialog and adds it to the staged references', async () => {
    renderStagingView()

    expect(screen.getByRole('button', { name: /add existing reference/i })).toBeTruthy()
    expect(screen.getByTestId('reference-count').textContent).toBe('0')

    await userEvent.click(screen.getByRole('button', { name: /add new reference/i }))

    expect(screen.getByRole('dialog', { name: /add new reference/i })).toBeTruthy()
    expect(screen.getByText(/reference form/i)).toBeTruthy()

    await userEvent.click(screen.getByRole('button', { name: /fill reference/i }))
    await userEvent.click(screen.getByRole('button', { name: /save reference/i }))

    await waitFor(() => expect(screen.getByTestId('reference-count').textContent).toBe('1'))
    expect(screen.getByTestId('created-reference').textContent).toBe('Doe|2026|Created reference|Article')
    expect(mockUseGetAllReferencesQuery).toHaveBeenCalledWith(undefined, { refetchOnFocus: true })
    expect(mockEditReferenceRequest).toHaveBeenCalledTimes(1)
  })
})

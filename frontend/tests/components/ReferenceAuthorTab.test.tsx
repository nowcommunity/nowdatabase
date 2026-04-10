import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'

import { AuthorTab } from '@/components/Reference/Tabs/AuthorTab'
import type { DetailContextType } from '@/components/DetailView/Context/DetailContext'
import { modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { EditDataType, ReferenceAuthorType, ReferenceDetailsType } from '@/shared/types'

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: () => <div data-testid="editable-table" />,
}))

jest.mock('@/components/DetailView/common/EditingForm', () => ({
  EditingForm: () => <div data-testid="editing-form" />,
}))

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  Grouped: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

const selectingTableMock = jest.fn()

jest.mock('@/components/DetailView/common/SelectingTable', () => ({
  SelectingTable: (props: {
    data?: Array<{ author_surname?: string; author_initials?: string; authorKey?: string }>
    selectedValues?: string[]
    idFieldName: string
  }) => {
    selectingTableMock(props)
    const { data = [], selectedValues = [], idFieldName } = props
    const filtered = data.filter(row => !selectedValues.includes(String(row[idFieldName as keyof typeof row] ?? '')))
    return <div data-testid="selecting-table">{filtered.map(row => row.author_surname).join(',')}</div>
  },
}))

const mockUseGetReferenceAuthorsQuery = jest.fn()
jest.mock('@/redux/referenceReducer', () => ({
  useGetReferenceAuthorsQuery: (...args: unknown[]) => mockUseGetReferenceAuthorsQuery(...args),
}))

const mockUseDetailContext = jest.fn()
jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  modeOptionToMode: {
    edit: { read: false, staging: false, new: false, option: 'edit' },
  },
  useDetailContext: () => mockUseDetailContext(),
}))

const createDetailContextValue = (
  overrides: Partial<DetailContextType<ReferenceDetailsType>> = {}
): DetailContextType<ReferenceDetailsType> =>
  ({
    data: {} as ReferenceDetailsType,
    mode: modeOptionToMode.edit,
    setMode: () => {},
    editData: { rid: 1, ref_authors: [] } as unknown as EditDataType<ReferenceDetailsType>,
    setEditData: () => {},
    textField: () => <></>,
    bigTextField: () => <></>,
    dropdown: () => <></>,
    dropdownWithSearch: () => <></>,
    radioSelection: () => <></>,
    validator: () => ({ name: '', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => {},
    isDirty: false,
    resetEditData: () => {},
    ...overrides,
  }) as DetailContextType<ReferenceDetailsType>

const buildAuthor = (overrides: Partial<ReferenceAuthorType> = {}): ReferenceAuthorType =>
  ({
    author_surname: 'Cande',
    author_initials: 'S.C.',
    ...overrides,
  }) as ReferenceAuthorType

describe('AuthorTab', () => {
  it('filters out already-selected authors from the selector list', () => {
    selectingTableMock.mockClear()
    const existingAuthor = buildAuthor({ field_id: 2, au_num: 1 })
    const otherAuthor = buildAuthor({ author_surname: 'Smith', author_initials: 'J.A.' })

    mockUseDetailContext.mockReturnValue(
      createDetailContextValue({
        editData: { rid: 1, ref_authors: [existingAuthor] } as unknown as EditDataType<ReferenceDetailsType>,
      })
    )

    mockUseGetReferenceAuthorsQuery.mockReturnValue({
      data: [existingAuthor, otherAuthor],
      isError: false,
    })

    render(<AuthorTab field_num_param={2} tab_name="Authors" />)

    expect(selectingTableMock).toHaveBeenCalled()
    const selectingProps = selectingTableMock.mock.calls[0][0] as {
      data?: Array<{ authorKey?: string }>
      selectedValues?: string[]
    }
    expect(selectingProps.selectedValues).toContain('cande|s.c.')
    expect(selectingProps.data?.[0]?.authorKey).toBeDefined()

    const renderedList = screen.getByTestId('selecting-table').textContent ?? ''
    expect(renderedList).toContain('Smith')
    expect(renderedList).not.toContain('Cande')
  })

  it('filters duplicates per author field grouping', () => {
    selectingTableMock.mockClear()
    const selectedEditor = buildAuthor({ author_surname: 'Brown', author_initials: 'T.', field_id: 12, au_num: 1 })
    const otherEditor = buildAuthor({ author_surname: 'Ng', author_initials: 'Q.' })

    mockUseDetailContext.mockReturnValue(
      createDetailContextValue({
        editData: { rid: 1, ref_authors: [selectedEditor] } as unknown as EditDataType<ReferenceDetailsType>,
      })
    )

    mockUseGetReferenceAuthorsQuery.mockReturnValue({
      data: [selectedEditor, otherEditor],
      isError: false,
    })

    render(<AuthorTab field_num_param={12} tab_name="Editors" />)

    const renderedList = screen.getByTestId('selecting-table').textContent ?? ''
    expect(renderedList).toContain('Ng')
    expect(renderedList).not.toContain('Brown')
  })
})

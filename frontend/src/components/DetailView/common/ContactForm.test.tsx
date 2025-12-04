import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ContactForm } from './ContactForm'
import type { ReferenceDetailsType, EditDataType } from '@/shared/types'
import { createReferenceTitle } from '@/components/Reference/referenceFormatting'
import { useDetailContext, type DetailContextType, type ModeType } from '../Context/DetailContext'
import { usePageContext, type PageContextType } from '@/components/Page'

jest.mock('../Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
}))

jest.mock('@/components/Page', () => ({
  usePageContext: jest.fn(),
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<() => DetailContextType<ReferenceDetailsType>>
const mockUsePageContext = usePageContext as jest.MockedFunction<() => PageContextType<ReferenceDetailsType>>

const readMode: ModeType = { read: true, staging: false, new: false, option: 'read' }

const createMockDetailContext = (reference: ReferenceDetailsType): DetailContextType<ReferenceDetailsType> => {
  const textField: DetailContextType<ReferenceDetailsType>['textField'] = () => <span />
  const bigTextField: DetailContextType<ReferenceDetailsType>['bigTextField'] = () => <span />
  const dropdown: DetailContextType<ReferenceDetailsType>['dropdown'] = () => <span />
  const dropdownWithSearch: DetailContextType<ReferenceDetailsType>['dropdownWithSearch'] = () => <span />
  const radioSelection: DetailContextType<ReferenceDetailsType>['radioSelection'] = () => <span />
  const validator: DetailContextType<ReferenceDetailsType>['validator'] = () => ({ name: '', error: null })
  const setFieldsWithErrors: DetailContextType<ReferenceDetailsType>['setFieldsWithErrors'] = updater => {
    updater({})
  }
  const setMode: DetailContextType<ReferenceDetailsType>['setMode'] = () => undefined
  const setEditData: DetailContextType<ReferenceDetailsType>['setEditData'] = () => undefined
  const resetEditData: DetailContextType<ReferenceDetailsType>['resetEditData'] = () => undefined

  return {
    data: reference,
    mode: readMode,
    setMode,
    editData: reference as EditDataType<ReferenceDetailsType>,
    setEditData,
    isDirty: false,
    resetEditData,
    textField,
    bigTextField,
    dropdown,
    dropdownWithSearch,
    radioSelection,
    validator,
    fieldsWithErrors: {},
    setFieldsWithErrors,
  }
}

const createMockPageContext = (
  createTitle: PageContextType<ReferenceDetailsType>['createTitle']
): PageContextType<ReferenceDetailsType> => {
  const setIdList: PageContextType<ReferenceDetailsType>['setIdList'] = () => undefined
  const setPreviousTableUrls: PageContextType<ReferenceDetailsType>['setPreviousTableUrls'] = () => undefined
  const setSqlLimit: PageContextType<ReferenceDetailsType>['setSqlLimit'] = () => undefined
  const setSqlOffset: PageContextType<ReferenceDetailsType>['setSqlOffset'] = () => undefined
  const setSqlColumnFilters: PageContextType<ReferenceDetailsType>['setSqlColumnFilters'] = () => undefined
  const setSqlOrderBy: PageContextType<ReferenceDetailsType>['setSqlOrderBy'] = () => undefined

  return {
    idList: [],
    setIdList,
    idFieldName: 'rid',
    viewName: 'reference',
    previousTableUrls: [],
    setPreviousTableUrls,
    createTitle,
    createSubtitle: () => '',
    editRights: {},
    sqlLimit: 0,
    sqlOffset: 0,
    sqlColumnFilters: [],
    sqlOrderBy: [],
    setSqlLimit,
    setSqlOffset,
    setSqlColumnFilters,
    setSqlOrderBy,
  }
}

jest.mock('@/redux/emailReducer', () => ({
  useEmailMutation: () => [jest.fn()],
}))

jest.mock('@/hooks/user', () => ({
  useUser: () => ({ initials: 'ABC' }),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: jest.fn() }),
}))

jest.mock('@/redux/personReducer', () => ({
  useGetPersonDetailsQuery: () => ({ data: { full_name: 'Test User', email: 'test@example.com' }, isLoading: false }),
}))

jest.mock('./ContactModal', () => ({
  ContactModal: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

describe('ContactForm detail context integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('prefills the subject with the page context title formatter output', async () => {
    const reference = {
      rid: 30,
      ref_authors: [
        { field_id: 2, author_surname: 'Smith', author_initials: 'J.' },
        { field_id: 2, author_surname: 'Doe', author_initials: 'A.' },
      ],
      date_primary: 1999,
      title_primary: 'A descriptive reference title',
      title_secondary: null,
      title_series: null,
      gen_notes: null,
    } as unknown as ReferenceDetailsType

    const expectedSubject = createReferenceTitle(reference)
    const createTitle = jest.fn<(data: ReferenceDetailsType) => string>(() => expectedSubject)

    mockUseDetailContext.mockReturnValue(createMockDetailContext(reference))
    mockUsePageContext.mockReturnValue(createMockPageContext(createTitle))

    render(<ContactForm<ReferenceDetailsType> buttonText="Contact" />)

    const subjectField = await screen.findByLabelText(/subject/i)

    await waitFor(() => {
      expect((subjectField as HTMLInputElement).value).toBe(expectedSubject)
    })

    expect(createTitle).toHaveBeenCalledWith(reference)
  })

  it('falls back to the formatter result when minimal metadata is provided', async () => {
    const reference = {
      rid: 77,
      ref_authors: [],
      date_primary: null,
      title_primary: null,
      title_secondary: null,
      title_series: null,
      gen_notes: null,
    } as unknown as ReferenceDetailsType

    const expectedSubject = createReferenceTitle(reference)
    const createTitle = jest.fn<(data: ReferenceDetailsType) => string>(() => expectedSubject)

    mockUseDetailContext.mockReturnValue(createMockDetailContext(reference))
    mockUsePageContext.mockReturnValue(createMockPageContext(createTitle))

    render(<ContactForm<ReferenceDetailsType> buttonText="Contact" />)

    const subjectField = await screen.findByLabelText(/subject/i)

    await waitFor(() => {
      expect((subjectField as HTMLInputElement).value).toBe(expectedSubject)
    })

    expect(createTitle).toHaveBeenCalledWith(reference)
  })
})

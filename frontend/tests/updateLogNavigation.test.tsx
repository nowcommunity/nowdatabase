import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { ReferenceList } from '@/components/DetailView/common/ReferenceList'
import { ReturnButton } from '@/components/common/ReturnButton'
import { DetailContext, modeOptionToMode, type DetailContextType } from '@/components/DetailView/Context/DetailContext'
import type { PageContextType } from '@/components/Page'
import type { AnyReference } from '@/shared/types'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
}))

jest.mock('@/shared/types', () => ({}))

type ReferenceMock = {
  rid: number
  ref_ref: {
    rid: number
    ref_type_id: number
    ref_authors: Array<{ author_surname: string | null; author_initials: string | null; field_id?: number | null }>
    issue: string | null
    ref_journal: { journal_title: string | null } | null
    publisher: string | null
    pub_place: string | null
    title_primary: string | null
    date_primary: number | null
    volume: string | null
    start_page: string | null
    end_page: string | null
    title_secondary: string | null
    gen_notes: string | null
  }
}

type ReferenceOverride = Partial<ReferenceMock>

const createReference = (overrides: ReferenceOverride = {}): ReferenceMock => ({
  rid: 123,
  ref_ref: {
    rid: 123,
    ref_type_id: 1,
    ref_authors: [
      { author_surname: 'Smith', author_initials: 'J', field_id: 1 },
      { author_surname: 'Johnson', author_initials: 'M', field_id: 2 },
    ],
    issue: null,
    ref_journal: { journal_title: 'Fossil Journal' },
    publisher: null,
    pub_place: null,
    title_primary: 'Primary fossil insights',
    date_primary: 1999,
    volume: null,
    start_page: null,
    end_page: null,
    title_secondary: null,
    gen_notes: null,
  },
  ...overrides,
})

type TestPageContext = PageContextType<unknown>

const createPageContextValue = (overrides: Partial<TestPageContext> = {}): TestPageContext =>
  ({
    idList: [],
    setIdList: () => {},
    idFieldName: 'rid',
    viewName: 'reference',
    previousTableUrls: [],
    setPreviousTableUrls: () => {},
    createTitle: () => '',
    createSubtitle: () => '',
    editRights: {},
    sqlLimit: 25,
    sqlOffset: 0,
    sqlColumnFilters: [],
    sqlOrderBy: [],
    setSqlLimit: () => {},
    setSqlOffset: () => {},
    setSqlColumnFilters: () => {},
    setSqlOrderBy: () => {},
    ...overrides,
  }) as TestPageContext

type TestDetailContext = DetailContextType<unknown>

const createDetailContextValue = (overrides: Partial<TestDetailContext> = {}): TestDetailContext =>
  ({
    data: {},
    mode: modeOptionToMode.read,
    setMode: () => {},
    editData: {} as TestDetailContext['editData'],
    setEditData: (() => {}) as TestDetailContext['setEditData'],
    textField: (() => <></>) as TestDetailContext['textField'],
    bigTextField: (() => <></>) as TestDetailContext['bigTextField'],
    dropdown: (() => <></>) as TestDetailContext['dropdown'],
    dropdownWithSearch: (() => <></>) as TestDetailContext['dropdownWithSearch'],
    radioSelection: (() => <></>) as TestDetailContext['radioSelection'],
    validator: () => ({ name: 'field', error: null }),
    fieldsWithErrors: {},
    setFieldsWithErrors: () => {},
    ...overrides,
  }) as TestDetailContext

const pageContextValue: TestPageContext = createPageContextValue()

jest.mock('@/components/Page', () => ({
  usePageContext: () => pageContextValue,
}))

type TestProvidersProps = {
  children: ReactNode
  pageContextOverrides?: Partial<TestPageContext>
  detailContextOverrides?: Partial<TestDetailContext>
}

const TestProviders = ({ children, pageContextOverrides = {}, detailContextOverrides = {} }: TestProvidersProps) => {
  Object.assign(pageContextValue, createPageContextValue(pageContextOverrides))
  const detailContextValue = createDetailContextValue(detailContextOverrides)

  return <DetailContext.Provider value={detailContextValue}>{children}</DetailContext.Provider>
}

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>
}

describe('Update log navigation flow', () => {
  const references = [createReference()] as unknown as AnyReference[]

  beforeEach(() => {
    Object.assign(pageContextValue, createPageContextValue())
  })

  it('returns to the originating update log path after viewing a reference', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/locality/20920?tab=10']}>
        <LocationDisplay />
        <Routes>
          <Route path="/locality/:id" element={<ReferenceList references={references} big />} />
          <Route
            path="/reference/:id"
            element={
              <TestProviders>
                <ReturnButton />
              </TestProviders>
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByTestId('location-display').textContent).toBe('/locality/20920?tab=10')

    await user.click(screen.getByRole('link', { name: /view/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toBe('/reference/123')
    })

    await user.click(screen.getByRole('button', { name: /return to table/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toBe('/locality/20920?tab=10')
    })
  })
})

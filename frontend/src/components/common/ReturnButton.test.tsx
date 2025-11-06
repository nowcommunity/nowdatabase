import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { ReturnButton } from '@/components/common/ReturnButton'
import { DetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import type { DetailContextType } from '@/components/DetailView/Context/DetailContext'
import type { PageContextType } from '@/components/Page'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
}))

jest.mock('@/shared/types', () => ({}))

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

const TestProviders = ({ children, pageContextOverrides, detailContextOverrides }: TestProvidersProps) => {
  if (pageContextOverrides) {
    Object.assign(pageContextValue, pageContextOverrides)
  }
  const detailContextValue = createDetailContextValue(detailContextOverrides)

  return <DetailContext.Provider value={detailContextValue}>{children}</DetailContext.Provider>
}

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>
}

describe('ReturnButton', () => {
  beforeEach(() => {
    Object.assign(pageContextValue, createPageContextValue())
  })

  it('navigates to the origin stored in navigation state', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={[{ pathname: '/reference/123', state: { returnTo: '/locality/1?tab=2' } }]}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/reference/:id"
            element={
              <TestProviders>
                <ReturnButton />
              </TestProviders>
            }
          />
          <Route path="/locality/:id" element={<div>Locality Detail</div>} />
          <Route path="/reference" element={<div>Reference Table</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /return to table/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toBe('/locality/1?tab=2')
    })
  })

  it('falls back to the view root when no origin information is present', async () => {
    const user = userEvent.setup()
    const setPreviousTableUrls = jest.fn()

    render(
      <MemoryRouter initialEntries={['/reference/123']}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/reference/:id"
            element={
              <TestProviders pageContextOverrides={{ setPreviousTableUrls }}>
                <ReturnButton />
              </TestProviders>
            }
          />
          <Route path="/reference" element={<div>Reference Table</div>} />
        </Routes>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('button', { name: /return to table/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toBe('/reference')
    })

    expect(setPreviousTableUrls).not.toHaveBeenCalled()
  })
})

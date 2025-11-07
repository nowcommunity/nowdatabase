import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { ReturnButton } from '@/components/common/ReturnButton'
import { DetailContext, modeOptionToMode, type DetailContextType } from '@/components/DetailView/Context/DetailContext'
import type { PageContextType } from '@/components/Page'
import { useSyncTabSearch } from '@/hooks/useSyncTabSearch'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
  ENV: 'test',
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
  detailContextOverrides?: Partial<TestDetailContext>
}

const TestProviders = ({ children, detailContextOverrides = {} }: TestProvidersProps) => {
  const detailContextValue = createDetailContextValue(detailContextOverrides)
  return <DetailContext.Provider value={detailContextValue}>{children}</DetailContext.Provider>
}

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>
}

const TabSyncHarness = () => {
  useSyncTabSearch(0)
  return <ReturnButton />
}

describe('Detail view return navigation integration', () => {
  beforeEach(() => {
    Object.assign(pageContextValue, createPageContextValue())
  })

  it('preserves update-log origin after syncing the tab query parameter', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={[{ pathname: '/reference/123', state: { returnTo: '/locality/10003?tab=10' } }]}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/reference/:id"
            element={
              <TestProviders>
                <TabSyncHarness />
              </TestProviders>
            }
          />
          <Route path="/locality/:id" element={<div data-testid="locality-view" />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toBe('/reference/123?tab=0')
    })

    await user.click(screen.getByRole('button', { name: /return to table/i }))

    await waitFor(() => {
      expect(screen.getByTestId('location-display').textContent).toBe('/locality/10003?tab=10')
    })
  })
})

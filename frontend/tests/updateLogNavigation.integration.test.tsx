// @ts-nocheck
import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { ReturnButton } from '@/components/common/ReturnButton'
import { DetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
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

const createPageContextValue = (overrides = {}) => ({
  idList: [],
  setIdList: jest.fn(),
  idFieldName: 'rid',
  viewName: 'reference',
  previousTableUrls: [],
  setPreviousTableUrls: jest.fn(),
  createTitle: () => '',
  createSubtitle: () => '',
  editRights: {},
  sqlLimit: 25,
  sqlOffset: 0,
  sqlColumnFilters: [],
  sqlOrderBy: [],
  setSqlLimit: jest.fn(),
  setSqlOffset: jest.fn(),
  setSqlColumnFilters: jest.fn(),
  setSqlOrderBy: jest.fn(),
  ...overrides,
})

const createDetailContextValue = (overrides = {}) => ({
  data: {},
  mode: modeOptionToMode.read,
  setMode: jest.fn(),
  editData: {},
  setEditData: jest.fn(),
  textField: jest.fn(() => <></>),
  bigTextField: jest.fn(() => <></>),
  dropdown: jest.fn(() => <></>),
  dropdownWithSearch: jest.fn(() => <></>),
  radioSelection: jest.fn(() => <></>),
  validator: jest.fn(() => ({ name: 'field', error: null })),
  fieldsWithErrors: {},
  setFieldsWithErrors: jest.fn(),
  ...overrides,
})

const pageContextValue = createPageContextValue()

jest.mock('@/components/Page', () => ({
  usePageContext: () => pageContextValue,
}))

const TestProviders = ({ children, detailContextOverrides = {} }) => {
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
      <MemoryRouter
        initialEntries={[{ pathname: '/reference/123', state: { returnTo: '/locality/10003?tab=10' } }]}
      >
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

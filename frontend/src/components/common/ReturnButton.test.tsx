// @ts-nocheck
import { describe, expect, it, jest } from '@jest/globals'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { ReturnButton } from '@/components/common/ReturnButton'
import { DetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'

jest.mock('lodash-es', () => ({
  cloneDeep: (value: unknown) => value,
}))

jest.mock('@/util/config', () => ({
  BACKEND_URL: '',
  ENABLE_WRITE: true,
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

const TestProviders = ({
  children,
  pageContextOverrides,
  detailContextOverrides,
}) => {
  if (pageContextOverrides) {
    Object.assign(pageContextValue, pageContextOverrides)
  }
  const detailContextValue = createDetailContextValue(detailContextOverrides)

  return (
    <DetailContext.Provider value={detailContextValue}>{children}</DetailContext.Provider>
  )
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
      <MemoryRouter
        initialEntries={[{ pathname: '/reference/123', state: { returnTo: '/locality/1?tab=2' } }]}
      >
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

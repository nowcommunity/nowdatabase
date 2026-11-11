import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'

import { ReturnButton } from '@/components/common/ReturnButton'
import { DetailContext, modeOptionToMode } from '@/components/DetailView/Context/DetailContext'
import { OccurrencesTab } from '@/components/Locality/Tabs/OccurrencesTab'
import type { LocalityDetailsType } from '@/shared/types'

jest.mock('@/components/Page', () => ({
  usePageContext: () => ({
    previousTableUrls: [],
    setPreviousTableUrls: jest.fn(),
    viewName: 'species',
  }),
}))

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: ({
    renderReadRowActions,
  }: {
    renderReadRowActions?: (props: { row: { original: { lid: number; species_id: number } } }) => ReactNode
  }) => <>{renderReadRowActions?.({ row: { original: { lid: 42, species_id: 35 } } })}</>,
}))

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  Grouped: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/DetailView/common/FieldUpdateHistory', () => ({
  EntryUpdateHistory: () => null,
}))

const LocationDisplay = () => {
  const { pathname, search } = useLocation()
  return <div data-testid="location">{`${pathname}${search}`}</div>
}

describe('OccurrencesTab species navigation', () => {
  it('returns to the same locality Occurrences tab from species details', async () => {
    const user = userEvent.setup()
    const localityData = {
      lid: 42,
      now_ls: [{ lid: 42, species_id: 35, com_species: {} }],
    } as LocalityDetailsType
    const detailContext = {
      data: localityData,
      mode: modeOptionToMode.read,
      editData: localityData,
      setEditData: jest.fn(),
      setMode: jest.fn(),
    } as never

    render(
      <MemoryRouter initialEntries={['/locality/42?tab=2']}>
        <DetailContext.Provider value={detailContext}>
          <LocationDisplay />
          <Routes>
            <Route path="/locality/:id" element={<OccurrencesTab />} />
            <Route path="/species/:id" element={<ReturnButton />} />
          </Routes>
        </DetailContext.Provider>
      </MemoryRouter>
    )

    await user.click(screen.getByRole('link'))
    expect(screen.getByRole('button', { name: /return to table/i })).toBeTruthy()

    await user.click(screen.getByRole('button', { name: /return to table/i }))

    expect(screen.getByTestId('location').textContent).toBe('/locality/42?tab=2')
  })
})

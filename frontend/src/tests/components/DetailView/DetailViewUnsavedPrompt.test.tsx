import { describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { DetailView, type TabType } from '@/components/DetailView/DetailView'
import { PageContext, type PageContextType } from '@/components/Page'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import type { TimeUnitDetailsType } from '@/shared/types'

const timeUnitData = {
  tu_name: 'old_tu',
  tu_display_name: 'Old TU',
  rank: 'Age',
  low_bnd: 2,
  up_bnd: 1,
  sequence: 'seq-1',
  tu_comment: '',
  now_tu_sequence: { sequence: 'seq-1', seq_name: 'Sequence 1' },
  now_tau: [],
  up_bound: { bid: 1, b_name: 'Upper', age: 20, b_comment: '' },
  low_bound: { bid: 2, b_name: 'Lower', age: 10, b_comment: '' },
} as unknown as TimeUnitDetailsType

const pageContextValue: PageContextType<unknown> = {
  idList: ['old_tu'],
  setIdList: jest.fn(),
  idFieldName: 'tu_name',
  viewName: 'time-unit',
  previousTableUrls: [],
  setPreviousTableUrls: jest.fn(),
  createTitle: () => timeUnitData.tu_display_name,
  createSubtitle: () => '',
  editRights: { edit: true },
  sqlLimit: 20,
  sqlOffset: 0,
  sqlColumnFilters: [],
  sqlOrderBy: [],
  setSqlLimit: jest.fn(),
  setSqlOffset: jest.fn(),
  setSqlColumnFilters: jest.fn(),
  setSqlOrderBy: jest.fn(),
}

const TimeUnitTabContent = () => {
  const { editData, setEditData, mode } = useDetailContext<TimeUnitDetailsType>()

  return (
    <div>
      <div data-testid="up-bound-age">{editData.up_bound?.age}</div>
      {!mode.read && (
        <button
          type="button"
          onClick={() =>
            setEditData({
              ...editData,
              up_bound: { ...(editData.up_bound ?? {}), age: 99 } as TimeUnitDetailsType['up_bound'],
            })
          }
        >
          Change upper age
        </button>
      )}
    </div>
  )
}

const tabs: TabType[] = [
  {
    title: 'Time Unit',
    content: <TimeUnitTabContent />,
  },
]

const renderWithRouter = () => {
  const onWrite = jest.fn(async () => {})
  const router = createMemoryRouter(
    [
      {
        path: '/time-unit/:id',
        element: (
          <PageContext.Provider value={pageContextValue}>
            <DetailView<TimeUnitDetailsType>
              tabs={tabs}
              data={timeUnitData}
              validator={() => ({ name: 'noop', error: null })}
              onWrite={onWrite}
            />
          </PageContext.Provider>
        ),
      },
      { path: '/time-unit', element: <div>Table view</div> },
    ],
    { initialEntries: ['/time-unit/old_tu'] }
  )

  render(<RouterProvider router={router} />)
  return router
}

describe('DetailView unsaved changes prompt', () => {
  it('shows a prompt when navigating away with dirty edits via Return to table', async () => {
    const user = userEvent.setup()
    const router = renderWithRouter()

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /change upper age/i }))
    await user.click(screen.getByRole('button', { name: /return to table/i }))

    await screen.findByRole('dialog')
    await user.click(screen.getByRole('button', { name: /stay on page/i }))

    expect(router.state.location.pathname).toBe('/time-unit/old_tu')

    await user.click(screen.getByRole('button', { name: /return to table/i }))
    await user.click(await screen.findByRole('button', { name: /leave page/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/time-unit')
    })
  })
})

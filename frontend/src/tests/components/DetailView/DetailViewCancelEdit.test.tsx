import { describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import { DetailView, TabType } from '@/components/DetailView/DetailView'
import { PageContext, PageContextType } from '@/components/Page'
import { useDetailContext } from '@/components/DetailView/Context/DetailContext'
import { TimeUnitDetailsType } from '@/shared/types'

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

describe('DetailView cancel edit behavior for Time Unit', () => {
  it('resets editData to original values when canceling edits', async () => {
    const user = userEvent.setup()
    const onWrite = jest.fn(async () => {})

    render(
      <PageContext.Provider value={pageContextValue}>
        <MemoryRouter initialEntries={[`/time-unit/${timeUnitData.tu_name}`]}>
          <DetailView<TimeUnitDetailsType>
            tabs={tabs}
            data={timeUnitData}
            validator={() => ({ name: 'noop', error: null })}
            onWrite={onWrite}
            hasStagingMode
          />
        </MemoryRouter>
      </PageContext.Provider>
    )

    expect(screen.getByTestId('up-bound-age').textContent).toBe('20')

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /change upper age/i }))
    expect(screen.getByTestId('up-bound-age').textContent).toBe('99')

    await user.click(screen.getByRole('button', { name: /cancel edit/i }))

    expect(screen.getByTestId('up-bound-age').textContent).toBe('20')
    expect(onWrite).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: /edit/i }))
    await user.click(screen.getByRole('button', { name: /change upper age/i }))

    expect(screen.getByTestId('up-bound-age').textContent).toBe('99')
  })
})

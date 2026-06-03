import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ContextType } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ArrayToTable } from '@/components/DetailView/common/tabLayoutHelpers'
import { DetailContext } from '@/components/DetailView/Context/DetailContext'

const FieldElement = (_props: { field: string }) => <span>field value</span>

const reference = {
  rid: 10,
  ref_ref: {
    rid: 10,
    title_primary: 'Field update reference',
    date_primary: 2020,
    ref_authors: [],
    ref_journal: { journal_title: 'Journal' },
  },
}

const detailData = {
  body_mass: 10,
  now_sau: [
    {
      sau_date: '2026-05-29',
      sau_authorizer: 'ED',
      sau_coordinator: 'CO',
      sau_comment: 'Updated body mass',
      now_sr: [reference],
      updates: [
        {
          log_id: 1,
          column_name: 'body_mass',
          log_action: 3,
          old_data: '10',
          new_data: '12',
        },
      ],
    },
  ],
}

const contextValue = {
  data: detailData,
  mode: { read: true, staging: false, new: false, option: 'read' },
} as unknown as ContextType<typeof DetailContext>

describe('FieldUpdateHistory', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('shows field-specific update history from detail data', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <DetailContext.Provider value={contextValue}>
          <ArrayToTable array={[['Body mass', <FieldElement key="body_mass" field="body_mass" />]]} />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    await user.click(screen.getByLabelText('Show update history for Body mass'))

    const popover = screen.getByRole('heading', { name: 'Body mass update history' }).closest('div')
    expect(popover).toBeTruthy()
    expect(screen.getByText('Updated body mass')).toBeInTheDocument()
    expect(screen.getByText(/Field update reference/)).toBeInTheDocument()
    const afterRow = screen.getByText('After:').closest('p')
    expect(afterRow).toBeTruthy()
    expect(within(afterRow as HTMLElement).getByText('12')).toBeInTheDocument()
  })

  it('does not show the history icon without matching field updates', () => {
    render(
      <MemoryRouter>
        <DetailContext.Provider value={contextValue}>
          <ArrayToTable array={[['Diet', <FieldElement key="diet1" field="diet1" />]]} />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    expect(screen.queryByLabelText('Show update history for Diet')).not.toBeInTheDocument()
  })

  it('does not show the history icon in edit mode', () => {
    render(
      <MemoryRouter>
        <DetailContext.Provider
          value={{ ...contextValue, mode: { read: false, staging: false, new: false, option: 'edit' } }}
        >
          <ArrayToTable array={[['Body mass', <FieldElement key="body_mass" field="body_mass" />]]} />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    expect(screen.queryByLabelText('Show update history for Body mass')).not.toBeInTheDocument()
  })

  it('renders multiple same-field updates without duplicate key warnings', async () => {
    const user = userEvent.setup()
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    const duplicateLogContext = {
      ...contextValue,
      data: {
        ...detailData,
        now_sau: [
          detailData.now_sau[0],
          {
            ...detailData.now_sau[0],
            sau_date: '2026-05-30',
            sau_comment: 'Updated body mass again',
            updates: [
              {
                log_id: 1,
                column_name: 'body_mass',
                log_action: 3,
                old_data: '12',
                new_data: '14',
              },
            ],
          },
        ],
      },
    } as unknown as ContextType<typeof DetailContext>

    render(
      <MemoryRouter>
        <DetailContext.Provider value={duplicateLogContext}>
          <ArrayToTable array={[['Body mass', <FieldElement key="body_mass" field="body_mass" />]]} />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    await user.click(screen.getByLabelText('Show update history for Body mass'))

    expect(screen.getByText('Updated body mass')).toBeInTheDocument()
    expect(screen.getByText('Updated body mass again')).toBeInTheDocument()
    expect(consoleError).not.toHaveBeenCalledWith(expect.stringContaining('Encountered two children with the same key'))
  })
})

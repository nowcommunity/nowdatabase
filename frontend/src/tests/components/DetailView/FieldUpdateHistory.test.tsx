import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ContextType } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { ArrayToTable } from '@/components/DetailView/common/tabLayoutHelpers'
import { DetailContext } from '@/components/DetailView/Context/DetailContext'
import { EntryUpdateHistory } from '@/components/DetailView/common/FieldUpdateHistory'

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
  now_ss: [{ lid: 100, sed_struct: 'cross-bedding' }],
  now_lau: [
    {
      lau_date: '2026-06-03',
      lau_authorizer: 'ED',
      lau_coordinator: 'CO',
      lau_comment: 'Added sedimentary structure',
      now_lr: [reference],
      updates: [
        {
          log_id: 2,
          table_name: 'now_ss',
          pk_data: '3.100;13.cross-bedding;',
          column_name: 'sed_struct',
          log_action: 2,
          old_data: null,
          new_data: 'cross-bedding',
        },
        {
          log_id: 3,
          table_name: 'now_ss',
          pk_data: '3.100;13.cross-bedding;',
          column_name: 'ss_comment',
          log_action: 3,
          old_data: 'old row comment',
          new_data: 'new row comment',
        },
        {
          log_id: 4,
          table_name: 'now_ss',
          pk_data: '3.101;13.cross-bedding;',
          column_name: 'sed_struct',
          log_action: 2,
          old_data: null,
          new_data: 'cross-bedding',
        },
        {
          log_id: 5,
          table_name: 'now_ss',
          pk_data: '3.100;19.cross bedding/layer;',
          column_name: 'sed_struct',
          log_action: 2,
          old_data: null,
          new_data: 'cross bedding/layer',
        },
      ],
    },
  ],
  now_oau: [
    {
      occ_date: '2026-06-04',
      occ_authorizer: 'ED',
      occ_coordinator: 'CO',
      occ_comment: 'Occurrence row changed',
      references: [reference],
      updates: [
        {
          log_id: 6,
          table_name: 'now_ls',
          pk_data: '3.100;3.200;',
          column_name: 'lid',
          log_action: 3,
          old_data: '100',
          new_data: '101',
        },
        {
          log_id: 7,
          table_name: 'now_ls',
          pk_data: '3.100;3.200;',
          column_name: 'species_id',
          log_action: 3,
          old_data: '200',
          new_data: '201',
        },
      ],
    },
    {
      occ_date: '2026-06-04',
      occ_authorizer: 'ED',
      occ_coordinator: 'CO',
      occ_comment: 'Occurrence row changed',
      references: [reference],
      updates: [
        {
          log_id: 8,
          table_name: 'now_ls',
          pk_data: '3.100;3.200;',
          column_name: 'lid',
          log_action: 3,
          old_data: '100',
          new_data: '101',
        },
        {
          log_id: 9,
          table_name: 'now_ls',
          pk_data: '3.100;3.200;',
          column_name: 'species_id',
          log_action: 3,
          old_data: '200',
          new_data: '201',
        },
      ],
    },
  ],
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

  it('shows entry-specific update history for a matching relation row', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <DetailContext.Provider value={contextValue}>
          <EntryUpdateHistory
            row={{ lid: 100, sed_struct: 'cross-bedding' }}
            label="sedimentary structure cross-bedding"
            tableName="now_ss"
            getRowValue={row => row.sed_struct}
            getPkValues={row => [row.lid, row.sed_struct]}
          />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    await user.click(screen.getByLabelText('Show entry history for sedimentary structure cross-bedding'))

    expect(screen.getByRole('heading', { name: 'sedimentary structure cross-bedding entry history' })).toBeTruthy()
    expect(screen.getAllByText('Added sedimentary structure')).toHaveLength(1)
    expect(screen.getAllByText(/Field update reference/)).toHaveLength(1)
    const tableRow = screen.getAllByText('Table:')[0].closest('p')
    expect(tableRow).toBeTruthy()
    expect(within(tableRow as HTMLElement).getByText('now_ss')).toBeInTheDocument()
    expect(screen.getByText('ss_comment:').closest('p')).toHaveTextContent('old row comment -> new row comment')
    expect(screen.queryByText('101')).not.toBeInTheDocument()
  })

  it('groups duplicate occurrence row update logs into one history entry', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <DetailContext.Provider value={contextValue}>
          <EntryUpdateHistory
            row={{ lid: 100, species_id: 200 }}
            label="occurrence 100/200"
            tableName="now_ls"
            getRowValue={row => row.species_id}
            getPkValues={row => [row.lid, row.species_id]}
          />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    await user.click(screen.getByLabelText('Show entry history for occurrence 100/200'))

    expect(screen.getByRole('heading', { name: 'occurrence 100/200 entry history' })).toBeTruthy()
    expect(screen.getAllByText('Occurrence row changed')).toHaveLength(1)
    expect(screen.getAllByText(/Field update reference/)).toHaveLength(1)
    expect(screen.getByText('lid:').closest('p')).toHaveTextContent('100 -> 101')
    expect(screen.getByText('species_id:').closest('p')).toHaveTextContent('200 -> 201')
  })

  it('uses a safe popover id for entry values with spaces or punctuation', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <DetailContext.Provider value={contextValue}>
          <EntryUpdateHistory
            row={{ lid: 100, sed_struct: 'cross bedding/layer' }}
            label="sedimentary structure cross bedding/layer"
            tableName="now_ss"
            getRowValue={row => row.sed_struct}
            getPkValues={row => [row.lid, row.sed_struct]}
          />
        </DetailContext.Provider>
      </MemoryRouter>
    )

    const button = screen.getByLabelText('Show entry history for sedimentary structure cross bedding/layer')
    await user.click(button)

    expect(button).toHaveAttribute('aria-describedby', 'now_ss-cross-bedding-layer-update-history-popover')
  })

  it('does not bubble entry history clicks to the relation row', async () => {
    const user = userEvent.setup()
    const handleRowClick = jest.fn()

    render(
      <MemoryRouter>
        <DetailContext.Provider value={contextValue}>
          <div role="button" tabIndex={0} onClick={handleRowClick} onKeyDown={() => undefined}>
            <EntryUpdateHistory
              row={{ lid: 100, sed_struct: 'cross-bedding' }}
              label="sedimentary structure cross-bedding"
              tableName="now_ss"
              getRowValue={row => row.sed_struct}
              getPkValues={row => [row.lid, row.sed_struct]}
            />
          </div>
        </DetailContext.Provider>
      </MemoryRouter>
    )

    await user.click(screen.getByLabelText('Show entry history for sedimentary structure cross-bedding'))

    expect(handleRowClick).not.toHaveBeenCalled()
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

import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import { LocalitySpeciesTab } from '@/components/Species/Tabs/LocalitySpeciesTab'
import { modeOptionToMode, useDetailContext } from '@/components/DetailView/Context/DetailContext'
import type { SpeciesLocality } from '@/shared/types'
import type { MRT_ColumnDef, MRT_Row } from 'material-react-table'
import { occurrenceLabels } from '@/constants/occurrenceLabels'

jest.mock('@/components/DetailView/Context/DetailContext', () => ({
  useDetailContext: jest.fn(),
  modeOptionToMode: {
    new: { read: false, staging: false, new: true, option: 'new' },
    read: { read: true, staging: false, new: false, option: 'read' },
    edit: { read: false, staging: false, new: false, option: 'edit' },
    'staging-edit': { read: false, staging: true, new: false, option: 'staging-edit' },
    'staging-new': { read: false, staging: true, new: true, option: 'staging-new' },
  },
}))

type EditableTableProps = {
  columns: MRT_ColumnDef<SpeciesLocality>[]
  field: string
}

const editableTableMock = jest.fn<(props: EditableTableProps) => JSX.Element>()
editableTableMock.mockImplementation(() => <div data-testid="editable-table" />)

jest.mock('@/components/DetailView/common/EditableTable', () => ({
  EditableTable: (props: EditableTableProps) => editableTableMock(props),
}))

jest.mock('@/components/DetailView/common/EditingModal', () => ({
  EditingModal: ({ children, buttonText }: { children: ReactNode; buttonText: string }) => (
    <div data-testid="editing-modal" data-button-text={buttonText}>
      {children}
    </div>
  ),
}))

jest.mock('@/components/DetailView/common/tabLayoutHelpers', () => ({
  Grouped: ({ children, title }: { children: ReactNode; title: string }) => (
    <div data-testid="grouped" data-title={title}>
      {children}
    </div>
  ),
}))

const mockUseDetailContext = useDetailContext as jest.MockedFunction<typeof useDetailContext>

describe('LocalitySpeciesTab MW score prerequisites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDetailContext.mockReturnValue({
      mode: modeOptionToMode.read,
    } as never)
  })

  it('passes MW scale/value columns and MW Score cell can read values from row data', () => {
    render(<LocalitySpeciesTab />)

    const firstCall = editableTableMock.mock.calls[0]
    expect(firstCall).toBeDefined()

    const editableTableProps = firstCall?.[0]
    expect(editableTableProps?.field).toBe('now_ls')

    const accessorKeys = (editableTableProps?.columns ?? [])
      .map(column => ('accessorKey' in column ? column.accessorKey : undefined))
      .filter(Boolean)

    expect(accessorKeys).toEqual(expect.arrayContaining(['mw_scale_min', 'mw_scale_max', 'mw_value']))

    const mwScoreColumn = editableTableProps?.columns.find(column => column.header === 'MW Score')
    expect(mwScoreColumn).toBeDefined()

    const cellRenderer = mwScoreColumn?.Cell as ((args: { row: MRT_Row<SpeciesLocality> }) => ReactNode) | undefined

    const row = {
      original: {
        lid: 1,
        species_id: 25056,
        mw_scale_min: 1,
        mw_scale_max: 5,
        mw_value: 3,
        now_loc: {},
      },
    } as MRT_Row<SpeciesLocality>

    const cellResult = cellRenderer?.({ row })
    expect(cellResult).toBeTruthy()
  })

  it('uses occurrence terminology in grouped heading and modal button', () => {
    render(<LocalitySpeciesTab />)

    const grouped = document.querySelector('[data-testid="grouped"]')
    const editingModal = document.querySelector('[data-testid="editing-modal"]')

    expect(grouped?.getAttribute('data-title')).toBe(occurrenceLabels.informationSectionTitle)
    expect(editingModal?.getAttribute('data-button-text')).toBe(occurrenceLabels.addNewButton)
  })
})

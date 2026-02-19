import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render } from '@testing-library/react'
import { isValidElement, type ReactNode } from 'react'
import type { MRT_ColumnDef, MRT_Row } from 'material-react-table'
import { LocalitySpeciesTab } from '@/components/Species/Tabs/LocalitySpeciesTab'
import { modeOptionToMode, useDetailContext } from '@/components/DetailView/Context/DetailContext'
import type { SpeciesLocality } from '@/shared/types'

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
  enableAdvancedTableControls?: boolean
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

const getMwScoreCellRenderer = () => {
  const editableTableProps = editableTableMock.mock.calls[0]?.[0]
  const mwScoreColumn = editableTableProps?.columns.find(column => column.header === 'MW Score')

  return mwScoreColumn?.Cell as ((args: { row: MRT_Row<SpeciesLocality> }) => ReactNode) | undefined
}

const getElementChildText = (node: ReactNode): string | null => {
  if (!isValidElement(node)) return null
  const elementProps = node.props as { children?: unknown }
  return typeof elementProps.children === 'string' ? elementProps.children : null
}

describe('LocalitySpeciesTab MW Score rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseDetailContext.mockReturnValue({ mode: modeOptionToMode.read } as never)
    render(<LocalitySpeciesTab />)
  })

  it('enables advanced controls for editable locality-species rows', () => {
    const editableTableProps = editableTableMock.mock.calls[0]?.[0]
    expect(editableTableProps?.enableAdvancedTableControls).toBe(true)
  })

  it('uses occurrence terminology in modal button and group heading', () => {
    const grouped = document.querySelector('[data-testid="grouped"]')
    const editingModal = document.querySelector('[data-testid="editing-modal"]')

    expect(grouped?.getAttribute('data-title')).toBe('Occurrence Information')
    expect(editingModal?.getAttribute('data-button-text')).toBe('Add new Occurrence')
  })

  it('renders normalized score with 2 decimals for valid inputs', () => {
    const cellRenderer = getMwScoreCellRenderer()
    expect(cellRenderer).toBeDefined()

    const validRow = {
      original: {
        lid: 1,
        species_id: 25056,
        mw_scale_min: 1,
        mw_scale_max: 5,
        mw_value: 3,
        now_loc: {},
      },
    } as MRT_Row<SpeciesLocality>

    const output = cellRenderer?.({ row: validRow })
    expect(getElementChildText(output)).toBe('50.00')
  })

  it('renders blank output for invalid/null inputs and never reintroduces placeholder text', () => {
    const cellRenderer = getMwScoreCellRenderer()
    expect(cellRenderer).toBeDefined()

    const invalidRow = {
      original: {
        lid: 1,
        species_id: 25056,
        mw_scale_min: null,
        mw_scale_max: 5,
        mw_value: 3,
        now_loc: {},
      },
    } as MRT_Row<SpeciesLocality>

    const output = cellRenderer?.({ row: invalidRow })
    const childText = getElementChildText(output)

    expect(childText ?? '').toBe('')
    expect(childText ?? '').not.toContain('not implemented')
  })
})

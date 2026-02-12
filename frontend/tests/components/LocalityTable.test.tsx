import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'

jest.setTimeout(30000)

type MockedColumn = {
  accessorKey?: string
  Cell?: (props: { cell: { getValue: () => unknown } }) => unknown
}

type MockedTableViewProps = {
  columns?: MockedColumn[]
}

const mockTableView = jest.fn((props: MockedTableViewProps) => {
  capturedProps = props
  return null
})

const mockUseGetAllLocalitiesQuery = jest.fn()
const mockUsePageContext = jest.fn()

jest.mock('../../src/components/TableView/TableView', () => ({
  TableView: (props: MockedTableViewProps) => mockTableView(props),
}))

jest.mock('../../src/redux/localityReducer', () => ({
  useGetAllLocalitiesQuery: (...args: unknown[]) => mockUseGetAllLocalitiesQuery(...args),
}))

jest.mock('../../src/components/Page', () => ({
  usePageContext: (...args: unknown[]) => mockUsePageContext(...args),
}))

jest.mock('../../src/components/Map/LocalitiesMap', () => ({
  LocalitiesMap: () => null,
}))

jest.mock('../../src/components/Locality/LocalitySynonymsModal', () => ({
  LocalitySynonymsModal: () => null,
}))

let capturedProps: MockedTableViewProps | undefined

describe('LocalityTable numeric cell formatting', () => {
  beforeEach(async () => {
    capturedProps = undefined
    mockUsePageContext.mockReturnValue({ idList: [] })
    mockUseGetAllLocalitiesQuery.mockReturnValue({
      data: [],
      isFetching: false,
      isError: false,
      error: undefined,
    })

    const { LocalityTable } = await import('../../src/components/Locality/LocalityTable')
    render(<LocalityTable />)

    await waitFor(() => {
      expect(mockTableView).toHaveBeenCalled()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    capturedProps = undefined
  })

  const getCellRenderer = (columnKey: string) => {
    const column = (capturedProps?.columns ?? []).find(col => col.accessorKey === columnKey)
    expect(column).toBeDefined()
    expect(typeof column?.Cell).toBe('function')
    return column?.Cell
  }

  it('formats coordinate values with at most three decimals while preserving shorter values', () => {
    const decLatCell = getCellRenderer('dec_lat')
    const decLongCell = getCellRenderer('dec_long')

    expect(decLatCell?.({ cell: { getValue: () => 12.34567 } })).toBe('12.346')
    expect(decLatCell?.({ cell: { getValue: () => 12.3 } })).toBe(12.3)
    expect(decLongCell?.({ cell: { getValue: () => -55 } })).toBe(-55)
  })

  it('keeps max_age/min_age formatting behavior unchanged', () => {
    const maxAgeCell = getCellRenderer('max_age')
    const minAgeCell = getCellRenderer('min_age')

    expect(maxAgeCell?.({ cell: { getValue: () => 99.9999 } })).toBe('100.000')
    expect(maxAgeCell?.({ cell: { getValue: () => 3.25 } })).toBe(3.25)
    expect(minAgeCell?.({ cell: { getValue: () => 7.0001 } })).toBe('7.000')
    expect(minAgeCell?.({ cell: { getValue: () => 7 } })).toBe(7)
  })
})

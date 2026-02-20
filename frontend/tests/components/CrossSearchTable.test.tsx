import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { render, waitFor } from '@testing-library/react'

type CrossSearchRow = {
  lid_now_loc: number
  species_id_com_species: number
  appr_num_spm: number
  cusp_shape?: string | number | null
  cusp_count_buccal?: number | null
  cusp_count_lingual?: number | null
  loph_count_lon?: number | null
  loph_count_trs?: number | null
  [key: string]: unknown
}

type MockedColumn = {
  id?: string
  accessorKey?: string
  accessorFn?: (row: CrossSearchRow) => unknown
  Cell?: (props: { cell: { getValue: () => unknown } }) => unknown
}

type MockedTableViewProps = {
  data: CrossSearchRow[] | undefined
  columns?: MockedColumn[]
  getDetailPath?: (row: CrossSearchRow) => string
}

const mockTableView = jest.fn((props: MockedTableViewProps) => {
  capturedProps = props
  return null
})

const mockUseGetAllCrossSearchQuery = jest.fn()
const mockUseGetAllCrossSearchLocalitiesQuery = jest.fn()
const mockUsePageContext = jest.fn()

jest.mock('../../src/components/TableView/TableView', () => ({
  TableView: (props: MockedTableViewProps) => mockTableView(props),
}))

jest.mock('../../src/redux/crossSearchReducer', () => ({
  useGetAllCrossSearchQuery: (...args: unknown[]) => mockUseGetAllCrossSearchQuery(...args),
  useGetAllCrossSearchLocalitiesQuery: (...args: unknown[]) => mockUseGetAllCrossSearchLocalitiesQuery(...args),
}))

jest.mock('../../src/components/Map/LocalitiesMap', () => ({
  LocalitiesMap: () => null,
}))

jest.mock('../../src/components/Page', () => ({
  usePageContext: (...args: unknown[]) => mockUsePageContext(...args),
}))

let capturedProps: MockedTableViewProps | undefined

const createCrossSearch = (overrides: Partial<CrossSearchRow> = {}): CrossSearchRow => {
  return {
    species_id_com_species: 0,
    lid_now_loc: 0,
    appr_num_spm: 0,
    ...overrides,
  }
}

describe('CrossSearchTable column configuration', () => {
  beforeEach(async () => {
    capturedProps = undefined
    mockUsePageContext.mockReturnValue({
      sqlLimit: 25,
      sqlOffset: 0,
      sqlColumnFilters: [],
      sqlOrderBy: [],
    })
    mockUseGetAllCrossSearchQuery.mockReturnValue({ data: [createCrossSearch()], isFetching: false })
    mockUseGetAllCrossSearchLocalitiesQuery.mockReturnValue({ data: [], isFetching: false })

    const { CrossSearchTable } = await import('../../src/components/CrossSearch/CrossSearchTable')
    render(<CrossSearchTable />)
    await waitFor(() => {
      expect(mockTableView).toHaveBeenCalled()
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
    capturedProps = undefined
  })

  it('provides unique column identifiers', () => {
    expect(capturedProps?.columns).toBeDefined()
    const identifiers = (capturedProps?.columns ?? [])
      .map(column => {
        if (!column) {
          return undefined
        }

        if (typeof column.id === 'string') {
          return column.id
        }

        if (typeof column.accessorKey === 'string') {
          return column.accessorKey
        }

        return undefined
      })
      .filter((identifier): identifier is string => Boolean(identifier))

    expect(new Set(identifiers).size).toBe(identifiers.length)
  })

  it('formats developmental crown type values using the shared formatter', () => {
    const developmentalColumn = (capturedProps?.columns ?? []).find(column => column?.id === 'crowntype')
    expect(developmentalColumn).toBeDefined()

    const accessorFn = developmentalColumn?.accessorFn
    expect(typeof accessorFn).toBe('function')

    const sample = createCrossSearch({
      cusp_shape: 'S',
      cusp_count_buccal: 1,
      cusp_count_lingual: 2,
      loph_count_lon: 3,
      loph_count_trs: 4,
    })

    expect(accessorFn?.(sample)).toBe('S1234')
  })

  it('builds composite-key occurrence detail paths for row navigation', () => {
    expect(typeof capturedProps?.getDetailPath).toBe('function')

    const path = capturedProps?.getDetailPath?.(
      createCrossSearch({ lid_now_loc: 20920, species_id_com_species: 21052 })
    )

    expect(path).toBe('/occurrence/20920/21052')
  })
  it('formats coordinates with a maximum of three decimals for consistency with Locality table', () => {
    const decLatColumn = (capturedProps?.columns ?? []).find(column => column?.accessorKey === 'dec_lat')
    const decLongColumn = (capturedProps?.columns ?? []).find(column => column?.accessorKey === 'dec_long')

    expect(typeof decLatColumn?.Cell).toBe('function')
    expect(typeof decLongColumn?.Cell).toBe('function')

    expect(decLatColumn?.Cell?.({ cell: { getValue: () => 12.34567 } })).toBe('12.346')
    expect(decLatColumn?.Cell?.({ cell: { getValue: () => 12.3 } })).toBe(12.3)
    expect(decLongColumn?.Cell?.({ cell: { getValue: () => -55 } })).toBe(-55)
    expect(decLongColumn?.Cell?.({ cell: { getValue: () => '-96.7166667' } })).toBe('-96.717')
  })
})

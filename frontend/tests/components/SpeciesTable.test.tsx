import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import type { JSX } from 'react'
import type { MRT_Row } from 'material-react-table'
import type { Species } from '../../src/shared/types'
import { SpeciesCommentDialog as MockSpeciesCommentDialog } from '../../src/components/Species/SpeciesCommentDialog'

type SynonymFilter = (row: { original: Species }, columnId: string, filterValue: unknown) => boolean

type MockedColumn = {
  id?: string
  accessorKey?: string
  accessorFn?: (row: Species) => unknown
  Cell?: (args: { row: { original: Species } }) => JSX.Element
}

type MockedTableViewProps = {
  data: Species[] | undefined
  columns?: MockedColumn[]
  filterFns?: Record<string, SynonymFilter>
  renderRowActionExtras?: (args: { row: MRT_Row<Species> }) => JSX.Element | null
}

const mockTableView = jest.fn((props: MockedTableViewProps) => {
  capturedProps = props

  return (
    <div data-testid="mock-table-view">
      {(props.data ?? []).map(row => (
        <div key={row.species_id}>
          {props.renderRowActionExtras?.({ row: { original: row } as unknown as MRT_Row<Species> }) ?? null}
        </div>
      ))}
    </div>
  )
})

const mockUseGetAllSpeciesQuery = jest.fn()

jest.mock('../../src/components/TableView/TableView', () => ({
  TableView: (props: MockedTableViewProps) => mockTableView(props),
}))

jest.mock('../../src/redux/speciesReducer', () => ({
  useGetAllSpeciesQuery: (...args: unknown[]) => mockUseGetAllSpeciesQuery(...args),
}))

jest.mock('../../src/components/Species/SynonymsModal', () => ({
  SynonymsModal: () => null,
}))

jest.mock('../../src/components/Species/SpeciesCommentDialog', () => ({
  SpeciesCommentDialog: ({
    open,
    comment,
    onClose,
  }: {
    open: boolean
    comment: string | null
    onClose: () => void
  }) => {
    if (!open) {
      return null
    }

    const trimmed = (comment ?? '').trim()
    const content = trimmed.length > 0 ? trimmed : 'No comment available.'

    return (
      <div role="dialog">
        <p>{content}</p>
        <button onClick={onClose}>close</button>
      </div>
    )
  },
}))

let capturedProps: MockedTableViewProps | undefined

describe('SpeciesTable synonym filtering', () => {
  const createSpecies = (overrides: Partial<Species>): Species => ({
    species_id: 0,
    order_name: null,
    family_name: null,
    genus_name: null,
    species_name: null,
    subclass_or_superorder_name: null,
    suborder_or_superfamily_name: null,
    subfamily_name: null,
    unique_identifier: null,
    taxonomic_status: null,
    sv_length: null,
    body_mass: 0,
    sd_size: null,
    sd_display: null,
    tshm: null,
    tht: null,
    horizodonty: null,
    crowntype: null,
    cusp_shape: null,
    cusp_count_buccal: null,
    cusp_count_lingual: null,
    loph_count_lon: null,
    loph_count_trs: null,
    fct_al: null,
    fct_ol: null,
    fct_sf: null,
    fct_ot: null,
    fct_cm: null,
    microwear: null,
    mesowear: null,
    mw_or_high: 0,
    mw_or_low: 0,
    mw_cs_sharp: 0,
    mw_cs_round: 0,
    mw_cs_blunt: 0,
    diet1: null,
    diet2: null,
    diet3: null,
    locomo1: null,
    locomo2: null,
    locomo3: null,
    sp_comment: null,
    sp_author: null,
    has_synonym: false,
    has_no_locality: false,
    synonyms: [],
    ...overrides,
  })

  beforeEach(async () => {
    capturedProps = undefined
    const speciesWithSynonyms = createSpecies({
      species_id: 2,
      genus_name: 'Canis',
      species_name: 'lupus',
      synonyms: [
        { syn_genus_name: 'Lupus', syn_species_name: 'familiaris' },
        { syn_genus_name: 'Canis', syn_species_name: 'domesticus' },
      ],
    })

    const regularSpecies = createSpecies({
      species_id: 1,
      genus_name: 'Panthera',
      species_name: 'leo',
      sp_comment: 'A fierce cat',
    })

    mockUseGetAllSpeciesQuery.mockReturnValue({ data: [regularSpecies, speciesWithSynonyms], isFetching: false })

    const { SpeciesTable } = await import('../../src/components/Species/SpeciesTable')
    render(<SpeciesTable />)
    expect(mockTableView).toHaveBeenCalled()
  })

  afterEach(() => {
    jest.clearAllMocks()
    capturedProps = undefined
  })

  it('opens the comment modal when the comment button is clicked', async () => {
    expect(mockTableView).toHaveBeenCalled()
    const commentButton = screen.getByRole('button', { name: /view species comment for panthera leo/i })
    fireEvent.click(commentButton)

    expect(mockTableView).toHaveBeenCalled()

    // The mocked comment dialog echoes the comment text when open
    expect(screen.getByText('A fierce cat')).toBeTruthy()

    fireEvent.click(screen.getByText('close'))

    await waitFor(() => {
      expect(screen.queryByText('A fierce cat')).toBeNull()
    })
  })

  it('does not render a comment button when the species comment is absent', () => {
    expect(screen.queryByRole('button', { name: /view species comment for canis lupus/i })).toBeNull()
  })

  it('renders the fallback message when the comment dialog receives an empty comment', () => {
    render(
      <MockSpeciesCommentDialog
        open
        comment={null}
        onClose={jest.fn()}
        genusName={null}
        speciesName={null}
      />
    )

    expect(screen.getByText('No comment available.')).toBeTruthy()
  })

  it('matches rows when the genus filter value appears in a synonym', () => {
    expect(capturedProps).toBeDefined()
    const filterFns = capturedProps?.filterFns
    expect(filterFns).toBeDefined()

    const genusFilter = filterFns?.genusSynonymContains
    expect(genusFilter).toBeDefined()

    const speciesWithSynonyms = capturedProps?.data?.find(species => species.species_id === 2)
    expect(speciesWithSynonyms).toBeDefined()
    const row = { original: speciesWithSynonyms! }

    expect(genusFilter!(row as { original: Species }, 'genus_name', 'lupus')).toBe(true)
    expect(genusFilter!(row as { original: Species }, 'genus_name', 'unknown')).toBe(false)
  })

  it('matches rows when the species filter value appears in a synonym', () => {
    expect(capturedProps).toBeDefined()
    const filterFns = capturedProps?.filterFns
    expect(filterFns).toBeDefined()

    const speciesFilter = filterFns?.speciesSynonymContains
    expect(speciesFilter).toBeDefined()

    const speciesWithSynonyms = capturedProps?.data?.find(species => species.species_id === 2)
    expect(speciesWithSynonyms).toBeDefined()
    const row = { original: speciesWithSynonyms! }

    expect(speciesFilter!(row as { original: Species }, 'species_name', 'fami')).toBe(true)
    expect(speciesFilter!(row as { original: Species }, 'species_name', 'absent')).toBe(false)
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
    const developmentalColumn = (capturedProps?.columns ?? []).find(column => column?.id === 'developmental_crown_type')
    expect(developmentalColumn).toBeDefined()

    const accessorFn = developmentalColumn?.accessorFn
    expect(typeof accessorFn).toBe('function')

    const sample = createSpecies({
      cusp_shape: 'B',
      cusp_count_buccal: '2',
      cusp_count_lingual: '3',
      loph_count_lon: '4',
      loph_count_trs: '5',
    })

    expect(accessorFn?.(sample)).toBe('B2345')
  })

  it('formats functional crown type values using the shared formatter', () => {
    const functionalColumn = (capturedProps?.columns ?? []).find(column => column?.id === 'functional_crown_type')
    expect(functionalColumn).toBeDefined()

    const accessorFn = functionalColumn?.accessorFn
    expect(typeof accessorFn).toBe('function')

    const sample = createSpecies({
      fct_al: 'A',
      fct_ol: '0',
      fct_sf: 'S',
      fct_ot: '',
      fct_cm: null,
    })

    expect(accessorFn?.(sample)).toBe('A0S--')
  })
})

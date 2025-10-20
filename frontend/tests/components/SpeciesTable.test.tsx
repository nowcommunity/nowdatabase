import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Species } from '../../src/shared/types'

type SynonymFilter = (row: { original: Species }, columnId: string, filterValue: unknown) => boolean

type MockedTableViewProps = {
  data: Species[] | undefined
  filterFns?: Record<string, SynonymFilter>
}

const mockTableView = jest.fn((props: MockedTableViewProps) => {
  capturedProps = props
  return null
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
    })

    mockUseGetAllSpeciesQuery.mockReturnValue({ data: [regularSpecies, speciesWithSynonyms], isFetching: false })

    const { SpeciesTable } = await import('../../src/components/Species/SpeciesTable')
    renderToStaticMarkup(<SpeciesTable />)
  })

  afterEach(() => {
    jest.clearAllMocks()
    capturedProps = undefined
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
})

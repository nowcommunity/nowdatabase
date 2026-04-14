import { describe, expect, it, jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SpeciesMergePage } from '@/pages/admin/SpeciesMergePage'
import { Role, Species, SpeciesMergeSummary, SpeciesMergeSummaryField, Reference } from '@/shared/types'

const mockUseUser = jest.fn()
const mockUseNotify = jest.fn()
const mockUseGetAllSpeciesQuery = jest.fn()
const mockUseGetSpeciesMergeSummaryQuery = jest.fn()
const mockUseMergeSpeciesMutation = jest.fn()
const mockUseGetAllReferencesQuery = jest.fn()

jest.mock('@/hooks/user', () => ({
  useUser: () => mockUseUser(),
}))

jest.mock('@/hooks/notification', () => ({
  useNotify: () => ({ notify: mockUseNotify }),
}))

jest.mock('@/redux/speciesReducer', () => ({
  useGetAllSpeciesQuery: () => mockUseGetAllSpeciesQuery(),
  useGetSpeciesMergeSummaryQuery: () => mockUseGetSpeciesMergeSummaryQuery(),
  useMergeSpeciesMutation: () => mockUseMergeSpeciesMutation(),
}))

jest.mock('@/redux/referenceReducer', () => ({
  useGetAllReferencesQuery: () => mockUseGetAllReferencesQuery(),
}))

const speciesFactory = (overrides: Partial<Species> = {}): Species => ({
  species_id: 1,
  order_name: 'Order',
  family_name: 'Family',
  genus_name: 'Genus',
  species_name: 'species',
  subclass_or_superorder_name: null,
  suborder_or_superfamily_name: null,
  subfamily_name: null,
  unique_identifier: 'id',
  taxonomic_status: null,
  sv_length: null,
  body_mass: 1,
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
  sp_author: null,
  sp_comment: null,
  has_synonym: false,
  has_no_locality: false,
  synonyms: [],
  ...overrides,
})

const referenceFactory = (overrides: Partial<Reference> = {}): Reference => ({
  rid: 100,
  title_primary: 'Reference title',
  title_secondary: '',
  date_primary: 2000,
  ref_authors: [{ au_num: 1, author_surname: 'Doe', author_initials: 'J' }],
  ref_journal: { journal_title: 'Journal' },
  ref_ref_type: { ref_type: 'Article' },
  ...overrides,
})

const summaryFieldFactory = (overrides: Partial<SpeciesMergeSummaryField> = {}): SpeciesMergeSummaryField => ({
  species_id: 0,
  class_name: null,
  order_name: null,
  family_name: null,
  genus_name: null,
  species_name: null,
  subclass_or_superorder_name: null,
  suborder_or_superfamily_name: null,
  subfamily_name: null,
  unique_identifier: null,
  taxonomic_status: null,
  common_name: null,
  sp_author: null,
  strain: null,
  gene: null,
  taxon_status: null,
  diet_description: null,
  rel_fib: null,
  selectivity: null,
  digestion: null,
  feedinghab1: null,
  feedinghab2: null,
  shelterhab1: null,
  shelterhab2: null,
  hunt_forage: null,
  brain_mass: null,
  activity: null,
  symph_mob: null,
  relative_blade_length: null,
  microwear: null,
  horizodonty: null,
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
  mesowear: null,
  mw_or_high: null,
  mw_or_low: null,
  mw_cs_sharp: null,
  mw_cs_round: null,
  mw_cs_blunt: null,
  mw_scale_min: null,
  mw_scale_max: null,
  mw_value: null,
  pop_struc: null,
  sp_status: null,
  used_morph: null,
  used_now: null,
  used_gene: null,
  sp_comment: null,
  localities: 0,
  sv_length: null,
  body_mass: null,
  sd_size: null,
  sd_display: null,
  tshm: null,
  tht: null,
  crowntype: null,
  diet1: null,
  diet2: null,
  diet3: null,
  locomo1: null,
  locomo2: null,
  locomo3: null,
  ...overrides,
})

const summaryFactory = (): SpeciesMergeSummary => ({
  obsolete: summaryFieldFactory({
    species_id: 1,
    order_name: 'Order',
    family_name: 'Family',
    genus_name: 'Genus',
    species_name: 'species',
    unique_identifier: 'id',
    localities: 1,
    body_mass: 1,
  }),
  accepted: summaryFieldFactory({
    species_id: 2,
    order_name: 'Order',
    family_name: 'Family',
    genus_name: 'Genus',
    species_name: 'species2',
    unique_identifier: 'id2',
    localities: 2,
    body_mass: 2,
  }),
  speciesFieldChoices: [],
  occurrenceConflicts: [],
})

describe('SpeciesMergePage', () => {
  it('blocks non-admin users', () => {
    mockUseUser.mockReturnValue({ role: Role.ReadOnly })
    mockUseGetAllSpeciesQuery.mockReturnValue({ data: [], isError: false })
    mockUseGetAllReferencesQuery.mockReturnValue({ data: [], isError: false })
    mockUseGetSpeciesMergeSummaryQuery.mockReturnValue({ data: undefined, isFetching: false, isError: false })
    mockUseMergeSpeciesMutation.mockReturnValue([jest.fn(), { isLoading: false, data: undefined }])

    render(
      <MemoryRouter>
        <SpeciesMergePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Only administrators can access the Species Merge tool.')).toBeTruthy()
  })

  it('renders the selection UI for admins', () => {
    mockUseUser.mockReturnValue({ role: Role.Admin })
    mockUseGetAllSpeciesQuery.mockReturnValue({ data: [speciesFactory()], isError: false })
    mockUseGetAllReferencesQuery.mockReturnValue({ data: [referenceFactory()], isError: false })
    mockUseGetSpeciesMergeSummaryQuery.mockReturnValue({ data: summaryFactory(), isFetching: false, isError: false })
    mockUseMergeSpeciesMutation.mockReturnValue([jest.fn(), { isLoading: false, data: undefined }])

    render(
      <MemoryRouter>
        <SpeciesMergePage />
      </MemoryRouter>
    )

    expect(screen.getByText('Merge Species (Admin)')).toBeTruthy()
    expect(screen.getByLabelText('Obsolete taxonomy')).toBeTruthy()
    expect(screen.getByLabelText('Accepted taxonomy')).toBeTruthy()
  })
})

import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getAllSpecies } from '../../services/species'
import { nowDb } from '../../utils/db'

type PrismaSpeciesRow = {
  species_id: number
  order_name: string
  family_name: string
  genus_name: string
  species_name: string
  subclass_or_superorder_name: string | null
  suborder_or_superfamily_name: string | null
  subfamily_name: string | null
  unique_identifier: string
  taxonomic_status: string | null
  sv_length: string | null
  body_mass: bigint | null
  sd_size: string | null
  sd_display: string | null
  tshm: string | null
  tht: string | null
  horizodonty: string | null
  crowntype: string | null
  cusp_shape: string | null
  cusp_count_buccal: string | null
  cusp_count_lingual: string | null
  loph_count_lon: string | null
  loph_count_trs: string | null
  fct_al: string | null
  fct_ol: string | null
  fct_sf: string | null
  fct_ot: string | null
  fct_cm: string | null
  microwear: string | null
  mesowear: string | null
  mw_or_high: number | null
  mw_or_low: number | null
  mw_cs_sharp: number | null
  mw_cs_round: number | null
  mw_cs_blunt: number | null
  diet1: string | null
  diet2: string | null
  diet3: string | null
  locomo1: string | null
  locomo2: string | null
  locomo3: string | null
  sp_comment: string | null
}

type PrismaNowLsRow = { species_id: number }
type PrismaSpeciesSynonymRow = {
  species_id: number
  syn_genus_name: string | null
  syn_species_name: string | null
}

jest.mock('../../utils/db', () => ({
  nowDb: {
    com_species: { findMany: jest.fn() },
    now_ls: { findMany: jest.fn() },
    com_taxa_synonym: { findMany: jest.fn() },
  },
  logDb: {},
}))

const mockedNowDb = jest.mocked(nowDb, { shallow: true }) as {
  com_species:    { findMany: jest.Mock<Promise<PrismaSpeciesRow[]>, any[]> },
  now_ls:         { findMany: jest.Mock<Promise<PrismaNowLsRow[]>, any[]> },
  com_taxa_synonym: { findMany: jest.Mock<Promise<PrismaSpeciesSynonymRow[]>, any[]> },
}

describe('getAllSpecies', () => {
  const speciesRow = (overrides: Partial<PrismaSpeciesRow> = {}): PrismaSpeciesRow => {
    const base: PrismaSpeciesRow = {
      species_id: 1,
      order_name: '',
      family_name: '',
      genus_name: '',
      species_name: '',
      subclass_or_superorder_name: null,
      suborder_or_superfamily_name: null,
      subfamily_name: null,
      unique_identifier: '',
      taxonomic_status: null,
      sv_length: null,
      body_mass: null,
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
      mw_or_high: null,
      mw_or_low: null,
      mw_cs_sharp: null,
      mw_cs_round: null,
      mw_cs_blunt: null,
      diet1: null,
      diet2: null,
      diet3: null,
      locomo1: null,
      locomo2: null,
      locomo3: null,
      sp_comment: null,
    }

    return { ...base, ...overrides }
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('attaches synonym arrays and flags for each species', async () => {
    const firstSpeciesOverrides: Partial<PrismaSpeciesRow> = {
      species_id: 1,
      genus_name: 'Panthera',
      species_name: 'leo',
    }
    const secondSpeciesOverrides: Partial<PrismaSpeciesRow> = {
      species_id: 2,
      genus_name: 'Canis',
      species_name: 'lupus',
    }

    const speciesRows: PrismaSpeciesRow[] = [speciesRow(firstSpeciesOverrides), speciesRow(secondSpeciesOverrides)]
    const localityRows: PrismaNowLsRow[] = [{ species_id: 1 }]
    const synonymRows: PrismaSpeciesSynonymRow[] = [
      {
        species_id: 2,
        syn_genus_name: 'Lupus',
        syn_species_name: 'familiaris',
      },
      {
        species_id: 2,
        syn_genus_name: 'Canis',
        syn_species_name: 'domesticus',
      },
    ]

    mockedNowDb.com_species.findMany.mockResolvedValue(speciesRows)
    mockedNowDb.now_ls.findMany.mockResolvedValue(localityRows)
    mockedNowDb.com_taxa_synonym.findMany.mockResolvedValue(synonymRows)

    const result = await getAllSpecies()

    expect(result).toHaveLength(2)

    const firstSpeciesResult = result.find(sp => sp.species_id === 1)
    expect(firstSpeciesResult).toBeDefined()
    expect(firstSpeciesResult?.synonyms).toEqual([])
    expect(firstSpeciesResult?.has_synonym).toBe(false)
    expect(firstSpeciesResult?.has_no_locality).toBe(false)

    const secondSpeciesResult = result.find(sp => sp.species_id === 2)
    expect(secondSpeciesResult).toBeDefined()
    expect(secondSpeciesResult?.synonyms).toEqual([
      { syn_genus_name: 'Lupus', syn_species_name: 'familiaris' },
      { syn_genus_name: 'Canis', syn_species_name: 'domesticus' },
    ])
    expect(secondSpeciesResult?.has_synonym).toBe(true)
    expect(secondSpeciesResult?.has_no_locality).toBe(true)
  })
})

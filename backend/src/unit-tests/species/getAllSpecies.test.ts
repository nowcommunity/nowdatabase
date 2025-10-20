import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getAllSpecies } from '../../services/species'
import { nowDb } from '../../utils/db'
import type { com_species, com_taxa_synonym, now_ls } from '../../../prisma/generated/now_test_client'

// Use the generated Prisma types to keep fixtures aligned with the schema.
type PrismaSpeciesRow = com_species
type PrismaNowLsRow = Pick<now_ls, 'species_id'>
type PrismaSpeciesSynonymRow = Pick<com_taxa_synonym, 'species_id' | 'syn_genus_name' | 'syn_species_name'>

jest.mock('../../utils/db', () => ({
  nowDb: {
    com_species: { findMany: jest.fn() },
    now_ls: { findMany: jest.fn() },
    com_taxa_synonym: { findMany: jest.fn() },
  },
  logDb: {},
}))

const mockedNowDb = jest.mocked(nowDb, true)

describe('getAllSpecies', () => {
  const speciesRow = (overrides: Partial<PrismaSpeciesRow> = {}): PrismaSpeciesRow => {
    const base: PrismaSpeciesRow = {
      species_id: 1,
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

    mockedNowDb.com_species.findMany.mockResolvedValue([
      speciesRow(firstSpeciesOverrides),
      speciesRow(secondSpeciesOverrides),
    ])
    mockedNowDb.now_ls.findMany.mockResolvedValue([{ species_id: 1 }])
    mockedNowDb.com_taxa_synonym.findMany.mockResolvedValue([
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
    ])

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

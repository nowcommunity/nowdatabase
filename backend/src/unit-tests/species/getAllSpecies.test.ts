import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getAllSpecies } from '../../services/species'
import { nowDb } from '../../utils/db'
import type { Prisma } from '../../../prisma/generated/now_test_client'

const speciesFindManyArgs: Parameters<typeof nowDb.com_species.findMany>[0] = {
  select: {
    species_id: true,
    order_name: true,
    family_name: true,
    genus_name: true,
    species_name: true,
    subclass_or_superorder_name: true,
    suborder_or_superfamily_name: true,
    subfamily_name: true,
    unique_identifier: true,
    taxonomic_status: true,
    sv_length: true,
    body_mass: true,
    sd_size: true,
    sd_display: true,
    tshm: true,
    tht: true,
    horizodonty: true,
    crowntype: true,
    cusp_shape: true,
    cusp_count_buccal: true,
    cusp_count_lingual: true,
    loph_count_lon: true,
    loph_count_trs: true,
    fct_al: true,
    fct_ol: true,
    fct_sf: true,
    fct_ot: true,
    fct_cm: true,
    microwear: true,
    mesowear: true,
    mw_or_high: true,
    mw_or_low: true,
    mw_cs_sharp: true,
    mw_cs_round: true,
    mw_cs_blunt: true,
    diet1: true,
    diet2: true,
    diet3: true,
    locomo1: true,
    locomo2: true,
    locomo3: true,
    sp_comment: true,
  },
}

type PrismaSpeciesRow = Prisma.com_speciesGetPayload<typeof speciesFindManyArgs>

const nowLsFindManyArgs: Parameters<typeof nowDb.now_ls.findMany>[0] = {
  where: {
    now_loc: {
      NOT: undefined,
    },
  },
  select: {
    species_id: true,
  },
  distinct: ['species_id'],
}

type PrismaNowLsRow = Prisma.now_lsGetPayload<typeof nowLsFindManyArgs>

const speciesSynonymFindManyArgs: Parameters<typeof nowDb.com_taxa_synonym.findMany>[0] = {
  select: {
    species_id: true,
    syn_genus_name: true,
    syn_species_name: true,
  },
}

type PrismaSpeciesSynonymRow = Prisma.com_taxa_synonymGetPayload<typeof speciesSynonymFindManyArgs>

jest.mock('../../utils/db', () => ({
  nowDb: {
    com_species: { findMany: jest.fn() },
    now_ls: { findMany: jest.fn() },
    com_taxa_synonym: { findMany: jest.fn() },
  },
  logDb: {},
}))

const mockedNowDb: jest.MockedObject<typeof nowDb> = jest.mocked(nowDb, { shallow: true })

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

    expect(mockedNowDb.com_species.findMany.mock.calls[0]?.[0]).toEqual(speciesFindManyArgs)
    expect(mockedNowDb.now_ls.findMany.mock.calls[0]?.[0]).toEqual(nowLsFindManyArgs)
    expect(mockedNowDb.com_taxa_synonym.findMany.mock.calls[0]?.[0]).toEqual(speciesSynonymFindManyArgs)

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

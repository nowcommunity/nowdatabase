import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getAllSpecies } from '../../services/species'
import { nowDb } from '../../utils/db'
import { Prisma } from '../../../prisma/generated/now_test_client'

const speciesFindManyArgs = Prisma.validator<Prisma.com_speciesFindManyArgs>()({
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
})

type PrismaSpeciesRow = Awaited<ReturnType<typeof nowDb.com_species.findMany>>[number]

const nowLsFindManyArgs = Prisma.validator<Prisma.now_lsFindManyArgs>()({
  where: {
    now_loc: {
      NOT: undefined,
    },
  },
  select: {
    species_id: true,
  },
  distinct: ['species_id'],
})

type PrismaNowLsRow = Awaited<ReturnType<typeof nowDb.now_ls.findMany>>[number]

const speciesSynonymFindManyArgs = Prisma.validator<Prisma.com_taxa_synonymFindManyArgs>()({
  select: {
    species_id: true,
    syn_genus_name: true,
    syn_species_name: true,
  },
})

type PrismaSpeciesSynonymRow = Awaited<ReturnType<typeof nowDb.com_taxa_synonym.findMany>>[number]

jest.mock('../../utils/db', () => ({
  nowDb: {
    com_species: { findMany: jest.fn() },
    now_ls: { findMany: jest.fn() },
    com_taxa_synonym: { findMany: jest.fn() },
  },
  logDb: {},
}))

const mockedNowDb = jest.mocked(nowDb)

describe('getAllSpecies', () => {
  const speciesRow = (overrides: Partial<PrismaSpeciesRow> = {}): PrismaSpeciesRow => {
    const base: PrismaSpeciesRow = {
      species_id: 1,
      class_name: '',
      order_name: '',
      family_name: '',
      subclass_or_superorder_name: null,
      suborder_or_superfamily_name: null,
      subfamily_name: null,
      genus_name: '',
      species_name: '',
      unique_identifier: '',
      taxonomic_status: null,
      common_name: null,
      sp_author: null,
      strain: null,
      gene: null,
      taxon_status: null,
      diet1: null,
      diet2: null,
      diet3: null,
      diet_description: null,
      rel_fib: null,
      selectivity: null,
      digestion: null,
      feedinghab1: null,
      feedinghab2: null,
      shelterhab1: null,
      shelterhab2: null,
      locomo1: null,
      locomo2: null,
      locomo3: null,
      hunt_forage: null,
      body_mass: null,
      brain_mass: null,
      sv_length: null,
      activity: null,
      sd_size: null,
      sd_display: null,
      tshm: null,
      symph_mob: null,
      relative_blade_length: null,
      tht: null,
      crowntype: null,
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
    }

    return { ...base, ...overrides }
  }

  const localityRow = (overrides: Partial<PrismaNowLsRow> = {}): PrismaNowLsRow => {
    const base: PrismaNowLsRow = {
      lid: 1,
      species_id: 1,
      nis: null,
      pct: null,
      quad: null,
      mni: null,
      qua: null,
      id_status: null,
      orig_entry: null,
      source_name: null,
      body_mass: null,
      mesowear: null,
      mw_or_high: null,
      mw_or_low: null,
      mw_cs_sharp: null,
      mw_cs_round: null,
      mw_cs_blunt: null,
      mw_scale_min: null,
      mw_scale_max: null,
      mw_value: null,
      microwear: null,
      dc13_mean: null,
      dc13_n: null,
      dc13_max: null,
      dc13_min: null,
      dc13_stdev: null,
      do18_mean: null,
      do18_n: null,
      do18_max: null,
      do18_min: null,
      do18_stdev: null,
    }

    return { ...base, ...overrides }
  }

  const synonymRow = (overrides: Partial<PrismaSpeciesSynonymRow> = {}): PrismaSpeciesSynonymRow => {
    const base: PrismaSpeciesSynonymRow = {
      synonym_id: 1,
      species_id: 1,
      syn_genus_name: null,
      syn_species_name: null,
      syn_comment: null,
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
    const localityRows: PrismaNowLsRow[] = [localityRow({ lid: 1, species_id: 1 })]
    const synonymRows: PrismaSpeciesSynonymRow[] = [
      synonymRow({
        synonym_id: 10,
        species_id: 2,
        syn_genus_name: 'Lupus',
        syn_species_name: 'familiaris',
      }),
      synonymRow({
        synonym_id: 11,
        species_id: 2,
        syn_genus_name: 'Canis',
        syn_species_name: 'domesticus',
      }),
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

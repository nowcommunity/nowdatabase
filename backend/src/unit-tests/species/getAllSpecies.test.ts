import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { getAllSpecies } from '../../services/species'
import { nowDb } from '../../utils/db'
import type { com_species } from '@prisma/client'

jest.mock('../../utils/db', () => ({
  nowDb: {
    com_species: { findMany: jest.fn() },
    now_ls: { findMany: jest.fn() },
    com_taxa_synonym: { findMany: jest.fn() },
  },
  logDb: {},
}))

// Use the generated Prisma type to keep tests aligned with the real schema
type PrismaSpeciesRow = com_species

describe('getAllSpecies', () => {
  const speciesRow = (overrides: Partial<PrismaSpeciesRow> = {}): PrismaSpeciesRow =>
    ({
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
      ...overrides,
    }) as PrismaSpeciesRow

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('attaches synonym arrays and flags for each species', async () => {
    const firstSpecies = speciesRow({
      species_id: 1,
      genus_name: 'Panthera',
      species_name: 'leo',
    })
    const secondSpecies = speciesRow({
      species_id: 2,
      genus_name: 'Canis',
      species_name: 'lupus',
    })

    ;(nowDb.com_species.findMany as jest.Mock).mockResolvedValue([firstSpecies, secondSpecies])
    ;(nowDb.now_ls.findMany as jest.Mock).mockResolvedValue([{ species_id: 1 }])
    ;(nowDb.com_taxa_synonym.findMany as jest.Mock).mockResolvedValue([
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

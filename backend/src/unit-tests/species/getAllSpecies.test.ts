import { describe, it, expect, jest } from '@jest/globals'
import { getAllSpecies } from '../../services/species'
import { nowDb } from '../../utils/db'

jest.mock('../../utils/db')

describe('getAllSpecies', () => {
  it('should return all species with locality and synonym flags', async () => {
    const mockedNowDb = nowDb as typeof nowDb & {
      com_species: { findMany: jest.Mock<() => Promise<any[]>> }
      now_ls: { findMany: jest.Mock<() => Promise<any[]>> }
      com_taxa_synonym: { findMany: jest.Mock<() => Promise<any[]>> }
    }
    
    // Mock com_species.findMany
    mockedNowDb.com_species.findMany.mockResolvedValue([
      {
        species_id: 1,
        order_name: 'Carnivora',
        family_name: 'Felidae',
        genus_name: 'Panthera',
        species_name: 'leo',
      },
    ])

    // Mock now_ls.findMany
    mockedNowDb.now_ls.findMany.mockResolvedValue([{ species_id: 1 }])

    // Mock com_taxa_synonym.findMany
    mockedNowDb.com_taxa_synonym.findMany.mockResolvedValue([{ species_id: 2 }])

    const result = await getAllSpecies()

    expect(result).toHaveLength(1)
    expect(result[0].species_id).toBe(1)
    expect(result[0].has_no_locality).toBe(false)
    expect(result[0].has_synonym).toBe(false)
  })
})

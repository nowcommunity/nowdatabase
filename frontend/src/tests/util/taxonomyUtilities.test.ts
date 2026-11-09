import { describe, expect, it } from '@jest/globals'
import { checkSpeciesTaxonomy, TaxonomySpecies } from '@/util/taxonomyUtilities'
import { EditDataType, Species } from '@/shared/types'

const existingSpecies: TaxonomySpecies = {
  species_id: 1,
  subclass_or_superorder_name: 'Eutheria',
  order_name: 'Carnivora',
  suborder_or_superfamily_name: 'Caniformia',
  family_name: 'Canidae',
  subfamily_name: 'Caninae',
  genus_name: 'Canis',
  species_name: 'lupus',
  unique_identifier: 'Canis lupus',
}

const editedSpecies: EditDataType<Species> = {
  species_id: 2,
  subclass_or_superorder_name: 'Eutheria',
  order_name: 'Carnivora',
  suborder_or_superfamily_name: 'Caniformia',
  family_name: 'Felidae',
  subfamily_name: 'Caninae',
  genus_name: 'Canis',
  species_name: 'familiaris',
  unique_identifier: 'Canis familiaris',
}

describe('checkSpeciesTaxonomy', () => {
  it('reports taxonomy hierarchy conflicts by default', () => {
    const errors = checkSpeciesTaxonomy(editedSpecies, [existingSpecies], [])

    expect(errors).toContain('Subfamily Caninae belongs to family Canidae, not Felidae.')
  })

  it('allows admins to bypass taxonomy hierarchy conflicts', () => {
    const errors = checkSpeciesTaxonomy(editedSpecies, [existingSpecies], [], true)

    expect(errors).toEqual(new Set())
  })

  it('continues to reject duplicate taxa when hierarchy conflicts are allowed', () => {
    const duplicateSpecies = {
      ...editedSpecies,
      genus_name: existingSpecies.genus_name,
      species_name: existingSpecies.species_name,
      unique_identifier: existingSpecies.unique_identifier,
    }

    const errors = checkSpeciesTaxonomy(duplicateSpecies, [existingSpecies], [], true)

    expect(errors).toContain('The taxon already exists in the database.')
  })
})

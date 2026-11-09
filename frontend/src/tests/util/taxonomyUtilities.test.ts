import { describe, expect, it, jest } from '@jest/globals'
import {
  checkSpeciesTaxonomy,
  convertSpeciesTaxonomyFields,
  getSpeciesTaxonomyKey,
  TaxonomySpecies,
} from '@/util/taxonomyUtilities'
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
    const errors = checkSpeciesTaxonomy(editedSpecies, [existingSpecies], [], { allowTaxonomyHierarchyMismatch: true })

    expect(errors).toEqual(new Set())
  })

  it('continues to reject duplicate taxa when hierarchy conflicts are allowed', () => {
    const duplicateSpecies = {
      ...editedSpecies,
      genus_name: existingSpecies.genus_name,
      species_name: existingSpecies.species_name,
      unique_identifier: existingSpecies.unique_identifier,
    }

    const errors = checkSpeciesTaxonomy(duplicateSpecies, [existingSpecies], [], {
      allowTaxonomyHierarchyMismatch: true,
    })

    expect(errors).toContain('The taxon already exists in the database.')
  })

  it('continues to reject duplicate synonyms when hierarchy conflicts are allowed', () => {
    const errors = checkSpeciesTaxonomy(
      editedSpecies,
      [existingSpecies],
      [
        {
          synonym_id: 1,
          species_id: 1,
          syn_genus_name: 'Canis',
          syn_species_name: 'familiaris',
          syn_comment: null,
        },
      ],
      { allowTaxonomyHierarchyMismatch: true }
    )

    expect(errors).toContain('Canis lupus already has Canis familiaris as a synonym.')
  })

  it('reports hierarchy mismatches to callers when an admin override is available', () => {
    const onTaxonomyHierarchyMismatch = jest.fn()

    checkSpeciesTaxonomy(editedSpecies, [existingSpecies], [], { onTaxonomyHierarchyMismatch })

    expect(onTaxonomyHierarchyMismatch).toHaveBeenCalledWith([
      'Genus Canis belongs to family Canidae, not Felidae.',
      'Subfamily Caninae belongs to family Canidae, not Felidae.',
    ])
  })

  describe('taxonomy normalization and keys', () => {
    it.each([
      ['canis/', 'Canis/'],
      ['/CANIS', '/Canis'],
      ['/', '/'],
      ['canis/LUPUS', 'Canis/Lupus'],
    ])('normalizes slash-separated live input %s safely', (value, expected) => {
      expect(convertSpeciesTaxonomyFields({ genus_name: value }).genus_name).toBe(expected)
    })

    it('includes taxonomic status in the acknowledgement key', () => {
      expect(getSpeciesTaxonomyKey({ ...editedSpecies, taxonomic_status: 'valid' })).not.toBe(
        getSpeciesTaxonomyKey({ ...editedSpecies, taxonomic_status: 'invalid' })
      )
    })
  })

  it('does not report hierarchy mismatches when a shared taxon field is empty', () => {
    const emptySpecies = {
      ...editedSpecies,
      subclass_or_superorder_name: '',
      order_name: '',
      suborder_or_superfamily_name: '',
      family_name: '',
      subfamily_name: '',
      genus_name: '',
      species_name: '',
      unique_identifier: '',
    }
    const existingSpeciesWithNoFamily = { ...existingSpecies, family_name: '', order_name: 'Artiodactyla' }
    const onTaxonomyHierarchyMismatch = jest.fn()

    const errors = checkSpeciesTaxonomy(emptySpecies, [existingSpeciesWithNoFamily], [], {
      onTaxonomyHierarchyMismatch,
    })

    expect(errors).toEqual(new Set())
    expect(onTaxonomyHierarchyMismatch).not.toHaveBeenCalled()
  })
})

import { describe, expect, it } from '@jest/globals'

import { buildTaxonomySuggestionOptions } from '@/components/Species/taxonomySuggestions'
import type { Species } from '@/shared/types'

const species = (overrides: Partial<Species>): Species => overrides as Species

describe('buildTaxonomySuggestionOptions', () => {
  it('returns sorted unique non-empty taxonomy values for a field', () => {
    const options = buildTaxonomySuggestionOptions(
      [
        species({ family_name: ' Felidae ' }),
        species({ family_name: 'Bovidae' }),
        species({ family_name: 'Felidae' }),
        species({ family_name: '' }),
        species({ family_name: null }),
      ],
      'family_name'
    )

    expect(options).toEqual(['Bovidae', 'Felidae'])
  })

  it('returns an empty option list before species data is loaded', () => {
    expect(buildTaxonomySuggestionOptions(undefined, 'genus_name')).toEqual([])
  })
})

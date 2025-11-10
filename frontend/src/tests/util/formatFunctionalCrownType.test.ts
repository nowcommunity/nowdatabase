import { describe, expect, it } from '@jest/globals'
import { formatFunctionalCrownType } from '../../shared/types/util'

describe('formatFunctionalCrownType', () => {
  it('returns hyphen placeholders when all segments are empty', () => {
    expect(
      formatFunctionalCrownType({
        fct_al: null,
        fct_ol: null,
        fct_sf: null,
        fct_ot: null,
        fct_cm: null,
      })
    ).toBe('-----')
  })

  it('converts numeric values to strings and preserves characters', () => {
    expect(
      formatFunctionalCrownType({
        fct_al: 1,
        fct_ol: 0,
        fct_sf: 'S',
        fct_ot: 2,
        fct_cm: 3,
      })
    ).toBe('10S23')
  })

  it('treats empty strings as missing data', () => {
    expect(
      formatFunctionalCrownType({
        fct_al: 'A',
        fct_ol: '',
        fct_sf: null,
        fct_ot: 'T',
        fct_cm: undefined,
      })
    ).toBe('A--T-')
  })
})

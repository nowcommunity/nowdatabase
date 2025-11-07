import { describe, expect, it } from '@jest/globals'
import { formatDevelopmentalCrownType } from '../../shared/types/util'

describe('formatDevelopmentalCrownType', () => {
  it('returns hyphen placeholders when all segments are empty', () => {
    expect(
      formatDevelopmentalCrownType({
        cusp_shape: null,
        cusp_count_buccal: null,
        cusp_count_lingual: null,
        loph_count_lon: null,
        loph_count_trs: null,
      })
    ).toBe('-----')
  })

  it('converts numeric values to strings and preserves characters', () => {
    expect(
      formatDevelopmentalCrownType({
        cusp_shape: 'tri',
        cusp_count_buccal: 2,
        cusp_count_lingual: 3,
        loph_count_lon: 4,
        loph_count_trs: 5,
      })
    ).toBe('tri2345')
  })

  it('treats empty strings as missing data', () => {
    expect(
      formatDevelopmentalCrownType({
        cusp_shape: 'bun',
        cusp_count_buccal: '',
        cusp_count_lingual: 1,
        loph_count_lon: undefined,
        loph_count_trs: 'x',
      })
    ).toBe('bun-1-x')
  })
})

import { describe, expect, it } from '@jest/globals'
import { validateOccurrenceFields } from './occurrence'

describe('isotope count and standard deviation validation', () => {
  it('rejects fractional isotope counts', () => {
    expect(validateOccurrenceFields({ dc13_n: 0.5 })).toContainEqual({
      name: 'δ13C N',
      error: 'δ13C N must be a positive integer.',
    })
    expect(validateOccurrenceFields({ do18_n: 12.5 })).toContainEqual({
      name: 'δ18O N',
      error: 'δ18O N must be a positive integer.',
    })
  })

  it('requires positive standard deviations while accepting positive decimals', () => {
    expect(validateOccurrenceFields({ dc13_stdev: 0 })).toContainEqual({
      name: 'δ13C Stdev',
      error: 'δ13C Stdev must be a positive decimal number.',
    })
    expect(validateOccurrenceFields({ do18_stdev: -0.5 })).toContainEqual({
      name: 'δ18O Stdev',
      error: 'δ18O Stdev must be a positive decimal number.',
    })
    expect(validateOccurrenceFields({ dc13_stdev: 0.5 })).not.toContainEqual(
      expect.objectContaining({ name: 'δ13C Stdev' })
    )
    expect(validateOccurrenceFields({ do18_stdev: 0.5 })).not.toContainEqual(
      expect.objectContaining({ name: 'δ18O Stdev' })
    )
  })
})

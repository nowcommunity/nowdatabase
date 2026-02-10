import { describe, expect, it } from '@jest/globals'
import { calculateNormalizedMesowearScore } from '@/shared/utils/mesowear'

describe('calculateNormalizedMesowearScore', () => {
  it('returns a 2-decimal score for valid inputs', () => {
    expect(calculateNormalizedMesowearScore(1, 5, 3)).toBe('50.00')
  })

  it('returns null for null or empty values', () => {
    expect(calculateNormalizedMesowearScore(null, 5, 3)).toBeNull()
    expect(calculateNormalizedMesowearScore(1, null, 3)).toBeNull()
    expect(calculateNormalizedMesowearScore(1, 5, null)).toBeNull()
    expect(calculateNormalizedMesowearScore('', 5, 3)).toBeNull()
  })

  it('returns null when reported value is below scale minimum', () => {
    expect(calculateNormalizedMesowearScore(3, 10, 2)).toBeNull()
  })

  it('uses fallback scale 1 when max-min is zero or negative', () => {
    expect(calculateNormalizedMesowearScore(5, 5, 6)).toBe('100.00')
    expect(calculateNormalizedMesowearScore(5, 4, 6)).toBe('100.00')
  })

  it('returns null for values outside 0-100 after normalization', () => {
    expect(calculateNormalizedMesowearScore(1, 2, 4)).toBeNull()
  })
})

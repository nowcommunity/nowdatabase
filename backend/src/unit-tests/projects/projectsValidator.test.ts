import { describe, expect, it } from '@jest/globals'
import { ensureValidMemberIds, ensureValidUserId, ValidationError } from '../../validators/projectsValidator'

describe('projectsValidator', () => {
  it('validates numeric coordinator id', () => {
    expect(ensureValidUserId(5, 'Coordinator user ID')).toEqual(5)
  })

  it('throws on invalid coordinator id', () => {
    expect(() => ensureValidUserId('abc', 'Coordinator user ID')).toThrow(ValidationError)
  })

  it('accepts unique numeric member ids', () => {
    expect(ensureValidMemberIds([1, 1, 2])).toEqual([1, 2])
  })

  it('rejects non-array member ids', () => {
    expect(() => ensureValidMemberIds('1,2,3')).toThrow(ValidationError)
  })

  it('rejects member ids containing non-numbers', () => {
    expect(() => ensureValidMemberIds([1, 'two', 3])).toThrow(ValidationError)
  })
})

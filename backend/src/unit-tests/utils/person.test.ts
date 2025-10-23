import { describe, expect, it } from '@jest/globals'
import { getPersonDisplayName } from '../../services/utils/person'

describe('getPersonDisplayName', () => {
  it('returns full name when first name and surname are present', () => {
    const displayName = getPersonDisplayName({
      first_name: 'Jane',
      surname: 'Doe',
      initials: 'JD',
    })

    expect(displayName).toBe('Jane Doe')
  })

  it('returns surname when first name missing', () => {
    const displayName = getPersonDisplayName({
      first_name: null,
      surname: 'Doe',
      initials: 'JD',
    })

    expect(displayName).toBe('Doe')
  })

  it('falls back to initials when name parts missing', () => {
    const displayName = getPersonDisplayName({
      first_name: null,
      surname: null,
      initials: 'JD',
    })

    expect(displayName).toBe('JD')
  })

  it('uses provided fallback when no person data available', () => {
    const displayName = getPersonDisplayName(null, 'Fallback')

    expect(displayName).toBe('Fallback')
  })

  it('returns "Unknown" when no data available', () => {
    const displayName = getPersonDisplayName(null, '')

    expect(displayName).toBe('Unknown')
  })
})

import { describe, expect, it } from '@jest/globals'
import { formatTimeUnitWriteError } from '@/redux/timeUnitReducer'

describe('formatTimeUnitWriteError', () => {
  it('formats structured validator errors for invalid bounds', () => {
    const message = formatTimeUnitWriteError({
      status: 403,
      data: [
        { name: 'Upper Bound', error: 'Upper bound with ID 40000 does not exist' },
        { name: 'Lower Bound', error: 'Lower bound with ID 30000 does not exist' },
      ],
    })

    expect(message).toBe(
      'Following validators failed: Upper Bound: Upper bound with ID 40000 does not exist, Lower Bound: Lower bound with ID 30000 does not exist'
    )
  })

  it('formats cascade/calculator errors', () => {
    const message = formatTimeUnitWriteError({
      status: 403,
      data: {
        name: 'cascade',
        cascadeErrors: 'Following localities would become contradicting: 1, 2',
        calculatorErrors: 'Check fractions of following localities: 3',
      },
    })

    expect(message).toBe(
      'Following localities would become contradicting: 1, 2 Check fractions of following localities: 3'
    )
  })

  it('returns null for unrelated errors', () => {
    expect(formatTimeUnitWriteError({ status: 500, data: { message: 'Failed to write time unit' } })).toBeNull()
  })
})

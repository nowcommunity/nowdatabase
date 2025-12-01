import { describe, expect, it } from '@jest/globals'
import { PROJECT_STATUSES, RECORD_STATUS_VALUES } from '../../constants/status'

describe('status constants', () => {
  it('includes the expected project statuses', () => {
    expect(PROJECT_STATUSES).toEqual(['current', 'no_data', 'finished'])
  })

  it('exposes record status booleans used for validation', () => {
    expect(RECORD_STATUS_VALUES).toEqual([true, false])
  })
})

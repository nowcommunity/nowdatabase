import { describe, expect, it } from '@jest/globals'
import { parseNumericIds } from '../routes/utils/exportFilters'

describe('parseNumericIds', () => {
  it('accepts integer ids as numbers or strings', () => {
    expect(parseNumericIds([12, '34'])).toEqual([12, 34])
  })

  it('rejects partially numeric strings', () => {
    expect(() => parseNumericIds(['12abc'])).toThrow('ids must contain only integers.')
  })

  it('rejects decimals', () => {
    expect(() => parseNumericIds([12.3])).toThrow('ids must contain only integers.')
    expect(() => parseNumericIds(['12.3'])).toThrow('ids must contain only integers.')
  })

  it('rejects non-array id payloads', () => {
    expect(() => parseNumericIds('12')).toThrow('ids must be an array.')
  })
})

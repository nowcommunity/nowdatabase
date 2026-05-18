import { describe, expect, it } from '@jest/globals'
import { dwcCsvCell, normalizeDwcCsvValue, writeDwcCsvString } from '../services/utils/dwcCsv'

describe('DwC CSV writer', () => {
  it('normalizes embedded line feeds before quoting cells', () => {
    expect(normalizeDwcCsvValue('first\nsecond\r\nthird\rfourth')).toEqual('first second third fourth')
    expect(dwcCsvCell('first\n"second"')).toEqual('"first ""second"""')
  })

  it('writes one physical line per row even when source values contain line breaks', () => {
    const csv = writeDwcCsvString(
      ['id', 'remarks'],
      [
        { id: 'one', remarks: 'alpha\nbeta' },
        { id: 'two', remarks: 'gamma\r\ndelta' },
      ]
    )

    expect(csv).toEqual('"id","remarks"\n"one","alpha beta"\n"two","gamma delta"\n')
    expect(csv.split('\n')).toHaveLength(4)
  })
})

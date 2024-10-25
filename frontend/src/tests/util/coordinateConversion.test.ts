import { expect, it, describe } from '@jest/globals'
import { convertDmsToDec, convertDecToDms } from '../../util/coordinateConversion'

describe('Coordinate conversion', () => {
  it('Converting dms to dec works', () => {
    expect(convertDmsToDec('10 10 10 N', true)).toBeCloseTo(10.169444444, 5)
    expect(convertDmsToDec('1 10 10 S', true)).toBeCloseTo(-1.169444444, 5)
    expect(convertDmsToDec('170 1 00 E', false)).toBeCloseTo(170.016666666, 5)
    expect(convertDmsToDec('00 59 59 W', false)).toBeCloseTo(-0.999722222, 5)
  })

  it('Converting dec to dms works', () => {
    expect(convertDecToDms(85.745, true)).toBe('85 44 42 N')
    expect(convertDecToDms(-0.01, true)).toBe('0 0 36 S')
    expect(convertDecToDms(179.99999, false)).toBe('179 59 59 E')
    expect(convertDecToDms(-0.0333, false)).toBe('0 1 59 W')
  })

  it('Invalid dms to dec conversion doesnt work', () => {
    expect(convertDmsToDec('67 34 123 N', true)).toBe(undefined)
    expect(convertDmsToDec('13 12 S', true)).toBe(undefined)
    expect(convertDmsToDec('10 10 10 W', true)).toBe(undefined)
    expect(convertDmsToDec('25 36 20', false)).toBe(undefined)
    expect(convertDmsToDec('', false)).toBe(undefined)
    expect(convertDmsToDec(null, false)).toBe(undefined)
    expect(convertDmsToDec(undefined, true)).toBe(undefined)
  })

  it('Invalid dec to dms conversion doesnt work', () => {
    expect(convertDecToDms(180.1, false)).toBe(undefined)
    expect(convertDecToDms(-200, false)).toBe(undefined)
    expect(convertDecToDms(90.0001, true)).toBe(undefined)
    expect(convertDecToDms(-95, true)).toBe(undefined)
    expect(convertDecToDms(null, false)).toBe(undefined)
    expect(convertDecToDms(undefined, true)).toBe(undefined)
  })
})

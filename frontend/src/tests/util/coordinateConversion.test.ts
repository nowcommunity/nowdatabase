import { expect, it, describe } from '@jest/globals'
import { convertDmsToDec, convertDecToDms } from '../../util/coordinateConversion'

describe('Coordinate conversion', () => {
  it('Converting dms to dec works', () => {
    expect(convertDmsToDec('10 10 10 N', 'latitude')).toBeCloseTo(10.169444444, 5)
    expect(convertDmsToDec('1 10 10 S', 'latitude')).toBeCloseTo(-1.169444444, 5)
    expect(convertDmsToDec('170 1 00 E', 'longitude')).toBeCloseTo(170.016666666, 5)
    expect(convertDmsToDec('00 59 59 W', 'longitude')).toBeCloseTo(-0.999722222, 5)
  })

  it('Converting dec to dms works', () => {
    expect(convertDecToDms(85.745, 'latitude')).toBe('85 44 42 N')
    expect(convertDecToDms(-0.01, 'latitude')).toBe('0 0 36 S')
    expect(convertDecToDms(179.99999, 'longitude')).toBe('179 59 59 E')
    expect(convertDecToDms(-0.0333, 'longitude')).toBe('0 1 59 W')
  })

  it('Invalid dms to dec conversion doesnt work', () => {
    expect(convertDmsToDec('67 34 123 N', 'latitude')).toBe(undefined)
    expect(convertDmsToDec('13 12 S', 'latitude')).toBe(undefined)
    expect(convertDmsToDec('10 10 10 W', 'latitude')).toBe(undefined)
    expect(convertDmsToDec('25 36 20', 'longitude')).toBe(undefined)
    expect(convertDmsToDec('', 'longitude')).toBe(undefined)
    expect(convertDmsToDec(null, 'longitude')).toBe(undefined)
    expect(convertDmsToDec(undefined, 'latitude')).toBe(undefined)
  })

  it('Invalid dec to dms conversion doesnt work', () => {
    expect(convertDecToDms(180.1, 'longitude')).toBe(undefined)
    expect(convertDecToDms(-200, 'longitude')).toBe(undefined)
    expect(convertDecToDms(90.0001, 'latitude')).toBe(undefined)
    expect(convertDecToDms(-95, 'latitude')).toBe(undefined)
    expect(convertDecToDms(null, 'longitude')).toBe(undefined)
    expect(convertDecToDms(undefined, 'latitude')).toBe(undefined)
  })
})

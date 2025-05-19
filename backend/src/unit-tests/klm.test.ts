import { describe, it, expect } from '@jest/globals'
import { Placemark, generateKLM } from '../utils/klm'

const testLocalities: Placemark[] = [
  {
    name: 'Lantian-Shuijiazui',
    lat: 34.1,
    long: 109.3,
  },
  {
    name: 'Dmanisi',
    lat: 41.33611111111112,
    long: 44.34388888888889,
  },
  {
    name: 'RomanyÃ  dEmpordÃ ',
    lat: 42.166,
    long: 2.666,
  },
  {
    name: 'Las Umbrias 1',
    lat: 41.1963254,
    long: -1.5106093,
  },
  {
    name: 'Goishi',
    lat: 38.2,
    long: 140.7,
  },
  {
    name: 'not in cross search',
    lat: 38.2,
    long: 140.7,
  },
]

const testKlm =
  `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2">` +
  `<Document><name>Luomus locality data</name><Folder><name>Luomus localities</name>` +
  `<Placemark><name>Lantian-Shuijiazui</name><description></description>` +
  `<Point><coordinates>109.3,34.1,0</coordinates></Point></Placemark>,<Placemark>` +
  `<name>Dmanisi</name><description></description><Point><coordinates>44.34388888888889,` +
  `41.33611111111112,0</coordinates></Point></Placemark>,<Placemark><name>RomanyÃ dEmpordÃ` +
  `</name><description></description><Point><coordinates>2.666,42.166,0</coordinates></Point>` +
  `</Placemark>,<Placemark><name>Las Umbrias 1</name><description></description><Point><coordinates>` +
  `-1.5106093,41.1963254,0</coordinates></Point></Placemark>,<Placemark><name>Goishi</name><description>` +
  `</description><Point><coordinates>140.7,38.2,0</coordinates></Point></Placemark>,<Placemark>` +
  `<name>not in cross search</name><description></description><Point><coordinates>140.7,38.2,0` +
  `</coordinates></Point></Placemark></Folder></Document></kml>`

describe('KML generation', () => {
  it('Returns expected KML', () => {
    expect(generateKLM(testLocalities)).toEqual(testKlm)
  })
})

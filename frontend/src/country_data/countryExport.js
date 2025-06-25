import fs from 'fs'

// Edit these in cases where names in frontend/src/shared/validators/countryList.ts
// differ from the country boundary data
const nameMappings = {
  'Antigua & Barbuda': 'Antigua and Barbuda',
  'Bosnia & Herzegovina': 'Bosnia and Herzegovina',
  'Brunei Darussalam': 'Brunei',
  'Democratic Republic of the Congo': 'Congo, Democratic republic of the (prev. Zaire)',
  "Côte d'Ivoire": "Cote D'Ivoire",
  'Timor-Leste': 'East Timor',
  'French Southern and Antarctic Territories': 'French Southern and Antarctic Lands',
  Bahamas: 'Bahamas, The',
  Gambia: 'Gambia, The',
  'Iran (Islamic Republic of)': 'Iran',
  "Lao People's Democratic Republic": 'Laos',
  'Libyan Arab Jamahiriya': 'Libya',
  'The former Yugoslav Republic of Macedonia': 'North Macedonia',
  'Micronesia (Federated States of)': 'Micronesia, Federated States of',
  'Moldova, Republic of': 'Moldova',
  "Democratic People's Republic of Korea": 'North Korea',
  'Russian Federation': 'Russia',
  'South Georgia & the South Sandwich Islands': 'South Georgia and the South Sandwich Islands',
  'Republic of Korea': 'South Korea',
  'Syrian Arab Republic': 'Syria',
  'United Republic of Tanzania': 'Tanzania',
  'U.K. of Great Britain and Northern Ireland': 'United Kingdom',
  'United States Virgin Islands': 'Virgin Islands',
}

function main() {
  if (process.argv.length != 3) {
    console.log('Usage: node countryDataExportTool.js [administrative boundaries .geojson file]')
    return
  }

  const filepath = process.argv[2]
  const data = fs.readFileSync(filepath, 'utf8')
  let borders = JSON.parse(data)

  const polygons = []
  const boundingBoxes = {}
  borders.features.forEach(feature => {
    const bounds = {
      top: null,
      left: null,
      bottom: null,
      right: null,
    }

    const halvedBounds = {
      top: null,
      left: null,
      bottom: null,
      right: null,
    }

    feature.geometry.coordinates.forEach(poly => {
      polygons.push(
        poly[0].map(coord => {
          const lat = coord[1]
          const long = coord[0]

          if (!bounds.top) bounds.top = lat
          if (!bounds.bottom) bounds.bottom = lat
          if (!bounds.left) bounds.left = long
          if (!bounds.right) bounds.right = long
          bounds.top = Math.min(bounds.top, lat)
          bounds.bottom = Math.max(bounds.bottom, lat)
          bounds.left = Math.min(bounds.left, long)
          bounds.right = Math.max(bounds.right, long)

          if (!halvedBounds.top) halvedBounds.top = lat
          if (!halvedBounds.bottom) halvedBounds.bottom = lat
          if (!halvedBounds.right) halvedBounds.right = -180
          if (!halvedBounds.left) halvedBounds.left = long
          halvedBounds.top = Math.min(halvedBounds.top, lat)
          halvedBounds.bottom = Math.max(halvedBounds.bottom, lat)

          if (long < 0) halvedBounds.right = Math.max(halvedBounds.right, long)
          else halvedBounds.left = Math.min(halvedBounds.left, long)

          return [lat, long]
        })
      )
    })

    let country = feature.properties.name
    if (country in nameMappings) country = nameMappings[country]

    const boundsWidth = bounds.right - bounds.left
    const halvedBoundsWidth = halvedBounds.right + 180 + 180 - halvedBounds.left
    const box = boundsWidth < halvedBoundsWidth ? bounds : halvedBounds
    boundingBoxes[country] = box
  })

  const polygonString = 'export const countryPolygons: number[][][] = ' + JSON.stringify(polygons) + ';'
  const boundsType = `export type CountryBoundingBox = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};

export type CountryBoundingBoxes =
{ 
    [key: string] : CountryBoundingBox
};

`
  const boundsString =
    boundsType + 'export const countryBoundingBoxes: CountryBoundingBoxes = ' + JSON.stringify(boundingBoxes) + ';'
  fs.writeFileSync('countryPolygons.ts', polygonString)
  fs.writeFileSync('countryBoundingBoxes.ts', boundsString)
}

main()

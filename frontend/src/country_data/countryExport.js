import fs from 'fs'

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

    feature.geometry.coordinates.forEach(poly => {
      polygons.push(
        poly[0].map(coord => {
          const lat = coord[1]
          const long = coord[0]

          if (!bounds.top) bounds.top = long
          if (!bounds.bottom) bounds.bottom = long
          if (!bounds.left) bounds.left = lat
          if (!bounds.right) bounds.right = lat

          bounds.top = Math.min(bounds.top, long)
          bounds.bottom = Math.max(bounds.bottom, long)
          bounds.left = Math.min(bounds.left, lat)
          bounds.right = Math.max(bounds.right, lat)
          return [lat, long]
        })
      )
    })
    boundingBoxes[feature.properties.name] = bounds
  })

  const polygonString = 'export const countryPolygons: number[][][] = ' + JSON.stringify(polygons) + ';'
  const boundsType = `export type CountryBoundingBoxes =
{ 
    [key: string] : {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }
};

`
  const boundsString =
    boundsType + 'export const countryBoundingBoxes: CountryBoundingBoxes = ' + JSON.stringify(boundingBoxes) + ';'
  fs.writeFileSync('countryPolygons.ts', polygonString)
  fs.writeFileSync('countryBoundingBoxes.ts', boundsString)
}

main()

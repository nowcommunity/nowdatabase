import { SVG } from '@svgdotjs/svg.js'
import { countryPolygons } from '../../country_data/countryPolygons.ts'
import { Locality } from '@/shared/types'

interface PixelCoordinates {
  x: number
  y: number
}

// Converts decimal latitude longitude (degrees) coordinates to pixel coordinates,
// using width as the total map width.
const webMercatorConvert = (lat: number, long: number, width: number): PixelCoordinates => {
  const pi = 3.141592653589793
  const latRadians = lat * (pi / 180)
  const longRadians = long * (pi / 180)

  return {
    x: (1 / (pi * 2)) * (pi + longRadians) * width,
    y: (1 / (pi * 2)) * (pi - Math.log(Math.tan(pi / 4 + latRadians / 2))) * width,
  }
}

// Generates and returns an SVG image of localities on a map.
export const generateSvg = (
  localities: Locality[],
  mapBorderColor = '#000000',
  mapFillColor = '#ffffff',
  markerBorderColor = '#ff0000',
  markerFillColor = '#ffffff',
  transparent = true
) => {
  const draw = SVG()

  const width = 2048
  draw.viewbox(0, 0, width, width)

  if (!transparent) draw.polygon(`0,0 ${width},0 ${width},${width} 0,${width}`).fill('#ffffff')

  countryPolygons.forEach(countryBorder => {
    const points: string[] = []

    countryBorder.forEach(coordinate => {
      const pixelCoords = webMercatorConvert(coordinate[0], coordinate[1], width)
      points.push(`${pixelCoords.x},${pixelCoords.y}`)
    })

    const polygon = points.join(' ')
    draw.polygon(polygon).stroke({ width: 1, color: mapBorderColor }).fill(mapFillColor)
  })

  localities.forEach(locality => {
    const pixelCoords = webMercatorConvert(locality.dec_lat, locality.dec_long, width)
    const radius = 3
    const topLeftX = pixelCoords.x - radius
    const topLeftY = pixelCoords.y - radius
    draw.circle(radius).move(topLeftX, topLeftY).stroke({ width: 1, color: markerBorderColor }).fill(markerFillColor)
  })

  return draw.svg()
}

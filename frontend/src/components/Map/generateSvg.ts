import { SVG } from '@svgdotjs/svg.js'

type CoordinateConversion = 'web_mercanter'
interface PixelCoordinates {
  x: number
  y: number
}

const webMercanterConvert = (lat: number, long: number): PixelCoordinates => {
  const zoomLevel = 2
  const pi = 3.141592653589793
  return {
    x: (1 / (pi * 2)) * (2 ^ zoomLevel) * (pi + long),
    y: (1 / (pi * 2)) * (2 ^ zoomLevel) * (pi - Math.log(Math.tan(pi / 4 + lat / 2))),
  }
}

export const generateSvg = (conversion: CoordinateConversion) => {
  const draw = SVG()
  const polygon = draw.polygon('0,0 100,50 50,100').fill('none').stroke({ width: 1 })

  const dataString = draw.svg()
  const blob = new Blob([dataString], { type: 'text/kml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'map.svg'
  a.click()
}

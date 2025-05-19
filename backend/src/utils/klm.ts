export interface Placemark {
  name: string
  long: number
  lat: number
}

const toPlacemarkString = (locality: Placemark) => {
  return (
    `<Placemark><name>${locality.name}</name>` +
    `<description></description>` +
    `<Point><coordinates>${locality.long},${locality.lat},0</coordinates></Point>` +
    `</Placemark>`
  )
}

export const generateKLM = (placemarks: Placemark[]) => {
  const start =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<kml xmlns="http://www.opengis.net/kml/2.2">` +
    `<Document><name>Luomus locality data</name>` +
    `<Folder><name>Luomus localities</name>`
  const end = `</Folder></Document></kml>`

  return `${start}${placemarks.map(toPlacemarkString).join('')}${end}`
}

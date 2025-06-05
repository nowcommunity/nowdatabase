import { Locality } from '@/shared/types'

// Replaces special characters with html entities.
const htmlEncode = (str: string) => {
  const el = document.createElement('div')
  el.innerText = str
  return el.innerHTML
}

// A single row in a locality info table
const tableRow = (title: string, value: string, indentLevel: number) => {
  const indent = '\t'.repeat(indentLevel)

  let tableRowString = `${indent}<tr>\n`

  tableRowString += `${indent}\t<td>\n`
  tableRowString += `${indent}\t\t<b>${title}</b>\n`
  tableRowString += `${indent}\t</td>\n`

  tableRowString += `${indent}\t<td>\n`
  tableRowString += `${indent}\t\t${value}\n`
  tableRowString += `${indent}\t</td>\n`

  tableRowString += `${indent}</tr>\n`

  return tableRowString
}

// Locality info table that shows up when clicking map marker in Google Earth for example.
const localityInfoTable = (locality: Locality, indentLevel: number = 3) => {
  const indent = '\t'.repeat(indentLevel)

  let tableString = `${indent}<![CDATA[\n`
  tableString += `${indent}<table style="float: none; clear: none; border-collapse: collapse; margin-bottom: 16px; font-size: 90%;">\n`

  tableString += tableRow('Locality&nbsp;ID:', locality.lid.toString(), indentLevel + 1)
  tableString += tableRow('Country:', htmlEncode(locality.country), indentLevel + 1)
  tableString += tableRow('Lat/Long:', `${locality.dms_lat},${locality.dms_long}`, indentLevel + 1)
  tableString += tableRow(
    'Age:',
    `${locality.max_age} Ma (${locality.bfa_max}) - ${locality.min_age} Ma (${locality.bfa_min})`,
    indentLevel + 1
  )

  tableString += `${indent}</table>\n`
  tableString += `${indent}]]>\n`

  return tableString
}

const generatePlacemarkKml = (locality: Locality) => {
  let kmlString = `\t<Placemark>\n`
  kmlString += `\t\t<name>${htmlEncode(locality.loc_name)}</name>\n`

  kmlString += `\t\t<description>\n`
  kmlString += localityInfoTable(locality)
  kmlString += `\t\t</description>\n`

  kmlString += `\t\t<Point>\n`
  kmlString += `\t\t\t<coordinates>${locality.dec_long},${locality.dec_lat},0</coordinates>\n`
  kmlString += `\t\t</Point>\n`

  kmlString += `\t</Placemark>\n`

  return kmlString
}

// Returns an XML / KML string containing locality information as map markers, openable in Google Earth for example.
export const generateKml = (localities: Locality[]) => {
  let kmlString = `<?xml version="1.0" encoding="UTF-8"?>\n`
  kmlString +=
    `<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" ` +
    `xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n`
  kmlString += `<Document>\n`
  kmlString += `\t<name>NOW database ${new Date().toLocaleString()}</name>\n`

  kmlString += localities.map(generatePlacemarkKml).join('')

  kmlString += `</Document>\n</kml>`

  return kmlString
}

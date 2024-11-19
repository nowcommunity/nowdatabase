import { Router } from 'express'
import { GEONAMES_USERNAME } from '../utils/config'

export type Geoname = {
  adminCode01: string
  lng: string | number
  geonameId: number
  toponymName: string
  countryId: string
  fcl: string
  population: number
  countryCode: string
  name: string
  fclName: string
  adminCodes1: {
    ISO3166_2: string
  }
  countryName: string
  fcodeName: string
  adminName1: string
  lat: string | number
  fcode: string
}

export type GeonamesJSON = {
  totalResultsCount: number
  geonames: Geoname[]
}

export type ParsedGeoname = Pick<Geoname, 'name' | 'countryName' | 'lat' | 'lng'>

const router = Router()

router.post('/', async (req, res) => {
  const locationName: string = req.body.locationName
  const url = `https://secure.geonames.org/searchJSON?q=${locationName}&maxRows=5&username=${GEONAMES_USERNAME}`

  if (GEONAMES_USERNAME === '' || GEONAMES_USERNAME == undefined)
    return res.status(401).send({ error: 'No Geonames-api username given.' })
  if (locationName === '' || locationName == undefined) return res.status(400).send({ error: 'No location given' })
  console.log('url:', url)

  try {
    const fetchResponse = (await (await fetch(url)).json()) as GeonamesJSON
    if (!fetchResponse) return res.status(200).send({ locations: [] })

    const locations: ParsedGeoname[] = fetchResponse.geonames.map(geoname => ({
      name: geoname.name,
      countryName: geoname.countryName,
      lat: Number(geoname.lat),
      lng: Number(geoname.lng),
    }))

    return res.status(200).send({ locations: locations })
  } catch (e) {
    console.error('Error while fetching Geoname-api:', e)
    return res.status(400).send({ error: `Something went from while fetcthing locations from Geonames API` })
  }
})

export default router

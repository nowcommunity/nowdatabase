import { Router, Request } from 'express'
import { GEONAMES_USERNAME } from '../utils/config'
import { logger } from '../utils/logger'
import { GeonamesJSON, ParsedGeoname } from '../../../frontend/src/shared/types'

const router = Router()

router.post('/', async (req: Request<object, object, { locationName: string }>, res) => {
  const { locationName } = req.body
  const url = `https://secure.geonames.org/searchJSON?q=${locationName}&maxRows=5&username=${GEONAMES_USERNAME}`

  if (GEONAMES_USERNAME === '' || GEONAMES_USERNAME == undefined)
    return res.status(401).send({ error: 'No Geonames-api username given.' })
  if (locationName === '' || locationName == undefined) return res.status(400).send({ error: 'No location given' })

  try {
    const fetchResponse = (await (await fetch(url)).json()) as GeonamesJSON
    if (!fetchResponse) return res.status(200).send({ locations: [] })

    const locations: ParsedGeoname[] = fetchResponse.geonames.map(geoname => ({
      name: geoname.name,
      countryName: geoname.countryName,
      fclName: geoname.fclName,
      adminName1: geoname.adminName1,
      lat: Number(geoname.lat),
      lng: Number(geoname.lng),
    }))

    return res.status(200).send({ locations: locations })
  } catch (e) {
    logger.error(`Error while fetching Geoname-api: ${JSON.stringify(e)}`)
    return res.status(400).send({ error: `Something went from while fetcthing locations from Geonames API` })
  }
})

export default router

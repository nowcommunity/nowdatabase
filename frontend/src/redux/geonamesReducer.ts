import { api } from './api'
import { ParsedGeoname } from '../shared/types'

const geonamesApi = api.injectEndpoints({
  endpoints: builder => ({
    getGeonames: builder.query<{ locations: ParsedGeoname[] }, string>({
      query: search => ({
        url: `/geonames-api`,
        method: 'POST',
        body: { locationName: search },
      }),
    }),
  }),
})

export const { useLazyGetGeonamesQuery } = geonamesApi

import { api } from './api'
import { Region, RegionDetails } from '@/shared/types'

const regionsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllRegions: builder.query<Region[], void>({
      query: () => ({
        url: `/region/all`,
      }),
    }),
    getRegionDetails: builder.query<RegionDetails, string>({
      query: id => ({
        url: `/region/${id}`,
      }),
    }),
  }),
})

export const { useGetAllRegionsQuery, useGetRegionDetailsQuery } = regionsApi

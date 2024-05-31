import { api } from './api'
import { Locality, TimeUnit, TimeUnitDetails } from '@/backendTypes'

const timeunitsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllTimeUnits: builder.query<TimeUnit[], void>({
      query: () => ({
        url: `/time-unit/all`,
      }),
    }),
    getTimeUnitDetails: builder.query<TimeUnitDetails, string>({
      query: id => ({
        url: `/time-unit/${id}`,
      }),
    }),
    getTimeUnitLocalities: builder.query<Locality[], string>({
      query: id => ({
        url: `/time-unit/localities/${id}`,
      }),
    }),
  }),
})

export const { useGetAllTimeUnitsQuery, useGetTimeUnitLocalitiesQuery, useGetTimeUnitDetailsQuery } = timeunitsApi

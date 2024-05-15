import { api } from './api'
import { TimeUnit, TimeUnitDetails } from '@/backendTypes'

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
  }),
})

export const { useGetAllTimeUnitsQuery, useGetTimeUnitDetailsQuery } = timeunitsApi

import { api } from './api'
import { TimeBound, TimeBoundDetailsType, TimeUnit } from '@/backendTypes'

const timeboundsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllTimeBounds: builder.query<TimeBound[], void>({
      query: () => ({
        url: `/time-bound/all`,
      }),
    }),
    getTimeBoundDetails: builder.query<TimeBoundDetailsType, string | number>({
      query: id => ({
        url: `/time-bound/${id}`,
      }),
    }),
    getTimeBoundTimeUnits: builder.query<TimeUnit[], string | number>({
      query: id => ({
        url: `/time-bound/time-units/${id}`,
      }),
    }),
  }),
})

export const { useGetAllTimeBoundsQuery, useGetTimeBoundDetailsQuery, useGetTimeBoundTimeUnitsQuery } = timeboundsApi

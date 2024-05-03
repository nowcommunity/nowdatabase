/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { TimeUnit } from '@/backendTypes'

const timeunitsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllTimeUnits: builder.query<any, any>({
      query: () => ({
        url: `/time-unit/all`,
      }),
    }),
    getTimeUnitDetails: builder.query<TimeUnit, any>({
      query: (id: string) => ({
        url: `/time-unit/${id}`,
      }),
    }),
  }),
})

export const { useGetAllTimeUnitsQuery, useGetTimeUnitDetailsQuery } = timeunitsApi

/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { Locality } from '@/backendTypes'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<any, any>({
      query: () => ({
        url: `/locality/all`,
      }),
    }),
    getLocalityDetails: builder.query<Locality, any>({
      query: (id: number) => ({
        url: `/locality/${id}`,
      }),
    }),
  }),
})

export const { useGetAllLocalitiesQuery, useGetLocalityDetailsQuery } = localitiesApi

/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { Locality, LocalityDetails } from '@/backendTypes'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<Locality[], void>({
      query: () => ({
        url: `/locality/all`,
      }),
    }),
    getLocalityDetails: builder.query<LocalityDetails, string>({
      query: id => ({
        url: `/locality/${id}`,
      }),
    }),
  }),
})

export const { useGetAllLocalitiesQuery, useGetLocalityDetailsQuery } = localitiesApi

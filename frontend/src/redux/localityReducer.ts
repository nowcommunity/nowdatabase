/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { type now_locAttributes as Locality } from '@backend/models/now_loc'

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

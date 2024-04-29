/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from './api'
import { Species } from '@/backendTypes'

const speciesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSpecies: builder.query<any, any>({
      query: () => ({
        url: `/species/all`,
      }),
    }),
    getSpeciesDetails: builder.query<Species, any>({
      query: (id: number) => ({
        url: `/species/${id}`,
      }),
    }),
  }),
})

export const { useGetAllSpeciesQuery, useGetSpeciesDetailsQuery } = speciesApi

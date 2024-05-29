import { api } from './api'
import { Species, SpeciesDetailsType } from '@/backendTypes'

const speciesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSpecies: builder.query<Species[], void>({
      query: () => ({
        url: `/species/all`,
      }),
    }),
    getSpeciesDetails: builder.query<SpeciesDetailsType, string>({
      query: id => ({
        url: `/species/${id}`,
      }),
    }),
  }),
})

export const { useGetAllSpeciesQuery, useGetSpeciesDetailsQuery } = speciesApi

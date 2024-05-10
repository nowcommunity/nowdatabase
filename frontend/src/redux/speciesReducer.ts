import { api } from './api'
import { Species, SpeciesDetails } from '@/backendTypes'

const speciesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSpecies: builder.query<Species[], void>({
      query: () => ({
        url: `/species/all`,
      }),
    }),
    getSpeciesDetails: builder.query<SpeciesDetails, string>({
      query: id => ({
        url: `/species/${id}`,
      }),
    }),
  }),
})

export const { useGetAllSpeciesQuery, useGetSpeciesDetailsQuery } = speciesApi

import { api } from './api'
import { EditDataType, Species, SpeciesDetailsType } from '@/shared/types'

const speciesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSpecies: builder.query<Species[], void>({
      query: () => ({
        url: `/species/all`,
      }),
      providesTags: result => (result ? [{ type: 'specieslist' }] : []),
    }),
    getSpeciesDetails: builder.query<SpeciesDetailsType, string>({
      query: id => ({
        url: `/species/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'species', id: result.species_id }] : []),
    }),
    editSpecies: builder.mutation<SpeciesDetailsType, EditDataType<SpeciesDetailsType>>({
      query: species => ({
        url: `/species`,
        method: 'PUT',
        body: { species },
      }),
      invalidatesTags: (result, _error, { species_id }) =>
        result ? [{ type: 'species', id: species_id }, 'specieslist'] : [],
    }),
    deleteSpecies: builder.mutation<void, number>({
      query: id => ({
        url: `/species/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const { useGetAllSpeciesQuery, useGetSpeciesDetailsQuery, useEditSpeciesMutation, useDeleteSpeciesMutation } =
  speciesApi

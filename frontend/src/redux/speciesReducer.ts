import { api } from './api'
import { EditDataType, Species, SpeciesDetailsType, SpeciesSynonym } from '@/shared/types'

const speciesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSpecies: builder.query<Species[], void>({
      query: () => ({
        url: `/species/all`,
      }),
      providesTags: result => (result ? [{ type: 'specieslist' }, 'speciessynonyms'] : []),
    }),
    getAllSynonyms: builder.query<SpeciesSynonym[], void>({
      query: () => ({
        url: `/species/synonyms`,
      }),
      providesTags: result => (result ? ['speciessynonyms'] : []),
    }),
    getSpeciesDetails: builder.query<SpeciesDetailsType, string>({
      query: id => ({
        url: `/species/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'species', id: result.species_id }, 'speciessynonyms'] : []),
    }),
    editSpecies: builder.mutation<SpeciesDetailsType, EditDataType<SpeciesDetailsType>>({
      query: species => ({
        url: `/species`,
        method: 'PUT',
        body: { species },
      }),
      invalidatesTags: (result, _error, { species_id }) =>
        result ? [{ type: 'species', id: species_id }, 'specieslist', 'speciessynonyms'] : [],
    }),
    deleteSpecies: builder.mutation<void, number>({
      query: id => ({
        url: `/species/${id}`,
        method: 'DELETE',
      }),

      invalidatesTags: (result, _error, species_id) =>
        typeof result !== 'undefined' ? [{ type: 'species', id: species_id }, 'specieslist', 'speciessynonyms'] : [],
    }),
  }),
})

export const {
  useGetAllSpeciesQuery,
  useGetAllSynonymsQuery,
  useGetSpeciesDetailsQuery,
  useEditSpeciesMutation,
  useDeleteSpeciesMutation,
} = speciesApi

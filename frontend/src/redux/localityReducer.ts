import { api } from './api'
import { EditDataType, Locality, LocalityDetailsType } from '@/backendTypes'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<Locality[], void>({
      query: () => ({
        url: `/locality/all`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
    getLocalityDetails: builder.query<LocalityDetailsType, string>({
      query: id => ({
        url: `/locality/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'locality', id: result.lid }] : []),
    }),
    getLocalitySpeciesList: builder.mutation<unknown[], number[]>({
      query: (lids: number[]) => ({
        url: `/locality-species`,
        body: { lids },
        method: 'POST',
      }),
    }),
    editLocality: builder.mutation<{ id: number }, EditDataType<LocalityDetailsType>>({
      query: locality => ({
        url: `/locality`,
        method: 'PUT',
        body: { locality },
      }),
      invalidatesTags: (result, _error, { lid }) => (result ? [{ type: 'locality', id: lid }, 'localities'] : []),
    }),
  }),
})

export const {
  useGetAllLocalitiesQuery,
  useGetLocalityDetailsQuery,
  useEditLocalityMutation,
  useGetLocalitySpeciesListMutation,
} = localitiesApi

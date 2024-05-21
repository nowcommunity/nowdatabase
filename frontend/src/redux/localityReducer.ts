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
      providesTags: result => (result ? [{ type: 'locality', id: result.lid }] : []),
    }),
    editLocality: builder.mutation<LocalityDetails, LocalityDetails>({
      query: locality => ({
        url: `/locality/`,
        method: 'PUT',
        body: { locality },
      }),
      invalidatesTags: (result, _error, { lid }) => (result ? [{ type: 'locality', id: lid }] : []),
    }),
  }),
})

export const { useGetAllLocalitiesQuery, useGetLocalityDetailsQuery, useEditLocalityMutation } = localitiesApi

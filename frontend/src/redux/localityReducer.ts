import { api } from './api'
import { EditDataType, Locality, LocalityDetailsType } from '@/backendTypes'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<Locality[], void>({
      query: () => ({
        url: `/locality/all`,
      }),
    }),
    getLocalityDetails: builder.query<LocalityDetailsType, string>({
      query: id => ({
        url: `/locality/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'locality', id: result.lid }] : []),
    }),
    editLocality: builder.mutation<LocalityDetailsType, EditDataType<LocalityDetailsType>>({
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

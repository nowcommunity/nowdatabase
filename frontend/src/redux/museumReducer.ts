import { Museum, EditDataType } from '@/shared/types'
import { api } from './api'

const museumsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMuseums: builder.query<Museum[], void>({
      query: () => ({
        url: `/museum/all`,
      }),
      providesTags: result => (result ? [{ type: 'museums' }] : []),
    }),
    getMuseumDetails: builder.query<Museum, string>({
      query: id => ({
        url: `museum/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'museum', id: result.museum }] : []),
    }),
    editMuseum: builder.mutation<Museum, EditDataType<Museum>>({
      query: museum => ({
        url: `/museum`,
        method: 'PUT',
        body: { museum },
      }),
      invalidatesTags: (result, _error, { museum }) => (result ? [{ type: 'museum', id: museum }, 'museums'] : []),
    }),
  }),
})

export const { useGetAllMuseumsQuery, useGetMuseumDetailsQuery, useEditMuseumMutation } = museumsApi

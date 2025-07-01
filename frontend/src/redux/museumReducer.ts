import { Museum } from '@/shared/types'
import { api } from './api'

const museumsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMuseums: builder.query<Museum[], void>({
      query: () => ({
        url: `/museum/all`,
      }),
    }),
    getMuseumDetails: builder.query<Museum, string>({
      query: id => ({
        url: `museum/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'museum', id: result.museum }] : []),
    }),
  }),
})

export const { useGetAllMuseumsQuery, useGetMuseumDetailsQuery } = museumsApi

import { Museum } from '@/shared/types'
import { api } from './api'

const museumsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMuseums: builder.query<Museum[], void>({
      query: () => ({
        url: `/museum/all`,
      }),
    }),
  }),
})

export const { useGetAllMuseumsQuery } = museumsApi

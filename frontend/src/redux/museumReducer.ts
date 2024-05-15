import { Museum } from '@/backendTypes'
import { api } from './api'

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMuseums: builder.query<Museum[], void>({
      query: () => ({
        url: `/museum/all`,
      }),
    }),
  }),
})

export const { useGetAllMuseumsQuery } = referencesApi

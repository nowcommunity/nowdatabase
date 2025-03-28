import { api } from './api'
import { CrossSearch } from '@/shared/types'

const crossSearchApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCrossSearch: builder.query<CrossSearch[], void>({
      query: () => ({
        url: `/crosssearch/all`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
  }),
})

export const { useGetAllCrossSearchQuery } = crossSearchApi

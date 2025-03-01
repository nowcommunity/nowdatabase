import { api } from './api'
import { CrossSearch } from '@/shared/types'

const crossSearchApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCrossSearch: builder.query<CrossSearch[], { limit: number; offset: number }>({
      query: ({ limit, offset }) => ({
        url: `/crosssearch/all/${limit}/${offset}`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
  }),
})

export const { useGetAllCrossSearchQuery } = crossSearchApi

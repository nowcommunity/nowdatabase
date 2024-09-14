import { api } from './api'
import { CrossSearch } from '@/backendTypes'

const crossSearchApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCrossSearch: builder.query<CrossSearch[], void>({
      query: () => ({
        url: `/crosssearch/all`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
    getCrossSearchList: builder.mutation<string[][], number[]>({
      query: (lids: number[]) => ({
        url: `/locality-species`,
        body: { lids },
        method: 'POST',
      }),
    }),
  }),
})

export const { useGetAllCrossSearchQuery, useGetCrossSearchListMutation } = crossSearchApi

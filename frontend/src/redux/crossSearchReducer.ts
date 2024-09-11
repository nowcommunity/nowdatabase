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
    // getCrossSearchDetails: builder.query<LocalityDetailsType, string>({
    //   query: id => ({
    //     url: `/locality/${id}`,
    //   }),
    //   providesTags: result => (result ? [{ type: 'locality', id: result.lid }] : []),
    // }),
    getCrossSearchList: builder.mutation<string[][], number[]>({
      query: (lids: number[]) => ({
        url: `/locality-species`,
        body: { lids },
        method: 'POST',
      }),
    }),
    // editLocality: builder.mutation<{ id: number }, EditDataType<LocalityDetailsType>>({
    //   query: locality => ({
    //     url: `/locality`,
    //     method: 'PUT',
    //     body: { locality },
    //   }),
    //   invalidatesTags: (result, _error, { lid }) => (result ? [{ type: 'locality', id: lid }, 'localities'] : []),
    // }),
    // deleteLocality: builder.mutation<void, number>({
    //   query: id => ({
    //     url: `/locality/${id}`,
    //     method: 'DELETE',
    //   }),
    // }),
  }),
})

export const {
  useGetAllCrossSearchQuery,
  useGetCrossSearchListMutation,
} = crossSearchApi

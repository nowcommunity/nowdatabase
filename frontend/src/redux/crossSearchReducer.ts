import { MRT_ColumnFiltersState } from 'material-react-table'
import { api } from './api'
import { CrossSearch } from '@/shared/types'

const crossSearchApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCrossSearch: builder.query<
      CrossSearch[],
      { limit: number; offset: number; columnFilters: MRT_ColumnFiltersState }
    >({
      query: ({ limit, offset, columnFilters }) => ({
        url: `/crosssearch/all/${limit}/${offset}/${JSON.stringify(columnFilters)}`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
  }),
})

export const { useGetAllCrossSearchQuery } = crossSearchApi

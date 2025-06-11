import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table'
import { api } from './api'
import { CrossSearch, SimplifiedLocality } from '@/shared/types'

const crossSearchApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCrossSearch: builder.query<
      CrossSearch[],
      { limit: number; offset: number; columnFilters: MRT_ColumnFiltersState; sorting: MRT_SortingState }
    >({
      query: ({ limit, offset, columnFilters, sorting }) => ({
        url: `/crosssearch/all/${limit}/${offset}/${JSON.stringify(columnFilters)}/${JSON.stringify(sorting)}`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
    getAllCrossSearchLocalities: builder.query<
      SimplifiedLocality[],
      { columnFilters: MRT_ColumnFiltersState; sorting: MRT_SortingState }
    >({
      query: ({ columnFilters, sorting }) => ({
        url: `/crosssearch/localities/${JSON.stringify(columnFilters)}/${JSON.stringify(sorting)}`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
  }),
})

export const { useGetAllCrossSearchQuery, useGetAllCrossSearchLocalitiesQuery } = crossSearchApi

import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { api } from './api'
import { CrossSearch, SimplifiedLocality } from '@/shared/types'

const encodeRouteParameter = (value: unknown) => encodeURIComponent(JSON.stringify(value))

const isMissingPostRouteError = (error: FetchBaseQueryError | undefined, route: string) => {
  if (!error) return false
  const data = 'data' in error ? error.data : undefined
  const dataText = typeof data === 'string' ? data : ''
  const originalStatus = 'originalStatus' in error ? error.originalStatus : undefined
  return (error.status === 404 || originalStatus === 404) && dataText.includes(`Cannot POST ${route}`)
}

const crossSearchApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCrossSearch: builder.query<
      CrossSearch[],
      { limit: number; offset: number; columnFilters: MRT_ColumnFiltersState; sorting: MRT_SortingState }
    >({
      queryFn: async ({ limit, offset, columnFilters, sorting }, _queryApi, _extraOptions, baseQuery) => {
        const postResult = await baseQuery({
          url: `/crosssearch/all`,
          method: 'POST',
          body: { limit, offset, columnFilters, sorting },
        })

        if (!isMissingPostRouteError(postResult.error, '/crosssearch/all')) {
          return postResult as { data: CrossSearch[] } | { error: FetchBaseQueryError }
        }

        return (await baseQuery({
          url: `/crosssearch/all/${limit}/${offset}/${encodeRouteParameter(columnFilters)}/${encodeRouteParameter(sorting)}`,
        })) as { data: CrossSearch[] } | { error: FetchBaseQueryError }
      },
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
    getAllCrossSearchLocalities: builder.query<
      SimplifiedLocality[],
      { columnFilters: MRT_ColumnFiltersState; sorting: MRT_SortingState }
    >({
      queryFn: async ({ columnFilters, sorting }, _queryApi, _extraOptions, baseQuery) => {
        const postResult = await baseQuery({
          url: `/crosssearch/localities`,
          method: 'POST',
          body: { columnFilters, sorting },
        })

        if (!isMissingPostRouteError(postResult.error, '/crosssearch/localities')) {
          return postResult as { data: SimplifiedLocality[] } | { error: FetchBaseQueryError }
        }

        return (await baseQuery({
          url: `/crosssearch/localities/${encodeRouteParameter(columnFilters)}/${encodeRouteParameter(sorting)}`,
        })) as { data: SimplifiedLocality[] } | { error: FetchBaseQueryError }
      },
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
  }),
})

export const { useGetAllCrossSearchQuery, useGetAllCrossSearchLocalitiesQuery } = crossSearchApi

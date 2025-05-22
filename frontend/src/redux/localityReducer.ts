import { api } from './api'
import { EditDataType, Locality, LocalityDetailsType } from '@/shared/types'
import { MRT_ColumnFiltersState, MRT_SortingState } from 'material-react-table'

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<Locality[], void>({
      query: () => ({
        url: `/locality/all`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
    /*
    Tähän voi lisätä haettavat parametrit: sorting, filterit. 
    Tämä kutsu menee backend/src/routes/locality.ts
    */
    getFilteredLocalities: builder.query<
      Locality[],
      { columnFilters: MRT_ColumnFiltersState; sorting: MRT_SortingState }
    >({
      query: ({ columnFilters, sorting }) => ({
        url: `/locality/all/${JSON.stringify(columnFilters)}/${JSON.stringify(sorting)}`,
      }),
      providesTags: result => (result ? [{ type: 'localities' }] : []),
    }),
    getLocalityDetails: builder.query<LocalityDetailsType, string>({
      query: id => ({
        url: `/locality/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'locality', id: result.lid }] : []),
    }),
    getLocalitySpeciesList: builder.mutation<string[][], number[]>({
      query: (lids: number[]) => ({
        url: `/locality-species`,
        body: { lids },
        method: 'POST',
      }),
    }),
    editLocality: builder.mutation<{ id: number }, EditDataType<LocalityDetailsType>>({
      query: locality => ({
        url: `/locality`,
        method: 'PUT',
        body: { locality },
      }),
      invalidatesTags: (result, _error, { lid }) => (result ? [{ type: 'locality', id: lid }, 'localities'] : []),
    }),
    deleteLocality: builder.mutation<void, number>({
      query: id => ({
        url: `/locality/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _error, lid) =>
        typeof result !== 'undefined' ? [{ type: 'locality', id: lid }, 'localities'] : [],
    }),
  }),
})

export const {
  useGetAllLocalitiesQuery,
  useGetLocalityDetailsQuery,
  useEditLocalityMutation,
  useGetLocalitySpeciesListMutation,
  useDeleteLocalityMutation,
} = localitiesApi

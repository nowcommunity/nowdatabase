import { api } from './api'
import { EditDataType, Locality, LocalityDetailsType } from '@/shared/types'

const sanitizeLocalityProjects = (locality?: EditDataType<LocalityDetailsType>) => {
  if (!locality || !locality.now_plr) return [] as LocalityDetailsType['now_plr']
  return locality.now_plr
    .filter(project => project.rowState !== 'removed')
    .map(({ rowState: _rowState, ...project }) => ({ ...project })) as LocalityDetailsType['now_plr']
}

const localitiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllLocalities: builder.query<Locality[], void>({
      query: () => ({
        url: `/locality/all`,
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
      invalidatesTags: (result, _error, { lid }) =>
        result ? [{ type: 'locality', id: lid }, 'localities', 'specieslist'] : [],
      async onQueryStarted(locality, { dispatch, queryFulfilled }) {
        if (!locality.lid) {
          await queryFulfilled
          return
        }
        const patchResult = dispatch(
          localitiesApi.util.updateQueryData('getLocalityDetails', locality.lid.toString(), draft => {
            draft.now_plr = sanitizeLocalityProjects(locality)
          }),
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
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

import { api } from './api'
import { EditDataType, Locality, Sequence, TimeUnit, TimeUnitDetailsType } from '@/shared/types'

type SequenceQueryArgs = {
  limit?: number
  offset?: number
}

const timeunitsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllTimeUnits: builder.query<TimeUnit[], void>({
      query: () => ({
        url: `/time-unit/all/`,
      }),
      providesTags: result => (result ? [{ type: 'timeunits' }] : []),
    }),
    getTimeUnitDetails: builder.query<TimeUnitDetailsType, string>({
      query: id => ({
        url: `/time-unit/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'timeunit', id: result.tu_name }] : []),
    }),
    getTimeUnitLocalities: builder.query<Locality[], string>({
      query: id => ({
        url: `/time-unit/localities/${id}`,
      }),
    }),
    getSequences: builder.query<Sequence[], SequenceQueryArgs | void>({
      query: params => {
        const searchParams = new URLSearchParams()
        if (typeof params?.limit === 'number') {
          searchParams.set('limit', String(params.limit))
        }
        if (typeof params?.offset === 'number') {
          searchParams.set('offset', String(params.offset))
        }

        const queryString = searchParams.toString()

        return {
          url: `/time-unit/sequences${queryString ? `?${queryString}` : ''}`,
        }
      },
    }),
    editTimeUnit: builder.mutation<TimeUnitDetailsType, EditDataType<TimeUnitDetailsType>>({
      query: timeUnit => ({
        url: `/time-unit/`,
        method: 'PUT',
        body: { timeUnit },
      }),
      invalidatesTags: (result, _error, { tu_name }) =>
        result ? [{ type: 'timeunit', id: tu_name }, 'timeunits', 'timebounds'] : [],
    }),
    deleteTimeUnit: builder.mutation<void, string>({
      query: id => ({
        url: `/time-unit/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, _error, tu_name) =>
        typeof result !== 'undefined' ? [{ type: 'timeunit', id: tu_name }, 'timeunits'] : [],
    }),
  }),
})

export const {
  useGetAllTimeUnitsQuery,
  useGetTimeUnitLocalitiesQuery,
  useGetTimeUnitDetailsQuery,
  useEditTimeUnitMutation,
  useGetSequencesQuery,
  useDeleteTimeUnitMutation,
} = timeunitsApi

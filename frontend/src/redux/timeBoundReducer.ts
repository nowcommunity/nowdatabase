import { api } from './api'
import { EditDataType, TimeBound, TimeBoundDetailsType, TimeUnit } from '@/backendTypes'

const timeboundsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllTimeBounds: builder.query<TimeBound[], void>({
      query: () => ({
        url: `/time-bound/all`,
      }),
      providesTags: result => (result ? [{ type: 'timebounds' }] : []),
    }),
    getTimeBoundDetails: builder.query<TimeBoundDetailsType, string | number>({
      query: id => ({
        url: `/time-bound/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'timebound', id: result.bid }] : []),
    }),
    getTimeBoundTimeUnits: builder.query<TimeUnit[], string | number>({
      query: id => ({
        url: `/time-bound/time-units/${id}`,
      }),
    }),
    editTimeBound: builder.mutation<TimeBoundDetailsType, EditDataType<TimeBoundDetailsType>>({
      query: timeBound => ({
        url: `/time-bound`,
        method: 'PUT',
        body: { timeBound },
      }),
      invalidatesTags: (result, _error, { bid }) => (result ? [{ type: 'timebound', id: bid }, 'timebounds'] : []),
    }),
  }),
})

export const {
  useGetAllTimeBoundsQuery,
  useGetTimeBoundDetailsQuery,
  useGetTimeBoundTimeUnitsQuery,
  useEditTimeBoundMutation,
} = timeboundsApi

import { api } from './api'
import { EditDataType, Locality, TimeUnit, TimeUnitDetailsType } from '@/backendTypes'

const timeunitsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllTimeUnits: builder.query<TimeUnit[], void>({
      query: () => ({
        url: `/time-unit/all`,
      }),
    }),
    getTimeUnitDetails: builder.query<TimeUnitDetailsType, string>({
      query: id => ({
        url: `/time-unit/${id}`,
      }),
    }),
    getTimeUnitLocalities: builder.query<Locality[], string>({
      query: id => ({
        url: `/time-unit/localities/${id}`,
      }),
    }),
    editTimeUnit: builder.mutation<TimeUnitDetailsType, EditDataType<TimeUnitDetailsType>>({
      query: timeUnit => ({
        url: `/time-unit/`,
        method: 'PUT',
        body: { timeUnit },
      }),
      invalidatesTags: (result, _error, { tu_name }) => (result ? [{ type: 'timeunits', id: tu_name }] : []),
    }),
  }),
})

export const {
  useGetAllTimeUnitsQuery,
  useGetTimeUnitLocalitiesQuery,
  useGetTimeUnitDetailsQuery,
  useEditTimeUnitMutation,
} = timeunitsApi

import { api } from './api'
import { EditDataType, Locality, Sequence, TimeUnit, TimeUnitDetailsType } from '@/shared/types'

export type SequenceQueryArgs = {
  limit?: number
  offset?: number
}

type SequenceQueryResult = {
  rows: Sequence[]
  full_count: number
  limit?: number
  offset?: number
}

type TimeUnitValidationErrorItem = {
  name: string
  error: string
}

type TimeUnitCascadeError = {
  name?: string
  cascadeErrors?: string
  calculatorErrors?: string
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

export const formatTimeUnitWriteError = (error: unknown): string | null => {
  if (!isObject(error) || !('status' in error) || !('data' in error)) {
    return null
  }

  const status = error.status
  if (status !== 403) {
    return null
  }

  const payload = error.data
  if (Array.isArray(payload)) {
    const validationErrors = payload.filter(
      (item): item is TimeUnitValidationErrorItem =>
        isObject(item) && typeof item.name === 'string' && typeof item.error === 'string'
    )

    if (validationErrors.length === 0) {
      return null
    }

    return `Following validators failed: ${validationErrors.map(item => `${item.name}: ${item.error}`).join(', ')}`
  }

  if (isObject(payload)) {
    const cascadePayload = payload as TimeUnitCascadeError
    const messages = [cascadePayload.cascadeErrors, cascadePayload.calculatorErrors].filter(
      (message): message is string => typeof message === 'string' && message.trim() !== ''
    )
    if (messages.length > 0) {
      return messages.join(' ')
    }
  }

  return null
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
    getSequences: builder.query<SequenceQueryResult, SequenceQueryArgs | void>({
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

import { api } from './api'
import { Sequence, SequenceDetailsType } from '@/backendTypes'

const sequencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSequences: builder.query<Sequence[], void>({
      query: () => ({
        url: `/sequence/all`,
      }),
    }),
    getSequenceDetails: builder.query<SequenceDetailsType, string>({
      query: id => ({
        url: `/sequence/${id}`,
      }),
    }),
  }),
})

export const { useGetAllSequencesQuery, useGetSequenceDetailsQuery } = sequencesApi

import { api } from './api'
import { Reference, ReferenceDetailsType } from '@/backendTypes'

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllReferences: builder.query<Reference[], void>({
      query: () => ({
        url: `/reference/all`,
      }),
    }),
    getReferenceDetails: builder.query<ReferenceDetailsType, string>({
      query: id => ({
        url: `/reference/${id}`,
      }),
    }),
  }),
})

export const { useGetAllReferencesQuery, useGetReferenceDetailsQuery } = referencesApi

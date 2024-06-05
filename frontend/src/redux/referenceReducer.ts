import { api } from './api'
import { Reference, ReferenceDetailsType, ReferenceType } from '@/backendTypes'

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
    getReferenceTypes: builder.query<ReferenceType[], void>({
      query: () => ({
        url: 'reference/types',
      }),
    }),
  }),
})

export const { useGetAllReferencesQuery, useGetReferenceDetailsQuery, useGetReferenceTypesQuery } = referencesApi

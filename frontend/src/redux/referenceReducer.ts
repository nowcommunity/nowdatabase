import { api } from './api'
import {
  EditDataType,
  Locality,
  Reference,
  ReferenceAuthorType,
  ReferenceDetailsType,
  ReferenceJournalType,
  ReferenceType,
} from '@/shared/types'

const referencesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllReferences: builder.query<Reference[], void>({
      query: () => ({
        url: `/reference/all`,
      }),
      providesTags: result => (result ? [{ type: 'references' }] : []),
    }),
    getReferenceDetails: builder.query<ReferenceDetailsType, string>({
      query: id => ({
        url: `/reference/${id}`,
      }),
      providesTags: result => (result ? [{ type: 'reference', id: result.rid }] : []),
    }),
    getReferenceLocalities: builder.query<Locality[], string>({
      query: id => ({
        url: `/reference/localities/${id}`,
      }),
    }),
    getReferenceTypes: builder.query<ReferenceType[], void>({
      query: () => ({
        url: 'reference/types',
      }),
      providesTags: result => (result ? [{ type: 'author' }] : []),
    }),
    getReferenceAuthors: builder.query<ReferenceAuthorType[], void>({
      query: () => ({
        url: 'reference/authors',
      }),
    }),
    getReferenceJournals: builder.query<ReferenceJournalType[], void>({
      query: () => ({
        url: 'reference/journals',
      }),
    }),
    editReference: builder.mutation<ReferenceDetailsType, EditDataType<ReferenceDetailsType>>({
      query: reference => ({
        url: `/reference`,
        method: 'PUT',
        body: { reference },
      }),
      invalidatesTags: (result, _error, { rid }) => (result ? [{ type: 'reference', id: rid }, 'references'] : []),
    }),
    deleteReference: builder.mutation<void, number>({
      query: id => ({
        url: `/reference/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useGetAllReferencesQuery,
  useGetReferenceDetailsQuery,
  useGetReferenceLocalitiesQuery,
  useGetReferenceTypesQuery,
  useGetReferenceAuthorsQuery,
  useGetReferenceJournalsQuery,
  useEditReferenceMutation,
  useDeleteReferenceMutation,
} = referencesApi

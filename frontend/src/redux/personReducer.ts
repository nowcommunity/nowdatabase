import { api } from './api'
import { Person, PersonDetailsType } from '@/backendTypes'

const personsApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllPersons: builder.query<Person[], void>({
      query: () => ({
        url: `/person/all`,
      }),
    }),
    getPersonDetails: builder.query<PersonDetailsType, string>({
      query: id => ({
        url: `/person/${id}`,
      }),
    }),
  }),
})

export const { useGetAllPersonsQuery, useGetPersonDetailsQuery } = personsApi

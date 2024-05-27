import { SedimentaryStructureValues } from '@/backendTypes'
import { api } from './api'

const sedimentaryStructuresApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSedimentaryStructures: builder.query<SedimentaryStructureValues[], void>({
      query: () => ({
        url: `/sedimentary-structure/all`,
      }),
    }),
  }),
})

export const { useGetAllSedimentaryStructuresQuery } = sedimentaryStructuresApi

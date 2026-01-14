import { CollectingMethodValues } from '@/shared/types'
import { api } from './api'

const collectingMethodValuesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllCollectingMethodValues: builder.query<CollectingMethodValues[], void>({
      query: () => ({
        url: `/collecting-method-values/all`,
      }),
    }),
  }),
})

export const { useGetAllCollectingMethodValuesQuery } = collectingMethodValuesApi

import { api } from './api'
import { ActivityStatistic, Statistics } from '@/shared/types'

const statisticsApi = api.injectEndpoints({
  endpoints: builder => ({
    getStatistics: builder.query<Statistics, void>({
      query: () => ({
        url: `/statistics`,
      }),
    }),
    getLocalityStatistics: builder.query<ActivityStatistic[], void>({
      query: () => ({
        url: `/statistics/locality`,
      }),
    }),
    getSpeciesStatistics: builder.query<ActivityStatistic[], void>({
      query: () => ({
        url: `/statistics/species`,
      }),
    }),
  }),
})

export const { useGetStatisticsQuery, useGetLocalityStatisticsQuery, useGetSpeciesStatisticsQuery } = statisticsApi

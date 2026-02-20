import { skipToken } from '@reduxjs/toolkit/query'
import { useGetOccurrenceDetailsQuery } from '@/redux/api'
import { OccurrenceDetailsType } from '@/shared/types'

type UseOccurrenceDetailsResult = {
  occurrence: OccurrenceDetailsType | undefined
  isLoading: boolean
  isError: boolean
  refetch: () => Promise<unknown>
}

export const useOccurrenceDetails = (lid: number | null, speciesId: number | null): UseOccurrenceDetailsResult => {
  const queryArg = lid !== null && speciesId !== null ? { lid, speciesId } : skipToken
  const occurrenceQuery = useGetOccurrenceDetailsQuery(queryArg)

  return {
    occurrence: occurrenceQuery.data,
    isLoading: occurrenceQuery.isLoading || occurrenceQuery.isFetching,
    isError: occurrenceQuery.isError,
    refetch: occurrenceQuery.refetch,
  }
}

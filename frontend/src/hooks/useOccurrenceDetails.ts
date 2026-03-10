import { skipToken } from '@reduxjs/toolkit/query'
import { EditableOccurrenceData, OccurrenceDetailsType } from '@/shared/types'
import { useEditOccurrenceMutation, useGetOccurrenceDetailsQuery } from '@/redux/api'

type UseOccurrenceDetailsResult = {
  occurrence: OccurrenceDetailsType | undefined
  isLoading: boolean
  isError: boolean
  isSaving: boolean
  refetch: () => Promise<unknown>
  saveOccurrence: (occurrence: EditableOccurrenceData) => Promise<OccurrenceDetailsType>
}

export const useOccurrenceDetails = (lid: number | null, speciesId: number | null): UseOccurrenceDetailsResult => {
  const queryArg = lid !== null && speciesId !== null ? { lid, speciesId } : skipToken
  const occurrenceQuery = useGetOccurrenceDetailsQuery(queryArg)
  const [editOccurrence, editOccurrenceState] = useEditOccurrenceMutation()

  const saveOccurrence = async (occurrence: EditableOccurrenceData): Promise<OccurrenceDetailsType> => {
    if (lid === null || speciesId === null) {
      throw new Error('Occurrence ids are required for saving')
    }

    return await editOccurrence({ lid, speciesId, occurrence }).unwrap()
  }

  return {
    occurrence: occurrenceQuery.data,
    isLoading: occurrenceQuery.isLoading || occurrenceQuery.isFetching,
    isError: occurrenceQuery.isError,
    isSaving: editOccurrenceState.isLoading,
    refetch: occurrenceQuery.refetch,
    saveOccurrence,
  }
}

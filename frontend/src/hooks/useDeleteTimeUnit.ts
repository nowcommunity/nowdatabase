import { useCallback } from 'react'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { useDeleteTimeUnitMutation } from '@/redux/timeUnitReducer'
import { useNotify } from './notification'

type UseDeleteTimeUnitOptions = {
  onSuccess?: () => void
}

const GENERIC_DELETE_ERROR = 'Could not delete item. Error happened.'
const SUCCESS_MESSAGE = 'Deleted item successfully.'

const extractErrorMessage = (error: unknown): string | undefined => {
  if (typeof error === 'string') return error

  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as FetchBaseQueryError).data
    if (typeof data === 'string') return data
    if (
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
    ) {
      return (data as { message: string }).message
    }
  }

  return undefined
}

export const useDeleteTimeUnit = ({ onSuccess }: UseDeleteTimeUnitOptions = {}) => {
  const { notify } = useNotify()
  const [deleteMutation, mutationState] = useDeleteTimeUnitMutation()

  const deleteTimeUnit = useCallback(
    async (id: string) => {
      try {
        await deleteMutation(id).unwrap()
        notify(SUCCESS_MESSAGE)
        onSuccess?.()
      } catch (error) {
        const message = extractErrorMessage(error) ?? GENERIC_DELETE_ERROR
        notify(message, 'error')
      }
    },
    [deleteMutation, notify, onSuccess]
  )

  return { deleteTimeUnit, isDeleting: mutationState.isLoading }
}

export { GENERIC_DELETE_ERROR, SUCCESS_MESSAGE }

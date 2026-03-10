import { NotificationContext } from '@/components/Notification'
import { useContext } from 'react'
import { ValidationErrors } from '@/shared/types'

type ErrorWithMessage = {
  message?: string
  data?: unknown
}

const isValidationError = (value: unknown): value is ValidationErrors => {
  if (!value || typeof value !== 'object') return false

  const data = (value as { data?: unknown }).data
  if (!Array.isArray(data)) return false

  return data.every(item => typeof item === 'object' && item !== null && 'error' in item)
}

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (isValidationError(error) && error.data.length > 0) {
    return error.data.map(validationError => validationError.error).join(', ')
  }

  const unknownError = error as ErrorWithMessage

  if (typeof unknownError?.data === 'string' && unknownError.data.trim() !== '') return unknownError.data
  if (typeof unknownError?.message === 'string' && unknownError.message.trim() !== '') return unknownError.message

  return fallback
}

export const useNotify = () => {
  const { notify, setMessage } = useContext(NotificationContext)
  // setMessage can be used to change a notification's message without creating a new one
  // use this to create a progress bar etc.
  return { notify, setMessage }
}

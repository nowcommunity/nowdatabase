import { SerializedError } from '@reduxjs/toolkit'

export type ApiErrorData = {
  message?: string
  code?: string
}

type ApiErrorShape = { status: number; data?: ApiErrorData }

type ApiErrorResult = {
  status?: number
  data?: ApiErrorData
}

const isApiErrorShape = (error: unknown): error is ApiErrorShape => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number'
  )
}

const isSerializedError = (error: unknown): error is SerializedError => {
  return typeof error === 'object' && error !== null && 'message' in error
}

export const parseApiError = (error: unknown): ApiErrorResult => {
  if (isApiErrorShape(error)) {
    return { status: error.status, data: error.data }
  }

  if (isSerializedError(error)) {
    return { status: undefined, data: { message: error.message } }
  }

  return {}
}

export const isDuplicateNameError = (error: unknown) => {
  const { status, data } = parseApiError(error)
  return status === 409 && data?.code === 'duplicate_name'
}

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const { data } = parseApiError(error)
  return data?.message ?? fallback
}

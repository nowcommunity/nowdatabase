import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  return typeof error === 'object' && error !== null && 'status' in error
}

const extractStatus = (error: FetchBaseQueryError): number | null => {
  if (typeof error.status === 'number') {
    return error.status
  }

  return null
}

const extractMessageFromData = (data: unknown): string | null => {
  if (typeof data === 'string') {
    return data
  }

  if (data && typeof data === 'object' && 'message' in data) {
    const candidate = (data as { message?: unknown }).message
    if (typeof candidate === 'string') {
      return candidate
    }
  }

  return null
}

export const resolveErrorStatus = (error: FetchBaseQueryError | SerializedError | undefined): number | null => {
  if (!error || !isFetchBaseQueryError(error)) {
    return null
  }

  return extractStatus(error)
}

export const resolveErrorMessage = (
  status: number | null,
  error: FetchBaseQueryError | SerializedError | undefined,
  isError: boolean | undefined
): string | null => {
  if (!isError) {
    return null
  }

  if (error && isFetchBaseQueryError(error)) {
    const message = extractMessageFromData(error.data)
    if (message) {
      return message
    }
  }

  if (status === 401) {
    return 'You need to sign in to view this data.'
  }

  if (status === 403) {
    return 'You do not have permission to view this data.'
  }

  return 'We were unable to load this data. Please try again later.'
}

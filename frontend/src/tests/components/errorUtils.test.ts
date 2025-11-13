import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { SerializedError } from '@reduxjs/toolkit'
import { resolveErrorMessage, resolveErrorStatus } from '@/components/TableView/errorUtils'

describe('table view error utilities', () => {
  it('derives numeric status codes from fetch errors', () => {
    const fetchError: FetchBaseQueryError = { status: 403, data: {} }
    const serializedError: SerializedError = { name: 'Error', message: 'network failure' }
    expect(resolveErrorStatus(fetchError)).toBe(403)
    expect(resolveErrorStatus(serializedError)).toBeNull()
  })

  it('prefers backend messages when present', () => {
    const error = { status: 403, data: { message: 'Forbidden' } }
    const status = resolveErrorStatus(error)
    expect(resolveErrorMessage(status, error, true)).toBe('Forbidden')
  })

  it('falls back to permission copy when backend provides none', () => {
    const error = { status: 403, data: {} }
    const status = resolveErrorStatus(error)
    expect(resolveErrorMessage(status, error, true)).toBe('You do not have permission to view this data.')
  })

  it('returns null when not in error state', () => {
    const error = { status: 403, data: {} }
    const status = resolveErrorStatus(error)
    expect(resolveErrorMessage(status, error, false)).toBeNull()
  })
})

import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import { useOccurrenceDetails } from './useOccurrenceDetails'
import { useEditOccurrenceMutation, useGetOccurrenceDetailsQuery } from '@/redux/api'

jest.mock('@/redux/api', () => ({
  useGetOccurrenceDetailsQuery: jest.fn(),
  useEditOccurrenceMutation: jest.fn(),
}))

const mockUseGetOccurrenceDetailsQuery = useGetOccurrenceDetailsQuery as jest.MockedFunction<
  typeof useGetOccurrenceDetailsQuery
>
const mockUseEditOccurrenceMutation = useEditOccurrenceMutation as jest.MockedFunction<typeof useEditOccurrenceMutation>

describe('useOccurrenceDetails', () => {
  beforeEach(() => {
    mockUseGetOccurrenceDetailsQuery.mockReset()
    mockUseEditOccurrenceMutation.mockReset()
  })

  it('passes lid and speciesId to query hook and returns mapped data', () => {
    const refetch = jest.fn(() => Promise.resolve(undefined))
    mockUseGetOccurrenceDetailsQuery.mockReturnValue({
      data: { lid: 10, species_id: 20, loc_name: 'Loc' },
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch,
    } as unknown as ReturnType<typeof useGetOccurrenceDetailsQuery>)

    mockUseEditOccurrenceMutation.mockReturnValue([jest.fn(), { isLoading: false }] as unknown as ReturnType<
      typeof useEditOccurrenceMutation
    >)

    const { result } = renderHook(() => useOccurrenceDetails(10, 20))

    expect(mockUseGetOccurrenceDetailsQuery).toHaveBeenCalledWith({ lid: 10, speciesId: 20 })
    expect(result.current.occurrence?.lid).toBe(10)
    expect(result.current.occurrence?.species_id).toBe(20)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
    expect(result.current.isSaving).toBe(false)
  })

  it('reports loading when query is loading or fetching', () => {
    mockUseGetOccurrenceDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: true,
      isError: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as ReturnType<typeof useGetOccurrenceDetailsQuery>)

    mockUseEditOccurrenceMutation.mockReturnValue([jest.fn(), { isLoading: false }] as unknown as ReturnType<
      typeof useEditOccurrenceMutation
    >)

    const { result } = renderHook(() => useOccurrenceDetails(10, 20))

    expect(result.current.isLoading).toBe(true)
  })

  it('saveOccurrence calls edit mutation with expected payload', async () => {
    const refetch = jest.fn(() => Promise.resolve(undefined))
    mockUseGetOccurrenceDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch,
    } as unknown as ReturnType<typeof useGetOccurrenceDetailsQuery>)

    const unwrap = jest.fn<() => Promise<unknown>>().mockResolvedValue({ lid: 10, species_id: 20 })
    const editOccurrence = jest.fn(() => ({ unwrap }))

    mockUseEditOccurrenceMutation.mockReturnValue([editOccurrence, { isLoading: false }] as unknown as ReturnType<
      typeof useEditOccurrenceMutation
    >)

    const { result } = renderHook(() => useOccurrenceDetails(10, 20))

    await result.current.saveOccurrence({ qua: 'a' })

    expect(editOccurrence).toHaveBeenCalledWith({ lid: 10, speciesId: 20, occurrence: { qua: 'a' } })
    expect(unwrap).toHaveBeenCalled()
  })
})

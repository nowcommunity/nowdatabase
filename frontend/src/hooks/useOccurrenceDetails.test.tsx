import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import { useOccurrenceDetails } from './useOccurrenceDetails'
import { useGetOccurrenceDetailsQuery } from '@/redux/api'

jest.mock('@/redux/api', () => ({
  useGetOccurrenceDetailsQuery: jest.fn(),
}))

const mockUseGetOccurrenceDetailsQuery = useGetOccurrenceDetailsQuery as jest.MockedFunction<
  typeof useGetOccurrenceDetailsQuery
>

describe('useOccurrenceDetails', () => {
  beforeEach(() => {
    mockUseGetOccurrenceDetailsQuery.mockReset()
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

    const { result } = renderHook(() => useOccurrenceDetails(10, 20))

    expect(mockUseGetOccurrenceDetailsQuery).toHaveBeenCalledWith({ lid: 10, speciesId: 20 })
    expect(result.current.occurrence?.lid).toBe(10)
    expect(result.current.occurrence?.species_id).toBe(20)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isError).toBe(false)
  })

  it('reports loading when query is loading or fetching', () => {
    mockUseGetOccurrenceDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: true,
      isError: false,
      refetch: jest.fn(() => Promise.resolve(undefined)),
    } as unknown as ReturnType<typeof useGetOccurrenceDetailsQuery>)

    const { result } = renderHook(() => useOccurrenceDetails(10, 20))

    expect(result.current.isLoading).toBe(true)
  })
})

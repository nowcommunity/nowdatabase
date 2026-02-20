import { describe, expect, it, jest, beforeEach } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import type { ReactNode } from 'react'

const mockPageContext = {
  previousTableUrls: [] as string[],
  setPreviousTableUrls: jest.fn() as jest.MockedFunction<(value: string[]) => void>,
  viewName: 'reference',
}

jest.mock('@/components/Page', () => ({
  usePageContext: () => mockPageContext,
}))

import { resolveReturnNavigation, useReturnNavigation } from './useReturnNavigation'

describe('resolveReturnNavigation', () => {
  it('returns state decision when returnTo is provided', () => {
    const decision = resolveReturnNavigation({
      returnTo: '/locality/1?tab=2',
      previousUrls: ['/reference?tab=1'],
      fallback: '/reference',
    })

    expect(decision).toEqual({ type: 'state', target: '/locality/1?tab=2' })
  })

  it('uses the table url stack when no state is provided', () => {
    const decision = resolveReturnNavigation({
      returnTo: undefined,
      previousUrls: ['/reference?tab=1', '/reference?tab=2'],
      fallback: '/reference',
    })

    expect(decision).toEqual({
      type: 'stack',
      target: '/reference?tab=2',
      updatedStack: ['/reference?tab=1'],
    })
  })

  it('falls back to the provided path when there is no state or stack', () => {
    const decision = resolveReturnNavigation({
      returnTo: undefined,
      previousUrls: [],
      fallback: '/reference',
    })

    expect(decision).toEqual({ type: 'fallback', target: '/reference' })
  })
})

describe('useReturnNavigation', () => {
  beforeEach(() => {
    mockPageContext.previousTableUrls = []
    mockPageContext.setPreviousTableUrls.mockClear()
    mockPageContext.viewName = 'reference'
  })

  it('derives the fallback path from the current view name when one is not provided', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/reference/123']}>{children}</MemoryRouter>
    )

    const { result } = renderHook(() => useReturnNavigation(), { wrapper })

    expect(result.current.fallbackTarget).toBe('/reference')
  })

  it('falls back to /occurrence from a composite occurrence detail path when viewName is unavailable', () => {
    mockPageContext.viewName = ''

    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={[{ pathname: '/occurrence/20920/21052' }]}>{children}</MemoryRouter>
    )

    const { result } = renderHook(() => useReturnNavigation(), { wrapper })

    expect(result.current.fallbackTarget).toBe('/occurrence')
  })
  it('prefers an explicit fallback option', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <MemoryRouter initialEntries={['/reference/123']}>{children}</MemoryRouter>
    )

    const { result } = renderHook(() => useReturnNavigation({ fallback: '/updates' }), { wrapper })

    expect(result.current.fallbackTarget).toBe('/updates')
  })
})

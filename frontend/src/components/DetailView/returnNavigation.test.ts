import { describe, expect, it } from '@jest/globals'
import { resolveReturnNavigation } from './returnNavigation'

describe('resolveReturnNavigation', () => {
  it('prefers explicit return target from navigation state', () => {
    const decision = resolveReturnNavigation({
      returnTo: '/locality/1?tab=2',
      previousUrls: ['/reference'],
      fallback: '/reference',
    })

    expect(decision).toEqual({ type: 'state', target: '/locality/1?tab=2' })
  })

  it('falls back to previous table url when state is absent', () => {
    const decision = resolveReturnNavigation({
      returnTo: undefined,
      previousUrls: ['/reference'],
      fallback: '/reference',
    })

    expect(decision).toEqual({ type: 'stack', target: '/reference', updatedStack: [] })
  })

  it('uses provided fallback when no history remains', () => {
    const decision = resolveReturnNavigation({
      returnTo: undefined,
      previousUrls: [],
      fallback: '/reference',
    })

    expect(decision).toEqual({ type: 'fallback', target: '/reference' })
  })
})

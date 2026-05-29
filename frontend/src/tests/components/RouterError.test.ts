import { describe, expect, it } from '@jest/globals'

import { getRouterErrorMessage } from '@/components/ErrorBoundary/RouterErrorMessages'

describe('getRouterErrorMessage', () => {
  it('returns a generic message outside development', () => {
    expect(getRouterErrorMessage(new Error('sensitive route loader details'), false)).toBe(
      'An unexpected navigation error occurred.'
    )
  })

  it('returns raw error details in development', () => {
    expect(getRouterErrorMessage(new Error('route loader failed'), true)).toBe('route loader failed')
  })
})

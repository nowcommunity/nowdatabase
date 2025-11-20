import { describe, expect, it } from '@jest/globals'
import { removeDuplicateProjectLinks } from '../../services/utils/projectLinks'

describe('removeDuplicateProjectLinks', () => {
  it('filters out duplicates while preserving removals', () => {
    const existingProjectIds = new Set([35])
    const pendingLinks = [
      { lid: 1, pid: 35, rowState: 'new' as const },
      { lid: 1, pid: 36, rowState: 'new' as const },
      { lid: 1, pid: 36, rowState: 'new' as const },
      { lid: 1, pid: 36, rowState: 'removed' as const },
      { lid: 1, pid: 37 },
    ]

    const result = removeDuplicateProjectLinks(pendingLinks, existingProjectIds)

    expect(result).toEqual([
      { lid: 1, pid: 36, rowState: 'new' },
      { lid: 1, pid: 36, rowState: 'removed' },
      { lid: 1, pid: 37 },
    ])
  })
})

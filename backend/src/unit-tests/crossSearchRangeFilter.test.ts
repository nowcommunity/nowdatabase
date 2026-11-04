import { describe, expect, it } from '@jest/globals'
import { validateCrossSearchRouteParams } from '../../../frontend/src/shared/validators/crossSearch'
import { generateCrossSearchSql } from '../services/queries/crossSearchQuery'

const validate = (columnFilters: unknown) => {
  const error = validateCrossSearchRouteParams({ columnFilters, sorting: [] } as never, 'columnFilters')
  return error.error ? [error] : []
}

describe('cross-search range filters', () => {
  it('accepts range filter values with numeric or empty bounds', () => {
    expect(validate([{ id: 'max_age', value: [1.5, ''] }])).toHaveLength(0)
    expect(validate([{ id: 'max_age', value: ['', '5'] }])).toHaveLength(0)
    expect(validate([{ id: 'max_age', value: [null, 5] }])).toHaveLength(0)
  })

  it('rejects malformed range filter values', () => {
    expect(validate([{ id: 'max_age', value: ['abc', 5] }])).toHaveLength(1)
    expect(validate([{ id: 'max_age', value: [1, 2, 3] }])).toHaveLength(1)
    expect(validate([{ id: 'max_age', value: ['', ''] }])).toHaveLength(1)
  })

  it('builds numeric comparisons for range filters', () => {
    const sql = generateCrossSearchSql(true, [], 10, 0, [{ id: 'now_loc.max_age', value: [1, 5] }], undefined, false)
    const query = sql.sql
    expect(query).toContain('now_loc.max_age >= ?')
    expect(query).toContain('now_loc.max_age <= ?')
    expect(sql.values).toEqual(expect.arrayContaining([1, 5]))
  })
})

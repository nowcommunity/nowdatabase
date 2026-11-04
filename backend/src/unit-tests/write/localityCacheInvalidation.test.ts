import { describe, expect, it, jest } from '@jest/globals'
import type { PoolConnection } from 'mariadb'
import { invalidateLocalityListCache } from '../../services/locality'
import { WriteHandler } from '../../services/write/writeOperations/writeHandler'

jest.mock('../../utils/config', () => ({ COORDINATOR: 'test' }))
jest.mock('../../utils/db', () => ({ pool: {} }))
jest.mock('../../services/locality', () => ({
  invalidateLocalityListCache: jest.fn(),
}))

describe('WriteHandler locality cache invalidation', () => {
  it('invalidates the locality list cache after the transaction commits', async () => {
    const events: string[] = []
    jest.mocked(invalidateLocalityListCache).mockImplementation(() => {
      events.push('invalidate')
    })
    const handler = new WriteHandler({
      dbName: 'now_test',
      table: 'now_loc',
      idColumn: 'lid',
      allowedColumns: [],
      type: 'update',
    })
    handler.connection = {
      commit: () => {
        events.push('commit')
        return Promise.resolve()
      },
      end: () => {
        events.push('end')
        return Promise.resolve()
      },
    } as unknown as PoolConnection

    await handler.logUpdatesAndComplete('test')

    expect(events).toEqual(['commit', 'invalidate', 'end'])
  })
})

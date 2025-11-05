import { describe, expect, it } from '@jest/globals'
import reducer, {
  clearTableMetadata,
  TablePaginationMetadata,
  upsertTableMetadata,
} from '@/redux/slices/tablesSlice'

describe('tablesSlice', () => {
  it('stores metadata for table id', () => {
    const metadata: TablePaginationMetadata = { totalItems: 50, totalPages: 5, pageIndex: 0, pageSize: 10 }
    const state = reducer(undefined, upsertTableMetadata({ tableId: 'test', metadata }))
    expect(state.test).toEqual(metadata)
  })

  it('clears metadata for table id', () => {
    const metadata: TablePaginationMetadata = { totalItems: 10, totalPages: 1, pageIndex: 0, pageSize: 10 }
    const stateWithMetadata = reducer(undefined, upsertTableMetadata({ tableId: 'test', metadata }))
    const clearedState = reducer(stateWithMetadata, clearTableMetadata({ tableId: 'test' }))
    expect(clearedState.test).toBeUndefined()
  })
})

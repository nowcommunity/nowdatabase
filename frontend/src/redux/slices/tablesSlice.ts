import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'

export type TablePaginationMetadata = {
  totalItems: number
  totalPages: number
  pageIndex: number
  pageSize: number
}

export type TablesState = Record<string, TablePaginationMetadata>

const initialState: TablesState = {}

type UpsertPayload = {
  tableId: string
  metadata: TablePaginationMetadata
}

type ClearPayload = {
  tableId: string
}

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    upsertTableMetadata: (state, action: PayloadAction<UpsertPayload>) => {
      const { tableId, metadata } = action.payload
      state[tableId] = metadata
    },
    clearTableMetadata: (state, action: PayloadAction<ClearPayload>) => {
      const { tableId } = action.payload
      delete state[tableId]
    },
  },
})

export const { upsertTableMetadata, clearTableMetadata } = tablesSlice.actions

export const selectTableMetadata = (state: RootState, tableId: string) => state.tables?.[tableId] ?? null

export default tablesSlice.reducer

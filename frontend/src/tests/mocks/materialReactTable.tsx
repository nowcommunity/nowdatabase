/* eslint-disable react-refresh/only-export-components */
import { ReactNode } from 'react'

type MockRow = {
  original: Record<string, unknown>
  getVisibleCells: () => Array<{
    column: { id: string }
    getValue: () => unknown
  }>
}

type MockTable = {
  getPrePaginationRowModel: () => { rows: MockRow[] }
  getColumn: (id: string) => { columnDef: { header: string } }
}

let lastMaterialReactTableOptions: unknown = null

export const getLastMaterialReactTableOptions = <T,>(): T | null => {
  return (lastMaterialReactTableOptions as T | null) ?? null
}

export const useMaterialReactTable = <T extends object>(options: T): T & MockTable => ({
  ...(lastMaterialReactTableOptions = options),
  getPrePaginationRowModel: () => ({ rows: [] }),
  getColumn: (id: string) => ({ columnDef: { header: id } }),
})

export const MaterialReactTable = ({ children }: { children?: ReactNode; table?: unknown }) => (
  <div data-testid="material-react-table">{children}</div>
)

export const MRT_ShowHideColumnsButton = ({ children }: { children?: ReactNode; table?: unknown }) => (
  <button type="button">{children ?? 'Show/Hide Columns'}</button>
)

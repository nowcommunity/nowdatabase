import { PropsWithChildren, ReactNode, useMemo } from 'react'
import { Box } from '@mui/material'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import { selectTableMetadata, TablePaginationMetadata } from '@/redux/slices/tablesSlice'
import { TablePagination } from './TablePagination'

type PaginationPlacement = 'top' | 'bottom' | 'both'

type TableProps = {
  tableId: string
  onPageChange?: (pageIndex: number) => void
  isLoading?: boolean
  paginationPlacement?: PaginationPlacement
  renderEmptyState?: () => ReactNode
  hidePaginationWhenEmpty?: boolean
}

const shouldRenderPagination = (metadata: TablePaginationMetadata | null, hidePaginationWhenEmpty: boolean) => {
  if (!metadata) return false
  if (hidePaginationWhenEmpty && metadata.totalItems === 0) return false
  return true
}

export const Table = ({
  tableId,
  children,
  onPageChange,
  isLoading = false,
  paginationPlacement = 'bottom',
  renderEmptyState,
  hidePaginationWhenEmpty = false,
}: PropsWithChildren<TableProps>) => {
  const metadata = useSelector((state: RootState) => selectTableMetadata(state, tableId))

  const pagination = useMemo(
    () => ({
      metadata,
      enabled: shouldRenderPagination(metadata, hidePaginationWhenEmpty),
    }),
    [metadata, hidePaginationWhenEmpty]
  )

  const renderPagination = () => {
    if (!pagination.enabled || !pagination.metadata) return null
    return (
      <TablePagination
        key={`${tableId}-page-${pagination.metadata.pageIndex}-size-${pagination.metadata.pageSize}-total-${pagination.metadata.totalItems}`}
        metadata={pagination.metadata}
        onPageChange={onPageChange}
        isLoading={isLoading}
      />
    )
  }

  if (!children) {
    return null
  }

  const content = <Box>{children}</Box>

  const emptyState = pagination.metadata && pagination.metadata.totalItems === 0 ? renderEmptyState?.() : null

  return (
    <Box display="flex" flexDirection="column" gap={1.5}>
      {(paginationPlacement === 'top' || paginationPlacement === 'both') && renderPagination()}
      {emptyState ?? content}
      {(paginationPlacement === 'bottom' || paginationPlacement === 'both') && renderPagination()}
    </Box>
  )
}

export default Table

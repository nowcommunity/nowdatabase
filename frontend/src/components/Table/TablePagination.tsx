import { Box, Button, Divider, Typography } from '@mui/material'
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import type { TablePaginationMetadata } from '@/redux/slices/tablesSlice'

type TablePaginationProps = {
  metadata: TablePaginationMetadata
  onPageChange?: (pageIndex: number) => void
  isLoading?: boolean
}

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min
  if (value > max) return max
  return value
}

export const TablePagination = ({ metadata, onPageChange, isLoading = false }: TablePaginationProps) => {
  const { pageIndex, pageSize, totalItems, totalPages } = metadata

  const canGoPrevious = pageIndex > 0
  const canGoNext = pageIndex + 1 < totalPages

  const handlePrevious = () => {
    if (!canGoPrevious) return
    const nextIndex = clamp(pageIndex - 1, 0, Math.max(totalPages - 1, 0))
    onPageChange?.(nextIndex)
  }

  const handleNext = () => {
    if (!canGoNext) return
    const nextIndex = clamp(pageIndex + 1, 0, Math.max(totalPages - 1, 0))
    onPageChange?.(nextIndex)
  }

  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1
  const endItem = Math.min(totalItems, (pageIndex + 1) * pageSize)

  return (
    <Box display="flex" flexDirection="column" gap={1} paddingY={1.5}>
      <Divider />
      <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
        <Typography variant="body2" color="text.secondary" aria-live="polite">
          {totalItems === 0
            ? 'No results'
            : `Showing ${startItem.toLocaleString()}-${endItem.toLocaleString()} of ${totalItems.toLocaleString()}`}
        </Typography>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Typography component="span" variant="body2" color="text.secondary">
            Page {totalPages === 0 ? 0 : pageIndex + 1} of {totalPages}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={handlePrevious}
            startIcon={<NavigateBeforeIcon fontSize="small" />}
            disabled={!canGoPrevious || isLoading}
            aria-label="Go to previous page"
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleNext}
            endIcon={<NavigateNextIcon fontSize="small" />}
            disabled={!canGoNext || isLoading}
            aria-label="Go to next page"
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default TablePagination

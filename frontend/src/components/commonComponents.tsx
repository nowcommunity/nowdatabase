import { Tooltip, Box } from '@mui/material'
import { ReactNode } from 'react'

export const Cell = ({ renderedCellValue }: { renderedCellValue: ReactNode }) => (
  <Tooltip title={renderedCellValue}>
    <Box sx={{ maxWidth: '260px', WebkitMaskImage: 'linear-gradient(to right, #000 90%, transparent)' }}>
      {renderedCellValue}
    </Box>
  </Tooltip>
)

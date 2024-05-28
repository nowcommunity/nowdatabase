import { useMemo, ReactNode } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllRegionsQuery } from '../../redux/regionReducer'
import { Region } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { Box, Tooltip } from '@mui/material'

const Cell = ({ renderedCellValue }: { renderedCellValue: ReactNode }) => (
  <Tooltip title={renderedCellValue}>
    <Box sx={{ maxWidth: '260px', WebkitMaskImage: 'linear-gradient(to right, #000 90%, transparent)' }}>
      {renderedCellValue}
    </Box>
  </Tooltip>
)

export const RegionTable = ({ selectorFn }: { selectorFn?: (id: Region) => void }) => {
  const regionQuery = useGetAllRegionsQuery()
  const columns = useMemo<MRT_ColumnDef<Region>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'reg_coord_id',
        header: 'Region Id',
        size: 20,
      },
      {
        accessorKey: 'region',
        header: 'Region',
        maxSize: 60,
      },
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<Region>
      selectorFn={selectorFn}
      checkRowRestriction={checkRowRestriction}
      idFieldName="reg_coord_id"
      columns={columns}
      data={regionQuery.data}
      url="region"
    />
  )
}

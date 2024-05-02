import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllTimeUnitsQuery } from '../../redux/timeUnitReducer'
import { TimeUnit } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { Box, Tooltip } from '@mui/material'

const Cell = ({ renderedCellValue }: { renderedCellValue: React.ReactNode }) => (
  <Tooltip title={renderedCellValue}>
    <Box sx={{ maxWidth: '260px', '-webkit-mask-image': 'linear-gradient(90deg, #000 90%, transparent)' }}>
      {renderedCellValue}
    </Box>
  </Tooltip>
)

export const TimeUnitTable = ({
  selectorFn,
  selectedList,
}: {
  selectorFn?: (id: string) => void
  selectedList?: string[]
}) => {
  const time_unitQuery = useGetAllTimeUnitsQuery({})
  const columns = useMemo<MRT_ColumnDef<TimeUnit>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'tu_name',
        header: 'Time Unit Id',
        size: 20,
      },
/*      {
        accessorFn: ({ ref_authors }) => ref_authors.find(author => author.au_num === 1)?.author_surname ?? 'Not found',
        Cell,
        header: 'Author',
        maxSize: 60,
      },
*/
      {
        accessorKey: 'tu_display_name',
        header: 'Time Unit',
//        maxSize: 60,
      },
/*      {
        accessorKey: 'title_primary',
        Cell,
        header: 'Title',
        maxSize: 60,
      },
      {
        accessorKey: 'journal_title',
        Cell,
        header: 'Journal',
        maxSize: 60,
      },
      {
        accessorKey: 'title_secondary',
        header: 'Book Title',
        Cell,
        maxSize: 60,
      },
      {
        accessorKey: 'ref_type.ref_type',
        header: 'Type',
        maxSize: 60,
      },*/
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<TimeUnit>
      selectorFn={selectorFn}
      selectedList={selectedList}
      checkRowRestriction={checkRowRestriction}
      idFieldName="tu_name"
      columns={columns}
      data={time_unitQuery.data}
      url="time-unit"
    />
  )
}

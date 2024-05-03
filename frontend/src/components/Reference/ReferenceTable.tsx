import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllReferencesQuery } from '../../redux/referenceReducer'
import { Reference } from '@/backendTypes'
import { TableView } from '../TableView/TableView'
import { Box, Tooltip } from '@mui/material'

const Cell = ({ renderedCellValue }: { renderedCellValue: React.ReactNode }) => (
  <Tooltip title={renderedCellValue}>
    <Box sx={{ maxWidth: '260px',   WebkitMaskImage: 'linear-gradient(to right, #000 90%, transparent)' }}>
      {renderedCellValue}
    </Box>
  </Tooltip>
)

export const ReferenceTable = ({
  selectorFn,
  selectedList,
}: {
  selectorFn?: (id: string) => void
  selectedList?: string[]
}) => {
  const referenceQuery = useGetAllReferencesQuery()
  const columns = useMemo<MRT_ColumnDef<Reference>[]>(
    () => [
      {
        id: 'id',
        accessorKey: 'rid',
        header: 'Reference Id',
        size: 20,
      },
      {
        accessorFn: ({ ref_authors }) => ref_authors.find(author => author.au_num === 1)?.author_surname ?? 'Not found',
        Cell,
        header: 'Author',
        maxSize: 60,
      },
      {
        accessorKey: 'date_primary',
        header: 'Year',
        maxSize: 60,
      },
      {
        accessorKey: 'title_primary',
        Cell,
        header: 'Title',
        maxSize: 60,
      },
      {
        accessorFn: ({ ref_journal }) => ref_journal?.journal_title || '',
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
        accessorKey: 'ref_ref_type.ref_type',
        header: 'Type',
        maxSize: 60,
      },
    ],
    []
  )
  const checkRowRestriction = () => {
    return false
  }

  return (
    <TableView<Reference>
      selectorFn={selectorFn}
      selectedList={selectedList}
      checkRowRestriction={checkRowRestriction}
      idFieldName="rid"
      columns={columns}
      data={referenceQuery.data}
      url="reference"
    />
  )
}

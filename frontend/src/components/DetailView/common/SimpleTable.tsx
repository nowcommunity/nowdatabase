import { CircularProgress } from '@mui/material'
import { type MRT_ColumnDef, type MRT_RowData, MaterialReactTable } from 'material-react-table'

export const SimpleTable = <T extends MRT_RowData>({
  data,
  columns,
}: {
  data?: Array<T> | null
  columns: MRT_ColumnDef<T>[]
}) => {
  if (!data) return <CircularProgress />

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableTopToolbar={false}
      enableColumnActions={false}
      enablePagination={false}
      state={{ density: 'compact' }}
    />
  )
}

import { CircularProgress } from '@mui/material'
import { type MRT_ColumnDef, type MRT_RowData, MRT_Row, MaterialReactTable } from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import { ActionComponent } from '@/components/TableView/ActionComponent'

export const SimpleTable = <T extends MRT_RowData, ParentType extends MRT_RowData>({
  data,
  columns,
  idFieldName,
  url,
}: {
  data?: Array<T> | null
  columns: MRT_ColumnDef<T>[]
  idFieldName?: keyof T
  url?: string
}) => {
  const { mode } = useDetailContext<ParentType>()

  if (!data) return <CircularProgress />

  const linkToDetails = ({ row }: { row: MRT_Row<T> }) => {
    if (mode.read && idFieldName && url) return <ActionComponent {...{ row, idFieldName, url }} />
    return null // code shouldn't get here!
  }

  const actionRowProps =
    mode.read && idFieldName && url ? { enableRowActions: true, renderRowActions: linkToDetails } : {}

  return (
    <MaterialReactTable
      {...actionRowProps}
      columns={columns}
      data={data}
      enableTopToolbar={false}
      enableColumnActions={false}
      enablePagination={false}
      state={{ density: 'compact' }}
    />
  )
}

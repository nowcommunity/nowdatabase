import { CircularProgress } from '@mui/material'
import { type MRT_ColumnDef, type MRT_RowData } from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import { DetailTabTable } from './DetailTabTable'

export const SimpleTable = <T extends MRT_RowData, ParentType extends MRT_RowData>({
  data,
  columns,
  idFieldName,
  url,
  isFetching,
}: {
  data?: Array<T> | null
  columns: MRT_ColumnDef<T>[]
  idFieldName?: keyof T
  url?: string
  isFetching?: boolean
}) => {
  const { mode } = useDetailContext<ParentType>()

  if (isFetching) return <CircularProgress />

  const safeData = data ?? []

  if (!idFieldName) {
    return <DetailTabTable<T> mode="edit" data={safeData} columns={columns} enableRowActions={false} />
  }

  return (
    <DetailTabTable<T>
      mode={mode.read ? 'read' : 'select'}
      title="Detail List"
      data={safeData}
      columns={columns}
      idFieldName={idFieldName}
      url={url}
      isFetching={false}
      clickableRows={mode.read}
      enableColumnFilterModes={true}
      paginationPlacement="bottom"
    />
  )
}

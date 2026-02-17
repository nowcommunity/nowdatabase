import { CircularProgress } from '@mui/material'
import { type MRT_ColumnDef, type MRT_RowData } from 'material-react-table'
import { useDetailContext } from '../Context/DetailContext'
import { DetailTabTable } from './DetailTabTable'

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

  if (!idFieldName) {
    return <DetailTabTable<T> mode="edit" data={data} columns={columns} enableRowActions={false} />
  }

  return (
    <DetailTabTable<T>
      mode={mode.read ? 'read' : 'select'}
      title="Detail List"
      data={data}
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

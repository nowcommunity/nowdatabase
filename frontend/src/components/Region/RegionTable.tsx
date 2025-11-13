import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllRegionsQuery } from '../../redux/regionReducer'
import { Region } from '@/shared/types'
import { TableView } from '../TableView/TableView'

export const RegionTable = ({ selectorFn }: { selectorFn?: (id: Region) => void }) => {
  const { data: reqionQueryData, isFetching, isError, error } = useGetAllRegionsQuery()
  const columns = useMemo<MRT_ColumnDef<Region>[]>(
    () => [
      {
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

  const visibleColumns = {
    reg_coord_id: false,
  }

  return (
    <TableView<Region>
      title="Regions"
      selectorFn={selectorFn}
      idFieldName="reg_coord_id"
      columns={columns}
      isFetching={isFetching}
      isError={isError}
      error={error}
      visibleColumns={visibleColumns}
      data={reqionQueryData}
      url="region"
    />
  )
}

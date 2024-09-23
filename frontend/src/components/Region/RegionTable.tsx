import { useMemo } from 'react'
import { type MRT_ColumnDef } from 'material-react-table'
import { useGetAllRegionsQuery } from '../../redux/regionReducer'
import { Region } from '@/backendTypes'
import { TableView } from '../TableView/TableView'

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

  const hiddenColumns = {
    id: false,
  }

  return (
    <TableView<Region>
      title="Regions"
      selectorFn={selectorFn}
      idFieldName="reg_coord_id"
      columns={columns}
      hiddenColumns={hiddenColumns}
      data={regionQuery.data}
      url="region"
    />
  )
}
